import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const strategy = (query.strategy as string) || 'most_important'
  const language = (query.language as string) || ''
  const excludeIdsParam = (query.excludeIds as string) || ''

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

    const defaultLimit = dbUser.testingGroupSize || 10
    const limitParam = parseInt(query.limit as string, 10)
    const limit = !isNaN(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : defaultLimit

    const excludeIds = excludeIdsParam
      ? excludeIdsParam.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const baseWhere: any = {
      ownerId: dbUser.id,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {})
    }

    if (language && language !== 'all') {
      baseWhere.backLanguage = {
        equals: language
      }
    }

    let where: any = { ...baseWhere }
    let orderBy: any = [{ rank: 'desc' }, { id: 'asc' }]

    if (strategy === 'last_imported') {
      where.status = 'LEARNING'
      where.nextTestTime = null
      orderBy = [{ createdAt: 'desc' }, { id: 'asc' }]
    } else if (strategy === 'most_important') {
      where.status = 'LEARNING'
      orderBy = [{ rank: 'desc' }, { id: 'asc' }]
    } else if (strategy === 'review_learned') {
      where.status = 'LEARNED'
      orderBy = [{ rank: 'desc' }, { id: 'asc' }]
    } else if (strategy === 'phrases_a_de') {
      where.status = { not: 'DELETED' }
      where.tags = {
        some: {
          tag: {
            abbreviation: { in: ['à', 'de'] }
          }
        }
      }
      orderBy = [{ rank: 'desc' }, { id: 'asc' }]
    } else {
      where.status = 'LEARNING'
      orderBy = [{ rank: 'desc' }, { id: 'asc' }]
    }

    const flashcards = await prisma.flashcard.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        owner: true,
        tags: { include: { tag: true } }
      }
    })

    // If excludeIds caused too few cards, fallback without excludeIds to satisfy the batch
    if (flashcards.length < limit && excludeIds.length > 0) {
      delete where.id
      const fallbackCards = await prisma.flashcard.findMany({
        where,
        orderBy,
        take: limit,
        include: {
          owner: true,
          tags: { include: { tag: true } }
        }
      })
      return fallbackCards
    }

    return flashcards
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching flashcard batch:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve flashcard batch'
    })
  }
})
