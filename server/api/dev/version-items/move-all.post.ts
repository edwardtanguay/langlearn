import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const { sourceVersionId, targetVersionId } = body

  const isIncoming = (id: any) => !id || id === 'none' || id === '' || id === '0.0.0'

  let incomingVerId: string | null = null
  const getIncomingVerId = async () => {
    if (incomingVerId) return incomingVerId
    const incomingVer = await prisma.version.findFirst({
      where: {
        OR: [
          { status: 'INCOMING' },
          { status: 'PROPOSED_ITEMS' },
          { versionNumber: '0.0.0' }
        ]
      }
    })
    incomingVerId = incomingVer?.id || null
    return incomingVerId
  }

  const isSourceIncoming = isIncoming(sourceVersionId)
  const isTargetIncoming = isIncoming(targetVersionId)

  const resolvedSourceId = isSourceIncoming ? await getIncomingVerId() : sourceVersionId
  const resolvedTargetId = isTargetIncoming ? await getIncomingVerId() : targetVersionId

  const sourceWhereClause: any = isSourceIncoming
    ? { OR: [{ versionId: resolvedSourceId }, { versionId: null }] }
    : { versionId: resolvedSourceId }

  await prisma.versionItem.updateMany({
    where: sourceWhereClause,
    data: { versionId: resolvedTargetId }
  })

  return { success: true }
})

