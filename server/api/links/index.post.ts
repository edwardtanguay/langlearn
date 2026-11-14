import { syncAndResolveSlugImages } from '../../utils/imageSlug'
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
  const slug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : null
  const explicitThumb =
    typeof body.imageFileThumb === 'string' && body.imageFileThumb.trim()
      ? body.imageFileThumb.trim()
      : null
  const imgs = await syncAndResolveSlugImages(slug, 'links')
  const imageFileThumb = explicitThumb || imgs.imageFileThumb

  const link = await prisma.link.create({
    data: {
      language: body.language.toLowerCase().trim(),
      title: body.title.trim(),
      url: body.url.trim(),
      description: (body.description || '').trim(),
      slug,
      imageFileThumb,
      rank: isNaN(rank) ? 2.5 : Math.max(0, Math.min(5, rank))
    }
  })

  return {
    ...link,
    thumbUrl: link.imageFileThumb ? `/images/links/${link.imageFileThumb}` : imgs.thumbUrl
  }
})
