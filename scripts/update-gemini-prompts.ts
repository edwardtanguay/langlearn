import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

const languageNames: Record<string, string> = {
  fr: 'French',
  de: 'German',
  nl: 'Dutch',
  es: 'Spanish',
  it: 'Italian',
  pl: 'Polish',
  ru: 'Russian',
  is: 'Icelandic',
  da: 'Danish',
  el: 'Greek'
}

async function updatePrompts() {
  const prompts = await prisma.chatbotPrompt.findMany({
    where: { category: 'geminiQuizPrompts' }
  })

  console.log(`Found ${prompts.length} geminiQuizPrompts records to process.`)

  for (const p of prompts) {
    const langCode = p.language.toLowerCase()
    const langName = languageNames[langCode] || langCode.toUpperCase()
    const suffix = `Make the content of the quiz, including the instructions, entirely in ${langName}.`

    let newPrompt = p.prompt.trim()
    if (!newPrompt.endsWith(suffix)) {
      newPrompt = `${newPrompt} ${suffix}`
    }

    await prisma.chatbotPrompt.update({
      where: { id: p.id },
      data: { prompt: newPrompt }
    })

    console.log(`Updated prompt [${p.id}] (${langName}): "${newPrompt}"`)
  }

  console.log('Database update completed successfully.')
}

updatePrompts()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
