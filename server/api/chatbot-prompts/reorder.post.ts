import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.firstId || !body.secondId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing firstId or secondId parameters'
    })
  }

  const item1 = await prisma.chatbotPrompt.findUnique({ where: { id: body.firstId } })
  const item2 = await prisma.chatbotPrompt.findUnique({ where: { id: body.secondId } })

  if (!item1 || !item2) {
    throw createError({ statusCode: 404, statusMessage: 'Items not found for reordering' })
  }

  // Swap ranks
  await prisma.$transaction([
    prisma.chatbotPrompt.update({
      where: { id: item1.id },
      data: { rank: item2.rank }
    }),
    prisma.chatbotPrompt.update({
      where: { id: item2.id },
      data: { rank: item1.rank }
    })
  ])

  return { success: true }
})
