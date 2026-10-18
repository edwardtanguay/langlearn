import { computed } from 'vue'

export const useCurrentUser = () => {
  const config = useRuntimeConfig()
  const isBypass = computed(() => Boolean(config.public.bypassAuth))
  const auth = useAuth()
  const loggedIn = computed(() => isBypass.value ? true : (auth?.loggedIn ?? false))
  const userRole = useState<string>('currentUserRole', () => 'unknownUser')
  const isAuthResolved = useState<boolean>('isAuthResolved', () => false)

  const isAdmin = computed(() => Boolean(loggedIn.value && userRole.value === 'admin'))
  const isMember = computed(() => Boolean(loggedIn.value && userRole.value === 'member'))
  const isUnknownUser = computed(() => Boolean(!loggedIn.value || userRole.value === 'unknownUser'))

  const fetchRole = async () => {
    if (!loggedIn.value) {
      userRole.value = 'unknownUser'
      isAuthResolved.value = true
      return 'unknownUser'
    }
    try {
      const headers = useRequestHeaders(['cookie'])
      const data = await $fetch<{ role: string }>('/api/user/me', { headers })
      if (data?.role) {
        userRole.value = data.role
        isAuthResolved.value = true
        return data.role
      }
    } catch {
      userRole.value = 'member'
    } finally {
      isAuthResolved.value = true
    }
    return userRole.value
  }

  return {
    loggedIn,
    userRole,
    isAdmin,
    isMember,
    isUnknownUser,
    isAuthResolved,
    fetchRole
  }
}
