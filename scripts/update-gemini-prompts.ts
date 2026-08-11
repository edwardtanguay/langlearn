import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

const cleanPrompts: Record<string, string> = {
  '4e187f93-163e-4708-84fe-1f87556d11a0': 'Create an interactive quiz on the subject of the verb "to sit" in various conjugations and contexts. Make the content of the quiz, including the instructions, entirely in French.',
  '1f5e1f51-63e1-4085-80f3-1e1b69dade87': 'Create an interactive quiz on the subject of distinguishing and using tout, tous, toute, and toutes with practice sentences. Make the content of the quiz, including the instructions, entirely in French.',
  '92eb7a1e-1ce9-4c93-95ae-b3250ec227fe': 'Create an interactive quiz on the subject of choosing between the prepositions "à" and "de" in common verb and adjective structures. Make the content of the quiz, including the instructions, entirely in French.',
  'd2fef219-335c-4da6-8599-be7112e7cbf0': 'Create an interactive quiz on the subject of B1 level vocabulary and reading comprehension covering everyday topics and intermediate grammar. Make the content of the quiz, including the instructions, entirely in French.',
  'bf082d5d-91e0-4860-ba7a-3e073144c838': 'Create an interactive quiz on the subject of contrasting passé composé and passé simple usage in contextual sentences. Make the content of the quiz, including the instructions, entirely in French.',
  '35b2fa71-9456-435f-9ccf-d9fe6067625e': 'Create an interactive quiz on the subject of B1 level vocabulary and grammar covering everyday conversation, modal verbs, and subclauses. Make the content of the quiz, including the instructions, entirely in German.',
  '9a24cca4-8fb4-4114-a13f-0e0ce585a88c': 'Create an interactive quiz on the subject of B1 level vocabulary and grammar covering common expressions, word order, and intermediate sentence structure. Make the content of the quiz, including the instructions, entirely in Dutch.'
}

async function refinePrompts() {
  for (const [id, promptText] of Object.entries(cleanPrompts)) {
    await prisma.chatbotPrompt.update({
      where: { id },
      data: { prompt: promptText }
    })
    console.log(`Updated [${id}]: "${promptText}"`)
  }
  console.log('Clean prompt update completed successfully.')
}

refinePrompts()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
