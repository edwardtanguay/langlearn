import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export interface BatchCardItem {
  id: string
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  memoryHook?: string | null
  rank: number
  createdAt: Date
  tags: string[]
}

export interface ImportBatch {
  id: string
  batchTime: string
  rawDate: Date
  count: number
  cards: BatchCardItem[]
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const clientTz = (getHeader(event, 'x-client-timezone') as string) || (getQuery(event).tz as string) || undefined

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  // Fetch all non-deleted cards for this user ordered by createdAt desc
  const flashcards = await prisma.flashcard.findMany({
    where: {
      ownerId: dbUser.id,
      status: { not: 'DELETED' }
    },
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' }
    ],
    select: {
      id: true,
      front: true,
      back: true,
      frontLanguage: true,
      backLanguage: true,
      pronunciation: true,
      memoryHook: true,
      rank: true,
      createdAt: true,
      tags: {
        select: {
          tag: {
            select: { abbreviation: true }
          }
        }
      }
    }
  })

  // Format date helper in user's timezone
  const formatTime = (date: Date): string => {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: clientTz || undefined,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      return formatter.format(date).replace(',', '')
    } catch (e) {
      return date.toISOString().replace('T', ' ').slice(0, 19)
    }
  }

  // Cluster flashcards into batches (cards created within 5 seconds of each other)
  const batches: ImportBatch[] = []
  let currentBatch: ImportBatch | null = null

  for (const card of flashcards) {
    const cardDate = new Date(card.createdAt)
    const cardTimeMs = cardDate.getTime()
    const cardTags = card.tags.map(t => t.tag.abbreviation)

    const cardItem: BatchCardItem = {
      id: card.id,
      front: card.front,
      back: card.back,
      frontLanguage: card.frontLanguage,
      backLanguage: card.backLanguage,
      pronunciation: card.pronunciation,
      memoryHook: card.memoryHook,
      rank: card.rank,
      createdAt: cardDate,
      tags: cardTags
    }

    if (!currentBatch) {
      currentBatch = {
        id: card.id,
        batchTime: formatTime(cardDate),
        rawDate: cardDate,
        count: 1,
        cards: [cardItem]
      }
    } else {
      const diffMs = Math.abs(currentBatch.rawDate.getTime() - cardTimeMs)
      if (diffMs <= 5000) {
        // Within 5 seconds of the batch start, group together
        currentBatch.cards.push(cardItem)
        currentBatch.count++
      } else {
        // New batch
        batches.push(currentBatch)
        currentBatch = {
          id: card.id,
          batchTime: formatTime(cardDate),
          rawDate: cardDate,
          count: 1,
          cards: [cardItem]
        }
      }
    }
  }

  if (currentBatch) {
    batches.push(currentBatch)
  }

  return {
    batches,
    totalBatches: batches.length
  }
})
