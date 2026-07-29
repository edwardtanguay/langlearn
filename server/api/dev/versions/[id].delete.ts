import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  await prisma.version.delete({
    where: { id }
  })

  return { success: true }
})
