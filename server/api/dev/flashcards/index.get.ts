import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'
import { buildInterleavedQueue } from '../../../utils/algorithm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Get all user flashcards directly
    const allFlashcards = await prisma.flashcard.findMany({
      where: {
        ownerId: dbUser.id
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // Get all user activities that correspond to testing/actions
    const activities = await prisma.userFlashcardActivity.findMany({
      where: {
        userId: dbUser.id,
        actionTaken: {
          in: ['TESTED', 'MARKED_AS_KEEP_TESTING', 'MARKED_AS_LEARNED', 'MARKED_AS_PARKED', 'MARKED_AS_DELETED']
        }
      },
      orderBy: {
        whenActedUpon: 'desc'
      }
    })

    // Map activities by flashcardId to easily find the latest one
    const latestActivityMap = new Map<string, string>() // flashcardId -> ISO string
    for (const act of activities) {
      if (!latestActivityMap.has(act.flashcardId)) {
        latestActivityMap.set(act.flashcardId, act.whenActedUpon.toISOString())
      }
    }

    const now = new Date()

    // Separate active learning cards into pools
    const learningCards = allFlashcards.filter(f => f.status === 'LEARNING')
    const otherCards = allFlashcards.filter(f => f.status !== 'LEARNING')

    const newCardsPool = learningCards
      .filter(f => !f.nextTestTime)
      .sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id))

    const dueCardsPool = learningCards
      .filter(f => f.nextTestTime && f.nextTestTime.getTime() <= now.getTime())
      .sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id))

    const futureCardsPool = learningCards
      .filter(f => f.nextTestTime && f.nextTestTime.getTime() > now.getTime())
      .sort((a, b) => a.nextTestTime!.getTime() - b.nextTestTime!.getTime() || b.rank - a.rank)

    // Take top 30 new cards and top 10 due cards for interleaving
    const topNew = newCardsPool.slice(0, 30)
    const remNew = newCardsPool.slice(30)

    const topDue = dueCardsPool.slice(0, 10)
    const remDue = dueCardsPool.slice(10)

    const interleavedActiveQueue = buildInterleavedQueue(topNew, topDue, { newRatio: 3, dueRatio: 1 })

    // Combine in queue presentation order:
    // 1. Interleaved active queue (top 30 new + top 10 due)
    // 2. Remaining due cards
    // 3. Remaining new cards
    // 4. Future scheduled cards
    // 5. Finished/Parked/Deleted cards
    const sortedFlashcards = [
      ...interleavedActiveQueue,
      ...remDue,
      ...remNew,
      ...futureCardsPool,
      ...otherCards.sort((a, b) => b.rank - a.rank)
    ]

    // Build the payload
    const result = sortedFlashcards.map((f) => {
      const lastTested = latestActivityMap.get(f.id) || null
      const nextTest = f.nextTestTime?.toISOString() || null
      
      return {
        id: f.id,
        status: f.status,
        rank: f.rank,
        front: f.front,
        frontLanguage: f.frontLanguage,
        back: f.back,
        backLanguage: f.backLanguage,
        pronunciation: f.pronunciation,
        memoryHook: f.memoryHook,
        tags: f.tags.map(t => t.tag.abbreviation),
        lastTested,
        nextTest,
        createdAt: f.createdAt.toISOString(),
        minutesToTestAgain: dbUser.minutesToTestAgain
      }

    })

    return result
  } catch (error) {
    console.error('Error fetching dev flashcards:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve dev flashcards'
    })
  }
})

