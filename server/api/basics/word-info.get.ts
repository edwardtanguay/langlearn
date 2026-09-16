import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const userId = user.dbId || user.id
    const query = getQuery(event)
    const language = query.language as string | undefined

    const whereClause: any = { userId }
    if (language) {
      whereClause.language = language
    }

    const items = await prisma.basicWordInfo.findMany({
      where: whereClause,
      select: {
        id: true,
        wordId: true,
        language: true,
        pronunciation: true,
        isLearned: true,
        updatedAt: true
      }
    })

    return { items }
  } catch (err: any) {
    // If not authenticated or error, return empty items gracefully
    if (err?.statusCode === 401) {
      return { items: [] }
    }
    throw err
  }
})
