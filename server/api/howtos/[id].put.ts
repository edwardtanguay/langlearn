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
  if (body?.imageFileMain !== undefined) {
    data.imageFileMain =
      typeof body.imageFileMain === 'string' && body.imageFileMain.trim()
        ? body.imageFileMain.trim()
        : null
  }
  if (body?.imageFileThumb !== undefined) {
    data.imageFileThumb =
      typeof body.imageFileThumb === 'string' && body.imageFileThumb.trim()
        ? body.imageFileThumb.trim()
        : null
  }
  if (body?.rank !== undefined) {
    const rawRank = Number(body.rank)
    if (!isNaN(rawRank)) {
      data.rank = Math.max(0, Math.min(5, rawRank))
    }
  }

  try {
    let updated = await prisma.howtoItem.update({
      where: { id },
      data
    })
    const imgs = await syncAndResolveSlugImages(updated.slug, 'howtos')
    const patch: { imageFileMain?: string; imageFileThumb?: string } = {}
    if (!updated.imageFileMain && imgs.imageFileMain) {
      patch.imageFileMain = imgs.imageFileMain
    }
    if (!updated.imageFileThumb && imgs.imageFileThumb) {
      patch.imageFileThumb = imgs.imageFileThumb
    }
    if (Object.keys(patch).length > 0) {
      updated = await prisma.howtoItem.update({
        where: { id },
        data: patch
      })
    }

    return {
      ...updated,
      imageUrl: updated.imageFileMain ? `/images/howtos/${updated.imageFileMain}` : imgs.imageUrl,
      thumbUrl: updated.imageFileThumb ? `/images/howtos/${updated.imageFileThumb}` : imgs.thumbUrl
    }
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
