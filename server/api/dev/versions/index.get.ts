import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const versions = await prisma.version.findMany({
    include: {
      versionItems: {
        orderBy: { orderWithinVersion: 'asc' },
        include: {
          startedByUser: true
        }
      }
    },
    orderBy: { versionNumber: 'desc' }
  })

  return versions
})
