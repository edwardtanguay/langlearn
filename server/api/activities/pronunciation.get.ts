import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

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

    // Fetch all flashcards owned by user that have a valid pronunciation
    const allCards = await prisma.flashcard.findMany({
      where: {
        ownerId: dbUser.id,
        pronunciation: {
          not: null
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        activities: {
          where: {
            actionTaken: {
              in: ['PRONUNCIATION_KEEP_TAKING', 'PRONUNCIATION_LEARNED']
            }
          },
          orderBy: {
            whenActedUpon: 'desc'
          },
          take: 1
        }
      }
    })

    // Filter out empty pronunciations and 'fix' tag
    const validCards = allCards.filter(c => 
      c.pronunciation && 
      c.pronunciation.trim().length > 0 &&
      !c.tags?.some(t => t.tag.abbreviation.toLowerCase() === 'fix')
    )

    // Calculate metrics:
    // Learned: marked as LEARNED
    // Taken: taken at least once (pronunciationTimesTaken >= 1)
    // New: untested (pronunciationTimesTaken === 0)
    const learned = validCards.filter(c => c.pronunciationStatus === 'LEARNED').length
    const taken = validCards.filter(c => (c.pronunciationTimesTaken ?? 0) >= 1).length
    const newCount = validCards.filter(c => (c.pronunciationTimesTaken ?? 0) === 0).length

    const query = getQuery(event)
    const reviewMode = query.review === 'true'

    // Separate unlearned cards into "new" (untested) and "testing" (in-progress)
    const unlearned = validCards.filter(c => c.pronunciationStatus !== 'LEARNED')
    const learnedCards = validCards.filter(c => c.pronunciationStatus === 'LEARNED')

    const newCards = unlearned.filter(c => (c.pronunciationTimesTaken ?? 0) === 0)
    const testingCards = unlearned.filter(c => (c.pronunciationTimesTaken ?? 0) >= 1)

    // Group 1: New untested cards sorted by rank descending (highest priority first)
    newCards.sort((a, b) => (b.rank ?? 2.5) - (a.rank ?? 2.5))

    // Group 2: Testing cards sorted by last tested time ascending (oldest tested first, newly tested at the back)
    testingCards.sort((a, b) => {
      const lastA = a.activities?.[0]?.whenActedUpon ? new Date(a.activities[0].whenActedUpon).getTime() : 0
      const lastB = b.activities?.[0]?.whenActedUpon ? new Date(b.activities[0].whenActedUpon).getTime() : 0
      if (lastA !== lastB) return lastA - lastB
      return (b.rank ?? 2.5) - (a.rank ?? 2.5)
    })

    const rawQueue = unlearned.length > 0
      ? [...newCards, ...testingCards]
      : (reviewMode ? learnedCards.sort((a, b) => (b.rank ?? 2.5) - (a.rank ?? 2.5)) : [])

    // Strip internal activities relation before sending to client
    const practiceQueue = rawQueue.map(({ activities, ...card }) => card)

    return {
      metrics: {
        learned,
        taken,
        new: newCount,
        total: validCards.length
      },
      cards: practiceQueue
    }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('Error fetching pronunciation practice data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve pronunciation practice data'
    })
  }
})
