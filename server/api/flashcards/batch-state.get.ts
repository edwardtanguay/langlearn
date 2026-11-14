import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)

  const dbUser = (await prisma.user.findUnique({
    where: { id: user.dbId || user.id }
  })) || (user.email ? await prisma.user.findUnique({
    where: { email: user.email }
  }) : null)

  if (!dbUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const strategy = (query.strategy as string) || dbUser.lastFlashcardStrategy || 'last_imported'
  const language = (query.language as string) || dbUser.lastFlashcardLanguage || 'all'

  const saved = await prisma.userFlashcardBatch.findUnique({
    where: {
      userId_strategy_language: {
        userId: dbUser.id,
        strategy,
        language
      }
    }
  })

  if (!saved || saved.isBatchComplete) {
    return { found: false, strategy, language }
  }

  try {
    const slots = JSON.parse(saved.slotsJson || '[]') as Array<{
      id: string
      slotIndex: number
      unsuccessfulCount: number
      status: 'untested' | 'testing' | 'learned' | 'parked' | 'deleted'
      language?: string
    }>
    const queueIds = JSON.parse(saved.queueIdsJson || '[]') as string[]
    const allCardIds = JSON.parse(saved.allCardIdsJson || '[]') as string[]

    if (slots.length === 0 || allCardIds.length === 0) {
      return { found: false, strategy, language }
    }

    const cards = await prisma.flashcard.findMany({
      where: {
        id: { in: allCardIds },
        ownerId: dbUser.id
      },
      include: {
        owner: true,
        tags: { include: { tag: true } }
      }
    })

    const cardMap = new Map(cards.map(c => [c.id, c]))

    // Filter out cards that no longer exist in DB, and mark externally-deleted cards as deleted
    const validSlots = slots
      .filter(s => cardMap.has(s.id))
      .map((s, idx) => {
        const card = cardMap.get(s.id)!
        if (card.status === 'DELETED' && s.status !== 'deleted') {
          return { ...s, slotIndex: idx, status: 'deleted' as const }
        }
        return { ...s, slotIndex: idx }
      })

    const allCards = allCardIds
      .map(id => cardMap.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))

    const queueCards = queueIds
      .map(id => cardMap.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c) && c.status !== 'DELETED')

    if (validSlots.length === 0 || queueCards.length === 0) {
      return { found: false, strategy, language }
    }

    const targetGroupSize = (dbUser.testingGroupSize && dbUser.testingGroupSize !== 10) ? dbUser.testingGroupSize : 7
    if (validSlots.length > targetGroupSize) {
      return { found: false, strategy, language }
    }

    return {
      found: true,
      strategy,
      language,
      slots: validSlots,
      queueCards,
      allCards,
      currentCardId: saved.currentCardId,
      learnedInBatchCount: saved.learnedInBatchCount,
      totalInBatch: validSlots.length,
      isBatchComplete: false
    }
  } catch (err) {
    console.error('Failed to parse saved flashcard batch state:', err)
    return { found: false, strategy, language }
  }
})

