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

const activeTab = ref<'flashcard-flow' | 'versions' | 'users'>('flashcard-flow')

const isBackgroundLoading = ref(false)
const hasLoadedVersions = ref(false)
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
// 1. VERSIONS TAB STATE & ACTIONS
// ==========================================
interface VersionItem {
  id: string
  versionId: string
  type: 'FEATURE' | 'BUGFIX'
  status: 'PROPOSED' | 'IN_PROGRESS' | 'IMPLEMENTED'
  body: string
  orderWithinVersion: number
  startedByUser?: { firstName: string; lastName: string; email: string }
}

interface Version {
  id: string
  versionNumber: string
  status: 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE'
  publishDate?: string | null
  versionItems: VersionItem[]
}

const versions = ref<Version[]>([])
const isLoadingVersions = ref(false)

// Version Modal
const showVersionModal = ref(false)
const versionForm = ref({
  id: '',
  versionNumber: '',
  status: 'FUTURE' as 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE',
  publishDate: ''
})
const isEditingVersion = ref(false)

// Item Modal
const showItemModal = ref(false)
const itemForm = ref({
  id: '',
  versionId: '',
  afterItemId: '',
  type: 'BUGFIX' as 'FEATURE' | 'BUGFIX',
  status: 'PROPOSED' as 'PROPOSED' | 'IN_PROGRESS' | 'IMPLEMENTED',
  body: ''
})
const isEditingItem = ref(false)

const loadVersions = async () => {
  if (!hasLoadedVersions.value) {
    isLoadingVersions.value = true
  }
  try {
    const data = await $fetch<Version[]>('/api/dev/versions')
    versions.value = data
    hasLoadedVersions.value = true
  } catch (err) {
    console.error('Failed to load versions:', err)
  } finally {
    isLoadingVersions.value = false
  }
}

function formatPublishDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0] ?? ''
}

// Version CRUD
const openAddVersionModal = () => {
  isEditingVersion.value = false
  versionForm.value = { id: '', versionNumber: '', status: 'FUTURE', publishDate: '' }
  showVersionModal.value = true
}

const openEditVersionModal = (v: Version) => {
  isEditingVersion.value = true
  const formattedDate = formatPublishDate(v.publishDate)
  versionForm.value = { id: v.id, versionNumber: v.versionNumber, status: v.status, publishDate: formattedDate }
  showVersionModal.value = true
}

const saveVersion = async () => {
  if (!versionForm.value.versionNumber.trim()) return
  try {
    if (isEditingVersion.value) {
      await $fetch(`/api/dev/versions/${versionForm.value.id}`, {
        method: 'PUT',
        body: versionForm.value
      })
    } else {
      await $fetch('/api/dev/versions', {
        method: 'POST',
        body: versionForm.value
      })
    }
    showVersionModal.value = false
    await loadVersions()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to save version')
  }
}

const deleteVersion = async (v: Version) => {
  if (!confirm(`Are you sure you want to delete version ${v.versionNumber}? All items in it will be deleted.`)) return
  try {
    await $fetch(`/api/dev/versions/${v.id}`, { method: 'DELETE' })
    await loadVersions()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to delete version')
  }
}

// Item CRUD
const openAddItemModal = (versionId: string, afterItemId?: string) => {
  isEditingItem.value = false
  itemForm.value = { id: '', versionId, afterItemId: afterItemId || '', type: 'BUGFIX', status: 'PROPOSED', body: '' }
  showItemModal.value = true
}

const openEditItemModal = (item: VersionItem) => {
  isEditingItem.value = true
  itemForm.value = {
    id: item.id,
    versionId: item.versionId,
    afterItemId: '',
    type: item.type,
    status: item.status,
    body: item.body
  }
  showItemModal.value = true
}

const saveItem = async () => {
  if (!itemForm.value.body.trim()) return
  try {
    if (isEditingItem.value) {
      await $fetch(`/api/dev/version-items/${itemForm.value.id}`, {
        method: 'PUT',
        body: itemForm.value
      })
    } else {
      await $fetch('/api/dev/version-items', {
        method: 'POST',
        body: itemForm.value
      })
    }
    showItemModal.value = false
    await loadVersions()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to save version item')
  }
}

const deleteItem = async (item: VersionItem) => {
  if (!confirm('Are you sure you want to delete this item?')) return
  try {
    await $fetch(`/api/dev/version-items/${item.id}`, { method: 'DELETE' })
    await loadVersions()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to delete item')
  }
}

const reorderItem = async (itemId: string, direction: 'UP' | 'DOWN') => {
  try {
    await $fetch('/api/dev/version-items/reorder', {
      method: 'POST',
      body: { itemId, direction }
    })
    await loadVersions()
  } catch (err: any) {
    console.error('Failed to reorder:', err)
  }
}

