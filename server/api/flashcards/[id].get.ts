import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Card ID required'
    })
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const flashcard = await prisma.flashcard.findFirst({
    where: {
      id: id,
      ownerId: dbUser.id,
      status: { not: 'DELETED' }
    },
    include: {
      owner: true,
      tags: { include: { tag: true } }
    }
  })

  if (!flashcard) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Flashcard not found'
    })
  }

  return flashcard
})
