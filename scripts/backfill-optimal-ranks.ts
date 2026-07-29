import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { calculateOptimalRank } from '../server/utils/rank-config'

async function backfillRanks() {
  console.log('Starting backfill of optimal length ranks for flashcards with rank == 2.5...')

  const cardsToUpdate = await prisma.flashcard.findMany({
    where: {
      rank: 2.5
    }
  })

  console.log(`Found ${cardsToUpdate.length} cards with rank == 2.5`)

  let updatedCount = 0
  for (const card of cardsToUpdate) {
    const newRank = calculateOptimalRank(card.front)
    if (newRank !== 2.5) {
      await prisma.flashcard.update({
        where: { id: card.id },
        data: { rank: newRank }
      })
      updatedCount++
    }
  }

  console.log(`Successfully updated ${updatedCount} flashcards with optimal length rank!`)
}

backfillRanks().catch(console.error).finally(() => prisma.$disconnect())
