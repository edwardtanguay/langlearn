import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  try {
    const body = await readBody(event)
    if (!body || !body.title || typeof body.title !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required and must be a string'
      })
    }
    return await prisma.task.create({
      data: {
        title: body.title
      }
    })
  } catch (error: any) {
    console.error('Error creating task:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create task'
    })
  }
})
