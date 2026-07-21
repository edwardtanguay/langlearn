import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)

  const abbreviation = (body.abbreviation || '').trim().toLowerCase()
  const description = (body.description || '').trim()

  if (!abbreviation) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Abbreviation is required'
    })
  }

  try {
    const existingTag = await prisma.tag.findUnique({
      where: { abbreviation }
    })

    if (existingTag) {
      return existingTag
    }

    const tag = await prisma.tag.create({
      data: {
        abbreviation,
        description
      }
    })

    return tag
  } catch (error) {
    console.error('Error creating tag:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create tag'
    })
  }
})
