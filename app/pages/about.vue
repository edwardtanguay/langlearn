<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BoltIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - About & Roadmap',
  meta: [
    { name: 'description', content: 'LangLearn integrates modern, no-cost tools like Google Translate and AI search into your language learning flow to help you learn languages faster and with a self-directed, personal approach.' }
  ]
})

interface VersionItem {
  id: string
  versionId: string | null
  type: 'FEATURE' | 'BUGFIX'
  body: string
  orderWithinVersion: number
}

interface Version {
  id: string
  versionNumber: string
  title?: string | null
  status: 'PUBLISHED' | 'IN_PROGRESS'
  publishDate?: string | null
  versionItems: VersionItem[]
}

const versions = ref<Version[]>([])
const unassignedItems = ref<VersionItem[]>([])
const isLoading = ref(true)
const isAdmin = ref(false)
const adminEditMode = ref(false)

// Edit Modals for Admin
const showEditItemModal = ref(false)
const editingItem = ref<{ id: string; versionId: string; afterItemId: string; body: string; type: 'FEATURE' | 'BUGFIX' }>({
  id: '', versionId: 'none', afterItemId: '', body: '', type: 'BUGFIX'
})
const isNewItem = ref(false)

const showEditVersionModal = ref(false)
const editingVersion = ref<{ id: string; versionNumber: string; title: string; status: 'PUBLISHED' | 'IN_PROGRESS'; publishDate: string }>({
  id: '', versionNumber: '', title: '', status: 'IN_PROGRESS', publishDate: ''
})
const isNewVersion = ref(false)

const loadData = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<{ versions: Version[]; unassignedItems: VersionItem[] }>('/api/versions/public')
    versions.value = data.versions || []
    unassignedItems.value = data.unassignedItems || []

    try {
      const me = await $fetch<{ role: string }>('/api/user/me')
      if (me?.role === 'admin') {
        isAdmin.value = true
      }
    } catch {
      isAdmin.value = false
    }
  } catch (err) {
    console.error('Failed to load versions history:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const displayedVersions = computed(() => {
  let list = [...versions.value]
  if (!isAdmin.value) {
    list = list.filter(v => v.status !== 'IN_PROGRESS')
  }
  if (adminEditMode.value) {
    list.sort((a, b) => {
      if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1
      if (a.status !== 'IN_PROGRESS' && b.status === 'IN_PROGRESS') return 1
      return 0
    })
  }
  return list
})

function formatPublishDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0] ?? ''
}

function getRelativeDateStr(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const pubDate = new Date(dateStr)
  if (isNaN(pubDate.getTime())) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(pubDate)
  target.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - target.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '(today)'
  if (diffDays === 1) return '(yesterday)'
  if (diffDays > 1) return `(${diffDays} days ago)`
  if (diffDays < 0) return `(in ${Math.abs(diffDays)} days)`
  return ''
}

const openAddVersion = () => {
  isNewVersion.value = true
  editingVersion.value = { id: '', versionNumber: '', title: '', status: 'IN_PROGRESS', publishDate: '' }
  showEditVersionModal.value = true
}

const openEditVersion = (ver: Version) => {
  isNewVersion.value = false
  const formattedDate = formatPublishDate(ver.publishDate)
  editingVersion.value = { id: ver.id, versionNumber: ver.versionNumber, title: ver.title || '', status: ver.status, publishDate: formattedDate }
  showEditVersionModal.value = true
}

const saveAdminVersion = async () => {
  if (!editingVersion.value.versionNumber.trim()) return
  const snapshot = JSON.parse(JSON.stringify(versions.value))
  const targetId = editingVersion.value.id
  const payload = { ...editingVersion.value }

  if (isNewVersion.value) {
    const tempId = 'temp-' + Date.now()
    const newVer: Version = {
      id: tempId,
      versionNumber: payload.versionNumber.trim(),
      title: payload.title.trim() || null,
      status: payload.status,
      publishDate: payload.publishDate || null,
      versionItems: []
    }
    versions.value.unshift(newVer)
    showEditVersionModal.value = false

    try {
      const created = await $fetch<Version>('/api/dev/versions', {
        method: 'POST',
        body: payload
      })
      const idx = versions.value.findIndex(v => v.id === tempId)
      if (idx !== -1) versions.value[idx] = created
    } catch (err: any) {
      versions.value = snapshot
      alert(err.data?.statusMessage || 'Failed to save version')
    }
  } else {
    const existing = versions.value.find(v => v.id === targetId)
    if (existing) {
      existing.versionNumber = payload.versionNumber.trim()
      existing.title = payload.title.trim() || null
      existing.status = payload.status
      existing.publishDate = payload.publishDate || null
    }
    showEditVersionModal.value = false

    try {
      const updated = await $fetch<Version>(`/api/dev/versions/${targetId}`, {
        method: 'PUT',
        body: payload
      })
      if (existing) {
        Object.assign(existing, updated)
      }
    } catch (err: any) {
      versions.value = snapshot
      alert(err.data?.statusMessage || 'Failed to save version')
    }
  }
}

