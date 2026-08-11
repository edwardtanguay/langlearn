import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.title || !body.prompt || !body.language) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: title, prompt, language'
    })
  }

  const category = body.category || 'geminiQuizPrompts'
  const language = body.language.toLowerCase().trim()

  let newRank = typeof body.rank === 'number' ? body.rank : null
  if (newRank === null) {
    const highest = await prisma.chatbotPrompt.findFirst({
      where: { category, language },
      orderBy: { rank: 'desc' }
    })
    newRank = (highest?.rank ?? 0) + 1.0
  }

  const created = await prisma.chatbotPrompt.create({
    data: {
      category,
      language,
      title: body.title.trim(),
      prompt: body.prompt.trim(),
      rank: newRank
    }
  })

  return created
})
