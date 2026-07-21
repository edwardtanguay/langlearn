import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

// Actions that also update Flashcard.status
const STATUS_FOR_ACTION: Record<string, string> = {
  MARKED_AS_LEARNED: 'LEARNED',
  MARKED_AS_PARKED: 'PARKED',
  MARKED_AS_DELETED: 'DELETED',
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

    const newStatus = STATUS_FOR_ACTION[actionTaken]
    const nextTestTime = calculateNextTestTime(new Date(), flashcard.rank)

    // Run activity creation + optional status update + nextTestTime update atomically
    await prisma.$transaction([
      prisma.userFlashcardActivity.create({
        data: { userId: dbUser.id, flashcardId: id, actionTaken }
      }),
      prisma.flashcard.update({
        where: { id },
        data: { 
          ...(newStatus ? { status: newStatus } : {}),
          nextTestTime
        }
      })
    ])

    return { ok: true }
  } catch (error) {
    console.error('Failed to record action:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to record action' })
  }
})
