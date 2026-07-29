import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { calculateOptimalRank } from '../server/utils/rank-config'

async function checkRanks() {
  const cards = await prisma.flashcard.findMany({
    where: {
      status: 'LEARNING',
      nextTestTime: null
    }
  })

  console.log(`Total unreviewed cards: ${cards.length}`)

  const mapped = cards.map(c => ({
    id: c.id,
    front: c.front,
    storedRank: c.rank,
    calculatedRank: calculateOptimalRank(c.front)
  }))

  mapped.sort((a, b) => b.calculatedRank - a.calculatedRank || a.id.localeCompare(b.id))

  console.log('\nTop 10 cards by calculated optimal rank:')
  mapped.slice(0, 10).forEach(c => console.log(`- [${c.calculatedRank}] "${c.front}" (Stored: ${c.storedRank})`))

  console.log('\nBottom 10 cards by calculated optimal rank:')
  mapped.slice(-10).forEach(c => console.log(`- [${c.calculatedRank}] "${c.front}" (Stored: ${c.storedRank})`))
}

checkRanks().finally(() => prisma.$disconnect())
