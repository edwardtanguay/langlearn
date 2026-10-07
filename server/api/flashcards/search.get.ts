import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const q = (query.q as string || '').trim().toLowerCase()

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

    const searchWords = q.split(/\s+/).filter(Boolean)

    // Search all non-deleted flashcards (both owned and public)
    const flashcards = await prisma.flashcard.findMany({
      where: {
        status: {
          not: 'DELETED'
        },
        ...(searchWords.length > 0 ? {
          AND: searchWords.map(word => ({
            OR: [
              {
                front: {
                  contains: word
                }
              },
              {
                back: {
                  contains: word
                }
              }
            ]
          }))
        } : {})
      },
      include: {
        owner: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return flashcards
  } catch (error) {
    console.error('Error searching flashcards:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search flashcards'
    })
  }
})
