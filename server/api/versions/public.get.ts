import { prisma } from '../../utils/prisma'
import { parseAndAssignCategories, ensureDefaultCategories } from '../../utils/categoryParser'

export default defineEventHandler(async (event) => {
  // Ensure default categories exist
  await ensureDefaultCategories()

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
  } else if (incomingVersion.status !== 'INCOMING' || incomingVersion.versionNumber !== '0.0.0') {
    incomingVersion = await prisma.version.update({
      where: { id: incomingVersion.id },
      data: {
        versionNumber: '0.0.0',
        title: 'Incoming changes',
        status: 'INCOMING'
      }
    })
  }

  // Assign any orphan version items to the INCOMING version
  await prisma.versionItem.updateMany({
    where: { versionId: null },
    data: { versionId: incomingVersion.id }
  })

  const versions = await prisma.version.findMany({
    include: {
      versionItems: {
        orderBy: { orderWithinVersion: 'asc' },
        include: {
          versionCategory: true,
          startedByUser: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      }
    },
    orderBy: { versionNumber: 'desc' }
  })

  const unassignedItems = await prisma.versionItem.findMany({
    where: { versionId: incomingVersion.id },
    orderBy: { orderWithinVersion: 'asc' },
    include: {
      versionCategory: true,
      startedByUser: {
        select: { id: true, firstName: true, lastName: true, email: true }
      }
    }
  })

  const categories = await prisma.versionCategory.findMany({
    include: {
      abbreviations: true
    },
    orderBy: { title: 'asc' }
  })

  return {
    versions,
    unassignedItems,
    categories
  }
})

