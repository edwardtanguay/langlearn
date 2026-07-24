import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  return {
    id: user.dbId || user.id,
    email: user.email,
    firstName: user.given_name,
    lastName: user.family_name,
    role: user.role
  }
})
