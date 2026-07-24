<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  SparklesIcon,
  WrenchScrewdriverIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  ForwardIcon,
  BoltIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - About & Roadmap',
  meta: [
    { name: 'description', content: 'LangLearn takes advantage of modern, free tools like Google Translate, AI search, to help you learn languages faster.' }
  ]
})

interface VersionItem {
  id: string
  versionId: string
  type: 'FEATURE' | 'BUGFIX'
  status: 'PROPOSED' | 'IN_PROGRESS' | 'IMPLEMENTED'
  body: string
  orderWithinVersion: number
}

interface Version {
  id: string
  versionNumber: string
  status: 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE'
  publishDate?: string | null
  versionItems: VersionItem[]
}

const versions = ref<Version[]>([])
const isLoading = ref(true)
const isAdmin = ref(false)

// Edit Modals for Admin
const showEditItemModal = ref(false)
const editingItem = ref<{ id: string; versionId: string; afterItemId: string; body: string; type: 'FEATURE' | 'BUGFIX'; status: 'PROPOSED' | 'IN_PROGRESS' | 'IMPLEMENTED' }>({
  id: '', versionId: '', afterItemId: '', body: '', type: 'BUGFIX', status: 'PROPOSED'
})
const isNewItem = ref(false)

const showEditVersionModal = ref(false)
const editingVersion = ref<{ id: string; versionNumber: string; status: 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE'; publishDate: string }>({
  id: '', versionNumber: '', status: 'FUTURE', publishDate: ''
})
const isNewVersion = ref(false)

const loadData = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<Version[]>('/api/versions/public')
    versions.value = data

    try {
      const me = await $fetch<{ role: string }>('/api/user/me')
      if (me?.role === 'admin') {
        isAdmin.value = true
      }
    } catch {
      isAdmin.value = false
    }
  } catch (err) {
    console.error('Failed to load public versions roadmap:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

function formatPublishDate(dateStr: string | null | undefined) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0] ?? ''
}

const openAddVersion = () => {
  isNewVersion.value = true
  editingVersion.value = { id: '', versionNumber: '', status: 'FUTURE', publishDate: '' }
  showEditVersionModal.value = true
}

const openEditVersion = (ver: Version) => {
  isNewVersion.value = false
  const formattedDate = formatPublishDate(ver.publishDate)
  editingVersion.value = { id: ver.id, versionNumber: ver.versionNumber, status: ver.status, publishDate: formattedDate }
  showEditVersionModal.value = true
}

const saveAdminVersion = async () => {
  if (!editingVersion.value.versionNumber.trim()) return
  try {
    if (isNewVersion.value) {
      await $fetch('/api/dev/versions', {
        method: 'POST',
        body: editingVersion.value
      })
    } else {
      await $fetch(`/api/dev/versions/${editingVersion.value.id}`, {
        method: 'PUT',
        body: editingVersion.value
      })
    }
    showEditVersionModal.value = false
    await loadData()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to save version')
  }
}

const deleteVersion = async (ver: Version) => {
  if (!confirm(`Are you sure you want to delete version ${ver.versionNumber}?`)) return
  try {
    await $fetch(`/api/dev/versions/${ver.id}`, { method: 'DELETE' })
    await loadData()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to delete version')
  }
}

const openAddItem = (versionId: string, afterItemId?: string) => {
  isNewItem.value = true
  editingItem.value = { id: '', versionId, afterItemId: afterItemId || '', body: '', type: 'BUGFIX', status: 'PROPOSED' }
  showEditItemModal.value = true
}

const openEditItem = (item: VersionItem) => {
  isNewItem.value = false
  editingItem.value = { id: item.id, versionId: item.versionId, afterItemId: '', body: item.body, type: item.type, status: item.status }
  showEditItemModal.value = true
}

const saveAdminItem = async () => {
  if (!editingItem.value.body.trim()) return
  try {
    if (isNewItem.value) {
      await $fetch('/api/dev/version-items', {
        method: 'POST',
        body: editingItem.value
      })
    } else {
      await $fetch(`/api/dev/version-items/${editingItem.value.id}`, {
        method: 'PUT',
        body: editingItem.value
      })
    }
    showEditItemModal.value = false
    await loadData()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to save item')
  }
}

