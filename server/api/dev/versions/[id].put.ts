import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const dataToUpdate: any = {}
  if (body.versionNumber !== undefined) {
    dataToUpdate.versionNumber = body.versionNumber.trim()
  }
  if (body.title !== undefined) {
    dataToUpdate.title = body.title ? body.title.trim() : null
  }
  if (body.status !== undefined) {
    dataToUpdate.status = body.status
  }
  if (body.publishDate !== undefined) {
    dataToUpdate.publishDate = body.publishDate ? new Date(body.publishDate) : null
  }

  const updated = await prisma.version.update({
    where: { id },
    data: dataToUpdate
  })

  return updated
})