const deleteVersion = async (ver: Version) => {
  if (!confirm(`Are you sure you want to delete version ${ver.versionNumber}?`)) return
  const snapshot = JSON.parse(JSON.stringify(versions.value))
  versions.value = versions.value.filter(v => v.id !== ver.id)
  try {
    await $fetch(`/api/dev/versions/${ver.id}`, { method: 'DELETE' })
  } catch (err: any) {
    versions.value = snapshot
    alert(err.data?.statusMessage || 'Failed to delete version')
  }
}

const openAddItem = (versionId: string | null, afterItemId?: string) => {
  isNewItem.value = true
  editingItem.value = { id: '', versionId: versionId || 'none', afterItemId: afterItemId || '', body: '', type: 'BUGFIX' }
  showEditItemModal.value = true
}

const openEditItem = (item: VersionItem) => {
  isNewItem.value = false
  editingItem.value = { id: item.id, versionId: item.versionId || 'none', afterItemId: '', body: item.body, type: item.type }
  showEditItemModal.value = true
}

const saveAdminItem = async () => {
  if (!editingItem.value.body.trim()) return
  showEditItemModal.value = false

  try {
    const payload = {
      ...editingItem.value,
      versionId: editingItem.value.versionId === 'none' ? null : editingItem.value.versionId
    }

    if (isNewItem.value) {
      await $fetch<VersionItem>('/api/dev/version-items', {
        method: 'POST',
        body: payload
      })
    } else {
      await $fetch(`/api/dev/version-items/${payload.id}`, {
        method: 'PUT',
        body: payload
      })
    }
    await loadData()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to save item')
  }
}

const deleteItem = async (item: VersionItem) => {
  if (!confirm('Are you sure you want to delete this item?')) return
  try {
    if (item.versionId === null) {
      unassignedItems.value = unassignedItems.value.filter(i => i.id !== item.id)
    } else {
      for (const v of versions.value) {
        v.versionItems = v.versionItems.filter(i => i.id !== item.id)
      }
    }
    await $fetch(`/api/dev/version-items/${item.id}`, { method: 'DELETE' })
  } catch (err: any) {
    await loadData()
    alert(err.data?.statusMessage || 'Failed to delete item')
  }
}

const reorderItem = async (itemId: string, direction: 'UP' | 'DOWN') => {
  // Find item in unassignedItems or within versions
  let list: VersionItem[] | null = null
  let idx = unassignedItems.value.findIndex(i => i.id === itemId)
  if (idx !== -1) {
    list = unassignedItems.value
  } else {
    for (const v of versions.value) {
      const i = v.versionItems.findIndex(item => item.id === itemId)
      if (i !== -1) {
        list = v.versionItems
        idx = i
        break
      }
    }
  }

  if (!list || idx === -1) return

  const currentItem = list[idx]
  if (!currentItem) return

  const itemType = currentItem.type
  // Filter matching type items to find relative swap neighbor
  const typeIndices: number[] = []
  list.forEach((item, index) => {
    if (item.type === itemType) typeIndices.push(index)
  })

  const posInTypeGroup = typeIndices.indexOf(idx)
  if (posInTypeGroup === -1) return

  const targetPosInGroup = direction === 'UP' ? posInTypeGroup - 1 : posInTypeGroup + 1
  if (targetPosInGroup < 0 || targetPosInGroup >= typeIndices.length) return

  const targetIdx = typeIndices[targetPosInGroup]
  if (targetIdx === undefined) return

  // Optimistic in-place swap
  const temp = list[idx]
  if (temp && list[targetIdx]) {
    list[idx] = list[targetIdx]
    list[targetIdx] = temp
  }

  try {
    await $fetch('/api/dev/version-items/reorder', {
      method: 'POST',
      body: { itemId, direction }
    })
  } catch (err: any) {
    console.error('Failed to reorder:', err)
    await loadData()
  }
}

