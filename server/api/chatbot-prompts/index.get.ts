import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = (query.category as string) || 'geminiQuizPrompts'

  const prompts = await prisma.chatbotPrompt.findMany({
    where: { category },
    orderBy: [
      { language: 'asc' },
      { rank: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  return prompts
})
