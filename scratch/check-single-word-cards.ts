import 'dotenv/config'
import { prisma } from '../server/utils/prisma'

async function main() {
  const cards = await prisma.flashcard.findMany({
    select: {
      id: true,
      front: true,
      back: true,
      backLanguage: true
    }
  })

  console.log(`Total flashcards: ${cards.length}`)

  const singleWordCards: typeof cards = []
  for (const card of cards) {
    const trimmed = card.back.trim()
    const clean = trimmed.replace(/\*/g, '')
    // Check if it's a single word (no spaces inside)
    if (clean.length > 0 && !/\s/.test(clean)) {
      if (!trimmed.startsWith('*') || !trimmed.endsWith('*')) {
        singleWordCards.push(card)
      }
    }
  }

  console.log(`Single word cards needing asterisks: ${singleWordCards.length}`)
  for (const card of singleWordCards.slice(0, 10)) {
    console.log(`Card ${card.id}: front="${card.front}", back="${card.back}" -> "*${card.back.replace(/\*/g, '').trim()}*"`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
