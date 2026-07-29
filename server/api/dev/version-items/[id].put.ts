import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const targetVersionId = (body.versionId === 'none' || body.versionId === null || body.versionId === '') ? null : body.versionId

  const dataToUpdate: any = {}
  if (body.body !== undefined) dataToUpdate.body = body.body.trim()
  if (body.type !== undefined) dataToUpdate.type = body.type
  if (body.versionId !== undefined) dataToUpdate.versionId = targetVersionId

  const updated = await prisma.versionItem.update({
    where: { id },
    data: dataToUpdate
  })

  return updated
})
