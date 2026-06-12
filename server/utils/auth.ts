import { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
  const config = useRuntimeConfig()
  
  if (config.public.bypassAuth) {
    // Return a mock user for local development
    return {
      id: 'mock-user-123',
      given_name: 'Local',
      family_name: 'Developer',
      email: 'local.dev@example.com'
    }
  }

  const kinde = event.context.kinde
  if (!kinde) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No Kinde context'
    })
  }

  const user = await kinde.getUser()
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No user found'
    })
  }

  return user
}
