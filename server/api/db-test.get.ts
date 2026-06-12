import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const record = await prisma.dbTest.findUnique({
      where: { id: 1 }
    })
    return { status: record?.status || 'off' }
  } catch (error) {
    console.error('Error fetching db-test status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve status from database'
    })
  }
})
