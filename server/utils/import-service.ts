import { prisma } from './prisma'
import { parseMetadata } from './metadata-parser'
import { calculateOptimalRank } from './rank-config'
import crypto from 'crypto'
import type { ParsedRow } from './import-parser'

function mapLanguage(lang: string): string {
  const l = lang.trim().toLowerCase()
  if (l === 'english') return 'en'
  if (l === 'french') return 'fr'
  if (l === 'german') return 'de'
  if (l === 'italian') return 'it'
  if (l === 'dutch') return 'nl'
  if (l === 'spanish') return 'es'
  return l.substring(0, 2)
}

export async function processImportRows(userId: string, rows: ParsedRow[]) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!dbUser) {
    throw new Error('User not found')
  }

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
  })

  const existingSet = new Set<string>()
  for (const card of existingCards) {
    existingSet.add(`${card.front.trim().toLowerCase()}|${card.back.trim().toLowerCase()}`)
  }

  const payloadSet = new Set<string>()
  const cardsToCreate: any[] = []
  const activitiesToCreate: any[] = []
  const skippedCards: Array<{ front: string; back: string }> = []

  for (const row of rows) {
    if (!row.lang1 || !row.lang2 || !row.text1 || !row.text2) {
      continue
    }

    const meta1 = parseMetadata(row.text1)
    const meta2 = parseMetadata(row.text2)

    let front = ''
    let back = ''
    let frontLanguage = ''
    let backLanguage = ''

    if (row.lang1.toLowerCase() === 'english') {
      front = meta1.cleanText
      back = meta2.cleanText
      frontLanguage = 'en'
      backLanguage = mapLanguage(row.lang2)
    } else if (row.lang2.toLowerCase() === 'english') {
      front = meta2.cleanText
      back = meta1.cleanText
      frontLanguage = 'en'
      backLanguage = mapLanguage(row.lang1)
    } else {
      front = meta1.cleanText
      back = meta2.cleanText
      frontLanguage = mapLanguage(row.lang1)
      backLanguage = mapLanguage(row.lang2)
    }

    if (!front || !back) {
      continue
    }

    // Clean front text: remove "my friend," prefix and asterisks
    front = front.replace(/^my friend,\s*/i, '').replace(/\*/g, '').trim()

    if (!front || !back) {
      continue
    }

    if (front.trim().toLowerCase() === back.trim().toLowerCase()) {
      skippedCards.push({ front, back })
      continue
    }

    const key = `${front.trim().toLowerCase()}|${back.trim().toLowerCase()}`

    if (existingSet.has(key) || payloadSet.has(key)) {
      skippedCards.push({ front, back })
      continue
    }

    const rowTags = Array.from(new Set([
      ...(row.tags || []),
      ...(meta1.tags || []),
      ...(meta2.tags || [])
    ]))

    const pronunciation = row.pronunciation || meta1.pronunciation || meta2.pronunciation || null
    const memoryHook = row.memoryHook || meta1.memoryHook || meta2.memoryHook || null
    const rank = row.rank ?? meta1.rank ?? meta2.rank ?? calculateOptimalRank(front)

    const flashcardId = crypto.randomUUID()

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
      rank,
      tagsToAttach: rowTags
    })

    activitiesToCreate.push({
      id: crypto.randomUUID(),
      userId: dbUser.id,
      flashcardId,
      actionTaken: 'IMPORTED',
      actionDetails: 'Imported from text/CSV'
    })
  }

  if (cardsToCreate.length > 0) {
    if (dbUser.role !== 'admin') {
      const startOfToday = new Date()
      startOfToday.setUTCHours(0, 0, 0, 0)

      const todayCount = await prisma.flashcard.count({
        where: {
          ownerId: dbUser.id,
          createdAt: { gte: startOfToday }
        }
      })

      if (todayCount + cardsToCreate.length > 100) {
        const remaining = Math.max(0, 100 - todayCount)
        throw new Error(`Daily import limit reached. Non-admin users are limited to 100 phrases per day. You have already imported ${todayCount} phrases today (${remaining} remaining).`)
      }
    }

    // Collect all unique tag abbreviations across all cards to create
    const allTagAbbrevs = new Set<string>()
    for (const card of cardsToCreate) {
      for (const t of card.tagsToAttach) {
        allTagAbbrevs.add(t)
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Ensure all tags exist in Tag table
      const tagMap = new Map<string, string>() // abbreviation -> tagId
      if (allTagAbbrevs.size > 0) {
        const existingTags = await tx.tag.findMany({
          where: { abbreviation: { in: Array.from(allTagAbbrevs) } }
        })
        for (const tag of existingTags) {
          tagMap.set(tag.abbreviation, tag.id)
        }

        const missingAbbrevs = Array.from(allTagAbbrevs).filter(abbrev => !tagMap.has(abbrev))
        for (const abbrev of missingAbbrevs) {
          const newTag = await tx.tag.create({
            data: { abbreviation: abbrev }
          })
          tagMap.set(abbrev, newTag.id)
        }
      }

      // 2. Prepare FlashcardTag items
      const flashcardTagsToCreate: Array<{ id: string; flashcardId: string; tagId: string }> = []
      const cardDataToCreate = cardsToCreate.map(({ tagsToAttach, ...cardData }) => {
        for (const abbrev of tagsToAttach) {
          const tagId = tagMap.get(abbrev)
          if (tagId) {
            flashcardTagsToCreate.push({
              id: crypto.randomUUID(),
              flashcardId: cardData.id,
              tagId
            })
          }
        }
        return cardData
      })

      await tx.flashcard.createMany({
        data: cardDataToCreate
      })
      if (flashcardTagsToCreate.length > 0) {
        await tx.flashcardTag.createMany({
          data: flashcardTagsToCreate
        })
      }
      await tx.userFlashcardActivity.createMany({
        data: activitiesToCreate
      })
    })
  }

  return {
    importedCount: cardsToCreate.length,
    skippedCount: skippedCards.length,
    skippedCards
  }
}
