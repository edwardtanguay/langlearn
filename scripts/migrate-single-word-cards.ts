import 'dotenv/config'
import { prisma } from '../server/utils/prisma'

async function main() {
  console.log('Fetching all flashcards...')
  const cards = await prisma.flashcard.findMany({
    select: {
      id: true,
      back: true
    }
  })

  console.log(`Found ${cards.length} cards total. Checking for single-word target phrases...`)

  const updates: Array<{ id: string; oldBack: string; newBack: string }> = []

  for (const card of cards) {
    const trimmed = card.back.trim()
    const clean = trimmed.replace(/\*/g, '')
    // Single word means no whitespace inside
    if (clean.length > 0 && !/\s/.test(clean)) {
      if (!trimmed.startsWith('*') || !trimmed.endsWith('*')) {
        updates.push({
          id: card.id,
          oldBack: card.back,
          newBack: `*${clean}*`
        })
      }
    }
  }

  console.log(`Found ${updates.length} cards to update. Applying updates in batches...`)

  const BATCH_SIZE = 50
  let updatedCount = 0

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(item =>
        prisma.flashcard.update({
          where: { id: item.id },
          data: { back: item.newBack }
        })
      )
    )
    updatedCount += batch.length
    console.log(`Updated ${updatedCount} / ${updates.length} cards...`)
  }

  console.log(`Migration complete! Successfully updated ${updatedCount} single-word flashcards with asterisks.`)
}

main()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
