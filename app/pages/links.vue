<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisHorizontalIcon
} from '@heroicons/vue/24/outline'
import { languageColors } from '~/utils/languageColors'

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

const languageTitles: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  de: 'German',
  ru: 'Russian',
  is: 'Icelandic',
  da: 'Danish',
  el: 'Greek'
}

const languageMetadata: Record<string, { title: string; color: string }> = Object.fromEntries(
  Object.entries(languageColors).map(([code, color]) => [
    code,
    { title: languageTitles[code] || code.toUpperCase(), color }
  ])
)

function isYouTubeUrl(url?: string): boolean {
  if (!url) return false
  return url.includes('youtube.com') || url.includes('youtu.be')
}

async function moveLink(categoryLinks: LinkItem[], index: number, direction: 'up' | 'down') {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= categoryLinks.length) return

  const item1 = categoryLinks[index]
  const item2 = categoryLinks[targetIndex]
  if (!item1 || !item2) return

  const prevLinks = JSON.parse(JSON.stringify(links.value))

  // Swap adjacent items in categoryLinks array
  categoryLinks[index] = item2
  categoryLinks[targetIndex] = item1

  // Assign clean, strictly descending unique ranks so relative order is strictly maintained
  const n = categoryLinks.length
  const step = n > 1 ? 4.0 / (n - 1) : 0
  const updates: Promise<any>[] = []

  categoryLinks.forEach((item, idx) => {
    const newRank = n > 1 ? Number((4.5 - idx * step).toFixed(4)) : 2.5
    if (item.rank !== newRank) {
      item.rank = newRank
      updates.push(
        ($fetch as any)(`/api/links/${item.id}`, {
          method: 'PUT',
          body: { rank: newRank }
        })
      )
    }
  })

  // Trigger reactivity for links array
  links.value = [...links.value]

  try {
    await Promise.all(updates)
  } catch (err) {
    console.error('Failed to move link:', err)
    links.value = prevLinks
  }
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

function capitalizeFirst(text?: string): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (!trimmed) return ''
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

function openLink(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

const activeCrudLinkId = ref<string | null>(null)

function toggleCrudToolbar(id: string, event?: Event) {
  if (event) event.stopPropagation()
  activeCrudLinkId.value = activeCrudLinkId.value === id ? null : id
}

function handleCardClick(link: LinkItem) {
  if (activeCrudLinkId.value) {
    activeCrudLinkId.value = null
    return
  }
  openLink(link.url)
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target && !target.closest('.crud-toolbar')) {
    activeCrudLinkId.value = null
  }
}

onMounted(() => {
  loadLinks()
  if (import.meta.client) {
    window.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('click', handleClickOutside)
  }
})

