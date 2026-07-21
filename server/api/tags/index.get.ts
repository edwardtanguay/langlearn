import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { flashcards: true }
        }
      },
      orderBy: {
        abbreviation: 'asc'
      }
    })

    return tags
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve tags'
    })
  }
})
