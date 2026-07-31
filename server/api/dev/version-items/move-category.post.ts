import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const { versionCategoryId, sourceVersionId, targetVersionId } = body

  if (!versionCategoryId) {
    throw createError({ statusCode: 400, statusMessage: 'versionCategoryId is required' })
  }

  const finalSourceVersionId = (sourceVersionId === 'none' || sourceVersionId === null || sourceVersionId === '') ? null : sourceVersionId
  const finalTargetVersionId = (targetVersionId === 'none' || targetVersionId === null || targetVersionId === '') ? null : targetVersionId

  await prisma.versionItem.updateMany({
    where: {
      versionCategoryId,
      versionId: finalSourceVersionId
    },
    data: { versionId: finalTargetVersionId }
  })

  return { success: true }
})
