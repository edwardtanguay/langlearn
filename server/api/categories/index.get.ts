import { prisma } from '../../utils/prisma'
import { ensureDefaultCategories } from '../../utils/categoryParser'

export default defineEventHandler(async (event) => {
  await ensureDefaultCategories()

  const categories = await prisma.versionCategory.findMany({
    include: {
      abbreviations: true,
    },
    orderBy: { title: 'asc' },
  })

  return categories
})
