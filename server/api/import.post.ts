import { prisma } from '../utils/prisma'
import { requireAuth } from '../utils/auth'
import { processImportRows } from '../utils/import-service'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  const body = await readBody(event)
  if (!body || !Array.isArray(body.rows)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid body, expected an object with a rows array'
    })
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  try {
    const result = await processImportRows(dbUser.id, body.rows)
    return result
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: err.message || 'Import failed'
    })
  }
})

