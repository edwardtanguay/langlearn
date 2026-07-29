import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

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

    const now = new Date()

    const readyCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id,
        status: 'LEARNING',
        OR: [
          { nextTestTime: null },
          { nextTestTime: { lte: now } }
        ]
      }
    })

    const waitingCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id,
        status: 'LEARNING',
        nextTestTime: { gt: now }
      }
    })

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const totalCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id
      }
    })

    const todayReviewedCount = await prisma.userFlashcardActivity.count({
      where: {
        userId: dbUser.id,
        whenActedUpon: { gte: startOfDay },
        actionTaken: {
          in: ['MARKED_AS_KEEP_TESTING', 'MARKED_AS_LEARNED', 'MARKED_AS_PARKED', 'MARKED_AS_DELETED']
        }
      }
    })

    const todayCorrectCount = await prisma.userFlashcardActivity.count({
      where: {
        userId: dbUser.id,
        whenActedUpon: { gte: startOfDay },
        actionTaken: 'MARKED_AS_LEARNED'
      }
    })

    const todayImportedCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id,
        createdAt: { gte: startOfDay }
      }
    })

    return {
      readyCount,
      waitingCount,
      totalCount,
      todayReviewedCount,
      todayCorrectCount,
      todayImportedCount
    }
  } catch (error) {
    console.error('Error fetching flashcard stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve flashcard stats'
    })
  }
})
