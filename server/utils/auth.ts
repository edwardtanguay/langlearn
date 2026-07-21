import { H3Event } from 'h3'
import { prisma } from './prisma'

export async function requireAuth(event: H3Event) {
  const kinde = event.context.kinde
  if (!kinde) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No Kinde context'
    })
  }

  const user = await kinde.getUser()
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No user found'
    })
  }

  // Auto-provision user in DB
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })
  }

  if (!dbUser) {
    // If not found by ID or email, create the new user
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email || '',
        firstName: user.given_name || '',
        lastName: user.family_name || '',
      }
    })
  }

  return user
}
