import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { parseAndAssignCategories } from '../../utils/categoryParser'

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

  // Ensure INCOMING 0.0.0 version exists
  let incomingVersion = await prisma.version.findFirst({
    where: {
      OR: [
        { status: 'INCOMING' },
        { status: 'PROPOSED_ITEMS' },
        { versionNumber: '0.0.0' }
      ]
    }
  })

  if (!incomingVersion) {
    incomingVersion = await prisma.version.create({
      data: {
        versionNumber: '0.0.0',
        title: 'Incoming changes',
        status: 'INCOMING',
        publishDate: null
      }
    })
  }

  // Calculate order within INCOMING version items
  const lastItem = await prisma.versionItem.findFirst({
    where: { versionId: incomingVersion.id },
    orderBy: { orderWithinVersion: 'desc' }
  })
  const nextOrder = (lastItem?.orderWithinVersion ?? 0) + 1

  const userId = user.dbId || user.id

  const newItem = await prisma.versionItem.create({
    data: {
      versionId: incomingVersion.id,
      type,
      body: itemBody,
      startedByUserId: userId,
      orderWithinVersion: nextOrder
    },
    include: {
      startedByUser: true
    }
  })

  // Run category parsing across all items
  await parseAndAssignCategories()

  const refetchedItem = await prisma.versionItem.findUnique({
    where: { id: newItem.id },
    include: {
      startedByUser: true,
      versionCategory: true
    }
  })

  return {
    success: true,
    item: refetchedItem || newItem
  }
})

