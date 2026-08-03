import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const existingVersion = await prisma.version.findUnique({
    where: { id }
  })

  if (existingVersion && (existingVersion.status === 'INCOMING' || existingVersion.status === 'PROPOSED_ITEMS' || existingVersion.versionNumber === '0.0.0')) {
    throw createError({ statusCode: 400, statusMessage: 'INCOMING version cannot be deleted' })
  }

  await prisma.version.delete({
    where: { id }
  })

  return { success: true }
})

