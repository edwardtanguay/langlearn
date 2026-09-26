import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

const newQuizzes = [
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
  }
]

async function main() {
  console.log('Seeding / updating French Gemini quizzes...')

  // Check if existing "tout, tous, toute, toutes" exists and update it
  const existingTout = await prisma.chatbotPrompt.findFirst({
    where: {
      language: 'fr',
      title: { in: ['tout, tous, toute, toutes', 'tout/toute/tous/toutes'] }
    }
  })

  if (existingTout) {
    await prisma.chatbotPrompt.update({
      where: { id: existingTout.id },
      data: {
        title: 'tout/toute/tous/toutes',
        prompt: newQuizzes[0]!.prompt
      }
    })
    console.log(`Updated existing prompt: tout/toute/tous/toutes (ID: ${existingTout.id})`)
  } else {
    const created = await prisma.chatbotPrompt.create({ data: newQuizzes[0]! })
    console.log(`Created prompt: tout/toute/tous/toutes (ID: ${created.id})`)
  }

  // Quiz 2: quel/quels/quelle/quelles/quelque/quelques
  const existingQuel = await prisma.chatbotPrompt.findFirst({
    where: {
      language: 'fr',
      title: { contains: 'quel' }
    }
  })
  if (existingQuel) {
    await prisma.chatbotPrompt.update({
      where: { id: existingQuel.id },
      data: {
        title: 'quel/quels/quelle/quelles/quelque/quelques',
        prompt: newQuizzes[1]!.prompt
      }
    })
    console.log(`Updated existing prompt: quel/... (ID: ${existingQuel.id})`)
  } else {
    const created = await prisma.chatbotPrompt.create({ data: newQuizzes[1]! })
    console.log(`Created prompt: quel/quels/quelle/quelles/quelque/quelques (ID: ${created.id})`)
  }

  // Quiz 3: technologie/technique
  const existingTech = await prisma.chatbotPrompt.findFirst({
    where: {
      language: 'fr',
      title: { contains: 'techno' }
    }
  })
  if (existingTech) {
    await prisma.chatbotPrompt.update({
      where: { id: existingTech.id },
      data: {
        title: 'technologie/technique',
        prompt: newQuizzes[2]!.prompt
      }
    })
    console.log(`Updated existing prompt: technologie/technique (ID: ${existingTech.id})`)
  } else {
    const created = await prisma.chatbotPrompt.create({ data: newQuizzes[2]! })
    console.log(`Created prompt: technologie/technique (ID: ${created.id})`)
  }

  console.log('Finished updating Gemini quizzes in database!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
