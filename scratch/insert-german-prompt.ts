import 'dotenv/config'
import { prisma } from '../server/utils/prisma.js'

async function run() {
  const existing = await prisma.chatbotPrompt.findFirst({
    where: {
      category: 'geminiQuizPrompts',
      language: 'de',
      title: 'Adjective Endings: optimierte vs. optimierten'
    }
  })

  if (!existing) {
    await prisma.chatbotPrompt.create({
      data: {
        category: 'geminiQuizPrompts',
        language: 'de',
        title: 'Adjective Endings: optimierte vs. optimierten',
        prompt: 'Create a German grammar quiz testing adjective declension with definite and indefinite articles (weak vs. strong declension), specifically focusing on patterns like whether "Ich habe die ... Versionen implementiert" should use "optimierte" or "optimierten", with 8 interactive multiple-choice questions, detailed explanations of case, gender, and plurality rules, and practice sentences.',
        rank: 0.5
      }
    })
    console.log('Inserted German quiz prompt!')
  } else {
    console.log('German quiz prompt already exists.')
  }
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
