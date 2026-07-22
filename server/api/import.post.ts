import { prisma } from '../utils/prisma'
import { requireAuth } from '../utils/auth'
import { parseMetadata } from '../utils/metadata-parser'
import crypto from 'crypto'

function mapLanguage(lang: string): string {
  const l = lang.trim().toLowerCase();
  if (l === 'english') return 'en';
  if (l === 'french') return 'fr';
  if (l === 'german') return 'de';
  if (l === 'italian') return 'it';
  if (l === 'dutch') return 'nl';
  if (l === 'spanish') return 'es';
  return l.substring(0, 2);
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  const body = await readBody(event)
  if (!body || !Array.isArray(body.rows)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid body, expected an object with a rows array'
    })
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const rows = body.rows;

  // 1. Single SELECT to fetch all existing non-deleted cards for O(1) duplicate checking
  const existingCards = await prisma.flashcard.findMany({
    where: {
      ownerId: dbUser.id,
      status: {
        not: 'DELETED'
      }
    },
    select: {
      front: true,
      back: true
    }
  });

  const existingSet = new Set<string>();
  for (const card of existingCards) {
    existingSet.add(`${card.front.trim().toLowerCase()}|${card.back.trim().toLowerCase()}`);
  }

  const payloadSet = new Set<string>();
  const cardsToCreate: any[] = [];
  const activitiesToCreate: any[] = [];
  const skippedCards: Array<{ front: string; back: string }> = [];

  // 2. In-Memory Processing & Metadata Extraction
  for (const row of rows) {
    if (!row.lang1 || !row.lang2 || !row.text1 || !row.text2) {
      continue;
    }

    const meta1 = parseMetadata(row.text1);
    const meta2 = parseMetadata(row.text2);

    let front = '';
    let back = '';
    let frontLanguage = '';
    let backLanguage = '';

    if (row.lang1.toLowerCase() === 'english') {
      front = meta1.cleanText;
      back = meta2.cleanText;
      frontLanguage = 'en';
      backLanguage = mapLanguage(row.lang2);
    } else if (row.lang2.toLowerCase() === 'english') {
      front = meta2.cleanText;
      back = meta1.cleanText;
      frontLanguage = 'en';
      backLanguage = mapLanguage(row.lang1);
    } else {
      front = meta1.cleanText;
      back = meta2.cleanText;
      frontLanguage = mapLanguage(row.lang1);
      backLanguage = mapLanguage(row.lang2);
    }

    if (!front || !back) {
      continue;
    }

    // Check if front and back text are identical (case-insensitive, trimmed)
    if (front.trim().toLowerCase() === back.trim().toLowerCase()) {
      skippedCards.push({ front, back });
      continue;
    }

    const key = `${front.trim().toLowerCase()}|${back.trim().toLowerCase()}`;

    // Duplicate check against existing database cards and previously seen cards in payload
    if (existingSet.has(key) || payloadSet.has(key)) {
      skippedCards.push({ front, back });
      continue;
    }

    payloadSet.add(key);

    const pronunciation = meta1.pronunciation || meta2.pronunciation || null;
    const memoryHook = meta1.memoryHook || meta2.memoryHook || null;
    const rank = meta1.rank ?? meta2.rank ?? 2.5;

    const flashcardId = crypto.randomUUID();

    cardsToCreate.push({
      id: flashcardId,
      ownerId: dbUser.id,
      front,
      back,
      frontLanguage,
      backLanguage,
      pronunciation,
      memoryHook,
      status: 'LEARNING',
      rank
    });

    activitiesToCreate.push({
      id: crypto.randomUUID(),
      userId: dbUser.id,
      flashcardId,
      actionTaken: 'IMPORTED',
      actionDetails: 'Imported from CSV'
    });
  }

  // 3. Single Atomic Transaction ($transaction)
  if (cardsToCreate.length > 0) {
    await prisma.$transaction(async (tx) => {
      await tx.flashcard.createMany({
        data: cardsToCreate
      });
      await tx.userFlashcardActivity.createMany({
        data: activitiesToCreate
      });
    });
  }

  return {
    importedCount: cardsToCreate.length,
    skippedCount: skippedCards.length,
    skippedCards
  };
});
