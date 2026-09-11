import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

function getStartOfDayInTimezone(tz?: string): Date {
  if (!tz) {
    const fallback = new Date()
    fallback.setHours(0, 0, 0, 0)
    return fallback
  }

  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const dateStr = formatter.format(now)
    const utcMidnight = new Date(`${dateStr}T00:00:00.000Z`)

    const offsetParts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(utcMidnight)

    const localHour = parseInt(offsetParts.find(p => p.type === 'hour')?.value || '0', 10)
    const localMinute = parseInt(offsetParts.find(p => p.type === 'minute')?.value || '0', 10)
    let offsetMinutes = localHour * 60 + localMinute
    if (offsetMinutes > 12 * 60) {
      offsetMinutes -= 24 * 60
    }
    return new Date(utcMidnight.getTime() - offsetMinutes * 60 * 1000)
  } catch (e) {
    const fallback = new Date()
    fallback.setHours(0, 0, 0, 0)
    return fallback
  }
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const clientTz = (getHeader(event, 'x-client-timezone') as string) || (getQuery(event).tz as string) || undefined

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

    const now = new Date()

    const readyCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id,
        status: 'LEARNING',
        OR: [
          { nextTestTime: null },
          { nextTestTime: { lte: now } }
        ]
      }
    })

    const waitingCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id,
        status: 'LEARNING',
        nextTestTime: { gt: now }
      }
    })

    const startOfDay = getStartOfDayInTimezone(clientTz)

    const totalCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id
      }
    })

    const todayReviewedCount = await prisma.userFlashcardActivity.count({
      where: {
        userId: dbUser.id,
        whenActedUpon: { gte: startOfDay },
        actionTaken: {
          in: ['MARKED_AS_KEEP_TESTING', 'MARKED_AS_LEARNED', 'MARKED_AS_PARKED', 'MARKED_AS_DELETED']
        }
      }
    })

    const todayCorrectCount = await prisma.userFlashcardActivity.count({
      where: {
        userId: dbUser.id,
        whenActedUpon: { gte: startOfDay },
        actionTaken: 'MARKED_AS_LEARNED'
      }
    })

    const todayImportedCount = await prisma.flashcard.count({
      where: {
        ownerId: dbUser.id,
        createdAt: { gte: startOfDay }
      }
    })

    return {
      readyCount,
      waitingCount,
      totalCount,
      todayReviewedCount,
      todayCorrectCount,
      todayImportedCount
    }
  } catch (error) {
    console.error('Error fetching flashcard stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve flashcard stats'
    })
  }
})
