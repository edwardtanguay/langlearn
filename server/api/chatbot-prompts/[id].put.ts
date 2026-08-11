import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID parameter' })
  }

  const body = await readBody(event)

  const updated = await prisma.chatbotPrompt.update({
    where: { id },
    data: {
      title: body.title !== undefined ? body.title.trim() : undefined,
      prompt: body.prompt !== undefined ? body.prompt.trim() : undefined,
      language: body.language !== undefined ? body.language.toLowerCase().trim() : undefined,
      category: body.category !== undefined ? body.category : undefined,
      rank: typeof body.rank === 'number' ? body.rank : undefined
    }
  })

  return updated
})
