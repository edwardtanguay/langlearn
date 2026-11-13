import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  try {
    const dbUser = (await prisma.user.findUnique({ where: { id: user.dbId || user.id } }))
      || (user.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null)

    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            flashcards: dbUser
              ? {
                  where: {
                    flashcard: {
                      ownerId: dbUser.id,
                      status: { not: 'DELETED' }
                    }
                  }
                }
              : true
          }
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
