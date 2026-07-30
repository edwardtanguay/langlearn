import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

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

  // Ensure PROPOSED_ITEMS 0.0.0 version exists
  let proposedVersion = await prisma.version.findFirst({
    where: {
      OR: [
        { status: 'PROPOSED_ITEMS' },
        { versionNumber: '0.0.0' }
      ]
    }
  })

  if (!proposedVersion) {
    proposedVersion = await prisma.version.create({
      data: {
        versionNumber: '0.0.0',
        title: 'Proposed changes',
        status: 'PROPOSED_ITEMS',
        publishDate: null
      }
    })
  }

  // Calculate order within PROPOSED_ITEMS version items
  const lastItem = await prisma.versionItem.findFirst({
    where: { versionId: proposedVersion.id },
    orderBy: { orderWithinVersion: 'desc' }
  })
  const nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1

  const userId = user.dbId || user.id

  const newItem = await prisma.versionItem.create({
    data: {
      versionId: proposedVersion.id,
      type,
      body: itemBody,
      startedByUserId: userId,
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

