import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { parseAndAssignCategories } from '../../../utils/categoryParser'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody(event)

  if (!body?.body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'body is required'
    })
  }

  const targetVersionId = body.versionId || null
  let nextOrder = 1

  if (body.afterItemId === 'TOP') {
    nextOrder = 1
    const itemsToShift = await prisma.versionItem.findMany({
      where: {
        versionId: targetVersionId,
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
          versionId: targetVersionId,
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
        where: { versionId: targetVersionId },
        orderBy: { orderWithinVersion: 'desc' }
      })
      nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1
    }
  } else {
    const lastItem = await prisma.versionItem.findFirst({
      where: { versionId: targetVersionId },
      orderBy: { orderWithinVersion: 'desc' }
    })
    nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1
  }

  const rankVal = typeof body.rank === 'number' ? body.rank : parseFloat(body.rank)
  const finalRank = isNaN(rankVal) ? 2.5 : rankVal

  const newItem = await prisma.versionItem.create({
    data: {
      versionId: targetVersionId,
      versionCategoryId: body.versionCategoryId || null,
      type: body.type || 'BUGFIX',
      body: body.body.trim(),
      rank: finalRank,
      startedByUserId: admin.dbId || admin.id,
      orderWithinVersion: nextOrder
    }
  })

  await parseAndAssignCategories()

  const refetched = await prisma.versionItem.findUnique({
    where: { id: newItem.id },
    include: { versionCategory: true, startedByUser: true }
  })

  return refetched || newItem
})
