import { prisma } from '../server/utils/prisma'


async function main() {
  const card = await prisma.flashcard.findFirst({
    where: {
      OR: [
        { front: { contains: 'misfit' } },
        { back: { contains: 'misfit' } }
      ]
    }
  })

  if (!card) {
    console.log('Card not found')
    return
  }

  console.log('Found card:', card.id, card.front, card.back)

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

  await prisma.userFlashcardActivity.create({
    data: {
      userId: card.ownerId,
      flashcardId: card.id,
      actionTaken: 'TESTED',
      whenActedUpon: fiveMinutesAgo
    }
  })

  console.log('Activity created for 5 minutes ago')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
