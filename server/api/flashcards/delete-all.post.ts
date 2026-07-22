import { defineEventHandler, createError } from 'h3'
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

    // Step 1: Disconnect any copiedFrom relations for this user's cards to avoid FK constraint errors
    await prisma.flashcard.updateMany({
      where: { ownerId: dbUser.id },
      data: { copiedFromId: null }
    })

    // Step 2: Delete all flashcards belonging to the user
    const deleteResult = await prisma.flashcard.deleteMany({
      where: { ownerId: dbUser.id }
    })

    return {
      success: true,
      count: deleteResult.count,
      message: `Successfully deleted ${deleteResult.count} flashcards`
    }
  } catch (error: any) {
    console.error('Error deleting user flashcards:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete flashcards'
    })
  }
})
