import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

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

  const tagAbbreviations = (body.tags || []) as string[]

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

    // 1. Find or create all matching Tag records
    const cleanAbbreviations = tagAbbreviations.map(t => t.trim().toLowerCase()).filter(Boolean)
    
    // Get or create corresponding tags from database
    const tags = []
    for (const abbr of cleanAbbreviations) {
      const tag = await prisma.tag.upsert({
        where: { abbreviation: abbr },
        update: {},
        create: { abbreviation: abbr }
      })
      tags.push(tag)
    }

    // 2. Delete existing FlashcardTag links
    await prisma.flashcardTag.deleteMany({
      where: {
        flashcardId: id
      }
    })

    // 3. Create new FlashcardTag links
    if (tags.length > 0) {
      await prisma.flashcardTag.createMany({
        data: tags.map(tag => ({
          flashcardId: id,
          tagId: tag.id
        }))
      })
    }

    // 4. Return updated flashcard with tags
    const updatedFlashcard = await prisma.flashcard.findUnique({
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

    return updatedFlashcard
  } catch (error) {
    console.error('Error updating flashcard tags:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update flashcard tags'
    })
  }
})
