<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  WrenchScrewdriverIcon,
  ArrowUpTrayIcon,
  LinkIcon,
  SparklesIcon,
  QueueListIcon
} from '@heroicons/vue/24/outline'

interface CardStats {
  readyCount: number
  waitingCount: number
  totalCount?: number
  todayReviewedCount?: number
  todayCorrectCount?: number
  todayImportedCount?: number
}

const mobileMenuOpen = ref(false)
const showStatsModal = useState('isStatsOpen', () => false)
const isIdeaBoxOpen = useState('isIdeaBoxOpen', () => false)
const navRef = ref<HTMLElement | null>(null)
const isNavReady = ref(false)

const cardStats = useState<CardStats | null>('flashcardStats', () => null)
const dailyTakeGoal = ref(100)

const handleClickOutside = (event: MouseEvent) => {
  if (navRef.value && !navRef.value.contains(event.target as Node)) {
    mobileMenuOpen.value = false
    showStatsModal.value = false
  }
}

let midnightTimeout: ReturnType<typeof setTimeout> | null = null

const scheduleMidnightRefresh = () => {
  if (midnightTimeout) clearTimeout(midnightTimeout)
  if (typeof window === 'undefined') return

  const now = new Date()
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
  const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime())

  midnightTimeout = setTimeout(() => {
    fetchNavCardStats()
    scheduleMidnightRefresh()
  }, msUntilMidnight)
}

const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const config = useRuntimeConfig()
const showColorModeToggle = config.public.showColorModeToggle
const showDevPageConfig = computed(() => config.public.showDevPage)

const { loggedIn, isAdmin, isMember, isUnknownUser, userRole, fetchRole } = useCurrentUser()
const isBypass = computed(() => Boolean(config.public.bypassAuth))
const auth = useAuth()
const user = computed(() => isBypass.value ? { given_name: 'Edward', picture: null } : (auth?.user ?? null))

const fetchUserData = async () => {
  if (!loggedIn.value) return
  try {
    const headers = useRequestHeaders(['cookie'])
    const data = await $fetch<{ role: string; dailyTakeGoal: number }>('/api/user/me', { headers })
    if (data?.role) {
      userRole.value = data.role
    }
    if (data?.dailyTakeGoal) {
      dailyTakeGoal.value = data.dailyTakeGoal
    }
  } catch (err: any) {
    userRole.value = 'member'
  }
}

const fetchNavCardStats = async () => {
  if (!loggedIn.value) return
  try {
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''
    const reqHeaders = useRequestHeaders(['cookie'])
    const headers: Record<string, string> = {
      ...reqHeaders,
      ...(tz ? { 'x-client-timezone': tz } : {})
    }
    const data = await $fetch<CardStats>('/api/flashcards/stats', {
      headers,
      query: tz ? { tz } : undefined
    })
    cardStats.value = data
  } catch (err: any) {
    if (err?.statusCode !== 401 && err?.status !== 401 && err?.response?.status !== 401) {
      console.error('Failed to fetch nav card stats', err)
    }
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  scheduleMidnightRefresh()

  if (loggedIn.value) {
    await Promise.all([
      fetchUserData(),
      fetchNavCardStats()
    ])
  } else {
    userRole.value = 'unknownUser'
  }
  isNavReady.value = true
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (midnightTimeout) clearTimeout(midnightTimeout)
})

watch(loggedIn, async (val) => {
  if (val) {
    await Promise.all([
      fetchUserData(),
      fetchNavCardStats()
    ])
  }
})

// Mutual exclusion: when stats modal opens, close idea box drawer
watch(showStatsModal, (newVal) => {
  if (newVal) {
    isIdeaBoxOpen.value = false
  }
})

const handleLogout = () => {
  navigateTo('/api/logout', { external: true })
}

const route = useRoute()
const isUserPage = computed(() => route.path === '/user' || route.path === '/profile')

const todayCount = computed(() => cardStats.value?.todayReviewedCount ?? 0)

const isCelebrationMode = computed(() => {
  return loggedIn.value && todayCount.value >= dailyTakeGoal.value && dailyTakeGoal.value > 0
})

