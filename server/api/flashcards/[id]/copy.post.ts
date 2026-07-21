import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing flashcard ID to copy'
    })
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // 1. Fetch the source flashcard
    const sourceCard = await prisma.flashcard.findUnique({
      where: { id },
      include: {
        tags: true
      }
    })

    if (!sourceCard) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Source flashcard not found'
      })
    }

    // 2. If the user already owns this exact card, just return it
    if (sourceCard.ownerId === dbUser.id) {
      const card = await prisma.flashcard.findUnique({
        where: { id },
        include: {
          owner: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      })
      return card
    }

    // 3. Check if the user has already copied this card previously and it isn't deleted
    const existingCopy = await prisma.flashcard.findFirst({
      where: {
        ownerId: dbUser.id,
        copiedFromId: sourceCard.id,
        status: {
          not: 'DELETED'
        }
      },
      include: {
        owner: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (existingCopy) {
      return existingCopy
    }

    // 4. Duplicate the flashcard
    const newCard = await prisma.flashcard.create({
      data: {
        ownerId: dbUser.id,
        front: sourceCard.front,
        back: sourceCard.back,
        frontLanguage: sourceCard.frontLanguage,
        backLanguage: sourceCard.backLanguage,
        pronunciation: sourceCard.pronunciation,
        status: 'LEARNING',
        rank: 2.5,
        copiedFromId: sourceCard.id,
        activities: {
          create: {
            userId: dbUser.id,
            actionTaken: 'IMPORTED',
            actionDetails: `Copied from card ${sourceCard.id} originally owned by ${sourceCard.ownerId}`
          }
        }
      }
    })

    // 5. Copy over tags
    if (sourceCard.tags.length > 0) {
      await prisma.flashcardTag.createMany({
        data: sourceCard.tags.map(t => ({
          flashcardId: newCard.id,
          tagId: t.tagId
        }))
      })
    }

    // 6. Fetch fully populated copied card
    const populatedCard = await prisma.flashcard.findUnique({
      where: { id: newCard.id },
      include: {
        owner: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return populatedCard
  } catch (error) {
    console.error('Error duplicating flashcard:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to duplicate flashcard'
    })
  }
})
