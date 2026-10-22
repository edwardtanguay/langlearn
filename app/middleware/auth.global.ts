export default defineNuxtRouteMiddleware(async (to) => {
  // Redirect legacy /videos route to /links
  if (to.path === '/videos') {
    return navigateTo('/links', { replace: true })
  }

  // Redirect legacy /user route to /profile
  if (to.path === '/user') {
    return navigateTo('/profile', { replace: true })
  }

  // Redirect legacy /flashcard routes to /flashcards
  if (to.path === '/flashcard') {
    return navigateTo('/flashcards', { replace: true })
  }
  if (to.path.startsWith('/flashcard/')) {
    const cardId = to.path.replace('/flashcard/', '')
    return navigateTo(`/flashcards/${cardId}`, { replace: true })
  }

  const { loggedIn, fetchRole } = useCurrentUser()
  const returnUrlCookie = useCookie<string | null>('auth_return_url', { maxAge: 3600, sameSite: 'lax', path: '/' })

  // 1. Unauthenticated / Unknown Users
  if (!loggedIn.value) {
    if (to.path === '/member') {
      return navigateTo('/', { replace: true })
    }

    const unknownAllowedPaths = [
      '/',
      '/links',
      '/about',
      '/activities/gemini-quiz'
    ]

    if (!unknownAllowedPaths.includes(to.path)) {
      returnUrlCookie.value = to.fullPath
      return navigateTo('/api/login', { external: true })
    }
    return
  }

  // 2. Authenticated Users (Resolve role & verify onboarding requirements)
  const role = await fetchRole()
  const isUserAdmin = role === 'admin'

  // First Sign-In check: force user to set source language and at least one target language
  const headers = useRequestHeaders(['cookie'])
  try {
    const me = await $fetch<{ sourceLanguage?: string | null; targetLanguages?: string[] }>('/api/user/me', { headers })
    const hasSource = Boolean(me?.sourceLanguage)
    const hasTarget = Array.isArray(me?.targetLanguages) && me.targetLanguages.length > 0
    if ((!hasSource || !hasTarget) && to.path !== '/profile') {
      return navigateTo('/profile?firstSignIn=true', { replace: true })
    }
  } catch {
    // If checking user settings fails, allow navigation to proceed gracefully
  }

  const isPathAllowedForMember = (path: string) => {
    if (path.startsWith('/flashcards') || path.startsWith('/flashcard')) return true
    const memberAllowedPaths = [
      '/member',
      '/batches',
      '/import',
      '/links',
      '/about',
      '/profile',
      '/activities/gemini-quiz'
    ]
    return memberAllowedPaths.includes(path)
  }

  // If returning from login, check for saved destination
  const savedTarget = returnUrlCookie.value
  if (savedTarget && (to.path === '/' || to.path === '/member' || to.path === '/flashcards' || to.path === '/flashcard')) {
    returnUrlCookie.value = null
    const targetUrl = savedTarget.replace('/flashcard', '/flashcards').replace('/user', '/profile')
    if (isUserAdmin) {
      return navigateTo(targetUrl, { replace: true })
    } else {
      const targetBase = targetUrl.split('?')[0] || ''
      if (isPathAllowedForMember(targetBase)) {
        return navigateTo(targetUrl, { replace: true })
      }
    }
  }

  // Admin routing
  if (isUserAdmin) {
    if (to.path === '/') {
      return navigateTo('/flashcards', { replace: true })
    }
    if (to.path === '/member') {
      return navigateTo('/flashcards', { replace: true })
    }
    return
  }

  // 3. Member routing
  if (to.path === '/') {
    try {
      const stats = await $fetch<{ totalCount?: number }>('/api/flashcards/stats', { headers })
      if ((stats?.totalCount ?? 0) > 0) {
        return navigateTo('/flashcards', { replace: true })
      }
    } catch {
      // Fallback
    }
    return navigateTo('/member', { replace: true })
  }

  // Member allowed paths strictly enforced
  if (!isPathAllowedForMember(to.path)) {
    return navigateTo('/member', { replace: true })
  }
})
