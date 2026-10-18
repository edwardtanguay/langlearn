<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Links',
  meta: [
    { name: 'description', content: 'Explore curated language learning links and native resources organized by language.' }
  ]
})

const { loggedIn, isAdmin, userRole } = useCurrentUser()

interface LinkItem {
  id: string
  language: string
  title: string
  url: string
  description?: string
  rank: number
}

const languageMetadata: Record<string, { title: string; color: string }> = {
  en: { title: 'English', color: '#0ea5e9' },
  fr: { title: 'French', color: '#333388' },
  es: { title: 'Spanish', color: '#be185d' },
  it: { title: 'Italian', color: '#194d19' },
  nl: { title: 'Dutch', color: '#d97706' },
  pl: { title: 'Polish', color: '#b8b8b8' },
  de: { title: 'German', color: '#7e4402' },
  ru: { title: 'Russian', color: '#3f3f46' },
  is: { title: 'Icelandic', color: '#06b6d4' },
  da: { title: 'Danish', color: '#7e22ce' },
  el: { title: 'Greek', color: '#ea580c' }
}

const links = ref<LinkItem[]>([])
const isLoading = ref(true)
const memberTargetLanguages = ref<string[]>([])

const loadLinks = async () => {
  isLoading.value = true
  try {
    const [linksData, meData] = await Promise.all([
      $fetch<LinkItem[]>('/api/links'),
      loggedIn.value ? $fetch<{ targetLanguages?: string[] }>('/api/user/me').catch(() => null) : null
    ])
    links.value = linksData || []
    if (meData?.targetLanguages) {
      memberTargetLanguages.value = meData.targetLanguages
    }
  } catch (err) {
    console.error('Failed to load links:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadLinks()
})

// Filter links based on user role and target languages:
// - unknownUsers & admins see all languages
// - members see ONLY their configured target languages
const filteredLinks = computed(() => {
  if (isAdmin.value || !loggedIn.value || userRole.value === 'unknownUser') {
    return links.value
  }
  const targets = new Set(memberTargetLanguages.value.map(l => l.toLowerCase()))
  return links.value.filter(l => targets.has(l.language.toLowerCase()))
})

// Group filtered links by language
const groupedCategories = computed(() => {
  const groups: Record<string, LinkItem[]> = {}

  for (const item of filteredLinks.value) {
    const lang = item.language.toLowerCase()
    if (!groups[lang]) {
      groups[lang] = []
    }
    groups[lang].push(item)
  }

  // Sort within each language by rank descending
  for (const lang in groups) {
    groups[lang]?.sort((a, b) => (b.rank ?? 2.5) - (a.rank ?? 2.5))
  }

  // Return formatted categories
  return Object.keys(groups)
    .map(lang => {
      const meta = languageMetadata[lang] || { title: lang.toUpperCase(), color: '#4f46e5' }
      return {
        code: lang.toUpperCase(),
        langKey: lang,
        title: meta.title,
        color: meta.color,
        links: groups[lang] ?? []
      }
    })
    .sort((a, b) => b.links.length - a.links.length)
})

// Admin CRUD Modal state
const showModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const isSaving = ref(false)
const saveError = ref('')

const formLink = ref({
  id: '',
  language: 'fr',
  title: '',
  url: '',
  description: '',
  rank: 2.5
})

// Delete modal state
const showDeleteConfirm = ref(false)
const linkToDelete = ref<LinkItem | null>(null)
const isDeleting = ref(false)

const openAddModal = (defaultLang = 'fr') => {
  modalMode.value = 'add'
  saveError.value = ''
  formLink.value = {
    id: '',
    language: defaultLang.toLowerCase(),
    title: '',
    url: '',
    description: '',
    rank: 2.5
  }
  showModal.value = true
}

const openEditModal = (item: LinkItem) => {
  modalMode.value = 'edit'
  saveError.value = ''
  formLink.value = {
    id: item.id,
    language: item.language,
    title: item.title,
    url: item.url,
    description: item.description || '',
    rank: item.rank ?? 2.5
  }
  showModal.value = true
}

const saveLink = async () => {
  if (isSaving.value) return
  saveError.value = ''

  if (!formLink.value.title || !formLink.value.url) {
    saveError.value = 'Title and URL are required'
    return
  }

  isSaving.value = true
  try {
    if (modalMode.value === 'add') {
      const created = await $fetch<LinkItem>('/api/links', {
        method: 'POST',
        body: formLink.value
      })
      links.value.push(created)
    } else {
      const updated = await $fetch<LinkItem>(`/api/links/${formLink.value.id}`, {
        method: 'PUT',
        body: formLink.value
      })
      const idx = links.value.findIndex(l => l.id === updated.id)
      if (idx !== -1) {
        links.value[idx] = updated
      }
    }
    showModal.value = false
  } catch (err: any) {
    saveError.value = err?.data?.statusMessage || err?.message || 'Failed to save link'
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (item: LinkItem) => {
  linkToDelete.value = item
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!linkToDelete.value || isDeleting.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/links/${linkToDelete.value.id}`, {
      method: 'DELETE'
    })
    links.value = links.value.filter(l => l.id !== linkToDelete.value?.id)
    showDeleteConfirm.value = false
    linkToDelete.value = null
  } catch (err: any) {
    console.error('Failed to delete link:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-10 px-4 min-h-[600px] space-y-10">
    <!-- Hero Header -->
    <div class="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-2 text-center md:text-left">
        <h1 class="text-2xl md:text-3xl font-black tracking-tight">Links</h1>
        <p class="text-sm text-gray-300 max-w-xl leading-relaxed">
          Hand-picked native videos, tutorials, and websites organized by language to elevate your real-world comprehension.
        </p>
      </div>

      <!-- Admin Add Link Button -->
      <div v-if="isAdmin" class="shrink-0">
        <button
          @click="openAddModal('fr')"
          class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <PlusIcon class="w-4 h-4" />
          <span>Add New Link</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-16 flex flex-col items-center justify-center space-y-3">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">Loading links...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="groupedCategories.length === 0" class="py-16 text-center space-y-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
      <p class="text-gray-700 dark:text-gray-300 font-medium">No links available for your selected target languages.</p>
      <NuxtLink v-if="loggedIn && !isAdmin" to="/user" class="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 underline">
        Configure Target Languages on your Profile &rarr;
      </NuxtLink>
    </div>

    <!-- Language Link Categories -->
    <div v-else v-for="category in groupedCategories" :key="category.code" class="space-y-4">
      <!-- Category Header (Top Aligned) -->
      <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <div class="flex items-center gap-3">
          <span
            class="px-2.5 py-0.5 rounded text-xs font-bold text-white shadow-xs uppercase tracking-wider flex items-center justify-center shrink-0"
            :style="{ backgroundColor: category.color }"
          >
            {{ category.code }}
          </span>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
            {{ category.title }}
          </h2>
          <span class="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none">
            ({{ category.links.length }} {{ category.links.length === 1 ? 'link' : 'links' }})
          </span>
        </div>

        <!-- Add Link in this category button (Admin) -->
        <button
          v-if="isAdmin"
          @click="openAddModal(category.langKey)"
          title="Add link in this language"
          class="text-xs font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <PlusIcon class="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      <!-- Links List (Styled with Title, Description, and Rank Badge) -->
      <ul class="space-y-3 text-sm">
        <li
          v-for="link in category.links"
          :key="link.id"
          class="p-3.5 rounded-xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60 shadow-xs flex items-start justify-between gap-3 group hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5 leading-snug"
              >
                <span>{{ link.title }}</span>
                <ArrowTopRightOnSquareIcon class="w-4 h-4 shrink-0 text-gray-400" />
              </a>

              <!-- Rank badge -->
              <span
                class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight border"
                :class="link.rank >= 4.5
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-800/60'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'"
                title="Priority Rank"
              >
                ⭐ {{ Number(link.rank).toFixed(1) }}
              </span>
            </div>

            <!-- Description -->
            <p v-if="link.description" class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ link.description }}
            </p>
          </div>

          <!-- Admin CRUD Buttons (Desktop & Mobile) -->
          <div v-if="isAdmin" class="flex items-center gap-1 shrink-0 pt-0.5">
            <button
              @click="openEditModal(link)"
              title="Edit link"
              class="p-1 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer rounded"
            >
              <PencilSquareIcon class="w-4 h-4" />
            </button>
            <button
              @click="confirmDelete(link)"
              title="Delete link"
              class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer rounded"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Admin Add/Edit Modal Dialog -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-5 text-left">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'add' ? 'Add Learning Link' : 'Edit Learning Link' }}
          </h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
          {{ saveError }}
        </div>

        <form @submit.prevent="saveLink" class="space-y-4 text-xs">
          <!-- Language Dropdown -->
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Language</label>
            <select
              v-model="formLink.language"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium"
            >
              <option v-for="(meta, code) in languageMetadata" :key="code" :value="code">
                {{ meta.title }} ({{ code.toUpperCase() }})
              </option>
            </select>
          </div>

          <!-- Title Input -->
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Title</label>
            <input
              type="text"
              v-model="formLink.title"
              placeholder="e.g. Voyages Endormis"
              required
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
            />
          </div>

          <!-- URL Input -->
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">URL</label>
            <input
              type="url"
              v-model="formLink.url"
              placeholder="https://..."
              required
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono"
            />
          </div>

          <!-- Description Input -->
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Description</label>
            <textarea
              v-model="formLink.description"
              rows="3"
              placeholder="Short explanation of what this link offers..."
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <!-- Rank Input (0.0 to 5.0) -->
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Rank (0.0 to 5.0)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              v-model.number="formLink.rank"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono"
            />
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <span v-if="isSaving" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isSaving ? 'Saving...' : 'Save Link' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm && linkToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-red-200 dark:border-red-900/50 space-y-4 text-left">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Delete Link?</h3>
        <p class="text-xs text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong class="text-gray-900 dark:text-white">{{ linkToDelete.title }}</strong>? This action cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            @click="showDeleteConfirm = false"
            :disabled="isDeleting"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
