import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
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
  } else if (proposedVersion.status !== 'PROPOSED_ITEMS' || proposedVersion.versionNumber !== '0.0.0') {
    proposedVersion = await prisma.version.update({
      where: { id: proposedVersion.id },
      data: {
        versionNumber: '0.0.0',
        status: 'PROPOSED_ITEMS'
      }
    })
  }

  // Assign any orphan version items to the PROPOSED_ITEMS version
  await prisma.versionItem.updateMany({
    where: { versionId: null },
    data: { versionId: proposedVersion.id }
  })

  const versions = await prisma.version.findMany({
    include: {
      versionItems: {
        orderBy: { orderWithinVersion: 'asc' },
        include: {
          startedByUser: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      }
    },
    orderBy: { versionNumber: 'desc' }
  })

  const unassignedItems = await prisma.versionItem.findMany({
    where: { versionId: proposedVersion.id },
    orderBy: { orderWithinVersion: 'asc' },
    include: {
      startedByUser: {
        select: { id: true, firstName: true, lastName: true, email: true }
      }
    }
  })

  return {
    versions,
    unassignedItems
  }
})

