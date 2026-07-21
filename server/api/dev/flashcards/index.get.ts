import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'
import { calculateNextTestTime } from '../../../utils/algorithm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Get all user flashcards directly
    const flashcards = await prisma.flashcard.findMany({
      where: {
        ownerId: dbUser.id
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // Get all user activities that correspond to testing/actions
    const activities = await prisma.userFlashcardActivity.findMany({
      where: {
        userId: dbUser.id,
        actionTaken: {
          in: ['TESTED', 'MARKED_AS_KEEP_TESTING', 'MARKED_AS_LEARNED', 'MARKED_AS_PARKED', 'MARKED_AS_DELETED']
        }
      },
      orderBy: {
        whenActedUpon: 'desc'
      }
    })

    // Map activities by flashcardId to easily find the latest one
    const latestActivityMap = new Map<string, string>() // flashcardId -> ISO string
    for (const act of activities) {
      if (!latestActivityMap.has(act.flashcardId)) {
        latestActivityMap.set(act.flashcardId, act.whenActedUpon.toISOString())
      }
    }

    // Build the payload
    const result = flashcards.map((f) => {
      const lastTested = latestActivityMap.get(f.id) || null
      const nextTest = f.nextTestTime?.toISOString() || null
      
      return {
        id: f.id,
        status: f.status,
        rank: f.rank,
        front: f.front,
        frontLanguage: f.frontLanguage,
        back: f.back,
        backLanguage: f.backLanguage,
        pronunciation: f.pronunciation,
        memoryHook: f.memoryHook,
        tags: f.tags.map(t => t.tag.abbreviation),
        lastTested,
        nextTest,
        minutesToTestAgain: dbUser.minutesToTestAgain
      }
    })

    return result
  } catch (error) {
    console.error('Error fetching dev flashcards:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve dev flashcards'
    })
  }
})
