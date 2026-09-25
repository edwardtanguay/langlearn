import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const { sectionId, action } = body

  if (!sectionId || !['LEARNED', 'KEEP_TESTING'].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'sectionId and valid action ("LEARNED" | "KEEP_TESTING") are required'
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

  const isLearned = action === 'LEARNED'

  const record = await prisma.userCorrectionSection.upsert({
    where: {
      userId_sectionId: {
        userId: dbUser.id,
        sectionId
      }
    },
    update: {
      isLearned,
      timesTested: {
        increment: 1
      },
      lastTestedAt: new Date()
    },
    create: {
      userId: dbUser.id,
      sectionId,
      isLearned,
      timesTested: 1,
      lastTestedAt: new Date()
    }
  })

  return {
    success: true,
    record
  }
})
