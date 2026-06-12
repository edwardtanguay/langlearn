import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Task ID is required'
      })
    }
    return await prisma.task.delete({
      where: {
        id: id
      }
    })
  } catch (error: any) {
    console.error('Error deleting task:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete task'
    })
  }
})
