import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { parseAndAssignCategories } from '../server/utils/categoryParser'

async function main() {
  console.log('Migrating PROPOSED_ITEMS status to INCOMING in Version table...')
  const updatedVersions = await prisma.version.updateMany({
    where: { status: 'PROPOSED_ITEMS' },
    data: { status: 'INCOMING' },
  })
  console.log(`Updated ${updatedVersions.count} versions from PROPOSED_ITEMS to INCOMING.`)

  console.log('Running category seeding and parsing on all version items...')
  await parseAndAssignCategories()
  console.log('✅ Seeding & category parsing completed successfully!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Error during seeding/migration:', err)
  process.exit(1)
})
