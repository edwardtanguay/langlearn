import 'dotenv/config'
import { prisma } from '../server/utils/prisma'


async function checkCards() {
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log('No user found')
    return
  }

  console.log('User ID:', user.id, 'Email:', user.email)

  const cards = await prisma.flashcard.findMany({
    where: {
      ownerId: user.id,
      front: {
        in: ['stumble', 'and now I don\'t want to tear it']
      }
    }
  })

  console.log('Cards found:', JSON.stringify(cards, null, 2))

  // Also check top 10 cards sorted by rank DESC where status = LEARNING and nextTestTime is null
  const topNewCards = await prisma.flashcard.findMany({
    where: {
      ownerId: user.id,
      status: 'LEARNING',
      nextTestTime: null
    },
    orderBy: [
      { rank: 'desc' },
      { id: 'asc' }
    ],
    take: 10
  })

  console.log('Top 10 New Cards (nextTestTime: null, rank DESC):')
  for (const c of topNewCards) {
    console.log(`- ID: ${c.id} | Rank: ${c.rank} | Front: "${c.front}"`)
  }

  // Also check top 10 cards sorted by nextTestTime <= NOW
  const topDueCards = await prisma.flashcard.findMany({
    where: {
      ownerId: user.id,
      status: 'LEARNING',
      nextTestTime: { lte: new Date() }
    },
    orderBy: [
      { rank: 'desc' },
      { id: 'asc' }
    ],
    take: 10
  })

  console.log('Top 10 Due Cards (nextTestTime <= NOW, rank DESC):')
  for (const c of topDueCards) {
    console.log(`- ID: ${c.id} | Rank: ${c.rank} | Front: "${c.front}" | NextTest: ${c.nextTestTime}`)
  }
}

checkCards().finally(() => prisma.$disconnect())
