import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body?.versionNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Version number is required'
    })
  }

  const version = await prisma.version.create({
    data: {
      versionNumber: body.versionNumber.trim(),
      title: body.title ? body.title.trim() : null,
      status: body.status || 'IN_PROGRESS',
      publishDate: body.publishDate ? new Date(body.publishDate) : null
    }
  })

  return version
})
