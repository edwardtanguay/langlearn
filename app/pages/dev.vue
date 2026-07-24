<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  WrenchScrewdriverIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  HashtagIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Developer Console',
  meta: [
    { name: 'description', content: 'Developer console for managing versions, user roles, and flashcard flow.' }
  ]
})

const activeTab = ref<'flashcard-flow' | 'users'>('flashcard-flow')

const isBackgroundLoading = ref(false)
const hasLoadedUsers = ref(false)
const hasLoadedCards = ref(false)

const config = useRuntimeConfig()
const router = useRouter()
const showDevPage = config.public.showDevPage
const auth = useAuth()
const loggedIn = computed(() => auth?.loggedIn ?? false)

// Role guard check
const userRole = ref<string>('member')
const isCheckingRole = ref(true)

const fetchUserRole = async () => {
  if (!loggedIn.value) {
    navigateTo('/')
    return
  }
  try {
    const me = await $fetch<{ role: string }>('/api/user/me')
    userRole.value = me.role
    if (me.role !== 'admin') {
      navigateTo('/')
    }
  } catch (err) {
    navigateTo('/')
  } finally {
    isCheckingRole.value = false
  }
}

onMounted(() => {
  if (!showDevPage) {
    navigateTo('/')
  } else {
    fetchUserRole()
  }
})

// ==========================================
// 1. USERS TAB STATE & ACTIONS
// ==========================================
interface UserEntry {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'member'
  _count?: { flashcards: number }
}

const usersList = ref<UserEntry[]>([])
const isLoadingUsers = ref(false)
const showUserModal = ref(false)
const userForm = ref<{ id: string; firstName: string; lastName: string; role: 'admin' | 'member' }>({
  id: '',
  firstName: '',
  lastName: '',
  role: 'member'
})

const loadUsers = async () => {
  if (!hasLoadedUsers.value) {
    isLoadingUsers.value = true
  } else {
    isBackgroundLoading.value = true
  }
  try {
    usersList.value = await $fetch<UserEntry[]>('/api/dev/users')
    hasLoadedUsers.value = true
  } catch (err) {
    console.error('Failed to load users:', err)
  } finally {
    isLoadingUsers.value = false
    isBackgroundLoading.value = false
  }
}

const openEditUserModal = (u: UserEntry) => {
  userForm.value = {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role
  }
  showUserModal.value = true
}

const saveUser = async () => {
  try {
    await $fetch(`/api/dev/users/${userForm.value.id}`, {
      method: 'PUT',
      body: userForm.value
    })
    showUserModal.value = false
    await loadUsers()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update user')
  }
}

// ==========================================
// 3. FLASHCARD FLOW TAB STATE
// ==========================================
interface DevFlashcard {
  id: string
  status: string
  rank: number
  front: string
  frontLanguage: string
  back: string
  backLanguage: string
  pronunciation: string | null
  memoryHook: string | null
  tags: string[]
  lastTested: string | null
  nextTest: string | null
  minutesToTestAgain: number
}

const flashcards = ref<DevFlashcard[]>([])
const isLoadingCards = ref(true)
const searchQuery = ref('')
const now = ref(Date.now())
let intervalId: any = null

const languageColors: Record<string, string> = {
  fr: '#333388',
  es: '#be185d',
  it: '#194d19',
  nl: '#d97706',
  pl: '#b8b8b8',
  de: '#7e4402',
  ru: '#3f3f46',
  is: '#06b6d4',
  da: '#7e22ce',
  el: '#ea580c'
}

const loadDevCards = async () => {
  if (!hasLoadedCards.value) {
    isLoadingCards.value = true
  } else {
    isBackgroundLoading.value = true
  }
  try {
    flashcards.value = await $fetch<DevFlashcard[]>('/api/dev/flashcards')
    hasLoadedCards.value = true
  } catch (err) {
    console.error('Failed to load dev cards:', err)
  } finally {
    isLoadingCards.value = false
    isBackgroundLoading.value = false
  }
}

