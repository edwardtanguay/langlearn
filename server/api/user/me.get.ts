import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.dbId || user.id }
  })
  return {
    id: dbUser?.id || user.dbId || user.id,
    email: dbUser?.email || user.email,
    firstName: dbUser?.firstName || user.given_name || 'User',
    lastName: dbUser?.lastName || user.family_name || '',
    role: dbUser?.role || user.role || 'member',
    dailyTakeGoal: dbUser?.dailyTakeGoal ?? 100,
    testingGroupSize: dbUser?.testingGroupSize ?? 10,
    sourceLanguage: dbUser?.sourceLanguage ?? 'en',
    targetLanguages: dbUser?.targetLanguages
      ? (typeof dbUser.targetLanguages === 'string' && dbUser.targetLanguages.startsWith('[')
          ? JSON.parse(dbUser.targetLanguages)
          : dbUser.targetLanguages.split(',').map((s: string) => s.trim()).filter(Boolean))
      : ['fr', 'es', 'it', 'nl', 'pl', 'de', 'ru', 'is', 'da', 'el']
  }
})
