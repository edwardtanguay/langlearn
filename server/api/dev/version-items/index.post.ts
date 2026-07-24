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

  const lastItem = await prisma.versionItem.findFirst({
    where: { versionId: body.versionId },
    orderBy: { orderWithinVersion: 'desc' }
  })
  const nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1

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
