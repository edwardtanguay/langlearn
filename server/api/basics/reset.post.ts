import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const userId = user.dbId || user.id
  const body = await readBody(event)

  const { language, categoryPrefix, wordIds } = body

  if (!language || typeof language !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'language is required' })
  }

  const whereClause: any = {
    userId,
    language,
    isLearned: true
  }

  if (Array.isArray(wordIds) && wordIds.length > 0) {
    whereClause.wordId = { in: wordIds }
  } else if (categoryPrefix && typeof categoryPrefix === 'string') {
    whereClause.wordId = { startsWith: categoryPrefix }
  }

  const result = await prisma.basicWordInfo.updateMany({
    where: whereClause,
    data: {
      isLearned: false
    }
  })

  return { success: true, count: result.count }
})
