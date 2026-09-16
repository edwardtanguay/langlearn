import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const userId = user.dbId || user.id
  const body = await readBody(event)

  const { wordId, language, pronunciation } = body

  if (!wordId || typeof wordId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'wordId is required' })
  }
  if (!language || typeof language !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'language is required' })
  }

  const cleanPronunciation = typeof pronunciation === 'string' ? pronunciation.trim() : null

  const updated = await prisma.basicWordInfo.upsert({
    where: {
      userId_wordId_language: {
        userId,
        wordId,
        language
      }
    },
    update: {
      pronunciation: cleanPronunciation
    },
    create: {
      userId,
      wordId,
      language,
      pronunciation: cleanPronunciation
    }
  })

  return { item: updated }
})
