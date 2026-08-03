import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { parseAndAssignCategories } from '../../../utils/categoryParser'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID required' })
  }

  const category = await prisma.versionCategory.findUnique({
    where: { id },
  })

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  if (category.title === 'General') {
    throw createError({ statusCode: 400, statusMessage: 'The default General category cannot be deleted' })
  }

  // Find General category
  let generalCategory = await prisma.versionCategory.findUnique({
    where: { title: 'General' },
  })

  if (!generalCategory) {
    generalCategory = await prisma.versionCategory.create({
      data: { title: 'General' },
    })
  }

  // Reassign all items under this category to General category
  await prisma.versionItem.updateMany({
    where: { versionCategoryId: id },
    data: { versionCategoryId: generalCategory.id },
  })

  // Delete category (abbreviations will cascade delete due to schema)
  await prisma.versionCategory.delete({
    where: { id },
  })

  await parseAndAssignCategories()

  return { success: true, message: 'Category deleted successfully' }
})
