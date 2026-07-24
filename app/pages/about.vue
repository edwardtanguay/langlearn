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
  versionItems: VersionItem[]
}

const versions = ref<Version[]>([])
const isLoading = ref(true)
const isAdmin = ref(false)

// Edit Modals for Admin
const showEditItemModal = ref(false)
const editingItem = ref<{ id: string; body: string; type: 'FEATURE' | 'BUGFIX'; status: 'PROPOSED' | 'IN_PROGRESS' | 'IMPLEMENTED' } | null>(null)

const showEditVersionModal = ref(false)
const editingVersion = ref<{ id: string; versionNumber: string; status: 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE' } | null>(null)

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

const openEditItem = (item: VersionItem) => {
  editingItem.value = { id: item.id, body: item.body, type: item.type, status: item.status }
  showEditItemModal.value = true
}

const saveAdminItem = async () => {
  if (!editingItem.value) return
  try {
    await $fetch(`/api/dev/version-items/${editingItem.value.id}`, {
      method: 'PUT',
      body: editingItem.value
    })
    showEditItemModal.value = false
    await loadData()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update item')
  }
}

const openEditVersion = (ver: Version) => {
  editingVersion.value = { id: ver.id, versionNumber: ver.versionNumber, status: ver.status }
  showEditVersionModal.value = true
}

const saveAdminVersion = async () => {
  if (!editingVersion.value) return
  try {
    await $fetch(`/api/dev/versions/${editingVersion.value.id}`, {
      method: 'PUT',
      body: editingVersion.value
    })
    showEditVersionModal.value = false
    await loadData()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update version')
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
        <span v-if="isAdmin" class="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
          ✏️ Admin Edit Mode Active
        </span>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
        Loading versions roadmap...
      </div>

      <div v-else-if="versions.length === 0" class="text-center py-12 text-gray-500 text-sm">
        No versions published yet.
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="ver in versions"
          :key="ver.id"
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4 transition-all"
        >
          <!-- Version Header -->
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div class="flex items-center space-x-3">
              <!-- Version Icon based on Status -->
              <div class="p-2 rounded-lg" :class="{
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400': ver.status === 'PUBLISHED',
                'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400': ver.status === 'IN_PROGRESS',
                'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400': ver.status === 'FUTURE'
              }">
                <CheckCircleIcon v-if="ver.status === 'PUBLISHED'" class="w-5 h-5" />
                <ClockIcon v-else-if="ver.status === 'IN_PROGRESS'" class="w-5 h-5 animate-spin" style="animation-duration: 4s;" />
                <ForwardIcon v-else class="w-5 h-5" />
              </div>

              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white font-mono flex items-center gap-2">
                  Version {{ ver.versionNumber }}
                  <!-- Subtle Admin Edit Version Hook -->
                  <button
                    v-if="isAdmin"
                    @click="openEditVersion(ver)"
                    class="text-gray-400 hover:text-amber-500 transition-colors p-1"
                    title="Admin: Edit Version"
                  >
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                </h3>
              </div>

              <!-- Status Badge -->
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border"
                :class="{
                  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800': ver.status === 'PUBLISHED',
                  'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800': ver.status === 'IN_PROGRESS',
                  'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800': ver.status === 'FUTURE'
                }"
              >
                {{ ver.status.replace('_', ' ') }}
              </span>
            </div>
          </div>

          <!-- Items List -->
          <div v-if="ver.versionItems.length > 0" class="space-y-2.5 pl-2">
            <div
              v-for="item in ver.versionItems"
              :key="item.id"
              class="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 group"
            >
              <div class="flex items-start space-x-3">
                <!-- Feature / Bugfix Icon -->
                <div class="mt-0.5 shrink-0">
                  <span v-if="item.type === 'FEATURE'" class="inline-flex items-center justify-center p-1 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-xs">
                    ✨
                  </span>
                  <span v-else class="inline-flex items-center justify-center p-1 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 text-xs">
                    🐛
                  </span>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                    {{ item.body }}
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-[10px] font-semibold text-gray-500 uppercase">
                      {{ item.type }}
                    </span>
                    <span class="text-[10px] text-gray-400">•</span>
                    <span class="text-[10px] font-medium text-gray-500">
                      Status: {{ item.status.replace('_', ' ') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Subtle Admin Edit Item Hook -->
              <button
                v-if="isAdmin"
                @click="openEditItem(item)"
                class="text-gray-400 hover:text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity p-1"
                title="Admin: Edit Item"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-else class="text-xs text-gray-400 italic pl-2">
            No items recorded for this version yet.
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Edit Version Modal -->
    <div v-if="showEditVersionModal && editingVersion" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Admin Edit: Version</h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Version Number</label>
            <input v-model="editingVersion.versionNumber" type="text" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select v-model="editingVersion.status" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="FUTURE">FUTURE</option>
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
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Admin Edit: Roadmap Item</h3>
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select v-model="editingItem.type" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option value="FEATURE">✨ FEATURE</option>
                <option value="BUGFIX">🐛 BUGFIX</option>
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
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea v-model="editingItem.body" rows="3" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"></textarea>
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
