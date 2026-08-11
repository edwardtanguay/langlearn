import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const cards = await prisma.flashcard.findMany()
  
  const matchingCards = cards.filter(card => 
    /^mon ami,/i.test(card.front) || /^mon ami,/i.test(card.back)
  )

  console.log(`Found ${matchingCards.length} flashcards matching criteria.`)

  for (const card of matchingCards) {
    let updatedFront = card.front
    let updatedBack = card.back

    if (/^mon ami,\s*/i.test(updatedFront)) {
      updatedFront = updatedFront.replace(/^mon ami,\s*/i, '')
    }

    if (/^mon ami,\s*/i.test(updatedBack)) {
      updatedBack = updatedBack.replace(/^mon ami,\s*/i, '')
    }

    console.log(`Updating ID ${card.id}:`)
    console.log(`  BEFORE - front: "${card.front}" | back: "${card.back}"`)
    console.log(`  AFTER  - front: "${updatedFront}" | back: "${updatedBack}"`)

    await prisma.flashcard.update({
      where: { id: card.id },
      data: {
        front: updatedFront,
        back: updatedBack
      }
    })
  }

  console.log('Update complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
