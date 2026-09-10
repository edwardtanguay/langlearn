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

    // Practice queue: prioritize unlearned cards (least taken first, then highest rank)
    const unlearned = validCards.filter(c => c.pronunciationStatus !== 'LEARNED')
    const learnedCards = validCards.filter(c => c.pronunciationStatus === 'LEARNED')

    unlearned.sort((a, b) => {
      const timesA = a.pronunciationTimesTaken ?? 0
      const timesB = b.pronunciationTimesTaken ?? 0
      if (timesA !== timesB) return timesA - timesB
      return (b.rank ?? 2.5) - (a.rank ?? 2.5)
    })

    learnedCards.sort((a, b) => (b.rank ?? 2.5) - (a.rank ?? 2.5))

    const practiceQueue = unlearned.length > 0 ? unlearned : learnedCards

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
