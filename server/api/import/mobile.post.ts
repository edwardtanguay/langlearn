import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { parseImportText } from '../../utils/import-parser'
import { processImportRows, analyzeImportRows } from '../../utils/import-service'

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body || typeof body.mobileImportText !== 'string' || !body.mobileImportText.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'mobileImportText is required'
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

  // Parse import text into structured card rows using unified parser
  const parsedRows = parseImportText(body.mobileImportText)
  if (parsedRows.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid card rows found in the imported text.'
    })
  }

  // If preview requested, return dry-run analysis without persisting
  if (body.preview) {
    const existingCards = await prisma.flashcard.findMany({
      where: {
        ownerId: dbUser.id,
        status: { not: 'DELETED' }
      },
      select: { front: true, back: true }
    })
    const existingSet = new Set<string>()
    for (const card of existingCards) {
      existingSet.add(`${card.front.trim().toLowerCase()}|${card.back.trim().toLowerCase()}`)
    }

    const { willImport, willNotImport } = analyzeImportRows(existingSet, parsedRows)

    return {
      preview: true,
      totalParsed: parsedRows.length,
      willNotImport,
      willImport
    }
  }

  // 1. Save mobile import record
  const record = await prisma.mobileImport.create({
    data: {
      userId: dbUser.id,
      mobileImportText: body.mobileImportText
    }
  })

  // 2. Process import rows (creates flashcards, skips duplicates)
  try {
    const importResult = await processImportRows(dbUser.id, parsedRows)
    return {
      id: record.id,
      userId: record.userId,
      mobileImportText: record.mobileImportText,
      whenImported: formatDate(record.whenImported),
      importedCount: importResult.importedCount,
      skippedCount: importResult.skippedCount
    }
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message || 'Failed to process cards from import text.'
    })
  }
})

