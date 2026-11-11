import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const description = typeof body?.description === 'string' ? body.description.trim() : ''
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''
  const rawRank = Number(body?.rank ?? 2.5)
  const rank = Math.max(0, Math.min(5, isNaN(rawRank) ? 2.5 : rawRank))

  if (!title || !description || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title, description, and slug are required'
    })
  }

  try {
    const created = await prisma.howtoItem.create({
      data: {
        title,
        description,
        slug,
        rank
      }
    })
    return created
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: `A howto item with slug "${slug}" already exists`
      })
    }
    console.error('Failed to create howto item:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create howto item'
    })
  }
})

