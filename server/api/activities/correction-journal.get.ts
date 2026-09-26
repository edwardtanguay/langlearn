import fs from 'fs'
import path from 'path'
import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { parseCorrectionJournal } from '../../../cli/commands/parse-correction-journal'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  // Load parsed data or generate if not yet generated
  const projectRoot = process.cwd()
  const parsedPath = path.join(projectRoot, 'data-parsed', 'correction-journal.json')

  let journalData: any = null
  if (fs.existsSync(parsedPath)) {
    try {
      journalData = JSON.parse(fs.readFileSync(parsedPath, 'utf8'))
    } catch {
      journalData = parseCorrectionJournal()
    }
  } else {
    journalData = parseCorrectionJournal()
  }

  // Fetch user's section progress
  const userSections = await prisma.userCorrectionSection.findMany({
    where: { userId: dbUser.id }
  })

  const progressMap = new Map<string, { isLearned: boolean; timesTested: number; lastTestedAt: Date | null; learnedFlashcardIds: string[] }>()
  for (const us of userSections) {
    let ids: string[] = []
    try {
      if (us.learnedFlashcardIds) {
        ids = JSON.parse(us.learnedFlashcardIds)
      }
    } catch {
      ids = []
    }
    progressMap.set(us.sectionId, {
      isLearned: us.isLearned,
      timesTested: us.timesTested,
      lastTestedAt: us.lastTestedAt,
      learnedFlashcardIds: ids
    })
  }

  // Attach user progress to each section
  let totalLearnedCount = 0
  const days = journalData.days.map((d: any) => {
    let dayLearned = 0
    const sections = d.sections.map((s: any) => {
      const prog = progressMap.get(s.id)
      const isLearned = prog ? prog.isLearned : false
      const timesTested = prog ? prog.timesTested : 0
      const learnedFlashcardIds = prog ? prog.learnedFlashcardIds : []
      if (isLearned) {
        dayLearned++
        totalLearnedCount++
      }
      return {
        ...s,
        isLearned,
        timesTested,
        lastTestedAt: prog?.lastTestedAt || null,
        learnedFlashcardIds
      }
    })

    return {
      ...d,
      sections,
      learnedCount: dayLearned
    }
  })

  return {
    days,
    totalSections: journalData.totalSections,
    totalWords: journalData.totalWords,
    totalFlashcards: journalData.totalFlashcards,
    totalLearnedCount
  }
})
