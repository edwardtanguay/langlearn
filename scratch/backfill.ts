import { PrismaClient } from '../server/prisma/client/client.js'
import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

const BASE_WAIT_MINUTES = 30
const RANK_MULTIPLIER = 4

function calculateNextTestTime(lastTestedIso: string | Date | null | undefined, rank: number): Date | null {
  if (!lastTestedIso) return null
  const lastTestedDate = typeof lastTestedIso === 'string' ? new Date(lastTestedIso) : lastTestedIso
  const waitMinutes = BASE_WAIT_MINUTES - (rank * RANK_MULTIPLIER)
  return new Date(lastTestedDate.getTime() + waitMinutes * 60 * 1000)
}

async function main() {
  const flashcards = await prisma.flashcard.findMany({
    include: {
      activities: {
        where: {
          actionTaken: {
            in: ['TESTED', 'MARKED_AS_KEEP_TESTING', 'MARKED_AS_LEARNED', 'MARKED_AS_PARKED', 'MARKED_AS_DELETED']
          }
        },
        orderBy: {
          whenActedUpon: 'desc'
        },
        take: 1
      }
    }
  })

  let updated = 0
  for (const card of flashcards) {
    if (card.activities.length > 0) {
      const lastTested = card.activities[0].whenActedUpon
      const nextTestTime = calculateNextTestTime(lastTested, card.rank)
      await prisma.flashcard.update({
        where: { id: card.id },
        data: { nextTestTime }
      })
      updated++
    }
  }
  console.log(`Updated ${updated} flashcards with nextTestTime.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
