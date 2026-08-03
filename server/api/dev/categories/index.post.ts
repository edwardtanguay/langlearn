import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { parseAndAssignCategories } from '../../../utils/categoryParser'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Category title is required' })
  }

  const title = body.title.trim()

  const existing = await prisma.versionCategory.findUnique({
    where: { title },
  })

  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Category with this title already exists' })
  }

  const parsedRank = body.rank !== undefined && !isNaN(parseFloat(body.rank)) ? parseFloat(body.rank) : 2.5

  const newCategory = await prisma.versionCategory.create({
    data: {
      title,
      rank: parsedRank,
    },
  })

  if (Array.isArray(body.abbreviations)) {
    for (const abbrText of body.abbreviations) {
      const cleanAbbr = String(abbrText).trim()
      if (cleanAbbr) {
        await prisma.versionCategoryAbbreviation.create({
          data: {
            versionCategoryId: newCategory.id,
            abbreviationText: cleanAbbr,
          },
        })
      }
    }
  }

  await parseAndAssignCategories()

  const refetched = await prisma.versionCategory.findUnique({
    where: { id: newCategory.id },
    include: { abbreviations: true },
  })

  return refetched || newCategory
})
