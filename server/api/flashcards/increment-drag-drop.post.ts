import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body || !Array.isArray(body.cardIds) || body.cardIds.length === 0) {
    return { count: 0 }
  }

  const cardIds: string[] = body.cardIds.filter((id: unknown): id is string => typeof id === 'string')

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    const result = await prisma.flashcard.updateMany({
      where: {
        id: { in: cardIds }
      },
      data: {
        timesShownDragDrop: {
          increment: 1
        }
      }
    })

    return { count: result.count }
  } catch (error) {
    console.error('Failed to increment timesShownDragDrop:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to increment timesShownDragDrop' })
  }
})
