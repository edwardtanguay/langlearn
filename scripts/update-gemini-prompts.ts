import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

async function updateGermanPrompt() {
  const germanPrompt = await prisma.chatbotPrompt.findFirst({
    where: {
      category: 'geminiQuizPrompts',
      language: 'de'
    }
  })

  if (!germanPrompt) {
    console.error('German prompt not found.')
    return
  }

  const updatedText = germanPrompt.prompt.replace('B1', 'C2')

  await prisma.chatbotPrompt.update({
    where: { id: germanPrompt.id },
    data: { prompt: updatedText }
  })

  console.log(`Updated German prompt [${germanPrompt.id}]:\n  "${updatedText}"`)
}

updateGermanPrompt()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
