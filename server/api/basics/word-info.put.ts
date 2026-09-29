import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const userId = user.dbId || user.id
  const body = await readBody(event)

  const { wordId, language, pronunciation, isLearned, rank, syncLearnedWordIds } = body

  if (!language || typeof language !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'language is required' })
  }

  // Batch sync learned IDs from localStorage if provided
  if (Array.isArray(syncLearnedWordIds)) {
    for (const wId of syncLearnedWordIds) {
      if (typeof wId === 'string' && wId.trim()) {
        await prisma.basicWordInfo.upsert({
          where: {
            userId_wordId_language: {
              userId,
              wordId: wId,
              language
            }
          },
          update: { isLearned: true },
          create: {
            userId,
            wordId: wId,
            language,
            isLearned: true
          }
        })
      }
    }
    return { success: true, count: syncLearnedWordIds.length }
  }

  if (!wordId || typeof wordId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'wordId is required' })
  }

  const updateData: { pronunciation?: string | null; isLearned?: boolean; rank?: number | null } = {}
  const createData: { userId: string; wordId: string; language: string; pronunciation?: string | null; isLearned?: boolean; rank?: number | null } = {
    userId,
    wordId,
    language
  }

  if (pronunciation !== undefined) {
    const cleanPronunciation = typeof pronunciation === 'string' ? pronunciation.trim() : null
    updateData.pronunciation = cleanPronunciation
    createData.pronunciation = cleanPronunciation
  }

  if (isLearned !== undefined) {
    updateData.isLearned = Boolean(isLearned)
    createData.isLearned = Boolean(isLearned)
  }

  if (rank !== undefined) {
    const cleanRank = typeof rank === 'number' ? Math.max(0, Math.min(5, rank)) : null
    updateData.rank = cleanRank
    createData.rank = cleanRank
  }

  const updated = await prisma.basicWordInfo.upsert({
    where: {
      userId_wordId_language: {
        userId,
        wordId,
        language
      }
    },
    update: updateData,
    create: createData
  })

  // If rank was updated, also update any existing wordInfo records for other languages so rank stays in sync
  if (rank !== undefined && updateData.rank !== undefined) {
    await prisma.basicWordInfo.updateMany({
      where: {
        userId,
        wordId
      },
      data: {
        rank: updateData.rank
      }
    })
  }

  return { item: updated }
})
