import { prisma } from './prisma'

export async function ensureDefaultCategories() {
  // Check if old "General" category exists without 'gen' abbreviation, rename it to "Clean and assign"
  const oldGeneral = await prisma.versionCategory.findUnique({
    where: { title: 'General' },
    include: { abbreviations: true }
  })
  if (oldGeneral) {
    const hasGenAbbr = oldGeneral.abbreviations.some(a => a.abbreviationText.toLowerCase() === 'gen')
    if (!hasGenAbbr) {
      await prisma.versionCategory.update({
        where: { id: oldGeneral.id },
        data: { title: 'Clean and assign' }
      })
    }
  }

  const defaultCategories = [
    { title: 'Clean and assign', abbreviations: [], rank: 2.5 },
    { title: 'General', abbreviations: ['gen', 'general'], rank: 2.5 },
    { title: 'Grammar Page', abbreviations: [], rank: 2.1 },
    { title: 'Versioning', abbreviations: [], rank: 2.5 },
    { title: 'Idea Box', abbreviations: [], rank: 2.5 },
    {
      title: 'Flashcard Page',
      abbreviations: ['flash', 'flashard', 'flash page', 'fl'],
      rank: 4.8,
    },
  ]

  for (const cat of defaultCategories) {
    const existing = await prisma.versionCategory.findUnique({
      where: { title: cat.title },
    })

    if (!existing) {
      const created = await prisma.versionCategory.create({
        data: { title: cat.title, rank: cat.rank },
      })
      for (const abbr of cat.abbreviations) {
        await prisma.versionCategoryAbbreviation.create({
          data: {
            versionCategoryId: created.id,
            abbreviationText: abbr,
          },
        })
      }
    } else {
      // Update rank if it's default
      if (cat.title === 'Flashcard Page' || cat.title === 'Grammar Page') {
        await prisma.versionCategory.update({
          where: { id: existing.id },
          data: { rank: cat.rank }
        })
      }
      if (cat.abbreviations.length > 0) {
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
}

export async function parseAndAssignCategories() {
  await ensureDefaultCategories()

  const categories = await prisma.versionCategory.findMany({
    include: {
      abbreviations: true,
    },
  })

  const cleanAssignCategory = categories.find((c) => c.title === 'Clean and assign')
  if (!cleanAssignCategory) return

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
        targetCategoryId = cleanAssignCategory.id
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
