import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing flashcard ID'
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

    // Ensure the card exists and is owned by the user
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id,
        ownerId: dbUser.id
      }
    })

    if (!flashcard) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied: You do not own this flashcard'
      })
    }

    // Determine the actionTaken for activity logging
    let actionTaken = 'TESTED'
    if (body.status === 'DELETED') {
      actionTaken = 'DELETED'
    } else if (body.status === 'PARKED') {
      actionTaken = 'PARKED'
    } else if (body.status === 'LEARNED') {
      actionTaken = 'TESTED'
    } else if (body.front !== undefined || body.back !== undefined || body.pronunciation !== undefined || body.memoryHook !== undefined || body.mnemonic !== undefined) {
      actionTaken = 'EDITED'
    }

    // Update the Flashcard directly
    const updatedFlashcard = await prisma.flashcard.update({
      where: { id },
      data: {
        ...(body.front !== undefined ? { front: body.front } : {}),
        ...(body.back !== undefined ? { back: body.back } : {}),
        ...(body.pronunciation !== undefined ? { pronunciation: body.pronunciation } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.rank !== undefined ? { rank: body.rank } : {}),
        ...(body.memoryHook !== undefined ? { memoryHook: body.memoryHook } : 
           body.mnemonic !== undefined ? { memoryHook: body.mnemonic } : {}) // Support mnemonic fallback just in case
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

    // Log user activity
    await prisma.userFlashcardActivity.create({
      data: {
        userId: dbUser.id,
        flashcardId: id,
        actionTaken,
        actionDetails: body.rank !== undefined ? `Rank updated to ${body.rank}` : `Status/Details modified: ${JSON.stringify(body)}`
      }
    })

    return updatedFlashcard
  } catch (error) {
    console.error('Error updating flashcard:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update flashcard'
    })
  }
})
