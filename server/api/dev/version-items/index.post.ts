import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody(event)

  if (!body?.versionId || !body?.body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'versionId and body are required'
    })
  }

  let nextOrder = 1

  if (body.afterItemId === 'TOP') {
    nextOrder = 1
    const itemsToShift = await prisma.versionItem.findMany({
      where: {
        versionId: body.versionId,
        orderWithinVersion: { gte: 1 }
      }
    })
    for (const item of itemsToShift) {
      await prisma.versionItem.update({
        where: { id: item.id },
        data: { orderWithinVersion: item.orderWithinVersion + 1 }
      })
    }
  } else if (body.afterItemId) {
    const targetItem = await prisma.versionItem.findUnique({
      where: { id: body.afterItemId }
    })
    if (targetItem) {
      nextOrder = targetItem.orderWithinVersion + 1
      // Shift all subsequent items in the same version up by 1
      const itemsToShift = await prisma.versionItem.findMany({
        where: {
          versionId: body.versionId,
          orderWithinVersion: { gte: nextOrder }
        }
      })
      for (const item of itemsToShift) {
        await prisma.versionItem.update({
          where: { id: item.id },
          data: { orderWithinVersion: item.orderWithinVersion + 1 }
        })
      }
    } else {
      const lastItem = await prisma.versionItem.findFirst({
        where: { versionId: body.versionId },
        orderBy: { orderWithinVersion: 'desc' }
      })
      nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1
    }
  } else {
    const lastItem = await prisma.versionItem.findFirst({
      where: { versionId: body.versionId },
      orderBy: { orderWithinVersion: 'desc' }
    })
    nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1
  }

  const newItem = await prisma.versionItem.create({
    data: {
      versionId: body.versionId,
      type: body.type || 'BUGFIX',
      status: body.status || 'PROPOSED',
      body: body.body.trim(),
      startedByUserId: admin.dbId || admin.id,
      orderWithinVersion: nextOrder
    }
  })

  return newItem
})
