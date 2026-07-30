import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const existingVersion = await prisma.version.findUnique({
    where: { id }
  })

  if (existingVersion && (existingVersion.status === 'PROPOSED_ITEMS' || existingVersion.versionNumber === '0.0.0')) {
    throw createError({ statusCode: 400, statusMessage: 'PROPOSED_ITEMS version cannot be modified' })
  }

  const dataToUpdate: any = {}
  if (body.versionNumber !== undefined) {
    const verNum = body.versionNumber.trim()
    if (verNum === '0.0.0' || body.status === 'PROPOSED_ITEMS') {
      throw createError({ statusCode: 400, statusMessage: 'PROPOSED_ITEMS version 0.0.0 is reserved and system managed' })
    }

    const taken = await prisma.version.findFirst({
      where: {
        versionNumber: verNum,
        NOT: { id }
      }
    })
    if (taken) {
      throw createError({ statusCode: 400, statusMessage: 'version number already taken' })
    }
    dataToUpdate.versionNumber = verNum
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

