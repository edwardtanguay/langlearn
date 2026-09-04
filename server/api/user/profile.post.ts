import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const dataToUpdate: Record<string, any> = {}

  if (body.dailyTakeGoal !== undefined) {
    dataToUpdate.dailyTakeGoal = Math.max(1, parseInt(body.dailyTakeGoal, 10) || 100)
  }

  if (body.testingGroupSize !== undefined) {
    dataToUpdate.testingGroupSize = Math.max(1, Math.min(50, parseInt(body.testingGroupSize, 10) || 10))
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.dbId || user.id },
    data: dataToUpdate
  })

  return {
    success: true,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      dailyTakeGoal: updatedUser.dailyTakeGoal,
      testingGroupSize: updatedUser.testingGroupSize
    }
  }
})