function formatDateTime(isoString: string | null) {
  if (!isoString) return 'Never'
  const date = new Date(isoString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function getTimeRemaining(nextTestIso: string | null, status: string, cardId: string) {
  if (status === 'LEARNED' || status === 'PARKED' || status === 'DELETED') {
    return { text: 'finished', colorClass: 'text-red-500', bgClass: '' }
  }
  
  let isDue = false;
  let type = '';
  
  if (!nextTestIso) {
    isDue = true;
    type = 'new';
  } else {
    const target = new Date(nextTestIso).getTime()
    const diffMs = target - now.value
    
    if (diffMs <= 0) {
      isDue = true;
      type = 'retest';
    } else {
      const totalSecs = Math.floor(diffMs / 1000)
      const mins = Math.floor(totalSecs / 60)
      const secs = totalSecs % 60
      return { text: `${mins}m ${secs}s`, colorClass: 'text-yellow-400', bgClass: '' }
    }
  }
  
  if (cardId === firstDueCardId.value) {
    return { text: `${type} (current)`, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-900 px-1 py-0.5 rounded' }
  } else if (cardId === secondDueCardId.value) {
    return { text: `${type} (next)`, colorClass: 'text-emerald-400', bgClass: '' }
  } else {
    return { text: type, colorClass: 'text-yellow-400', bgClass: '' }
  }
}

const filteredAndSortedCards = computed(() => {
  let cards = [...flashcards.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    cards = cards.filter(c => 
      c.front.toLowerCase().includes(q) || 
      c.back.toLowerCase().includes(q) || 
      c.status.toLowerCase().includes(q)
    )
  }
  return cards.sort((a, b) => {
    const aIsLearning = a.status === 'LEARNING' ? 1 : 0
    const bIsLearning = b.status === 'LEARNING' ? 1 : 0
    if (aIsLearning !== bIsLearning) {
      return bIsLearning - aIsLearning
    }
    if (b.rank !== a.rank) {
      return b.rank - a.rank
    }
    return a.id.localeCompare(b.id)
  })
})

const firstDueCardId = computed(() => {
  const dueCard = filteredAndSortedCards.value.find(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return true
    const target = new Date(c.nextTest).getTime()
    return target <= now.value
  })
  return dueCard ? dueCard.id : null
})

const secondDueCardId = computed(() => {
  const dueCards = filteredAndSortedCards.value.filter(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return true
    const target = new Date(c.nextTest).getTime()
    return target <= now.value
  })
  return dueCards.length > 1 ? dueCards[1]?.id ?? null : null
})

const readyToTestCount = computed(() => {
  return flashcards.value.filter(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return true
    return new Date(c.nextTest).getTime() <= now.value
  }).length
})

const waitingCount = computed(() => {
  return flashcards.value.filter(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return false
    return new Date(c.nextTest).getTime() > now.value
  }).length
})

