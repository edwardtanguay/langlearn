import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing howto item ID' })
  }

  try {
    await prisma.howtoItem.delete({
      where: { id }
    })
    return { ok: true }
  } catch (err) {
    console.error('Failed to delete howto item:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete howto item'
    })
  }
})

