import { prisma } from './prisma'
import { parseMetadata } from './metadata-parser'
import { calculateOptimalRank } from './rank-config'
import crypto from 'crypto'
import type { ParsedRow } from './import-parser'

function mapLanguage(lang: string): string {
  const l = lang.trim().toLowerCase()
  if (l === 'english') return 'en'
  if (l === 'french') return 'fr'
  if (l === 'german') return 'de'
  if (l === 'italian') return 'it'
  if (l === 'dutch') return 'nl'
  if (l === 'spanish') return 'es'
  return l.substring(0, 2)
}

export interface CardDetail {
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  memoryHook?: string | null
  rank?: number | null
  tags?: string[]
}

export interface SkippedCardDetail extends CardDetail {
  reason: string
}

export function cleanTrailingPunctuation(str: string): string {
  let s = str.trim()
  if (!s) return s

  const endsWithAsterisk = s.endsWith('*')
  if (endsWithAsterisk) {
    s = s.slice(0, -1).trim()
  }

  const match = s.match(/[\s.,!?;:…\-]+$/)
  if (match) {
    const trailing = match[0]
    const base = s.slice(0, -trailing.length).trim()
    if (base) {
      s = trailing.includes('?') ? `${base}?` : base
    }
  }

  if (endsWithAsterisk) {
    s = `${s}*`
  }

  return s
}

export function analyzeImportRows(existingSet: Set<string>, rows: ParsedRow[], sourceLanguage: string = 'en'): {
  willImport: CardDetail[]
  willNotImport: SkippedCardDetail[]
} {
  const payloadSet = new Set<string>()
  const willImport: CardDetail[] = []
  const willNotImport: SkippedCardDetail[] = []
  const userSourceLang = mapLanguage(sourceLanguage || 'en')

  for (const row of rows) {
    if (!row.lang1 || !row.lang2 || !row.text1 || !row.text2) {
      let reason = 'Missing language or text field'
      if (!row.text2 && row.text1) {
        reason = 'Incomplete card (missing back text)'
      } else if (!row.text1 && row.text2) {
        reason = 'Incomplete card (missing front text)'
      }
      willNotImport.push({
        front: row.text1 || '(empty)',
        back: row.text2 || '(empty)',
        frontLanguage: row.lang1 || 'unknown',
        backLanguage: row.lang2 || 'unknown',
        reason
      })
      continue
    }

    const meta1 = parseMetadata(row.text1)
    const meta2 = parseMetadata(row.text2)

    let front = ''
    let back = ''
    let frontLanguage = ''
    let backLanguage = ''

    const lang1Code = mapLanguage(row.lang1)
    const lang2Code = mapLanguage(row.lang2)

    if (lang1Code === userSourceLang) {
      front = meta1.cleanText
      back = meta2.cleanText
      frontLanguage = lang1Code
      backLanguage = lang2Code
    } else if (lang2Code === userSourceLang) {
      front = meta2.cleanText
      back = meta1.cleanText
      frontLanguage = lang2Code
      backLanguage = lang1Code
    } else {
      willNotImport.push({
        front: meta1.cleanText || row.text1 || '(empty)',
        back: meta2.cleanText || row.text2 || '(empty)',
        frontLanguage: lang1Code || row.lang1,
        backLanguage: lang2Code || row.lang2,
        reason: `Neither language matches your source language (${userSourceLang.toUpperCase()})`
      })
      continue
    }

    if (!front || !back) {
      willNotImport.push({
        front: front || row.text1 || '(empty)',
        back: back || row.text2 || '(empty)',
        frontLanguage: frontLanguage || row.lang1,
        backLanguage: backLanguage || row.lang2,
        reason: 'Empty text after parsing metadata'
      })
      continue
    }

    // Clean front text: remove "my friend," prefix, asterisks, and trailing punctuation
    front = front.replace(/^my friend,\s*/i, '').replace(/\*/g, '').trim()
    front = cleanTrailingPunctuation(front)

    // Clean back text trailing punctuation
    back = cleanTrailingPunctuation(back)

    // If target phrase (back) is only one word, wrap it with asterisks so it's highlighted
    const cleanBack = back.replace(/\*/g, '').trim()
    if (cleanBack.length > 0 && !/\s/.test(cleanBack)) {
      back = `*${cleanBack}*`
    }

    if (!front || !back) {
      willNotImport.push({
        front: front || '(empty)',
        back: back || '(empty)',
        frontLanguage,
        backLanguage,
        reason: 'Empty text after formatting'
      })
      continue
    }

    const rowTags = Array.from(new Set([
      ...(row.tags || []),
      ...(meta1.tags || []),
      ...(meta2.tags || [])
    ]))

    const pronunciation = row.pronunciation || meta1.pronunciation || meta2.pronunciation || null
    const memoryHook = row.memoryHook || meta1.memoryHook || meta2.memoryHook || null
    const rank = row.rank ?? meta1.rank ?? meta2.rank ?? calculateOptimalRank(front)

    const cardInfo: CardDetail = {
      front,
      back,
      frontLanguage,
      backLanguage,
      pronunciation,
      memoryHook,
      rank,
      tags: rowTags
    }

    if (front.trim().toLowerCase() === back.trim().toLowerCase()) {
      willNotImport.push({
        ...cardInfo,
        reason: 'Front and back are identical'
      })
      continue
    }

    const key = `${front.trim().toLowerCase()}|${back.trim().toLowerCase()}`

    if (existingSet.has(key)) {
      willNotImport.push({
        ...cardInfo,
        reason: 'Already exists in your cards database (duplicate)'
      })
      continue
    }

    if (payloadSet.has(key)) {
      willNotImport.push({
        ...cardInfo,
        reason: 'Duplicate entry in this import batch'
      })
      continue
    }

    payloadSet.add(key)
    willImport.push(cardInfo)
  }

  return { willImport, willNotImport }
}

