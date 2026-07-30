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

  const verNum = body.versionNumber.trim()
  if (verNum === '0.0.0' || body.status === 'PROPOSED_ITEMS') {
    throw createError({
      statusCode: 400,
      statusMessage: 'PROPOSED_ITEMS version 0.0.0 is reserved and system managed'
    })
  }

  const existing = await prisma.version.findUnique({
    where: { versionNumber: verNum }
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'version number already taken'
    })
  }

  const version = await prisma.version.create({
    data: {
      versionNumber: verNum,
      title: body.title ? body.title.trim() : null,
      status: body.status || 'IN_PROGRESS',
      publishDate: body.publishDate ? new Date(body.publishDate) : null
    }
  })

  return version
})

