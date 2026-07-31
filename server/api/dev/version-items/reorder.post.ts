import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/auth'

interface ReorderItem {
  id: string
  rank: number
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<{ items: ReorderItem[] }>(event)
  if (!body || !Array.isArray(body.items)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payload. "items" array required.'
    })
  }

  // Batch update ranks within a transaction
  await prisma.$transaction(
    body.items.map((item) =>
      prisma.versionItem.update({
        where: { id: item.id },
        data: { rank: item.rank }
      })
    )
  )

  return { success: true, count: body.items.length }
})
