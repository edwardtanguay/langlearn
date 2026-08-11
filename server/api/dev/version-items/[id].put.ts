import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { parseAndAssignCategories } from '../../../utils/categoryParser'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const existingItem = await prisma.versionItem.findUnique({
    where: { id }
  })

  if (!existingItem) {
    throw createError({ statusCode: 404, statusMessage: 'Version item not found' })
  }

  const targetVersionId = (body.versionId === 'none' || body.versionId === null || body.versionId === '') ? null : body.versionId

  const dataToUpdate: any = {}
  if (body.body !== undefined) dataToUpdate.body = body.body.trim()
  if (body.type !== undefined) dataToUpdate.type = body.type
  if (body.versionId !== undefined) dataToUpdate.versionId = targetVersionId
  if (body.isTested !== undefined) dataToUpdate.isTested = Boolean(body.isTested)
  if (body.rank !== undefined) {
    const rankVal = typeof body.rank === 'number' ? body.rank : parseFloat(body.rank)
    if (!isNaN(rankVal)) {
      dataToUpdate.rank = Math.max(0, Math.min(5, rankVal))
    }
  }

  if (body.versionCategoryId !== undefined) {
    dataToUpdate.versionCategoryId = body.versionCategoryId || null

    // If versionCategoryId is manually updated by admin, strip any matching abbreviation prefix from body text
    const currentBody = dataToUpdate.body !== undefined ? dataToUpdate.body : existingItem.body
    const categories = await prisma.versionCategory.findMany({
      include: { abbreviations: true }
    })
    let strippedBody = currentBody
    const lowerBody = currentBody.toLowerCase()
    for (const cat of categories) {
      for (const abbr of cat.abbreviations) {
        const prefix = abbr.abbreviationText.trim().toLowerCase() + ':'
        if (prefix.length > 1 && lowerBody.startsWith(prefix)) {
          strippedBody = currentBody.slice(prefix.length).trim()
          break
        }
      }
    }
    dataToUpdate.body = strippedBody
  }

  const updated = await prisma.versionItem.update({
    where: { id },
    data: dataToUpdate
  })

  await parseAndAssignCategories()

  const refetched = await prisma.versionItem.findUnique({
    where: { id },
    include: { versionCategory: true, startedByUser: true }
  })

  return refetched || updated
})
