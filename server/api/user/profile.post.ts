import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const userId = user.dbId || user.id
  const dataToUpdate: Record<string, any> = {}
  let shouldResetBatches = false

  if (body.dailyTakeGoal !== undefined) {
    dataToUpdate.dailyTakeGoal = Math.max(1, parseInt(body.dailyTakeGoal, 10) || 100)
  }

  if (body.testingGroupSize !== undefined) {
    const newGroupSize = Math.max(1, Math.min(7, parseInt(body.testingGroupSize, 10) || 7))
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { testingGroupSize: true }
    })
    if (currentUser && currentUser.testingGroupSize !== newGroupSize) {
      shouldResetBatches = true
    }
    dataToUpdate.testingGroupSize = newGroupSize
  }

  if (body.sourceLanguage !== undefined) {
    dataToUpdate.sourceLanguage = body.sourceLanguage ? String(body.sourceLanguage).toLowerCase().trim() : null
  }
  if (body.showSourceLanguageMaterials !== undefined) {
    dataToUpdate.showSourceLanguageMaterials = Boolean(body.showSourceLanguageMaterials)
  }
  if (body.isCommunity !== undefined) {
    dataToUpdate.isCommunity = Boolean(body.isCommunity)
  }

  if (body.targetLanguages !== undefined) {
    const arr = Array.isArray(body.targetLanguages) ? body.targetLanguages : []
    dataToUpdate.targetLanguages = JSON.stringify(arr)
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate
  })

  if (shouldResetBatches) {
    await prisma.userFlashcardBatch.deleteMany({
      where: { userId: updatedUser.id }
    })
  }

  return {
    success: true,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      dailyTakeGoal: updatedUser.dailyTakeGoal,
      testingGroupSize: updatedUser.testingGroupSize,
      sourceLanguage: updatedUser.sourceLanguage,
      showSourceLanguageMaterials: updatedUser.showSourceLanguageMaterials,
      isCommunity: updatedUser.isCommunity,
      targetLanguages: updatedUser.targetLanguages ? JSON.parse(updatedUser.targetLanguages) : []
    }
  }
})
