import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

function incrementMinorVersion(versionStr: string): string {
  const parts = versionStr.split('.').map(n => parseInt(n, 10))
  if (parts.length < 3 || parts.some(isNaN)) {
    return '0.2.0'
  }
  const major = parts[0]
  const minor = parts[1] + 1
  return `${major}.${minor}.0`
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const itemBody = body?.body?.trim()
  if (!itemBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item body text is required'
    })
  }

  const type = body?.type === 'FEATURE' ? 'FEATURE' : 'BUGFIX'

  // Calculate order within unassigned items (versionId === null)
  const lastItem = await prisma.versionItem.findFirst({
    where: { versionId: null },
    orderBy: { orderWithinVersion: 'desc' }
  })
  const nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1

  const newItem = await prisma.versionItem.create({
    data: {
      versionId: null,
      type,
      body: itemBody,
      startedByUserId: user.dbId || user.id,
      orderWithinVersion: nextOrder
    },
    include: {
      startedByUser: true
    }
  })

  return {
    success: true,
    item: newItem
  }
})
