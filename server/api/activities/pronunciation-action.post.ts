import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const { cardId, action } = body

  if (!cardId || !['LEARNED', 'KEEP_TAKING'].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'cardId and valid action ("LEARNED" | "KEEP_TAKING") are required'
    })
  }

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

    const card = await prisma.flashcard.findFirst({
      where: {
        id: cardId,
        ownerId: dbUser.id
      }
    })

    if (!card) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Flashcard not found'
      })
    }

    const newStatus = action === 'LEARNED' ? 'LEARNED' : 'LEARNING'

    const updatedCard = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        pronunciationStatus: newStatus,
        pronunciationTimesTaken: {
          increment: 1
        }
      }
    })

    // Log the user activity
    await prisma.userFlashcardActivity.create({
      data: {
        userId: dbUser.id,
        flashcardId: cardId,
        actionTaken: action === 'LEARNED' ? 'PRONUNCIATION_LEARNED' : 'PRONUNCIATION_KEEP_TAKING',
        actionDetails: `Pronunciation practice marked as ${action}`
      }
    })

    return {
      success: true,
      card: updatedCard
    }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('Error saving pronunciation practice action:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to record pronunciation action'
    })
  }
})
