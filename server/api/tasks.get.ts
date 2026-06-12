import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  try {
    return await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve tasks'
    })
  }
})
