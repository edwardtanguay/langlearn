import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

// Actions that also update Flashcard.status
const STATUS_FOR_ACTION: Record<string, string> = {
  MARKED_AS_LEARNED: 'LEARNED',
  MARKED_AS_PARKED: 'PARKED',
  MARKED_AS_DELETED: 'DELETED',
}

// Global points awarded per flashcard action
const POINTS_FOR_ACTION: Record<string, number> = {
  MARKED_AS_LEARNED: 10,
  MARKED_AS_KEEP_TESTING: 2,
  MARKED_AS_PARKED: 1,
  MARKED_AS_DELETED: 1,
}

const VALID_ACTIONS = new Set([
  'MARKED_AS_KEEP_TESTING',
  'MARKED_AS_LEARNED',
  'MARKED_AS_PARKED',
  'MARKED_AS_DELETED',
])

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { actionTaken } = body

  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing flashcard ID' })
  if (!actionTaken || !VALID_ACTIONS.has(actionTaken)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid actionTaken: ${actionTaken}` })
  }

  try {
    const dbUser = (await prisma.user.findUnique({ where: { id: user.dbId || user.id } }))
      || (user.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null)
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

    const newStatus = STATUS_FOR_ACTION[actionTaken]
    const pointsEarned = POINTS_FOR_ACTION[actionTaken] ?? 0
    const nextTestTime = calculateNextTestTime(new Date(), flashcard.rank)

    // Run activity creation + optional status update + nextTestTime update + user points increment atomically
    const [, , updatedUser] = await prisma.$transaction([
      prisma.userFlashcardActivity.create({
        data: { userId: dbUser.id, flashcardId: id, actionTaken }
      }),
      prisma.flashcard.update({
        where: { id },
        data: {
          ...(newStatus ? { status: newStatus } : {}),
          nextTestTime
        }
      }),
      prisma.user.update({
        where: { id: dbUser.id },
        data: {
          points: { increment: pointsEarned }
        },
        select: { points: true }
      })
    ])

    return { ok: true, pointsEarned, totalPoints: updatedUser.points }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('Failed to record action:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to record action' })
  }
})