const deleteItem = async (item: VersionItem) => {
  if (!confirm('Are you sure you want to delete this item?')) return
  try {
    await $fetch(`/api/dev/version-items/${item.id}`, { method: 'DELETE' })
    await loadData()
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
    await loadData()
  } catch (err: any) {
    console.error('Failed to reorder:', err)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-10 px-4 min-h-[600px] space-y-12">
    <!-- 1. INTRODUCTORY HERO SECTION -->
    <div class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center gap-6 md:gap-8">
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

      <!-- Right: Text Description -->
      <div class="space-y-2 text-center md:text-left">
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white">About LangLearn</h1>
        <p class="text-sm md:text-base text-gray-300 font-medium leading-relaxed">
          LangLearn takes advantage of modern, free tools like Google Translate, AI search, to help you learn languages faster and in a more self-directed, personal approach.
        </p>
      </div>
    </div>

    <!-- 2. VERSIONS ROADMAP & BUG FIXES DISPLAY -->
    <div class="space-y-6">
      <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Release History & Roadmap</span>
        </h2>
        <div class="flex items-center space-x-3">
          <button
            v-if="isAdmin"
            @click="openAddVersion"
            class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            + New Version
          </button>
          <span v-if="isAdmin" class="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
            ✏️ Admin Edit Mode Active
          </span>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
        Loading versions roadmap...
      </div>

      <div v-else-if="versions.length === 0" class="py-6 text-gray-500 text-sm">
        No versions published yet.
      </div>

      <!-- Minimal, just the facts Version List -->
      <div v-else class="space-y-6 text-sm text-gray-800 dark:text-gray-200">
        <div v-for="ver in versions" :key="ver.id" class="space-y-2">
          <!-- Minimal Version Title -->
          <div class="flex items-center space-x-3 text-base">
            <span class="font-bold font-mono text-gray-900 dark:text-white">v{{ ver.versionNumber }}</span>
            <span v-if="ver.publishDate" class="text-xs text-gray-500 dark:text-gray-400 font-sans">
              (Published {{ formatPublishDate(ver.publishDate) }})
            </span>
            <template v-if="isAdmin">
              <span class="text-gray-400 text-xs">|</span>
              <button @click="openEditVersion(ver)" class="text-xs text-amber-600 dark:text-amber-400 hover:underline">edit</button>
              <span class="text-gray-400 text-xs">|</span>
              <button @click="openAddItem(ver.id)" class="text-xs text-amber-600 dark:text-amber-400 hover:underline">add item</button>
              <span class="text-gray-400 text-xs">|</span>
              <button @click="deleteVersion(ver)" class="text-xs text-rose-600 dark:text-rose-400 hover:underline">delete</button>
            </template>
          </div>

          <!-- Features Section -->
          <div v-if="ver.versionItems.filter(i => i.type === 'FEATURE').length > 0" class="pl-4 space-y-1">
            <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400">features</h4>
            <ul class="pl-5 list-disc space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li v-for="item in ver.versionItems.filter(i => i.type === 'FEATURE')" :key="item.id">
                <div class="inline-flex items-center space-x-2">
                  <span>{{ item.body }}</span>
                  <span v-if="isAdmin" class="text-gray-400 dark:text-gray-500 text-[11px]">
                    (<button @click="reorderItem(item.id, 'UP')" class="hover:text-black dark:hover:text-white">up</button> |
                    <button @click="reorderItem(item.id, 'DOWN')" class="hover:text-black dark:hover:text-white">down</button> |
                    <button @click="openEditItem(item)" class="hover:text-black dark:hover:text-white">edit</button> |
                    <button @click="deleteItem(item)" class="hover:text-rose-500">delete</button> |
                    <button @click="openAddItem(ver.id, item.id)" class="hover:text-amber-500">add</button>)
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Bug Fixes Section -->
          <div v-if="ver.versionItems.filter(i => i.type === 'BUGFIX').length > 0" class="pl-4 space-y-1">
            <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400">bug fixes</h4>
            <ul class="pl-5 list-disc space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li v-for="item in ver.versionItems.filter(i => i.type === 'BUGFIX')" :key="item.id">
                <div class="inline-flex items-center space-x-2">
                  <span>{{ item.body }}</span>
                  <span v-if="isAdmin" class="text-gray-400 dark:text-gray-500 text-[11px]">
                    (<button @click="reorderItem(item.id, 'UP')" class="hover:text-black dark:hover:text-white">up</button> |
                    <button @click="reorderItem(item.id, 'DOWN')" class="hover:text-black dark:hover:text-white">down</button> |
                    <button @click="openEditItem(item)" class="hover:text-black dark:hover:text-white">edit</button> |
                    <button @click="deleteItem(item)" class="hover:text-rose-500">delete</button> |
                    <button @click="openAddItem(ver.id, item.id)" class="hover:text-amber-500">add</button>)
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Edit Version Modal -->
    <div v-if="showEditVersionModal && editingVersion" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isNewVersion ? 'Admin Create: Version' : 'Admin Edit: Version' }}</h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Version Number</label>
            <input v-model="editingVersion.versionNumber" type="text" placeholder="0.3.0" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Publish Date (Optional)</label>
            <input v-model="editingVersion.publishDate" type="date" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select v-model="editingVersion.status" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
              <option value="FUTURE">FUTURE</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-2 pt-2">
          <button @click="showEditVersionModal = false" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
          <button @click="saveAdminVersion" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold">Save</button>
        </div>
      </div>
    </div>

    <!-- Admin Edit Item Modal -->
    <div v-if="showEditItemModal && editingItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isNewItem ? 'Admin Add: Roadmap Item' : 'Admin Edit: Roadmap Item' }}</h3>
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select v-model="editingItem.type" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option value="BUGFIX">🐛 BUGFIX</option>
                <option value="FEATURE">✨ FEATURE</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select v-model="editingItem.status" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option value="PROPOSED">PROPOSED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="IMPLEMENTED">IMPLEMENTED</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Description / Body</label>
            <textarea v-model="editingItem.body" rows="3" placeholder="Describe the feature or bug fix..." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 pt-2">
          <button @click="showEditItemModal = false" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
          <button @click="saveAdminItem" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
