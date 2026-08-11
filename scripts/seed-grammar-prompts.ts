import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

const additionalPrompts = [
  // B1 Spanish
  {
    language: 'es',
    title: 'B1 topics',
    prompt: 'Create an interactive quiz on the subject of B1 level vocabulary and reading comprehension covering everyday topics and intermediate grammar. Make the content of the quiz, including the instructions, entirely in Spanish.',
    rank: 0
  },

  // Italian Prompts (4 total, including B1 topics)
  {
    language: 'it',
    title: 'B1 topics',
    prompt: 'Create an interactive quiz on the subject of B1 level vocabulary and reading comprehension covering everyday topics and intermediate grammar. Make the content of the quiz, including the instructions, entirely in Italian.',
    rank: 1
  },
  {
    language: 'it',
    title: 'passato prossimo vs. imperfetto',
    prompt: 'Create an interactive quiz on the subject of contrasting passato prossimo and imperfetto tenses in narrative contexts. Make the content of the quiz, including the instructions, entirely in Italian.',
    rank: 2
  },
  {
    language: 'it',
    title: 'congiuntivo presente',
    prompt: 'Create an interactive quiz on the subject of present subjunctive (congiuntivo presente) usage after verbs of opinion, emotion, and doubt. Make the content of the quiz, including the instructions, entirely in Italian.',
    rank: 3
  },
  {
    language: 'it',
    title: 'ci and ne pronominal particles',
    prompt: 'Create an interactive quiz on the subject of using pronominal particles "ci" and "ne" in everyday Italian sentences. Make the content of the quiz, including the instructions, entirely in Italian.',
    rank: 4
  }
]

async function seedAdditionalPrompts() {
  console.log('Seeding B1 Spanish and 4 Italian prompts into the database...')

  for (const item of additionalPrompts) {
    const created = await prisma.chatbotPrompt.create({
      data: {
        category: 'geminiQuizPrompts',
        language: item.language,
        title: item.title,
        prompt: item.prompt,
        rank: item.rank
      }
    })
    console.log(`Created [${created.language}] "${created.title}" (ID: ${created.id})`)
  }

  console.log('Database seeding of Spanish B1 and Italian prompts completed successfully!')
}

seedAdditionalPrompts()
  .catch((err) => {
    console.error('Seeding failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
