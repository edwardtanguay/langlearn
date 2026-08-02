<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { HomeIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon, InformationCircleIcon, DocumentTextIcon, ArrowRightOnRectangleIcon, WrenchScrewdriverIcon, ArrowUpTrayIcon, SpeakerWaveIcon, VideoCameraIcon } from '@heroicons/vue/24/outline'

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

const cardStats = useState<CardStats | null>('flashcardStats', () => null)
const dailyTakeGoal = ref(100)

const handleClickOutside = (event: MouseEvent) => {
  if (navRef.value && !navRef.value.contains(event.target as Node)) {
    mobileMenuOpen.value = false
    showStatsModal.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const config = useRuntimeConfig()
const showColorModeToggle = config.public.showColorModeToggle
const showDevPageConfig = computed(() => config.public.showDevPage)

const auth = useAuth()
const loggedIn = computed(() => auth?.loggedIn ?? false)
const user = computed(() => auth?.user ?? null)

const userRole = ref<string>('member')

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
    const headers = useRequestHeaders(['cookie'])
    const data = await $fetch<CardStats>('/api/flashcards/stats', { headers })
    cardStats.value = data
  } catch (err: any) {
    if (err?.statusCode !== 401 && err?.status !== 401 && err?.response?.status !== 401) {
      console.error('Failed to fetch nav card stats', err)
    }
  }
}

watch(loggedIn, (val) => {
  if (val) {
    fetchUserData()
    fetchNavCardStats()
  }
}, { immediate: true })

// Mutual exclusion: when stats modal opens, close idea box drawer
watch(showStatsModal, (newVal) => {
  if (newVal) {
    isIdeaBoxOpen.value = false
  }
})

const isAdmin = computed(() => userRole.value === 'admin')

const handleLogout = () => {
  navigateTo('/api/logout', { external: true })
}

const route = useRoute()
const isUserPage = computed(() => route.path === '/user')

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
    items.push({ name: 'Flashcards', path: '/flashcard', icon: DocumentTextIcon })
    items.push({ name: 'Pronunciation', path: '/pronunciation', icon: SpeakerWaveIcon })
    items.push({ name: 'Videos', path: '/videos', icon: VideoCameraIcon })
    items.push({ name: 'Import', path: '/import', icon: ArrowUpTrayIcon })
    if (showDevPageConfig.value && isAdmin.value) {
      items.push({ name: 'Dev', path: '/dev', icon: WrenchScrewdriverIcon, showOnMobile: false })
    }
    items.push({ name: 'About', path: '/about', icon: InformationCircleIcon })
  } else {
    items.push({ name: 'Home', path: '/', icon: HomeIcon })
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
        <!-- Logo / User Profile (First Name Only) -->
        <div class="flex items-center space-x-3">
          <ClientOnly>
            <NuxtLink :to="loggedIn ? '/user' : '/'" @click="mobileMenuOpen = false" class="group block transition-opacity duration-200" :class="{ 'opacity-50': isUserPage }">
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

          <!-- Quick-Add Idea Drawer Trigger -->
          <ClientOnly>
            <QuickAddIdeaDrawer v-if="loggedIn" />
          </ClientOnly>
        </div>

        <!-- Desktop Navigation & Take-Count Progress Pill -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Desktop Take-Count Goal Progress Pill -->
          <ClientOnly>
            <button v-if="loggedIn"
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
          </ClientOnly>

          <NuxtLink v-for="item in navItems"
                    :key="item.path"
                    :to="item.path"
                    class="flex items-center space-x-2 !text-gray-600 hover:!text-black transition-colors font-medium dark:!text-gray-300 dark:hover:!text-white"
                    active-class="!text-black dark:!text-white font-semibold">
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

          <!-- Desktop Logout Button -->
          <ClientOnly>
            <button v-if="loggedIn"
                    @click="handleLogout"
                    class="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors font-medium dark:text-gray-300 dark:hover:text-white w-[76px] shrink-0 justify-end">
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
              <span>Logout</span>
            </button>
            <div v-else class="w-[76px] shrink-0"></div>
          </ClientOnly>
        </div>

        <div class="flex items-center space-x-2 md:hidden">
          <!-- Mobile Tested Count Button -->
          <ClientOnly>
            <button v-if="loggedIn"
                    @click.stop="showStatsModal = !showStatsModal; mobileMenuOpen = false"
                    class="px-2.5 py-1 rounded-xl flex items-center transition-all cursor-pointer border min-w-[36px] min-h-[32px] justify-center text-xs font-bold shadow-xs"
                    :class="countButtonClass"
                    title="Tested today count - tap for full stats">
              <span v-if="cardStats !== null" class="font-extrabold font-mono text-sm">
                {{ todayCount }}
              </span>
              <span v-else class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            </button>
          </ClientOnly>

          <!-- Mobile Color Mode Toggle -->
          <button v-if="showColorModeToggle"
                  @click.stop="toggleColorMode"
                  class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                  aria-label="Toggle dark mode">
            <SunIcon v-if="colorMode.value === 'dark'"
                     class="h-5 w-5" />
            <MoonIcon v-else
                      class="h-5 w-5" />
          </button>

          <!-- Mobile Menu Button -->
          <button @click.stop="mobileMenuOpen = !mobileMenuOpen; showStatsModal = false"
                  class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                  aria-label="Toggle menu">
            <Bars3Icon v-if="!mobileMenuOpen"
                       class="h-6 w-6" />
            <XMarkIcon v-else
                       class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Popdown Modal (Renamed "Got Right" to "Learned") -->
    <Transition enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
      <div v-if="showStatsModal && loggedIn"
           class="absolute left-0 right-0 border-t border-b border-gray-200 bg-white dark:bg-gray-900 shadow-xl z-50 dark:border-gray-800 px-4 py-3">
        <div v-if="cardStats !== null" class="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div class="flex flex-col p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-150 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400 font-medium">Tested Today</span>
            <span class="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {{ cardStats.todayReviewedCount ?? 0 }}
            </span>
          </div>
          <div class="flex flex-col p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-150 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400 font-medium">Learned</span>
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

    <!-- Mobile Navigation -->
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

          <!-- Mobile Logout Button -->
          <ClientOnly>
            <button v-if="loggedIn"
                    @click="handleLogout(); mobileMenuOpen = false"
                    class="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-850/50 transition-colors font-medium">
              <ArrowRightOnRectangleIcon class="h-5 w-5" />
              <span>Logout</span>
            </button>
          </ClientOnly>
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
