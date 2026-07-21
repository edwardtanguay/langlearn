import { prisma } from '../utils/prisma'
import { requireAuth } from '../utils/auth'

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
  let importedCount = 0;
  let skippedCount = 0;
  const skippedCards: Array<{ front: string; back: string }> = [];

  for (const row of rows) {
    if (!row.lang1 || !row.lang2 || !row.text1 || !row.text2) {
      continue;
    }

    let front = '';
    let back = '';
    let frontLanguage = '';
    let backLanguage = '';

    if (row.lang1.toLowerCase() === 'english') {
      front = row.text1;
      back = row.text2;
      frontLanguage = 'en';
      backLanguage = mapLanguage(row.lang2);
    } else if (row.lang2.toLowerCase() === 'english') {
      front = row.text2;
      back = row.text1;
      frontLanguage = 'en';
      backLanguage = mapLanguage(row.lang1);
    } else {
      front = row.text1;
      back = row.text2;
      frontLanguage = mapLanguage(row.lang1);
      backLanguage = mapLanguage(row.lang2);
    }

    // Check if front and back text are identical (case-insensitive, trimmed)
    if (front.trim().toLowerCase() === back.trim().toLowerCase()) {
      skippedCount++;
      skippedCards.push({ front, back });
      continue;
    }

    // Check if non-deleted flashcard already exists for user
    const existingFlashcard = await prisma.flashcard.findFirst({
      where: {
        ownerId: dbUser.id,
        front: front,
        back: back,
        status: {
          not: 'DELETED'
        }
      }
    });

    if (!existingFlashcard) {
      await prisma.flashcard.create({
        data: {
          ownerId: dbUser.id,
          front,
          back,
          frontLanguage,
          backLanguage,
          status: 'LEARNING',
          rank: 2.5,
          activities: {
            create: {
              userId: dbUser.id,
              actionTaken: 'IMPORTED',
              actionDetails: 'Imported from CSV'
            }
          }
        }
      });
      importedCount++;
    } else {
      skippedCount++;
      skippedCards.push({ front, back });
    }
  }

  return { importedCount, skippedCount, skippedCards };
});
