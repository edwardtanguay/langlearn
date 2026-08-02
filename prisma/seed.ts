import { PrismaClient } from '../server/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config()

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

const adapter = new PrismaLibSql({
  url: url!,
  authToken,
})
const prisma = new PrismaClient({ adapter })
const rawClient = createClient({ url: url!, authToken })

async function ensureTablesExist() {
  console.log('Ensuring tables and columns exist in libSQL...')
  try {
    await rawClient.execute(`ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'member';`)
  } catch (e) {
    // Column already exists
  }

  try {
    await rawClient.execute(`ALTER TABLE "User" ADD COLUMN "dailyTakeGoal" INTEGER NOT NULL DEFAULT 100;`)
  } catch (e) {
    // Column already exists
  }

  try {
    await rawClient.execute(`ALTER TABLE "Version" ADD COLUMN "title" TEXT;`)
  } catch (e) {
    // Column already exists
  }

  try {
    await rawClient.execute(`ALTER TABLE "Version" ADD COLUMN "publishDate" DATETIME;`)
  } catch (e) {
    // Column already exists
  }

  await rawClient.execute(`
    CREATE TABLE IF NOT EXISTS "Version" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "versionNumber" TEXT NOT NULL UNIQUE,
      "title" TEXT,
      "status" TEXT NOT NULL DEFAULT 'FUTURE',
      "publishDate" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await rawClient.execute(`
    CREATE TABLE IF NOT EXISTS "VersionItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "versionId" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'BUGFIX',
      "status" TEXT NOT NULL DEFAULT 'PROPOSED',
      "body" TEXT NOT NULL,
      "startedByUserId" TEXT,
      "orderWithinVersion" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("versionId") REFERENCES "Version" ("id") ON DELETE CASCADE,
      FOREIGN KEY ("startedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL
    );
  `)
}

async function main() {
  console.log('Running database setup & seed...')
  await ensureTablesExist()

  const shouldWipe = process.env.ALLOW_DATA_WIPE === 'true'

  if (shouldWipe) {
    console.warn('⚠️ ALLOW_DATA_WIPE=true: Wiping existing tables...')
    await prisma.userFlashcardActivity.deleteMany()
    await prisma.flashcardTag.deleteMany()
    await prisma.flashcard.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.versionItem.deleteMany()
    await prisma.version.deleteMany()
    await prisma.user.deleteMany()
  } else {
    console.log('🛡️ Preserving existing user data and flashcards.')
  }

  // Ensure Edward User exists with role 'admin'
  const user = await prisma.user.upsert({
    where: { email: 'edwardtanguay@gmail.com' },
    update: { role: 'admin' },
    create: {
      id: '8bd752d1-38da-450e-af8b-2e5b4df70109',
      firstName: 'Edward',
      lastName: 'Tanguay',
      email: 'edwardtanguay@gmail.com',
      role: 'admin',
      minutesToTestAgain: 10
    }
  })
  console.log(`User ${user.email} is confirmed with role: ${user.role}`)

  const now = Date.now()
  const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000)

  // Seed default versions if no versions exist or update existing ones
  const existingVersionCount = await prisma.version.count()
  if (existingVersionCount === 0) {
    await prisma.version.create({
      data: {
        versionNumber: '0.1.0',
        title: 'Usuable MVP app',
        status: 'PUBLISHED',
        publishDate: fiveDaysAgo,
        versionItems: {
          create: [
            {
              type: 'FEATURE',
              status: 'IMPLEMENTED',
              body: 'Core flashcard testing engine with priority rank algorithm',
              startedByUserId: user.id,
              orderWithinVersion: 1
            },
            {
              type: 'FEATURE',
              status: 'IMPLEMENTED',
              body: 'Web CSV file import tool with metadata parsing',
              startedByUserId: user.id,
              orderWithinVersion: 2
            },
            {
              type: 'FEATURE',
              status: 'IMPLEMENTED',
              body: 'Kinde Google OAuth authentication integration',
              startedByUserId: user.id,
              orderWithinVersion: 3
            }
          ]
        }
      }
    })

    await prisma.version.create({
      data: {
        versionNumber: '0.2.0',
        title: 'Added version history',
        status: 'PUBLISHED',
        publishDate: twoDaysAgo,
        versionItems: {
          create: [
            {
              type: 'FEATURE',
              status: 'IMPLEMENTED',
              body: 'Versioning, feature requests, and bug-fix tracking system',
              startedByUserId: user.id,
              orderWithinVersion: 1
            },
            {
              type: 'FEATURE',
              status: 'IMPLEMENTED',
              body: 'User role permissions (admin vs member) and daily import rate limits',
              startedByUserId: user.id,
              orderWithinVersion: 2
            }
          ]
        }
      }
    })
    console.log('Seeded initial versions 0.1.0 and 0.2.0')
  } else {
    // Ensure existing versions have title and publishDate updated
    await prisma.version.updateMany({
      where: { versionNumber: '0.1.0' },
      data: { title: 'Usuable MVP app', publishDate: fiveDaysAgo }
    })
    await prisma.version.updateMany({
      where: { versionNumber: '0.2.0' },
      data: { title: 'Added version history', publishDate: twoDaysAgo }
    })
  }

  // Seed default tags if missing
  await prisma.tag.upsert({
    where: { abbreviation: 'fix' },
    update: {},
    create: { abbreviation: 'fix', description: 'Needs correction or review' }
  })
  await prisma.tag.upsert({
    where: { abbreviation: 'best' },
    update: {},
    create: { abbreviation: 'best', description: 'High quality vocabulary or phrase' }
  })

  // Only seed sample cards if ALLOW_DATA_WIPE is explicitly enabled and flashcards are empty
  const flashcardCount = await prisma.flashcard.count()
  if (shouldWipe && flashcardCount === 0) {
    const cardsData = [
      { front: "I'm glad that I asked the question", back: "Je suis content d'avoir posé la question.", frontLanguage: 'en', backLanguage: 'fr' },
      { front: "the bowl", back: "de kom", frontLanguage: 'en', backLanguage: 'nl' }
    ]
    for (const card of cardsData) {
      await prisma.flashcard.create({
        data: {
          ownerId: user.id,
          front: card.front,
          back: card.back,
          frontLanguage: card.frontLanguage,
          backLanguage: card.backLanguage,
          status: 'LEARNING',
          rank: 2.5
        }
      })
    }
  }

  console.log(`Setup complete. Total flashcards in DB: ${flashcardCount}`)
}

main()
  .catch((e) => {
    console.error('Error during database setup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
