import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

function getDayRangeInTimezone(daysAgo: number, tz?: string): { start: Date; end: Date; dateStr: string } {
  const safeDaysAgo = Math.max(0, Math.min(365, Math.floor(daysAgo) || 0))
  const now = new Date()
  const targetRef = new Date(now.getTime() - safeDaysAgo * 24 * 60 * 60 * 1000)

  if (!tz) {
    const start = new Date(targetRef)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    const dateStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
    return { start, end, dateStr }
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const dateStr = formatter.format(targetRef)
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
    const start = new Date(utcMidnight.getTime() - offsetMinutes * 60 * 1000)
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
    return { start, end, dateStr }
  } catch {
    const start = new Date(targetRef)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    const dateStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
    return { start, end, dateStr }
  }
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const daysAgo = Number(query.daysAgo ?? 0)
  const clientTz = (getHeader(event, 'x-client-timezone') as string) || (query.tz as string) || undefined

  const dbUser = (await prisma.user.findUnique({ where: { id: user.dbId || user.id } }))
    || (user.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null)

  if (!dbUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const { start, end, dateStr } = getDayRangeInTimezone(daysAgo, clientTz)

  const [activities, pointLogs] = await Promise.all([
    prisma.userFlashcardActivity.findMany({
      where: {
        userId: dbUser.id,
        whenActedUpon: { gte: start, lt: end }
      },
      include: {
        flashcard: {
          select: { frontLanguage: true }
        }
      },
      orderBy: { whenActedUpon: 'desc' }
    }),
    prisma.pointLog.findMany({
      where: {
        userId: dbUser.id,
        createdAt: { gte: start, lt: end }
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  const byLanguage: Record<string, number> = {}
  const byAction: Record<string, number> = {
    MARKED_AS_LEARNED: 0,
    MARKED_AS_KEEP_TESTING: 0,
    MARKED_AS_PARKED: 0,
    MARKED_AS_DELETED: 0
  }

  for (const act of activities) {
    const lang = act.flashcard?.frontLanguage || 'unknown'
    byLanguage[lang] = (byLanguage[lang] || 0) + 1
    if (act.actionTaken in byAction) {
      byAction[act.actionTaken] = (byAction[act.actionTaken] || 0) + 1
    } else {
      byAction[act.actionTaken] = 1
    }
  }

  const totalPoints = pointLogs.reduce((sum, l) => sum + l.points, 0)

  return {
    date: dateStr,
    daysAgo: Math.max(0, Math.floor(daysAgo) || 0),
    totalFlashcards: activities.length,
    totalPoints,
    byLanguage,
    byAction,
    logs: pointLogs.slice(0, 50)
  }
})

