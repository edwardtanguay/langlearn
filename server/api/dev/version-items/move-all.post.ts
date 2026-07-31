import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const { sourceVersionId, targetVersionId } = body

  const finalSourceVersionId = (sourceVersionId === 'none' || sourceVersionId === null || sourceVersionId === '') ? null : sourceVersionId
  const finalTargetVersionId = (targetVersionId === 'none' || targetVersionId === null || targetVersionId === '') ? null : targetVersionId

  await prisma.versionItem.updateMany({
    where: {
      versionId: finalSourceVersionId
    },
    data: { versionId: finalTargetVersionId }
  })

  return { success: true }
})
