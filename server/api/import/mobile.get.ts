import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const record = await prisma.mobileImport.findFirst({
    where: { userId: dbUser.id },
    orderBy: { whenImported: 'desc' }
  })

  if (!record) {
    return null
  }

  return {
    id: record.id,
    userId: record.userId,
    mobileImportText: record.mobileImportText,
    whenImported: formatDate(record.whenImported)
  }
})
