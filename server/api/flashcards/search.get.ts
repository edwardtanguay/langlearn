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

    // Search all non-deleted flashcards (both owned and public)
    const flashcards = await prisma.flashcard.findMany({
      where: {
        status: {
          not: 'DELETED'
        },
        ...(q ? {
          OR: [
            {
              front: {
                contains: q
              }
            },
            {
              back: {
                contains: q
              }
            },
            {
              pronunciation: {
                contains: q
              }
            },
            {
              memoryHook: {
                contains: q
              }
            },
            {
              tags: {
                some: {
                  tag: {
                    abbreviation: {
                      contains: q
                    }
                  }
                }
              }
            }
          ]
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
