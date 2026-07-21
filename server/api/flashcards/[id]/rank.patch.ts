import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing flashcard ID' })
  }

  const rank = parseFloat(body.rank)
  if (isNaN(rank) || rank < 0 || rank > 5) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid rank value (must be 0–5)' })
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    // Ensure the card exists and is owned by the user
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id,
        ownerId: dbUser.id
      }
    })

    if (!flashcard) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied: You do not own this flashcard'
      })
    }

    // We need the lastTested time to calculate the new nextTestTime
    const latestActivity = await prisma.userFlashcardActivity.findFirst({
      where: {
        flashcardId: id,
        actionTaken: {
          in: ['TESTED', 'MARKED_AS_KEEP_TESTING', 'MARKED_AS_LEARNED', 'MARKED_AS_PARKED', 'MARKED_AS_DELETED']
        }
      },
      orderBy: { whenActedUpon: 'desc' }
    })

    const { calculateNextTestTime } = await import('../../../utils/algorithm')
    const nextTestTime = latestActivity ? calculateNextTestTime(latestActivity.whenActedUpon, rank) : null

    await prisma.flashcard.update({
      where: { id },
      data: { rank, nextTestTime }
    })

    return { ok: true }
  } catch (error) {
    console.error('Failed to update rank:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update rank' })
  }
})
