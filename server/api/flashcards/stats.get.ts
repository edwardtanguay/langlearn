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

    return {
      readyCount,
      waitingCount
    }
  } catch (error) {
    console.error('Error fetching flashcard stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve flashcard stats'
    })
  }
})
