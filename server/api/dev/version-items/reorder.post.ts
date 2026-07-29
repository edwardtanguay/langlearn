import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const { itemId, direction } = body || {}
  if (!itemId || (direction !== 'UP' && direction !== 'DOWN')) {
    throw createError({ statusCode: 400, statusMessage: 'itemId and direction (UP|DOWN) are required' })
  }

  const currentItem = await prisma.versionItem.findUnique({
    where: { id: itemId }
  })
  if (!currentItem) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  }

  // Get items in same version sorted by orderWithinVersion
  const items = await prisma.versionItem.findMany({
    where: { versionId: currentItem.versionId },
    orderBy: { orderWithinVersion: 'asc' }
  })

  const index = items.findIndex(i => i.id === itemId)
  if (index === -1) {
    throw createError({ statusCode: 400, statusMessage: 'Item index error' })
  }

  const targetIndex = direction === 'UP' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= items.length) {
    return { success: true, message: 'Already at limit' }
  }

  const targetItem = items[targetIndex]

  // Swap orderWithinVersion
  await prisma.$transaction([
    prisma.versionItem.update({
      where: { id: currentItem.id },
      data: { orderWithinVersion: targetItem.orderWithinVersion }
    }),
    prisma.versionItem.update({
      where: { id: targetItem.id },
      data: { orderWithinVersion: currentItem.orderWithinVersion }
    })
  ])

  return { success: true }
})
