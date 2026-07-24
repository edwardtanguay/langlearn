import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.role ? { role: body.role } : {}),
      ...(body.firstName ? { firstName: body.firstName.trim() } : {}),
      ...(body.lastName ? { lastName: body.lastName.trim() } : {})
    }
  })

  return updated
})
