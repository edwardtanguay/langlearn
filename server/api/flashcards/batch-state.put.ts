import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const dbUser = (await prisma.user.findUnique({
    where: { id: user.dbId || user.id }
  })) || (user.email ? await prisma.user.findUnique({
    where: { email: user.email }
  }) : null)

  if (!dbUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const strategy = typeof body?.strategy === 'string' && body.strategy ? body.strategy : 'last_imported'
  const language = typeof body?.language === 'string' && body.language ? body.language : 'all'
  const slots = Array.isArray(body?.slots) ? body.slots : []
  const queueIds = Array.isArray(body?.queueIds) ? body.queueIds : []
  const allCardIds = Array.isArray(body?.allCardIds) ? body.allCardIds : []
  const currentCardId = typeof body?.currentCardId === 'string' ? body.currentCardId : null
  const learnedInBatchCount = typeof body?.learnedInBatchCount === 'number' ? body.learnedInBatchCount : 0
  const totalInBatch = typeof body?.totalInBatch === 'number' ? body.totalInBatch : slots.length
  const isBatchComplete = Boolean(body?.isBatchComplete)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: dbUser.id },
      data: {
        lastFlashcardStrategy: strategy,
        lastFlashcardLanguage: language
      }
    }),
    prisma.userFlashcardBatch.upsert({
      where: {
        userId_strategy_language: {
          userId: dbUser.id,
          strategy,
          language
        }
      },
      create: {
        userId: dbUser.id,
        strategy,
        language,
        slotsJson: JSON.stringify(slots),
        queueIdsJson: JSON.stringify(queueIds),
        allCardIdsJson: JSON.stringify(allCardIds),
        currentCardId,
        learnedInBatchCount,
        totalInBatch,
        isBatchComplete
      },
      update: {
        slotsJson: JSON.stringify(slots),
        queueIdsJson: JSON.stringify(queueIds),
        allCardIdsJson: JSON.stringify(allCardIds),
        currentCardId,
        learnedInBatchCount,
        totalInBatch,
        isBatchComplete
      }
    })
  ])

  return { ok: true }
})

