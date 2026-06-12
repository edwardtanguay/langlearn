import { prisma } from '../utils/prisma'
import { z } from 'zod'

const bodySchema = z.object({
  status: z.enum(['on', 'off'])
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { status } = bodySchema.parse(body)

    const record = await prisma.dbTest.upsert({
      where: { id: 1 },
      update: { status },
      create: { id: 1, status }
    })

    return { success: true, record }
  } catch (error) {
    console.error('Error updating db-test status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save status to database'
    })
  }
})
