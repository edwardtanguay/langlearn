import { prisma } from '../utils/prisma'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const dbUser = (await prisma.user.findUnique({ where: { id: user.dbId || user.id } }))
    || (user.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null)

  if (!dbUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  if (!dbUser.isCommunity) {
    return {
      isCommunity: false,
      currentUserId: dbUser.id,
      entries: []
    }
  }

  const users = await prisma.user.findMany({
    where: { isCommunity: true },
    orderBy: [
      { points: 'desc' },
      { firstName: 'asc' }
    ],
    select: {
      id: true,
      firstName: true,
      points: true
    }
  })

  return {
    isCommunity: true,
    currentUserId: dbUser.id,
    entries: users.map((u, idx) => ({
      rank: idx + 1,
      id: u.id,
      firstName: u.firstName || 'User',
      points: u.points ?? 0
    }))
  }
})

