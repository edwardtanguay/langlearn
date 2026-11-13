import { syncAndResolveSlugImages } from '../../utils/imageSlug'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing howto item ID' })
  }

  const data: Record<string, any> = {}
  if (typeof body?.title === 'string') data.title = body.title.trim()
  if (typeof body?.description === 'string') data.description = body.description.trim()
  if (typeof body?.slug === 'string') data.slug = body.slug.trim()
  if (body?.rank !== undefined) {
    const rawRank = Number(body.rank)
    if (!isNaN(rawRank)) {
      data.rank = Math.max(0, Math.min(5, rawRank))
    }
  }

  try {
    const updated = await prisma.howtoItem.update({
      where: { id },
      data
    })
    const imgs = await syncAndResolveSlugImages(updated.slug, 'howtos')
    return { ...updated, ...imgs }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'A howto item with that slug already exists'
      })
    }
    console.error('Failed to update howto item:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update howto item'
    })
  }
})

