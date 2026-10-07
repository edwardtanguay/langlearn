import { computed } from 'vue'

export const useCurrentUser = () => {
  const config = useRuntimeConfig()
  const isBypass = computed(() => Boolean(config.public.bypassAuth))
  const auth = useAuth()
  const loggedIn = computed(() => isBypass.value ? true : (auth?.loggedIn ?? false))
  const userRole = useState<string>('currentUserRole', () => 'member')
  const isAdmin = computed(() => userRole.value === 'admin')

  const fetchRole = async () => {
    if (!loggedIn.value) {
      userRole.value = 'member'
      return 'member'
    }
    try {
      const headers = useRequestHeaders(['cookie'])
      const data = await $fetch<{ role: string }>('/api/user/me', { headers })
      if (data?.role) {
        userRole.value = data.role
        return data.role
      }
    } catch {
      userRole.value = 'member'
    }
    return userRole.value
  }

  return {
    loggedIn,
    userRole,
    isAdmin,
    fetchRole
  }
}