// Tab Switch Observer
watch(activeTab, (tab) => {
  if (tab === 'versions') {
    loadVersions()
  } else if (tab === 'users') {
    loadUsers()
  } else if (tab === 'flashcard-flow') {
    loadDevCards()
  }
}, { immediate: true })

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Desktop-only Check wrapper -->
    <div class="block md:hidden text-center py-12 px-6 bg-gray-900 border border-gray-800 rounded-xl shadow-xl">
      <div class="text-4xl mb-4">🖥️</div>
      <h1 class="text-xl font-bold text-white mb-2">Desktop View Required</h1>
      <p class="text-gray-400 text-sm max-w-md mx-auto">
        The Developer Console is optimized for desktop-sized viewports. Please resize your browser or use a desktop device.
      </p>
    </div>

    <!-- Main Desktop Dev Container -->
    <div v-if="!isCheckingRole && userRole === 'admin'" class="hidden md:block space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Developer Console
          </h1>
          <p class="text-xs text-gray-400 mt-1">Admin control panel for managing versions, feature requests, users, and study algorithms.</p>
        </div>

        <!-- Sub-Menu Navigation Tabs (No icons, Flashcard Flow default) -->
        <div class="flex items-center gap-3">
          <div class="flex bg-gray-900 border border-gray-800 p-1 rounded-lg space-x-1">
            <button
              @click="activeTab = 'flashcard-flow'"
              class="px-4 py-1.5 text-xs font-semibold rounded-md transition-all"
              :class="activeTab === 'flashcard-flow' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
            >
              Flashcard Flow
            </button>

            <button
              @click="activeTab = 'users'"
              class="px-4 py-1.5 text-xs font-semibold rounded-md transition-all"
              :class="activeTab === 'users' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
            >
              Users
            </button>
          </div>
        </div>
      </div>



      <!-- ========================================== -->
      <!-- TAB 1: FLASHCARD FLOW & TESTING DASHBOARD -->
      <!-- ========================================== -->
      <div v-if="activeTab === 'flashcard-flow'" class="space-y-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-start gap-2.5">
            <span class="w-3 h-3 rounded-full bg-orange-500 animate-pulse mt-2 flex-shrink-0"></span>
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight leading-none">
                State of flashcards
              </h2>
              <p
                class="text-xs text-gray-400 mt-1.5 font-mono transition-opacity duration-500 ease-out min-h-[1rem]"
                :class="isLoadingCards ? 'opacity-0' : 'opacity-100'"
              >
                {{ readyToTestCount }} to test -- {{ waitingCount }} waiting
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filter by front, back, or status..."
              class="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gray-700 w-64 font-mono"
            />
            <button
              @click="loadDevCards"
              class="bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs py-1.5 px-3 rounded font-mono transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        <div v-if="isLoadingCards" class="text-center py-20 font-mono text-xs text-gray-400">
          Loading dev console data...
        </div>

        <div v-else class="bg-gray-950/80 border border-gray-800/60 rounded-lg overflow-hidden shadow-2xl backdrop-blur">
          <div class="max-h-[70vh] overflow-y-auto">
            <table class="w-full text-left border-collapse table-fixed text-[11px] font-mono leading-tight">
              <thead>
                <tr class="border-b border-gray-800 bg-gray-900/60 text-gray-400 font-bold sticky top-0 z-10 whitespace-nowrap">
                  <th class="py-1.5 px-2 w-[18%] text-left truncate">CARD</th>
                  <th class="py-1.5 px-2 w-[8%] text-left truncate">STATUS</th>
                  <th class="py-1.5 px-2 w-[8%] text-right truncate">RANK</th>
                  <th class="py-1.5 px-2 w-[13%] text-left truncate">LAST TESTED</th>
                  <th class="py-1.5 px-2 w-[15%] text-center truncate">TESTING STATUS</th>
                  <th class="py-1.5 px-2 w-[10%] text-left truncate">PRON.</th>
                  <th class="py-1.5 px-2 w-[10%] text-left truncate">HOOK</th>
                  <th class="py-1.5 px-2 w-[10%] text-left truncate">TAGS</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="card in filteredAndSortedCards"
                  :key="card.id"
                  class="border-b border-gray-900/40 hover:bg-gray-900/60 transition-colors"
                >
                  <td class="py-1.5 px-2 truncate" :title="card.front + '\n' + card.back">
                    <span
                      class="px-1 py-[1px] rounded text-[9px] font-bold mr-1.5"
                      :style="{ backgroundColor: languageColors[card.backLanguage] || '#4b5563', color: '#ffffff' }"
                    >
                      {{ card.backLanguage.toUpperCase() }}
                    </span>
                    <span class="text-white">{{ card.front }}</span>
                  </td>

                  <td class="py-1.5 px-2 truncate">
                    <span
                      class="px-1 py-[1px] rounded text-[9px] font-bold"
                      :class="{
                        'bg-gray-800 text-gray-400 border border-gray-700': card.status === 'LEARNED' || card.status === 'PARKED' || card.status === 'DELETED',
                        'bg-amber-950/40 text-amber-400 border border-amber-800/40': card.status === 'LEARNING'
                      }"
                    >
                      {{ card.status }}
                    </span>
                  </td>

                  <td class="py-1.5 px-2 text-right text-gray-300 font-bold truncate">
                    {{ card.rank.toFixed(5) }}
                  </td>

                  <td class="py-1.5 px-2 text-gray-400 truncate">
                    {{ formatDateTime(card.lastTested) }}
                  </td>

                  <td class="py-1.5 px-2 text-center truncate">
                    <span
                      class="font-bold inline-block"
                      :class="[getTimeRemaining(card.nextTest, card.status, card.id).colorClass, getTimeRemaining(card.nextTest, card.status, card.id).bgClass]"
                    >
                      {{ getTimeRemaining(card.nextTest, card.status, card.id).text }}
                    </span>
                  </td>

                  <td class="py-1.5 px-2 text-gray-400 truncate" :title="card.pronunciation || ''">
                    {{ card.pronunciation || '-' }}
                  </td>

                  <td class="py-1.5 px-2 text-gray-400 truncate" :title="card.memoryHook || ''">
                    {{ card.memoryHook || '-' }}
                  </td>

                  <td class="py-1.5 px-2">
                    <div class="flex flex-wrap gap-1" style="max-height: 1.5em; overflow: hidden;" :title="card.tags.join(', ')">
                      <span
                        v-for="tag in card.tags"
                        :key="tag"
                        class="px-1 py-[1px] rounded bg-gray-800 text-gray-300 text-[9px]"
                      >
                        {{ tag }}
                      </span>
                      <span v-if="!card.tags || card.tags.length === 0" class="text-gray-500">-</span>
                    </div>
                  </td>
                </tr>

                <tr v-if="filteredAndSortedCards.length === 0">
                  <td colspan="9" class="p-8 text-center text-gray-500">
                    No flashcards found matching filter.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-3 bg-gray-900/40 border-t border-gray-900 text-[10px] text-gray-500 flex justify-between">
            <span>Total cards listed: {{ filteredAndSortedCards.length }}</span>
            <span>Sorting order: Rank descending, then ID ascending</span>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 3: USER MANAGEMENT & ROLE PERMISSIONS -->
      <!-- ========================================== -->
      <div v-else-if="activeTab === 'users'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-white">Registered Users & Roles</h2>
          <button
            @click="loadUsers"
            class="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg border border-gray-700 transition-colors"
          >
            Refresh Users
          </button>
        </div>

        <div v-if="isLoadingUsers" class="text-center py-16 text-xs font-mono text-gray-400">
          Loading users list...
        </div>

        <div v-else class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-gray-850 text-gray-400 font-bold border-b border-gray-800">
              <tr>
                <th class="py-3 px-4">NAME</th>
                <th class="py-3 px-4">EMAIL</th>
                <th class="py-3 px-4">ROLE</th>
                <th class="py-3 px-4 text-center">CARDS</th>
                <th class="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/60 text-gray-300">
              <tr v-for="u in usersList" :key="u.id" class="hover:bg-gray-800/40 transition-colors">
                <td class="py-3 px-4 font-semibold text-white">
                  {{ u.firstName }} {{ u.lastName }}
                </td>
                <td class="py-3 px-4 text-gray-400">
                  {{ u.email }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border"
                    :class="u.role === 'admin' ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' : 'bg-gray-800 text-gray-400 border-gray-700'"
                  >
                    {{ u.role }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center font-bold text-white">
                  {{ u._count?.flashcards ?? 0 }}
                </td>
                <td class="py-3 px-4 text-right">
                  <button
                    @click="openEditUserModal(u)"
                    class="px-2.5 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-amber-400 hover:text-amber-300 rounded border border-gray-700 transition-colors"
                  >
                    Edit Role
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODALS FOR USERS -->
    <!-- ========================================== -->

    <!-- User Edit Role Modal -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-white">Edit User Access</h3>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-400 mb-1">First Name</label>
            <input v-model="userForm.firstName" type="text" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>

          <div>
            <label class="block text-gray-400 mb-1">Last Name</label>
            <input v-model="userForm.lastName" type="text" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>

          <div>
            <label class="block text-gray-400 mb-1">System Role</label>
            <select
              v-model="userForm.role"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="member">member (Standard user - 100 phrases/day import limit)</option>
              <option value="admin">admin (Full Dev access & unlimited imports)</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="showUserModal = false" class="px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800 rounded">
            Cancel
          </button>
          <button @click="saveUser" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold">
            Save User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
