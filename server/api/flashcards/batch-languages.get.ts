import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  de: 'German',
  ru: 'Russian',
  is: 'Icelandic',
  da: 'Danish',
  el: 'Greek',
  en: 'English'
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const strategy = (query.strategy as string) || 'last_imported'

  try {
    const dbUser = (await prisma.user.findUnique({
      where: { id: user.dbId || user.id }
    })) || (user.email ? await prisma.user.findUnique({
      where: { email: user.email }
    }) : null)

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    const threshold = dbUser.testingGroupSize || 10

    let strategyWhere: any = {
      ownerId: dbUser.id
    }

    if (strategy === 'last_imported') {
      strategyWhere.status = 'LEARNING'
      strategyWhere.nextTestTime = null
    } else if (strategy === 'most_important') {
      strategyWhere.status = 'LEARNING'
    } else if (strategy === 'review_learned') {
      strategyWhere.status = 'LEARNED'
    } else if (strategy === 'phrases_a_de') {
      strategyWhere.status = { not: 'DELETED' }
      strategyWhere.tags = {
        some: {
          tag: {
            abbreviation: { in: ['à', 'de'] }
          }
        }
      }
    } else {
      strategyWhere.status = 'LEARNING'
    }

    const groups = await prisma.flashcard.groupBy({
      by: ['backLanguage'],
      where: strategyWhere,
      _count: {
        id: true
      }
    })

    const totalAvailable = groups.reduce((acc, curr) => acc + curr._count.id, 0)

    const eligibleLanguages = groups
      .filter((g) => g.backLanguage && g._count.id >= threshold)
      .map((g) => {
        const code = g.backLanguage.toLowerCase()
        return {
          code,
          name: LANGUAGE_NAMES[code] || g.backLanguage.toUpperCase(),
          count: g._count.id
        }
      })
      .sort((a, b) => b.count - a.count)

    return {
      languages: eligibleLanguages,
      threshold,
      totalAvailable
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error in batch-languages:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve batch languages'
    })
  }
})
