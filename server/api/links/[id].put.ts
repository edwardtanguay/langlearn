import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  }

  const body = await readBody(event)
  const dataToUpdate: any = {}

  if (body.language !== undefined) dataToUpdate.language = body.language.toLowerCase().trim()
  if (body.title !== undefined) dataToUpdate.title = body.title.trim()
  if (body.url !== undefined) dataToUpdate.url = body.url.trim()
  if (body.description !== undefined) dataToUpdate.description = body.description.trim()
  if (body.rank !== undefined) {
    const rank = typeof body.rank === 'number' ? body.rank : parseFloat(body.rank || '2.5')
    dataToUpdate.rank = isNaN(rank) ? 2.5 : Math.max(0, Math.min(5, rank))
  }

  const updated = await prisma.link.update({
    where: { id },
    data: dataToUpdate
  })

  return updated
})
