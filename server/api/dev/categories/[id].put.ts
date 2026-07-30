import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { parseAndAssignCategories } from '../../../utils/categoryParser'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID required' })
  }

  const category = await prisma.versionCategory.findUnique({
    where: { id },
  })

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  if (body.title !== undefined) {
    const newTitle = body.title.trim()
    if (!newTitle) {
      throw createError({ statusCode: 400, statusMessage: 'Category title cannot be empty' })
    }
    const duplicate = await prisma.versionCategory.findFirst({
      where: {
        title: newTitle,
        NOT: { id },
      },
    })
    if (duplicate) {
      throw createError({ statusCode: 400, statusMessage: 'Category title already in use' })
    }
    await prisma.versionCategory.update({
      where: { id },
      data: { title: newTitle },
    })
  }

  if (Array.isArray(body.abbreviations)) {
    // Delete existing abbreviations for this category and insert new list
    await prisma.versionCategoryAbbreviation.deleteMany({
      where: { versionCategoryId: id },
    })

    for (const abbrText of body.abbreviations) {
      const cleanAbbr = String(abbrText).trim()
      if (cleanAbbr) {
        await prisma.versionCategoryAbbreviation.create({
          data: {
            versionCategoryId: id,
            abbreviationText: cleanAbbr,
          },
        })
      }
    }
  }

  await parseAndAssignCategories()

  const updatedCategory = await prisma.versionCategory.findUnique({
    where: { id },
    include: { abbreviations: true },
  })

  return updatedCategory
})
