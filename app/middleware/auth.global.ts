export default defineNuxtRouteMiddleware(async (to) => {
  // Redirect legacy /videos route to /links
  if (to.path === '/videos') {
    return navigateTo('/links', { replace: true })
  }

  const { loggedIn, isAdmin, fetchRole } = useCurrentUser()

  // 1. Unauthenticated / Unknown Users
  if (!loggedIn.value) {
    const unknownAllowedPaths = [
      '/',
      '/links',
      '/about',
      '/activities/gemini-quiz'
    ]

    // If trying to access /member or any other protected route, redirect to login
    if (!unknownAllowedPaths.includes(to.path)) {
      return navigateTo('/api/login', { external: true })
    }
    return
  }

  // 2. Authenticated Users (Resolve role)
  const role = await fetchRole()
  const isUserAdmin = role === 'admin'

  // Admin routing
  if (isUserAdmin) {
    // Admin landing redirect
    if (to.path === '/') {
      return navigateTo('/flashcard', { replace: true })
    }
    // Prevent admin from viewing member page
    if (to.path === '/member') {
      return navigateTo('/flashcard', { replace: true })
    }
    return
  }

  // 3. Member routing
  // Member landing redirect
  if (to.path === '/') {
    return navigateTo('/member', { replace: true })
  }

  // Member allowed paths strictly enforced (no direct URL access to admin pages)
  const memberAllowedPaths = [
    '/member',
    '/links',
    '/about',
    '/user',
    '/profile',
    '/activities/gemini-quiz'
  ]

  if (!memberAllowedPaths.includes(to.path)) {
    return navigateTo('/member', { replace: true })
  }
})