// ==========================================
// 2. USERS TAB STATE & ACTIONS
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
              @click="activeTab = 'versions'"
              class="px-4 py-1.5 text-xs font-semibold rounded-md transition-all"
              :class="activeTab === 'versions' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
            >
              Versions
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
      <!-- TAB 1: VERSIONS & VERSION ITEMS MANAGEMENT -->
      <!-- ========================================== -->
      <div v-if="activeTab === 'versions'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-white">App Version Roadmap</h2>
          <button
            @click="openAddVersionModal"
            class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1 transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
            <span>New Version</span>
          </button>
        </div>

        <div v-if="isLoadingVersions" class="text-center py-16 text-xs font-mono text-gray-400">
          Loading version data...
        </div>

        <div v-else-if="versions.length === 0" class="py-8 text-gray-400 text-xs font-mono">
          No versions found. Click "New Version" to get started.
        </div>

        <!-- Minimal, just the facts Version List -->
        <div v-else class="space-y-6 text-sm text-gray-200">
          <div v-for="ver in versions" :key="ver.id" class="space-y-2">
            <!-- Minimal Version Title & Actions -->
            <div class="flex items-center space-x-3 text-base">
              <span class="font-bold font-mono text-white">v{{ ver.versionNumber }}</span>
              <span v-if="ver.publishDate" class="text-xs text-gray-400 font-sans">
                (Published {{ formatPublishDate(ver.publishDate) }})
              </span>
              <span class="text-gray-600 text-xs">|</span>
              <button @click="openEditVersionModal(ver)" class="text-xs text-amber-400 hover:underline">edit</button>
              <span class="text-gray-600 text-xs">|</span>
              <button @click="openAddItemModal(ver.id)" class="text-xs text-amber-400 hover:underline">add item</button>
              <span class="text-gray-600 text-xs">|</span>
              <button @click="deleteVersion(ver)" class="text-xs text-rose-400 hover:underline">delete</button>
            </div>

            <!-- Features Section -->
            <div v-if="ver.versionItems.filter(i => i.type === 'FEATURE').length > 0" class="pl-4 space-y-1">
              <h4 class="text-xs font-semibold text-gray-400">features</h4>
              <ul class="pl-5 list-disc space-y-1 text-xs text-gray-300">
                <li v-for="item in ver.versionItems.filter(i => i.type === 'FEATURE')" :key="item.id">
                  <div class="inline-flex items-center space-x-2">
                    <span>{{ item.body }}</span>
                    <span class="text-gray-500 text-[11px]">
                      (<button @click="reorderItem(item.id, 'UP')" class="hover:text-white">up</button> |
                      <button @click="reorderItem(item.id, 'DOWN')" class="hover:text-white">down</button> |
                      <button @click="openEditItemModal(item)" class="hover:text-white">edit</button> |
                      <button @click="deleteItem(item)" class="hover:text-rose-400">delete</button> |
                      <button @click="openAddItemModal(ver.id, item.id)" class="hover:text-amber-400">add</button>)
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Bug Fixes Section -->
            <div v-if="ver.versionItems.filter(i => i.type === 'BUGFIX').length > 0" class="pl-4 space-y-1">
              <h4 class="text-xs font-semibold text-gray-400">bug fixes</h4>
              <ul class="pl-5 list-disc space-y-1 text-xs text-gray-300">
                <li v-for="item in ver.versionItems.filter(i => i.type === 'BUGFIX')" :key="item.id">
                  <div class="inline-flex items-center space-x-2">
                    <span>{{ item.body }}</span>
                    <span class="text-gray-500 text-[11px]">
                      (<button @click="reorderItem(item.id, 'UP')" class="hover:text-white">up</button> |
                      <button @click="reorderItem(item.id, 'DOWN')" class="hover:text-white">down</button> |
                      <button @click="openEditItemModal(item)" class="hover:text-white">edit</button> |
                      <button @click="deleteItem(item)" class="hover:text-rose-400">delete</button> |
                      <button @click="openAddItemModal(ver.id, item.id)" class="hover:text-amber-400">add</button>)
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 2: FLASHCARD FLOW & TESTING DASHBOARD -->
      <!-- ========================================== -->
      <div v-else-if="activeTab === 'flashcard-flow'" class="space-y-6">
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
    <!-- MODALS FOR VERSIONS, ITEMS, USERS -->
    <!-- ========================================== -->

    <!-- Version Add/Edit Modal -->
    <div v-if="showVersionModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-white">{{ isEditingVersion ? 'Edit Version' : 'Create New Version' }}</h3>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-400 mb-1">Version Number (e.g. 0.3.0)</label>
            <input
              v-model="versionForm.versionNumber"
              type="text"
              placeholder="0.2.0"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block text-gray-400 mb-1">Publish Date (Optional)</label>
            <input
              v-model="versionForm.publishDate"
              type="date"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block text-gray-400 mb-1">Status</label>
            <select
              v-model="versionForm.status"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="FUTURE">FUTURE</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="showVersionModal = false" class="px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800 rounded">
            Cancel
          </button>
          <button @click="saveVersion" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold">
            Save Version
          </button>
        </div>
      </div>
    </div>

    <!-- Item Add/Edit Modal -->
    <div v-if="showItemModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-white">{{ isEditingItem ? 'Edit Version Item' : 'Add Item to Version' }}</h3>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-400 mb-1">Type</label>
              <select
                v-model="itemForm.type"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="BUGFIX">🐛 BUGFIX</option>
                <option value="FEATURE">✨ FEATURE</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 mb-1">Status</label>
              <select
                v-model="itemForm.status"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="PROPOSED">PROPOSED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="IMPLEMENTED">IMPLEMENTED</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-gray-400 mb-1">Description / Body</label>
            <textarea
              v-model="itemForm.body"
              rows="3"
              placeholder="Describe the feature or bug fix..."
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="showItemModal = false" class="px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800 rounded">
            Cancel
          </button>
          <button @click="saveItem" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold">
            Save Item
          </button>
        </div>
      </div>
    </div>

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
