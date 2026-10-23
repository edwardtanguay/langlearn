import 'dotenv/config'
import { prisma } from '../server/utils/prisma'

async function main() {
  console.log('Checking for Version Management category and items...')
  
  // Find or create 'Versioning' category
  let versioningCat = await prisma.versionCategory.findUnique({
    where: { title: 'Versioning' }
  })

  const vmCat = await prisma.versionCategory.findUnique({
    where: { title: 'Version Management' }
  })

  if (!versioningCat && vmCat) {
    console.log('Renaming "Version Management" category directly to "Versioning"...')
    versioningCat = await prisma.versionCategory.update({
      where: { id: vmCat.id },
      data: { title: 'Versioning' }
    })
    console.log('Renamed category to:', versioningCat)
  } else if (versioningCat && vmCat) {
    console.log('Both categories exist. Moving all items from "Version Management" to "Versioning"...')
    const updateResult = await prisma.versionItem.updateMany({
      where: { versionCategoryId: vmCat.id },
      data: { versionCategoryId: versioningCat.id }
    })
    console.log(`Moved ${updateResult.count} items.`)

    // Also move abbreviations if any
    await prisma.versionCategoryAbbreviation.updateMany({
      where: { versionCategoryId: vmCat.id },
      data: { versionCategoryId: versioningCat.id }
    })

    // Delete old category
    await prisma.versionCategory.delete({
      where: { id: vmCat.id }
    })
    console.log('Deleted old "Version Management" category.')
  } else if (!versioningCat && !vmCat) {
    console.log('Neither "Versioning" nor "Version Management" category found. Creating "Versioning"...')
    versioningCat = await prisma.versionCategory.create({
      data: {
        title: 'Versioning',
        rank: 2.5
      }
    })
    console.log('Created category:', versioningCat)
  } else {
    console.log('"Versioning" category already exists and "Version Management" does not exist.')
  }

  // Count items assigned to 'Versioning'
  const count = await prisma.versionItem.count({
    where: {
      versionCategory: {
        title: 'Versioning'
      }
    }
  })
  console.log(`✅ Items currently assigned to "Versioning": ${count}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
