import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const dbUser = await prisma.user.findUnique({
    where: { id: user.dbId || user.id }
  })

  if (!dbUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)

  const todayCount = await prisma.flashcard.count({
    where: {
      ownerId: dbUser.id,
      createdAt: { gte: startOfToday }
    }
  })

  const isAdmin = dbUser.role === 'admin'
  const limit = 100

  return {
    todayCount,
    limit,
    role: dbUser.role,
    isAdmin,
    remaining: isAdmin ? Infinity : Math.max(0, limit - todayCount)
  }
})
