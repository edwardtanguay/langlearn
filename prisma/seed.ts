import { PrismaClient } from '../server/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

const adapter = new PrismaLibSql({
  url: url!,
  authToken,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // 1. Clean up existing tables
  await prisma.userFlashcardActivity.deleteMany()
  await prisma.flashcardTag.deleteMany()
  await prisma.flashcard.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Edward User
  const user = await prisma.user.create({
    data: {
      id: '8bd752d1-38da-450e-af8b-2e5b4df70109',
      firstName: 'Edward',
      lastName: 'Tanguay',
      email: 'edwardtanguay@gmail.com',
      minutesToTestAgain: 10
    }
  })
  console.log(`Created user: ${user.email}`)

  // 3. Create default tags
  const tagFix = await prisma.tag.create({
    data: {
      abbreviation: 'fix',
      description: 'Needs correction or review'
    }
  })
  const tagBest = await prisma.tag.create({
    data: {
      abbreviation: 'best',
      description: 'High quality vocabulary or phrase'
    }
  })
  console.log('Created default tags: fix, best')

  // 4. Seeding flashcards
  const cardsData = [
    {
      front: "I'm glad that I asked the question",
      back: "Je suis content d'avoir posé la question.",
      frontLanguage: 'en',
      backLanguage: 'fr',
      status: 'LEARNING'
    },
    {
      front: "I also have to remember to plan my run today",
      back: "Je dois aussi penser à planifier ma course d'aujourd'hui.",
      frontLanguage: 'en',
      backLanguage: 'fr',
      status: 'LEARNING'
    },
    {
      front: "in polished French",
      back: "dans un français soigné",
      frontLanguage: 'en',
      backLanguage: 'fr',
      status: 'LEARNING'
    },
    {
      front: "direct borrowing from English",
      back: "emprunt direct à l'anglais",
      frontLanguage: 'en',
      backLanguage: 'fr',
      status: 'LEARNING'
    },
    {
      front: "the bowl",
      back: "de kom",
      frontLanguage: 'en',
      backLanguage: 'nl',
      status: 'LEARNING'
    },
    {
      front: "recently",
      back: "unlängst",
      frontLanguage: 'en',
      backLanguage: 'de',
      status: 'LEARNING'
    },
    {
      front: "misfit",
      back: "Außenseiter",
      frontLanguage: 'en',
      backLanguage: 'de',
      status: 'LEARNING'
    },
    {
      front: "because",
      back: "poiché",
      frontLanguage: 'en',
      backLanguage: 'it',
      status: 'LEARNING'
    },
    {
      front: "post-war period",
      back: "dopoguerra",
      frontLanguage: 'en',
      backLanguage: 'it',
      status: 'LEARNING'
    },
    {
      front: "so long as",
      back: "poiché",
      frontLanguage: 'en',
      backLanguage: 'it',
      status: 'LEARNING'
    },
    {
      front: "given that",
      back: "visto che",
      frontLanguage: 'en',
      backLanguage: 'it',
      status: 'LEARNING'
    }
  ]

  for (const card of cardsData) {
    await prisma.flashcard.create({
      data: {
        ownerId: user.id,
        front: card.front,
        back: card.back,
        frontLanguage: card.frontLanguage,
        backLanguage: card.backLanguage,
        status: card.status,
        rank: 2.5,
        activities: {
          create: {
            userId: user.id,
            actionTaken: 'IMPORTED',
            actionDetails: 'Imported from seed'
          }
        }
      }
    })
  }

  console.log(`Successfully seeded ${cardsData.length} flashcards.`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
