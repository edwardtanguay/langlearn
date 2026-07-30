import { prisma } from './prisma'

export async function ensureDefaultCategories() {
  const defaultCategories = [
    { title: 'General', abbreviations: [] },
    { title: 'Grammar Page', abbreviations: [] },
    { title: 'Versioning', abbreviations: [] },
    { title: 'Idea Box', abbreviations: [] },
    {
      title: 'Flashcard Page',
      abbreviations: ['flash', 'flashard', 'flash page', 'fl'],
    },
  ]

  for (const cat of defaultCategories) {
    const existing = await prisma.versionCategory.findUnique({
      where: { title: cat.title },
    })

    if (!existing) {
      const created = await prisma.versionCategory.create({
        data: { title: cat.title },
      })
      for (const abbr of cat.abbreviations) {
        await prisma.versionCategoryAbbreviation.create({
          data: {
            versionCategoryId: created.id,
            abbreviationText: abbr,
          },
        })
      }
    } else if (cat.abbreviations.length > 0) {
      // Ensure default abbreviations exist
      for (const abbr of cat.abbreviations) {
        const existingAbbr = await prisma.versionCategoryAbbreviation.findFirst({
          where: {
            versionCategoryId: existing.id,
            abbreviationText: { equals: abbr },
          },
        })
        if (!existingAbbr) {
          await prisma.versionCategoryAbbreviation.create({
            data: {
              versionCategoryId: existing.id,
              abbreviationText: abbr,
            },
          })
        }
      }
    }
  }
}

export async function parseAndAssignCategories() {
  await ensureDefaultCategories()

  const categories = await prisma.versionCategory.findMany({
    include: {
      abbreviations: true,
    },
  })

  const generalCategory = categories.find((c) => c.title === 'General')
  if (!generalCategory) return

  // Build a list of all abbreviations sorted by length descending so longer matches take precedence
  const abbrMap: { abbrText: string; categoryId: string }[] = []
  for (const cat of categories) {
    for (const abbrObj of cat.abbreviations) {
      if (abbrObj.abbreviationText.trim()) {
        abbrMap.push({
          abbrText: abbrObj.abbreviationText.trim().toLowerCase(),
          categoryId: cat.id,
        })
      }
    }
  }
  abbrMap.sort((a, b) => b.abbrText.length - a.abbrText.length)

  const items = await prisma.versionItem.findMany()

  for (const item of items) {
    const rawBody = item.body || ''
    const lowerBody = rawBody.toLowerCase()
    let matchedCategoryId: string | null = null
    let newBody = rawBody

    for (const { abbrText, categoryId } of abbrMap) {
      const prefix = abbrText + ':'
      if (lowerBody.startsWith(prefix)) {
        matchedCategoryId = categoryId
        newBody = rawBody.slice(prefix.length).trim()
        break
      }
    }

    let targetCategoryId = item.versionCategoryId
    let bodyToSave = rawBody

    if (matchedCategoryId) {
      targetCategoryId = matchedCategoryId
      bodyToSave = newBody
    } else {
      if (!item.versionCategoryId) {
        targetCategoryId = generalCategory.id
      }
    }

    if (targetCategoryId !== item.versionCategoryId || bodyToSave !== item.body) {
      await prisma.versionItem.update({
        where: { id: item.id },
        data: {
          versionCategoryId: targetCategoryId,
          body: bodyToSave,
        },
      })
    }
  }
}
