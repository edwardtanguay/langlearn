import { syncAndResolveSlugImages } from '../../utils/imageSlug'
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

  const explicitMain =
    typeof body?.imageFileMain === 'string' && body.imageFileMain.trim()
      ? body.imageFileMain.trim()
      : null
  const explicitThumb =
    typeof body?.imageFileThumb === 'string' && body.imageFileThumb.trim()
      ? body.imageFileThumb.trim()
      : null

  const imgs = await syncAndResolveSlugImages(slug, 'howtos')
  const imageFileMain = explicitMain || imgs.imageFileMain
  const imageFileThumb = explicitThumb || imgs.imageFileThumb

  try {
    const created = await prisma.howtoItem.create({
      data: {
        title,
        description,
        slug,
        rank,
        imageFileMain,
        imageFileThumb
      }
    })
    return {
      ...created,
      imageUrl: created.imageFileMain ? `/images/howtos/${created.imageFileMain}` : imgs.imageUrl,
      thumbUrl: created.imageFileThumb ? `/images/howtos/${created.imageFileThumb}` : imgs.thumbUrl
    }
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
