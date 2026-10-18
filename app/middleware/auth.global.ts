export default defineNuxtRouteMiddleware(async (to) => {
  // Redirect legacy /videos route to /links
  if (to.path === '/videos') {
    return navigateTo('/links', { replace: true })
  }

  const { loggedIn, fetchRole } = useCurrentUser()
  const returnUrlCookie = useCookie<string | null>('auth_return_url', { maxAge: 3600, sameSite: 'lax', path: '/' })

  // 1. Unauthenticated / Unknown Users
  if (!loggedIn.value) {
    // If a member's session expired while on /member or bookmarks /member, redirect to Welcome page as unknownUser
    if (to.path === '/member') {
      return navigateTo('/', { replace: true })
    }

    const unknownAllowedPaths = [
      '/',
      '/links',
      '/about',
      '/activities/gemini-quiz'
    ]

    // If trying to access a forbidden protected route (e.g. /import), remember destination and redirect to login
    if (!unknownAllowedPaths.includes(to.path)) {
      returnUrlCookie.value = to.fullPath
      return navigateTo('/api/login', { external: true })
    }
    return
  }

  // 2. Authenticated Users (Resolve role)
  const role = await fetchRole()
  const isUserAdmin = role === 'admin'

  // If returning from login, check for saved destination
  const savedTarget = returnUrlCookie.value
  if (savedTarget && (to.path === '/' || to.path === '/member' || to.path === '/flashcard')) {
    returnUrlCookie.value = null
    if (isUserAdmin) {
      return navigateTo(savedTarget, { replace: true })
    } else {
      const memberAllowedPaths = [
        '/member',
        '/links',
        '/about',
        '/user',
        '/profile',
        '/activities/gemini-quiz'
      ]
      const targetBase = savedTarget.split('?')[0] || ''
      if (memberAllowedPaths.includes(targetBase)) {
        return navigateTo(savedTarget, { replace: true })
      }
    }
  }

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
