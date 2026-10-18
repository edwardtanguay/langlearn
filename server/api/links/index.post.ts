import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.title || !body.url || !body.language) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title, URL, and Language are required'
    })
  }

  const rank = typeof body.rank === 'number' ? body.rank : parseFloat(body.rank || '2.5')

  const link = await prisma.link.create({
    data: {
      language: body.language.toLowerCase().trim(),
      title: body.title.trim(),
      url: body.url.trim(),
      description: (body.description || '').trim(),
      rank: isNaN(rank) ? 2.5 : Math.max(0, Math.min(5, rank))
    }
  })

  return link
})