const countButtonClass = computed(() => {
  const goal = dailyTakeGoal.value || 100
  const ratio = todayCount.value / goal

  if (ratio >= 1.0) {
    return 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/30'
  } else if (ratio >= 0.33) {
    return 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
  } else {
    return 'bg-red-600/20 text-red-600 dark:text-red-400 border-red-500/50 hover:bg-red-600/30'
  }
})

const navItems = computed(() => {
  const items = []
  if (loggedIn.value) {
    if (isAdmin.value) {
      items.push({ name: 'Flashcards', path: '/flashcards', icon: DocumentTextIcon })
      items.push({ name: 'Batches', path: '/batches', icon: QueueListIcon })
      items.push({ name: 'Activities', path: '/activities', icon: DocumentTextIcon })
      items.push({ name: 'Links', path: '/links', icon: LinkIcon })
      items.push({ name: 'Import', path: '/import', icon: ArrowUpTrayIcon })
      if (showDevPageConfig.value) {
        items.push({ name: 'Dev', path: '/dev', icon: WrenchScrewdriverIcon, showOnMobile: false })
      }
      items.push({ name: 'About', path: '/about', icon: InformationCircleIcon })
    } else {
      items.push({ name: 'Flashcards', path: '/flashcards', icon: DocumentTextIcon })
      items.push({ name: 'Batches', path: '/batches', icon: QueueListIcon })
      items.push({ name: 'Import', path: '/import', icon: ArrowUpTrayIcon })
      items.push({ name: 'Activities', path: '/activities/gemini-quiz', icon: SparklesIcon })
      items.push({ name: 'Links', path: '/links', icon: LinkIcon })
      items.push({ name: 'About', path: '/about', icon: InformationCircleIcon })
    }
  } else {
    items.push({ name: 'Welcome', path: '/', icon: HomeIcon })
    items.push({ name: 'Activities', path: '/activities/gemini-quiz', icon: SparklesIcon })
    items.push({ name: 'Links', path: '/links', icon: LinkIcon })
    items.push({ name: 'About', path: '/about', icon: InformationCircleIcon })
  }
  return items
})
</script>

