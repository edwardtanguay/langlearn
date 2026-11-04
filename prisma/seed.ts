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

  await rawClient.execute(`
    CREATE TABLE IF NOT EXISTS "ChatbotPrompt" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "category" TEXT NOT NULL DEFAULT 'geminiQuizPrompts',
      "language" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "prompt" TEXT NOT NULL,
      "rank" REAL NOT NULL DEFAULT 2.5,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
              isTested: true,
              body: 'Core flashcard testing engine with priority rank algorithm',
              startedByUserId: user.id,
              orderWithinVersion: 1
            },
            {
              type: 'FEATURE',
              isTested: true,
              body: 'Web CSV file import tool with metadata parsing',
              startedByUserId: user.id,
              orderWithinVersion: 2
            },
            {
              type: 'FEATURE',
              isTested: true,
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
              isTested: true,
              body: 'Versioning, feature requests, and bug-fix tracking system',
              startedByUserId: user.id,
              orderWithinVersion: 1
            },
            {
              type: 'FEATURE',
              isTested: true,
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

  const chatbotPromptCount = await prisma.chatbotPrompt.count()
  if (chatbotPromptCount === 0) {
    const initialPrompts = [
      {
        category: 'geminiQuizPrompts',
        language: 'fr',
        title: 'verb "to sit"',
        prompt: 'Create a quiz in French that tests the user on the word "to sit" in various conjugations and contexts.',
        rank: 1.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'fr',
        title: 'tout/toute/tous/toutes',
        prompt: 'Create an interactive quiz on the subject of distinguishing and using tout, tous, toute, and toutes with practice sentences. Make the content of the quiz, including the instructions, entirely in French.',
        rank: 2.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'fr',
        title: 'phrases that use à or de',
        prompt: 'Create a French quiz focusing on choosing between the prepositions "à" and "de" in common verb and adjective structures.',
        rank: 3.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'fr',
        title: 'B1 topics',
        prompt: 'Create a French vocabulary and reading comprehension quiz tailored for B1 level learners covering everyday topics and intermediate grammar.',
        rank: 4.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'fr',
        title: 'passé composé vs passé simple',
        prompt: 'Create a French grammar quiz contrasting passé composé and passé simple usage in contextual sentences.',
        rank: 5.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'fr',
        title: 'quel/quels/quelle/quelles/quelque/quelques',
        prompt: 'Create an interactive quiz on the subject of distinguishing and using quel, quels, quelle, quelles, quelque, and quelques with practice sentences. Make the content of the quiz, including the instructions, entirely in French.',
        rank: 6.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'fr',
        title: 'technologie/technique',
        prompt: 'Create an interactive quiz on the subject of distinguishing and using "technologie" vs "technique" in various contexts with practice sentences. Make the content of the quiz, including the instructions, entirely in French.',
        rank: 7.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'de',
        title: 'Adjective Endings: optimierte vs. optimierten',
        prompt: 'Create a German grammar quiz testing adjective declension with definite and indefinite articles (weak vs. strong declension), specifically focusing on patterns like whether "Ich habe die ... Versionen implementiert" should use "optimierte" or "optimierten", with 10 interactive multiple-choice questions, detailed explanations of case, gender, and plurality rules, and practice sentences. The quiz should be 100% in German, no English.',
        rank: 0.5
      },
      {
        category: 'geminiQuizPrompts',
        language: 'de',
        title: 'German B1 topics',
        prompt: 'Create a German vocabulary and grammar quiz tailored for B1 level learners covering everyday conversation, modal verbs, and subclauses.',
        rank: 1.0
      },
      {
        category: 'geminiQuizPrompts',
        language: 'nl',
        title: 'Dutch B1 topics',
        prompt: 'Create a Dutch vocabulary and grammar quiz tailored for B1 level learners covering common expressions, word order, and intermediate sentence structure.',
        rank: 1.0
      }
    ]

    for (const item of initialPrompts) {
      await prisma.chatbotPrompt.create({ data: item })
    }
    console.log('Seeded 7 initial ChatbotPrompts (French, German, Dutch)')
  }

  // Ensure General Links exist
  const generalLinks = [
    {
      language: 'general',
      title: 'Language Learning Activities',
      url: 'https://language-learning-activities.vercel.app',
      description: 'General language learning activities and exercises',
      rank: 3.0
    },
    {
      language: 'general',
      title: 'Trilingual Little Prince',
      url: 'https://trilingual-little-prince.vercel.app',
      description: 'Read The Little Prince in three languages simultaneously',
      rank: 2.8
    }
  ]
  for (const gl of generalLinks) {
    const existing = await prisma.link.findFirst({ where: { url: gl.url } })
    if (!existing) {
      await prisma.link.create({ data: gl })
    }
  }

  // Ensure Version 0.11.0 exists
  const existingV11 = await prisma.version.findUnique({
    where: { versionNumber: '0.11.0' },
    include: { versionItems: true }
  })
  if (!existingV11) {
    await prisma.version.create({
      data: {
        versionNumber: '0.11.0',
        title: 'Spanish Verb Page',
        status: 'PUBLISHED',
        publishDate: new Date(),
        versionItems: {
          create: [
            {
              type: 'FEATURE',
              isTested: true,
              body: 'Created a new activity page called "Spanish Verbs" which reads the data-parsed\\spanish-verbs.json file and shows these verbs on the page as tables showing all the verb tenses left and pronouns along the top, there are controls which all the user to define which verbs he wants to show and which tenses and pronouns he wants to test on, when testing, the tenses/pronouns that should be tested are converted to input boxes and the user types in the answer, if correct it turns green, otherwise red, it is recorded in localstorage which tense/pronouns were answered incorrectly how many times, which can be listed by clicking a button "Retest difficult words".',
              startedByUserId: user.id,
              orderWithinVersion: 1
            },
            {
              type: 'FEATURE',
              isTested: true,
              body: 'Extended "npm run pd" script to parse Spanish verbs, which reads the data\\bits\\es-learnbits.txt file, reads in all indented lines under "- verbs", creates a file data-parsed\\spanish-verbs.json which is an array of objects for each verb and all of the tenses present, imperfect, preterite, future, conditional, present subjunctive, imperfect subjunctive, gerund, past participle, it imports only verbs that have all 8 lines.',
              startedByUserId: user.id,
              orderWithinVersion: 2
            },
            {
              type: 'BUGFIX',
              isTested: true,
              body: 'Reduced the amount of space at the top, now have "Back to Activities" on the left and on the right "Expand"/"Collapse" which shows/hides everything below the language buttons, the how many words learned bar, the four button and the search. Also, the language buttons are in one row since the names have been converted to capital language abbreviations, e.g. FR, SP, etc.',
              startedByUserId: user.id,
              orderWithinVersion: 3
            },
            {
              type: 'FEATURE',
              isTested: true,
              body: 'Added "feminine/masculine" and "true/false" and "right/wrong" to opposites.',
              startedByUserId: user.id,
              orderWithinVersion: 4
            },
            {
              type: 'BUGFIX',
              isTested: true,
              body: 'The names of the categories are now in the language that is being shown instead of always in English.',
              startedByUserId: user.id,
              orderWithinVersion: 5
            },
            {
              type: 'FEATURE',
              isTested: true,
              body: 'Created a "General" section at top and https://language-learning-activities.vercel.app as "Language Learning Activities" and also added https://trilingual-little-prince.vercel.app as "Trilingual Little Prince".',
              startedByUserId: user.id,
              orderWithinVersion: 6
            }
          ]
        }
      }
    })
  }

  console.log(`Setup complete. Total flashcards in DB: ${flashcardCount}, ChatbotPrompts in DB: ${await prisma.chatbotPrompt.count()}`)
}

main()
  .catch((e) => {
    console.error('Error during database setup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
