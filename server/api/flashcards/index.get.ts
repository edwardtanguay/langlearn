import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { buildInterleavedQueue } from '../../utils/algorithm'

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

    if (allFilter) {
      // Management mode: fetch all non-deleted cards
      const flashcards = await prisma.flashcard.findMany({
        where: {
          ownerId: dbUser.id,
          status: { not: 'DELETED' },
          ...(excludeId ? { id: { not: excludeId } } : {}),
          ...(tagFilter ? {
            tags: {
              some: { tag: { abbreviation: tagFilter } }
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
          tags: { include: { tag: true } }
        }
      })
      return flashcards
    }

    // Study mode: Interleaved top-ranked new cards (3:1 ratio with due cards)
    const baseWhere = {
      ownerId: dbUser.id,
      status: 'LEARNING',
      ...(excludeId ? { id: { not: excludeId } } : {}),
      ...(tagFilter ? {
        tags: {
          some: { tag: { abbreviation: tagFilter } }
        }
      } : {})
    }

    const commonInclude = {
      owner: true,
      tags: { include: { tag: true } }
    }

    // Pool 1: Top-ranked unreviewed new cards (nextTestTime is null)
    const poolNew = await prisma.flashcard.findMany({
      where: {
        ...baseWhere,
        nextTestTime: null
      },
      orderBy: [
        { rank: 'desc' },
        { id: 'asc' }
      ],
      take: 30, // Cap top new cards
      include: commonInclude
    })

    // Pool 2: Top-ranked due review cards (nextTestTime <= NOW)
    const poolDue = await prisma.flashcard.findMany({
      where: {
        ...baseWhere,
        nextTestTime: { lte: new Date() }
      },
      orderBy: [
        { rank: 'desc' },
        { id: 'asc' }
      ],
      take: 10, // Counterpart for 3:1 ratio
      include: commonInclude
    })

    // Interleave pools using 3:1 ratio
    let flashcards = buildInterleavedQueue(poolNew, poolDue, { newRatio: 3, dueRatio: 1 })

    if (limit) {
      flashcards = flashcards.slice(0, limit)
    }

    return flashcards
  } catch (error) {
    console.error('Error fetching active flashcards:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve flashcards'
    })
  }
})
