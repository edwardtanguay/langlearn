import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const dailyTakeGoal = Math.max(1, parseInt(body.dailyTakeGoal, 10) || 100)

  const updatedUser = await prisma.user.update({
    where: { id: user.dbId || user.id },
    data: {
      dailyTakeGoal
    }
  })

  return {
    success: true,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      dailyTakeGoal: updatedUser.dailyTakeGoal
    }
  }
})
