import 'dotenv/config'
import { prisma } from '../server/utils/prisma'

async function cleanCards() {
  console.log('Cleaning existing flashcards front text...')
  const cards = await prisma.flashcard.findMany({
    select: { id: true, front: true }
  })

  let cleanedCount = 0
  for (const card of cards) {
    if (!card.front) continue
    const newFront = card.front.replace(/^my friend,\s*/i, '').replace(/\*/g, '').trim()
    if (newFront !== card.front) {
      await prisma.flashcard.update({
        where: { id: card.id },
        data: { front: newFront }
      })
      cleanedCount++
    }
  }

  console.log(`Cleaned ${cleanedCount} flashcards front text successfully out of ${cards.length} cards.`)
}

cleanCards()
  .catch(err => console.error('Failed to clean cards:', err))
  .finally(() => prisma.$disconnect())