<template>
  <nav ref="navRef"
       class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-all duration-500"
       :class="{ 'celebration-mode': isCelebrationMode }">
    <div class="container-custom">
      <div class="flex justify-between items-center h-16" @click="mobileMenuOpen = false">
        <!-- Logo / User Profile (Navigates to /profile for both members and admins) -->
        <div class="flex items-center space-x-3">
          <ClientOnly>
            <NuxtLink :to="loggedIn ? '/profile' : '/'" @click="mobileMenuOpen = false" class="group block transition-opacity duration-200" :class="{ 'opacity-50': isUserPage }">
              <div class="flex flex-row items-center gap-2.5">
                <template v-if="loggedIn">
                  <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden shrink-0 shadow-xs">
                    <img v-if="user?.picture" :src="user.picture" alt="Avatar" class="w-full h-full object-cover" />
                    <span v-else class="text-sm text-white">{{ user?.given_name?.[0] || 'U' }}</span>
                  </div>
                  <!-- First name only display -->
                  <span class="text-sm font-bold text-gray-800 group-hover:text-black dark:text-gray-200 dark:group-hover:text-white transition-colors whitespace-nowrap">
                    {{ user?.given_name || 'User' }}
                  </span>
                </template>
                <template v-else>
                  <span class="text-xl font-bold !text-black hover:!text-gray-700 transition-colors dark:!text-white dark:hover:!text-gray-300">LangLearn</span>
                </template>
              </div>
            </NuxtLink>
            <template #fallback>
              <NuxtLink to="/" @click="mobileMenuOpen = false" class="group block">
                <div class="flex flex-row items-center gap-2.5">
                  <span class="text-xl font-bold !text-black hover:!text-gray-700 transition-colors dark:!text-white dark:hover:!text-gray-300">LangLearn</span>
                </div>
              </NuxtLink>
            </template>
          </ClientOnly>

          <!-- Quick-Add Idea Drawer Trigger (Admin only) -->
          <ClientOnly>
            <QuickAddIdeaDrawer v-if="loggedIn && isAdmin" />
          </ClientOnly>
        </div>

        <!-- Desktop Navigation & Take-Count Progress Pill -->
        <div class="hidden md:flex items-center space-x-6 min-h-[36px]">
          <!-- Skeleton Loading Placeholders until Nav Data is Ready -->
          <div v-if="!isNavReady" class="flex items-center space-x-4 animate-pulse">
            <div class="h-7 w-20 bg-gray-200 dark:bg-gray-700/60 rounded-lg"></div>
            <div class="h-7 w-20 bg-gray-200 dark:bg-gray-700/60 rounded-lg"></div>
            <div class="h-7 w-16 bg-gray-200 dark:bg-gray-700/60 rounded-lg"></div>
            <div class="h-7 w-16 bg-gray-200 dark:bg-gray-700/60 rounded-lg"></div>
            <div class="h-7 w-16 bg-gray-200 dark:bg-gray-700/60 rounded-lg"></div>
          </div>

          <!-- Fully Loaded Navigation Items (Faded in all at once) -->
          <div v-else class="flex items-center space-x-6 transition-opacity duration-300 opacity-100">
            <!-- Desktop Take-Count Goal Progress Pill (Admin only) -->
            <button v-if="loggedIn && isAdmin"
                    @click.stop="showStatsModal = !showStatsModal; mobileMenuOpen = false"
                    class="px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border text-xs font-bold shadow-xs min-h-[32px]"
                    :class="countButtonClass"
                    title="Today's take count / goal - click for full stats">
              <span v-if="cardStats !== null" class="font-extrabold font-mono text-sm">
                {{ todayCount }}
              </span>
              <span v-else class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              <span class="text-[10px] opacity-75 font-normal">/ {{ dailyTakeGoal }}</span>
            </button>

            <!-- Nav Links -->
            <NuxtLink v-for="item in navItems"
                      :key="item.path"
                      :to="item.path"
                      class="flex items-center space-x-2 !text-gray-600 hover:!text-amber-600 transition-colors font-medium dark:!text-gray-300 dark:hover:!text-yellow-500"
                      active-class="!text-amber-500 dark:!text-yellow-400 font-semibold">
              <component :is="item.icon"
                         class="h-5 w-5" />
              <span>{{ item.name }}</span>
            </NuxtLink>

            <!-- Desktop Color Mode Toggle -->
            <button v-if="showColorModeToggle"
                    @click="toggleColorMode"
                    class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label="Toggle dark mode">
              <SunIcon v-if="colorMode.value === 'dark'"
                       class="h-5 w-5" />
              <MoonIcon v-else
                        class="h-5 w-5" />
            </button>

            <!-- Desktop Logout / (Login & Register for unknownUsers) -->
            <button v-if="loggedIn"
                    @click="handleLogout"
                    class="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors font-medium dark:text-gray-300 dark:hover:text-white shrink-0 justify-end cursor-pointer">
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
              <span>Logout</span>
            </button>
            <div v-else class="flex items-center space-x-4 shrink-0">
              <a
                href="/api/login"
                class="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 transition-colors font-semibold dark:text-gray-300 dark:hover:text-white">
                <ArrowLeftOnRectangleIcon class="h-5 w-5" />
                <span>Login</span>
              </a>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 md:hidden">
          <!-- Mobile Tested Count Button -->
          <ClientOnly>
            <button v-if="loggedIn"
                    @click.stop="showStatsModal = !showStatsModal; mobileMenuOpen = false"
                    class="px-2.5 py-1 rounded-xl flex items-center transition-all cursor-pointer border min-w-[36px] min-h-[32px] justify-center text-xs font-bold shadow-xs"
                    :class="countButtonClass"
                    title="Tested today count - tap for full stats">
              <span v-if="cardStats !== null" class="font-extrabold font-mono">
                {{ todayCount }}
              </span>
              <span v-else class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            </button>
          </ClientOnly>

          <!-- Mobile Dark Mode Toggle Button -->
          <button v-if="showColorModeToggle"
                  @click="toggleColorMode"
                  class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                  aria-label="Toggle dark mode">
            <SunIcon v-if="colorMode.value === 'dark'"
                     class="h-5 w-5" />
            <MoonIcon v-else
                      class="h-5 w-5" />
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button @click.stop="mobileMenuOpen = !mobileMenuOpen"
                  class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                  aria-label="Toggle mobile menu">
            <Bars3Icon v-if="!mobileMenuOpen"
                       class="h-6 w-6" />
            <XMarkIcon v-else
                       class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Drawer / Modal -->
    <Transition enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
      <div v-if="showStatsModal"
           class="absolute left-0 right-0 border-t border-b border-gray-200 bg-white shadow-2xl z-50 dark:bg-gray-900 dark:border-gray-800 p-4 md:p-6">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Daily Study Progress
          </h2>
          <button @click="showStatsModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div v-if="cardStats" class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
          <div class="flex flex-col p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-150 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400 font-medium">Takes Today</span>
            <span class="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {{ todayCount }} / {{ dailyTakeGoal }}
            </span>
          </div>
          <div class="flex flex-col p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-150 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400 font-medium">Correct Today</span>
            <span class="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {{ cardStats.todayCorrectCount ?? 0 }}
            </span>
          </div>
          <div class="flex flex-col p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-150 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400 font-medium">Imported Today</span>
            <span class="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {{ cardStats.todayImportedCount ?? 0 }}
            </span>
          </div>
          <div class="flex flex-col p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-150 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400 font-medium">Total Cards</span>
            <span class="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {{ cardStats.totalCount ?? 0 }}
            </span>
          </div>
        </div>
        <div v-else class="flex justify-center items-center py-4">
          <div class="w-6 h-6 border-2 border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Navigation Menu -->
    <Transition enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
      <div v-if="mobileMenuOpen"
           class="md:hidden absolute left-0 right-0 border-t border-b border-gray-200 bg-white shadow-2xl z-50 dark:bg-gray-900 dark:border-gray-800">
        <div class="container-custom py-4 space-y-2">
          <template v-for="item in navItems" :key="item.path">
            <NuxtLink v-if="item.showOnMobile !== false"
                      :to="item.path"
                      @click="mobileMenuOpen = false"
                      class="flex items-center space-x-3 px-4 py-3 rounded-lg !text-gray-600 hover:bg-gray-100 hover:!text-black transition-colors font-medium dark:!text-gray-300 dark:hover:bg-gray-800 dark:hover:!text-white"
                      active-class="bg-gray-100 !text-black dark:bg-gray-800 dark:!text-white">
              <component :is="item.icon"
                         class="h-5 w-5" />
              <span>{{ item.name }}</span>
            </NuxtLink>
          </template>

          <!-- Mobile Logout / (Login & Register for unknownUsers) -->
          <div class="border-t border-gray-100 dark:border-gray-800 pt-2">
            <button v-if="loggedIn"
                    @click="handleLogout(); mobileMenuOpen = false"
                    class="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-850/50 transition-colors font-medium cursor-pointer">
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
              <span>Logout</span>
            </button>
            <div v-else class="space-y-1">
              <a
                href="/api/login"
                @click="mobileMenuOpen = false"
                class="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors font-semibold">
                <ArrowLeftOnRectangleIcon class="h-5 w-5" />
                <span>Login with Google</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
@keyframes fireworksSubtle {
  0% {
    background-position: 0% 0%, 50% 50%, 100% 100%;
  }
  50% {
    background-position: 100% 50%, 0% 100%, 50% 0%;
  }
  100% {
    background-position: 0% 0%, 50% 50%, 100% 100%;
  }
}

.celebration-mode {
  background-image: 
    radial-gradient(circle at 20% 40%, rgba(234, 179, 8, 0.22) 0%, transparent 35%),
    radial-gradient(circle at 75% 30%, rgba(236, 72, 153, 0.22) 0%, transparent 35%),
    radial-gradient(circle at 50% 70%, rgba(34, 197, 94, 0.22) 0%, transparent 35%);
  background-size: 150% 150%;
  animation: fireworksSubtle 6s infinite ease-in-out;
}
</style>
