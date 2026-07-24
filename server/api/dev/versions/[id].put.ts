import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const updated = await prisma.version.update({
    where: { id },
    data: {
      ...(body.versionNumber ? { versionNumber: body.versionNumber.trim() } : {}),
      ...(body.status ? { status: body.status } : {})
    }
  })

  return updated
})
