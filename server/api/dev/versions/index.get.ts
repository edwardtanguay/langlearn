import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { compareSemVerDesc } from '../../../../shared/utils/semver'

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

  versions.sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))

  return versions
})
