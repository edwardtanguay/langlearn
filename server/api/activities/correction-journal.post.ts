import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const { sectionId, action, learnedFlashcardIds, isLearned } = body

  if (!sectionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'sectionId is required'
    })
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  let targetIsLearned: boolean | undefined = undefined
  if (typeof isLearned === 'boolean') {
    targetIsLearned = isLearned
  } else if (action === 'LEARNED') {
    targetIsLearned = true
  } else if (action === 'KEEP_TESTING') {
    targetIsLearned = false
  }

  const learnedJson = Array.isArray(learnedFlashcardIds)
    ? JSON.stringify(learnedFlashcardIds)
    : undefined

  const record = await prisma.userCorrectionSection.upsert({
    where: {
      userId_sectionId: {
        userId: dbUser.id,
        sectionId
      }
    },
    update: {
      ...(targetIsLearned !== undefined ? { isLearned: targetIsLearned } : {}),
      ...(learnedJson !== undefined ? { learnedFlashcardIds: learnedJson } : {}),
      timesTested: {
        increment: 1
      },
      lastTestedAt: new Date()
    },
    create: {
      userId: dbUser.id,
      sectionId,
      isLearned: targetIsLearned ?? false,
      learnedFlashcardIds: learnedJson ?? '[]',
      timesTested: 1,
      lastTestedAt: new Date()
    }
  })

  return {
    success: true,
    record
  }
})

