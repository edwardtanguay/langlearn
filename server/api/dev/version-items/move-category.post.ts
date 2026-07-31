import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const { versionCategoryId, targetVersionId } = body

  if (!versionCategoryId) {
    throw createError({ statusCode: 400, statusMessage: 'versionCategoryId is required' })
  }

  const finalVersionId = (targetVersionId === 'none' || targetVersionId === null || targetVersionId === '') ? null : targetVersionId

  await prisma.versionItem.updateMany({
    where: { versionCategoryId },
    data: { versionId: finalVersionId }
  })

  return { success: true }
})
