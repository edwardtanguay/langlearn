import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { calculateNextTestTime, isCardDue } from '../../utils/algorithm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const tagFilter = query.tag as string | undefined
  const allFilter = query.all === 'true'
  const excludeId = query.excludeId as string | undefined

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

    const limitParam = parseInt(query.limit as string)
    const limit = !isNaN(limitParam) && limitParam > 0 ? limitParam : undefined

    // Fetch the user's active flashcards
    let flashcards = await prisma.flashcard.findMany({
      where: {
        ownerId: dbUser.id,
        ...(excludeId ? {
          id: {
            not: excludeId
          }
        } : {}),
        ...(allFilter ? {
          status: {
            not: 'DELETED'
          }
        } : {
          status: 'LEARNING',
          OR: [
            { nextTestTime: null },
            { nextTestTime: { lte: new Date() } }
          ]
        }),
        ...(tagFilter ? {
          tags: {
            some: {
              tag: {
                abbreviation: tagFilter
              }
            }
          }
        } : {})
      },
      orderBy: [
        { rank: 'desc' },
        { id: 'asc' }
      ],
      take: limit,
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
    console.error('Error fetching active flashcards:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve flashcards'
    })
  }
})
