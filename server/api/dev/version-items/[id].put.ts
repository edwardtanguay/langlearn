import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const updated = await prisma.versionItem.update({
    where: { id },
    data: {
      ...(body.body ? { body: body.body.trim() } : {}),
      ...(body.type ? { type: body.type } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(body.versionId ? { versionId: body.versionId } : {})
    }
  })

  return updated
})