// Filter links based on user role and target languages:
// - unknownUsers (not logged in) see all languages
// - logged-in users (members & admins) see ONLY their configured target languages
const filteredLinks = computed(() => {
  if (!loggedIn.value || userRole.value === 'unknownUser') {
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
      const updated = await ($fetch as any)(`/api/links/${formLink.value.id}`, {
        method: 'PUT',
        body: formLink.value
      }) as LinkItem
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
    await ($fetch as any)(`/api/links/${linkToDelete.value.id}`, {
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
    <h1 class="sr-only">Links</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-16 flex flex-col items-center justify-center space-y-3">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">Loading links...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="groupedCategories.length === 0" class="py-16 text-center space-y-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
      <p class="text-gray-700 dark:text-gray-300 font-medium">No links available for your selected target languages.</p>
      <NuxtLink v-if="loggedIn" to="/user" class="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 underline">
        Configure Target Languages on your Profile &rarr;
      </NuxtLink>
    </div>

    <!-- Language Link Categories -->
    <div v-else v-for="category in groupedCategories" :key="category.code" class="space-y-4">
      <!-- Category Header (Clean title without outer Add button) -->
      <div class="w-full flex items-center justify-between px-1 py-1">
        <h2
          class="text-2xl font-black tracking-tight leading-normal my-0"
          :style="{ color: category.color }"
        >
          {{ category.title }}
        </h2>
      </div>

      <!-- Links List (Whole panel clickable, colored background, colored title, capitalized description, no hover underline) -->
      <ul class="space-y-3 text-sm">
        <li
          v-for="(link, idx) in category.links"
          :key="link.id"
          @click="handleCardClick(link)"
          class="p-4 rounded-xl border shadow-xs flex items-start justify-between gap-3 group transition-all duration-150 cursor-pointer select-none hover:brightness-110 active:scale-[0.99]"
          :style="{
            backgroundColor: `color-mix(in srgb, ${category.color} 14%, #111827)`,
            borderColor: `color-mix(in srgb, ${category.color} 30%, #374151)`
          }"
        >
          <div class="space-y-1.5 min-w-0 flex-1">
            <!-- Active Admin CRUD Tools (Displayed when title clicked) -->
            <div
              v-if="isAdmin && activeCrudLinkId === link.id"
              @click.stop="toggleCrudToolbar(link.id, $event)"
              class="crud-toolbar flex items-center gap-1.5 bg-black/95 px-3 py-1.5 rounded-xl text-xs shadow-md border border-gray-700 w-full cursor-pointer"
            >
              <!-- Add New Link in this language -->
              <button
                @click.stop="openAddModal(category.langKey)"
                title="Add Link"
                class="p-1 text-white/80 hover:text-white cursor-pointer transition-colors"
              >
                <PlusIcon class="w-4 h-4" />
              </button>

              <template v-if="category.links.length > 1">
                <span class="h-3 w-px bg-white/20 mx-1 self-center"></span>

                <!-- Reorder Up -->
                <button
                  @click.stop="moveLink(category.links, idx, 'up')"
                  :disabled="idx === 0"
                  title="Move Up"
                  class="p-1 text-white/80 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                >
                  <ArrowUpIcon class="w-4 h-4 stroke-[2.5]" />
                </button>

                <!-- Reorder Down -->
                <button
                  @click.stop="moveLink(category.links, idx, 'down')"
                  :disabled="idx === category.links.length - 1"
                  title="Move Down"
                  class="p-1 text-white/80 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                >
                  <ArrowDownIcon class="w-4 h-4 stroke-[2.5]" />
                </button>
              </template>

              <span class="h-3 w-px bg-white/20 mx-1 self-center"></span>

              <!-- Edit -->
              <button
                @click.stop="openEditModal(link)"
                title="Edit Link"
                class="p-1 text-amber-300 hover:text-amber-200 cursor-pointer transition-colors"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </button>

              <!-- Delete -->
              <button
                @click.stop="confirmDelete(link)"
                title="Delete Link"
                class="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Title Line (Paper/video icon on front, ellipsis icon on far right for admin) -->
            <div
              v-else
              class="flex items-center justify-between gap-2 w-full"
            >
              <div
                @click.stop="openLink(link.url)"
                class="font-bold text-base leading-snug flex items-center gap-2 cursor-pointer hover:underline min-w-0"
                :style="{ color: category.color }"
              >
                <!-- YouTube Icon / Document Icon on the front (left side) -->
                <span class="inline-flex items-center shrink-0">
                  <svg v-if="isYouTubeUrl(link.url)" class="w-4 h-4 text-gray-400 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor" title="YouTube video">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <DocumentTextIcon v-else class="w-4 h-4 text-gray-400 dark:text-gray-400" title="Web article" />
                </span>
                <span class="truncate">{{ link.title.trim() }}</span>
              </div>

              <!-- Ellipsis icon on far right for admin to toggle manage bar -->
              <button
                v-if="isAdmin"
                type="button"
                @click.stop="toggleCrudToolbar(link.id, $event)"
                title="Manage link"
                class="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <EllipsisHorizontalIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Description (forced capitalize first letter) -->
            <p v-if="link.description" class="text-xs text-gray-300 dark:text-gray-300 leading-relaxed">
              {{ capitalizeFirst(link.description) }}
            </p>
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

        <form @submit.prevent="saveLink" @keydown.ctrl.enter="saveLink" @keydown.meta.enter="saveLink" class="space-y-4 text-xs">
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
