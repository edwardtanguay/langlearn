export default defineNuxtRouteMiddleware(async (to) => {
  // Redirect legacy /videos route to /links
  if (to.path === '/videos') {
    return navigateTo('/links', { replace: true })
  }

  const { loggedIn, isAdmin, fetchRole } = useCurrentUser()

  if (loggedIn.value) {
    const role = await fetchRole()
    const isUserAdmin = role === 'admin'

    // Root landing redirect based on role
    if (to.path === '/') {
      return navigateTo(isUserAdmin ? '/flashcard' : '/member', { replace: true })
    }

    // For non-admin members, restrict access to only member-approved pages
    if (!isUserAdmin) {
      const memberAllowedPaths = [
        '/member',
        '/links',
        '/about',
        '/user',
        '/activities/gemini-quiz'
      ]

      const isAllowed = memberAllowedPaths.includes(to.path)
      if (!isAllowed) {
        return navigateTo('/member', { replace: true })
      }
    }
  }
})
