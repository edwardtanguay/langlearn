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

  // 1. Find IN_PROGRESS version
  let targetVersion = await prisma.version.findFirst({
    where: { status: 'IN_PROGRESS' },
    orderBy: { createdAt: 'desc' }
  })

  // 2. If no IN_PROGRESS version, find FUTURE version and upgrade to IN_PROGRESS
  if (!targetVersion) {
    targetVersion = await prisma.version.findFirst({
      where: { status: 'FUTURE' },
      orderBy: { createdAt: 'asc' }
    })

    if (targetVersion) {
      targetVersion = await prisma.version.update({
        where: { id: targetVersion.id },
        data: { status: 'IN_PROGRESS' }
      })
    }
  }

  // 3. If no IN_PROGRESS or FUTURE version, create a new IN_PROGRESS version
  if (!targetVersion) {
    const lastVersion = await prisma.version.findFirst({
      orderBy: { versionNumber: 'desc' }
    })

    const nextVerStr = lastVersion ? incrementMinorVersion(lastVersion.versionNumber) : '0.1.0'

    targetVersion = await prisma.version.create({
      data: {
        versionNumber: nextVerStr,
        status: 'IN_PROGRESS'
      }
    })
  }

  // Calculate order within version
  const lastItem = await prisma.versionItem.findFirst({
    where: { versionId: targetVersion.id },
    orderBy: { orderWithinVersion: 'desc' }
  })
  const nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1

  const newItem = await prisma.versionItem.create({
    data: {
      versionId: targetVersion.id,
      type,
      status: 'PROPOSED',
      body: itemBody,
      startedByUserId: user.dbId || user.id,
      orderWithinVersion: nextOrder
    },
    include: {
      version: true,
      startedByUser: true
    }
  })

  return {
    success: true,
    item: newItem,
    versionNumber: targetVersion.versionNumber
  }
})
