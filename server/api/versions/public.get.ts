import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
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
    where: { versionId: null },
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