export function getStartOfDayInTimezone(tz?: string): Date {
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

export function formatLocalYMDHMS(date: Date, tz?: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz || undefined,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    return formatter.format(date).replace(',', '')
  } catch (e) {
    return date.toISOString().replace('T', ' ').slice(0, 19)
  }
}

export async function processImportRows(userId: string, rows: ParsedRow[], clientTz?: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!dbUser) {
    throw new Error('User not found')
  }

  if (!dbUser.sourceLanguage) {
    throw new Error('Please set your source language in your profile before importing flashcards.')
  }

  const existingCards = await prisma.flashcard.findMany({
    where: {
      ownerId: dbUser.id,
      status: {
        not: 'DELETED'
      }
    },
    select: {
      front: true,
      back: true
    }
  })

  const existingSet = new Set<string>()
  for (const card of existingCards) {
    existingSet.add(`${card.front.trim().toLowerCase()}|${card.back.trim().toLowerCase()}`)
  }

  const { willImport, willNotImport } = analyzeImportRows(existingSet, rows, dbUser.sourceLanguage)

  const cardsToCreate: any[] = []
  const activitiesToCreate: any[] = []

  for (const card of willImport) {
    const flashcardId = crypto.randomUUID()
    cardsToCreate.push({
      id: flashcardId,
      ownerId: dbUser.id,
      front: card.front,
      back: card.back,
      frontLanguage: card.frontLanguage,
      backLanguage: card.backLanguage,
      pronunciation: card.pronunciation || null,
      memoryHook: card.memoryHook || null,
      status: 'LEARNING',
      rank: card.rank ?? calculateOptimalRank(card.front),
      tagsToAttach: card.tags || []
    })

    activitiesToCreate.push({
      id: crypto.randomUUID(),
      userId: dbUser.id,
      flashcardId,
      actionTaken: 'IMPORTED',
      actionDetails: 'Imported from text/CSV'
    })
  }

  const skippedCards = willNotImport

  if (cardsToCreate.length > 0) {
    if (dbUser.role !== 'admin') {
      const startOfToday = getStartOfDayInTimezone(clientTz)

      const todayCount = await prisma.flashcard.count({
        where: {
          ownerId: dbUser.id,
          createdAt: { gte: startOfToday }
        }
      })

      if (todayCount + cardsToCreate.length > 100) {
        const remaining = Math.max(0, 100 - todayCount)
        const waitDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const waitFormatted = formatLocalYMDHMS(waitDate, clientTz)
        throw new Error(`Members can only import 100 cards per day. You have imported ${todayCount} today and are trying to import ${cardsToCreate.length}. You may either import ${remaining} now, or wait until ${waitFormatted} to import 100 again. This is a safety measure to prevent spamming. If you would like to be able to import more cards per day, contact the administrator (Edward).`)
      }
    }

    // Collect all unique tag abbreviations across all cards to create
    const allTagAbbrevs = new Set<string>()
    for (const card of cardsToCreate) {
      for (const t of card.tagsToAttach) {
        allTagAbbrevs.add(t)
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Ensure all tags exist in Tag table
      const tagMap = new Map<string, string>() // abbreviation -> tagId
      if (allTagAbbrevs.size > 0) {
        const existingTags = await tx.tag.findMany({
          where: { abbreviation: { in: Array.from(allTagAbbrevs) } }
        })
        for (const tag of existingTags) {
          tagMap.set(tag.abbreviation, tag.id)
        }

        const missingAbbrevs = Array.from(allTagAbbrevs).filter(abbrev => !tagMap.has(abbrev))
        for (const abbrev of missingAbbrevs) {
          const newTag = await tx.tag.create({
            data: { abbreviation: abbrev }
          })
          tagMap.set(abbrev, newTag.id)
        }
      }

      // 2. Prepare FlashcardTag items
      const flashcardTagsToCreate: Array<{ id: string; flashcardId: string; tagId: string }> = []
      const cardDataToCreate = cardsToCreate.map(({ tagsToAttach, ...cardData }) => {
        for (const abbrev of tagsToAttach) {
          const tagId = tagMap.get(abbrev)
          if (tagId) {
            flashcardTagsToCreate.push({
              id: crypto.randomUUID(),
              flashcardId: cardData.id,
              tagId
            })
          }
        }
        return cardData
      })

      await tx.flashcard.createMany({
        data: cardDataToCreate
      })
      if (flashcardTagsToCreate.length > 0) {
        await tx.flashcardTag.createMany({
          data: flashcardTagsToCreate
        })
      }
      await tx.userFlashcardActivity.createMany({
        data: activitiesToCreate
      })
    })
  }

  return {
    importedCount: cardsToCreate.length,
    skippedCount: skippedCards.length,
    skippedCards
  }
}