const isFirstInList = (item: VersionItem, list: VersionItem[]): boolean => {
  return list.length > 0 && list[0]?.id === item.id
}

const isLastInList = (item: VersionItem, list: VersionItem[]): boolean => {
  return list.length > 0 && list[list.length - 1]?.id === item.id
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-10 px-4 min-h-[600px] space-y-12">
    <!-- 1. INTRODUCTORY HERO SECTION -->
    <div class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-8">
      <!-- Left: Fast Flashcards Symbol -->
      <div class="shrink-0 relative group flex items-center justify-center p-2">
        <div class="absolute -top-1 -right-1 z-10">
          <BoltIcon class="w-6 h-6 text-amber-400 animate-pulse drop-shadow-md" />
        </div>
        <!-- Flat Geometric Overlapping Flashcard Stack SVG with Tech Gradient -->
        <svg class="w-24 h-24 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cardGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.4" />
            </linearGradient>
            <linearGradient id="cardGradMid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ea580c" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#d97706" stop-opacity="0.7" />
            </linearGradient>
            <linearGradient id="cardGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
            <linearGradient id="techLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#fef3c7" stop-opacity="0.4" />
            </linearGradient>
          </defs>

          <!-- Back Card (Layer 1 - Violet/Indigo accent) -->
          <rect x="22" y="14" width="56" height="42" rx="8" fill="url(#cardGradBack)" transform="rotate(-12 50 35)" />
          
          <!-- Middle Card (Layer 2 - Orange accent) -->
          <rect x="24" y="24" width="56" height="42" rx="8" fill="url(#cardGradMid)" transform="rotate(-4 52 45)" />

          <!-- Front Main Card (Layer 3 - Amber Tech Gradient) -->
          <rect x="24" y="36" width="58" height="44" rx="8" fill="url(#cardGradFront)" class="drop-shadow-lg" />
          
          <!-- Geometric tech lines & text simulation on front card -->
          <rect x="32" y="46" width="28" height="5" rx="2.5" fill="url(#techLineGrad)" />
          <rect x="32" y="55" width="42" height="4" rx="2" fill="url(#techLineGrad)" opacity="0.75" />
          <rect x="32" y="63" width="20" height="4" rx="2" fill="url(#techLineGrad)" opacity="0.5" />
          <circle cx="68" cy="48.5" r="3.5" fill="#ffffff" opacity="0.9" />
        </svg>
      </div>

      <!-- Right: Text Description & Author Link -->
      <div class="flex-1 flex flex-col md:flex-row md:items-start justify-between gap-4 text-center md:text-left w-full">
        <div class="space-y-2 max-w-2xl">
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white">About LangLearn</h1>
          <p class="text-sm md:text-base text-gray-300 font-medium leading-relaxed">
            LangLearn integrates modern, no-cost tools like Google Translate and AI search into your language learning flow to help you learn languages faster and with a self-directed, personal approach.
          </p>
        </div>
        <div class="pt-1 md:pt-0 text-xs text-gray-400 font-medium shrink-0 md:text-right">
          More projects by <a href="https://tanguay.info" target="_blank" rel="noopener noreferrer" class="text-white underline hover:text-amber-300 transition-colors">Edward</a>
        </div>
      </div>
    </div>

    <!-- 2. VERSIONS DISPLAY -->
    <div class="space-y-6">
      <div class="flex items-start justify-between">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Version History</span>
        </h2>
        <div v-if="isAdmin" class="hidden md:flex items-center space-x-3">
          <button
            v-if="adminEditMode"
            @click="openAddVersion"
            class="px-2.5 py-1 text-xs text-gray-300 dark:text-gray-400 hover:text-white bg-gray-800 dark:bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 transition-colors"
          >
            + New Version
          </button>
          <label class="inline-flex items-center gap-2 cursor-pointer text-xs text-gray-400 select-none">
            <input
              type="checkbox"
              v-model="adminEditMode"
              class="sr-only peer"
            />
            <div class="relative w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
            <span class="font-medium" :class="adminEditMode ? 'text-white' : 'text-gray-400'">Admin Edit</span>
          </label>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
        Loading version history...
      </div>

      <div v-else-if="displayedVersions.length === 0 && (!isAdmin || unassignedItems.length === 0)" class="py-6 text-gray-500 text-sm">
        No versions published yet.
      </div>

      <!-- Version Cards List -->
      <div v-else class="space-y-8 text-sm text-gray-800 dark:text-gray-200">
        
        <!-- Proposed Features & Bug Fixes (Admin section for unassigned items) -->
        <div v-if="isAdmin" class="space-y-3">
          <div class="bg-amber-950/30 dark:bg-amber-950/20 border border-amber-800/40 rounded-xl p-2.5 md:p-3.5 shadow-sm space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <div class="flex items-center space-x-2.5">
                <span class="font-bold text-amber-400 text-base md:text-lg">
                  Proposed features & bug fixes
                </span>
                <span class="text-xs font-mono text-amber-400/70">
                  ({{ unassignedItems.length }} unassigned)
                </span>
              </div>
            </div>
            <div v-if="adminEditMode" class="text-xs text-gray-400 shrink-0 font-mono text-right pt-1">
              ( <button @click="openAddItem(null, 'TOP')" class="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">add item</button> )
            </div>
          </div>

          <div v-if="unassignedItems.length === 0" class="pl-3 text-xs text-gray-500 italic">
            No proposed features or bug fixes yet.
          </div>

          <!-- Unassigned Items List -->
          <div v-else class="pl-2 pr-2 space-y-3">
            <!-- Features Section -->
            <div v-if="unassignedItems.filter(i => i.type === 'FEATURE').length > 0" class="space-y-1.5">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">features</h4>
              <ul class="space-y-1.5 text-xs text-gray-300">
                <li v-for="item in unassignedItems.filter(i => i.type === 'FEATURE')" :key="item.id" class="flex items-start justify-between gap-4 py-0.5">
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <span class="shrink-0 text-gray-400 select-none">•</span>
                    <span class="flex-1 break-words">{{ item.body }}</span>
                  </div>
                  <span v-if="adminEditMode" class="text-gray-400 shrink-0 text-[11px] font-mono whitespace-nowrap">
                    ( 
                    <button 
                      @click="!isFirstInList(item, unassignedItems.filter(i => i.type === 'FEATURE')) && reorderItem(item.id, 'UP')" 
                      :disabled="isFirstInList(item, unassignedItems.filter(i => i.type === 'FEATURE'))" 
                      :class="isFirstInList(item, unassignedItems.filter(i => i.type === 'FEATURE')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >up</button> | 
                    <button 
                      @click="!isLastInList(item, unassignedItems.filter(i => i.type === 'FEATURE')) && reorderItem(item.id, 'DOWN')" 
                      :disabled="isLastInList(item, unassignedItems.filter(i => i.type === 'FEATURE'))" 
                      :class="isLastInList(item, unassignedItems.filter(i => i.type === 'FEATURE')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >down</button> | 
                    <button @click="openEditItem(item)" class="hover:text-white cursor-pointer">edit</button> | 
                    <button @click="deleteItem(item)" class="text-red-400 hover:text-red-300 cursor-pointer">delete</button> | 
                    <button @click="openAddItem(null, item.id)" class="text-emerald-400 hover:text-emerald-300 cursor-pointer">add item</button> 
                    )
                  </span>
                </li>
              </ul>
            </div>

            <!-- Bug Fixes Section -->
            <div v-if="unassignedItems.filter(i => i.type === 'BUGFIX').length > 0" class="space-y-1.5">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">bug fixes</h4>
              <ul class="space-y-1.5 text-xs text-gray-300">
                <li v-for="item in unassignedItems.filter(i => i.type === 'BUGFIX')" :key="item.id" class="flex items-start justify-between gap-4 py-0.5">
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <span class="shrink-0 text-gray-400 select-none">•</span>
                    <span class="flex-1 break-words">{{ item.body }}</span>
                  </div>
                  <span v-if="adminEditMode" class="text-gray-400 shrink-0 text-[11px] font-mono whitespace-nowrap">
                    ( 
                    <button 
                      @click="!isFirstInList(item, unassignedItems.filter(i => i.type === 'BUGFIX')) && reorderItem(item.id, 'UP')" 
                      :disabled="isFirstInList(item, unassignedItems.filter(i => i.type === 'BUGFIX'))" 
                      :class="isFirstInList(item, unassignedItems.filter(i => i.type === 'BUGFIX')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >up</button> | 
                    <button 
                      @click="!isLastInList(item, unassignedItems.filter(i => i.type === 'BUGFIX')) && reorderItem(item.id, 'DOWN')" 
                      :disabled="isLastInList(item, unassignedItems.filter(i => i.type === 'BUGFIX'))" 
                      :class="isLastInList(item, unassignedItems.filter(i => i.type === 'BUGFIX')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >down</button> | 
                    <button @click="openEditItem(item)" class="hover:text-white cursor-pointer">edit</button> | 
                    <button @click="deleteItem(item)" class="text-red-400 hover:text-red-300 cursor-pointer">delete</button> | 
                    <button @click="openAddItem(null, item.id)" class="text-emerald-400 hover:text-emerald-300 cursor-pointer">add item</button> 
                    )
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Standard Version Cards -->
        <div v-for="ver in displayedVersions" :key="ver.id" class="space-y-3">
          <!-- Full-Width Version Panel Card -->
          <div class="bg-gray-800/40 dark:bg-gray-800/40 rounded-xl p-2.5 md:p-3.5 shadow-sm space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <div class="flex items-baseline space-x-2.5">
                <span class="font-mono font-bold text-amber-400 text-base md:text-lg">
                  v{{ ver.versionNumber }}
                </span>
                <span v-if="ver.title" class="font-bold text-white text-base md:text-lg">
                  {{ ver.title }}
                </span>
              </div>
              <div v-if="ver.publishDate" class="text-xs sm:text-sm text-gray-400 font-mono shrink-0">
                {{ formatPublishDate(ver.publishDate) }} {{ getRelativeDateStr(ver.publishDate) }}
              </div>
            </div>

            <!-- Right-aligned Version CRUD Actions -->
            <div v-if="isAdmin && adminEditMode" class="text-xs text-gray-400 shrink-0 font-mono text-right pt-1">
              ( <button @click="openEditVersion(ver)" class="hover:text-white cursor-pointer transition-colors">edit</button> | <button @click="deleteVersion(ver)" class="text-red-400 hover:text-red-300 cursor-pointer transition-colors">delete</button> | <button @click="openAddItem(ver.id, 'TOP')" class="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">add item</button> )
            </div>
          </div>

          <!-- Version Items (Features & Bug Fixes OUTSIDE panel) -->
          <div class="pl-2 pr-2 space-y-3">
            <!-- Features Section -->
            <div v-if="ver.versionItems.filter(i => i.type === 'FEATURE').length > 0" class="space-y-1.5">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">features</h4>
              <ul class="space-y-1.5 text-xs text-gray-300">
                <li v-for="item in ver.versionItems.filter(i => i.type === 'FEATURE')" :key="item.id" class="flex items-start justify-between gap-4 py-0.5">
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <span class="shrink-0 text-gray-400 select-none">•</span>
                    <span class="flex-1 break-words">{{ item.body }}</span>
                  </div>
                  <span v-if="isAdmin && adminEditMode" class="text-gray-400 shrink-0 text-[11px] font-mono whitespace-nowrap">
                    ( 
                    <button 
                      @click="!isFirstInList(item, ver.versionItems.filter(i => i.type === 'FEATURE')) && reorderItem(item.id, 'UP')" 
                      :disabled="isFirstInList(item, ver.versionItems.filter(i => i.type === 'FEATURE'))" 
                      :class="isFirstInList(item, ver.versionItems.filter(i => i.type === 'FEATURE')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >up</button> | 
                    <button 
                      @click="!isLastInList(item, ver.versionItems.filter(i => i.type === 'FEATURE')) && reorderItem(item.id, 'DOWN')" 
                      :disabled="isLastInList(item, ver.versionItems.filter(i => i.type === 'FEATURE'))" 
                      :class="isLastInList(item, ver.versionItems.filter(i => i.type === 'FEATURE')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >down</button> | 
                    <button @click="openEditItem(item)" class="hover:text-white cursor-pointer">edit</button> | 
                    <button @click="deleteItem(item)" class="text-red-400 hover:text-red-300 cursor-pointer">delete</button> | 
                    <button @click="openAddItem(ver.id, item.id)" class="text-emerald-400 hover:text-emerald-300 cursor-pointer">add item</button> 
                    )
                  </span>
                </li>
              </ul>
            </div>

            <!-- Bug Fixes Section -->
            <div v-if="ver.versionItems.filter(i => i.type === 'BUGFIX').length > 0" class="space-y-1.5">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">bug fixes</h4>
              <ul class="space-y-1.5 text-xs text-gray-300">
                <li v-for="item in ver.versionItems.filter(i => i.type === 'BUGFIX')" :key="item.id" class="flex items-start justify-between gap-4 py-0.5">
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <span class="shrink-0 text-gray-400 select-none">•</span>
                    <span class="flex-1 break-words">{{ item.body }}</span>
                  </div>
                  <span v-if="isAdmin && adminEditMode" class="text-gray-400 shrink-0 text-[11px] font-mono whitespace-nowrap">
                    ( 
                    <button 
                      @click="!isFirstInList(item, ver.versionItems.filter(i => i.type === 'BUGFIX')) && reorderItem(item.id, 'UP')" 
                      :disabled="isFirstInList(item, ver.versionItems.filter(i => i.type === 'BUGFIX'))" 
                      :class="isFirstInList(item, ver.versionItems.filter(i => i.type === 'BUGFIX')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >up</button> | 
                    <button 
                      @click="!isLastInList(item, ver.versionItems.filter(i => i.type === 'BUGFIX')) && reorderItem(item.id, 'DOWN')" 
                      :disabled="isLastInList(item, ver.versionItems.filter(i => i.type === 'BUGFIX'))" 
                      :class="isLastInList(item, ver.versionItems.filter(i => i.type === 'BUGFIX')) ? 'text-gray-600 dark:text-gray-600 opacity-40 cursor-not-allowed' : 'hover:text-white cursor-pointer'"
                    >down</button> | 
                    <button @click="openEditItem(item)" class="hover:text-white cursor-pointer">edit</button> | 
                    <button @click="deleteItem(item)" class="text-red-400 hover:text-red-300 cursor-pointer">delete</button> | 
                    <button @click="openAddItem(ver.id, item.id)" class="text-emerald-400 hover:text-emerald-300 cursor-pointer">add item</button> 
                    )
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Edit Version Modal -->
    <div v-if="showEditVersionModal && editingVersion" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isNewVersion ? 'Admin Create: Version' : 'Admin Edit: Version' }}</h3>
        <form @submit.prevent="saveAdminVersion" class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Version Number</label>
            <input v-model="editingVersion.versionNumber" @keydown.enter.exact.prevent="saveAdminVersion" type="text" placeholder="0.3.0" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Version Title</label>
            <input v-model="editingVersion.title" @keydown.enter.exact.prevent="saveAdminVersion" type="text" placeholder="Added version history" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Publish Date (YYYY-MM-DD)</label>
            <input v-model="editingVersion.publishDate" @keydown.enter.exact.prevent="saveAdminVersion" type="date" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select v-model="editingVersion.status" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="showEditVersionModal = false" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
            <button type="submit" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Admin Edit Item Modal -->
    <div v-if="showEditItemModal && editingItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isNewItem ? 'Admin Add: Roadmap Item' : 'Admin Edit: Roadmap Item' }}</h3>
        <form @submit.prevent="saveAdminItem" class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select v-model="editingItem.type" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option value="BUGFIX">🐛 BUGFIX</option>
                <option value="FEATURE">✨ FEATURE</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Version</label>
              <select v-model="editingItem.versionId" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option value="none">none (Proposed)</option>
                <option v-for="ver in versions" :key="ver.id" :value="ver.id">
                  v{{ ver.versionNumber }} {{ ver.title ? `- ${ver.title}` : '' }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Description / Body</label>
            <textarea v-model="editingItem.body" @keydown.enter.exact.prevent="saveAdminItem" rows="3" placeholder="Describe the feature or bug fix..." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"></textarea>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="showEditItemModal = false" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
            <button type="submit" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
