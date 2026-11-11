<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  BookOpenIcon,
  PlusIcon,
  PencilSquareIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon,
  CommandLineIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Guide',
  meta: [
    { name: 'description', content: 'Learn how to use LangLearn, best study options, Google Translate import codes, and step-by-step how-to guides.' }
  ]
})

const { isAdmin } = useCurrentUser()

interface HowtoItem {
  id: string
  title: string
  description: string
  rank: number
  slug: string
  createdAt?: string
  updatedAt?: string
}

const howtoItems = ref<HowtoItem[]>([])
const isLoading = ref(true)
const brokenImageSlugs = ref<Record<string, boolean>>({})

const sortedHowtoItems = computed(() => {
  return [...howtoItems.value].sort((a, b) => (b.rank ?? 2.5) - (a.rank ?? 2.5))
})

function getImagePath(slug: string): string {
  return `/images/howtos/${slug}.jpg`
}

function handleImageError(slug: string) {
  brokenImageSlugs.value = { ...brokenImageSlugs.value, [slug]: true }
}

async function loadHowtoItems() {
  isLoading.value = true
  try {
    const data = await $fetch<HowtoItem[]>('/api/howtos')
    howtoItems.value = data || []
  } catch (err) {
    console.error('Failed to load howtoItems:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadHowtoItems()
})

// Admin CRUD Modal State
const showModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const isSaving = ref(false)
const saveError = ref('')
const pendingItemId = ref<string | null>(null)

const formItem = ref({
  id: '',
  title: '',
  description: '',
  rank: 2.5,
  slug: ''
})

// Delete confirmation modal state
const showDeleteConfirm = ref(false)
const itemToDelete = ref<HowtoItem | null>(null)
const isDeleting = ref(false)

function openAddModal() {
  modalMode.value = 'add'
  saveError.value = ''
  formItem.value = {
    id: '',
    title: '',
    description: '',
    rank: 2.5,
    slug: ''
  }
  showModal.value = true
}

function openEditModal(item: HowtoItem) {
  modalMode.value = 'edit'
  saveError.value = ''
  formItem.value = {
    id: item.id,
    title: item.title,
    description: item.description,
    rank: item.rank ?? 2.5,
    slug: item.slug
  }
  showModal.value = true
}

async function saveItem() {
  if (isSaving.value) return
  saveError.value = ''

  const title = formItem.value.title.trim()
  const description = formItem.value.description.trim()
  const slug = formItem.value.slug.trim()
  const rank = Math.max(0, Math.min(5, Number(formItem.value.rank ?? 2.5)))

  if (!title || !description || !slug) {
    saveError.value = 'Title, description, and slug are required.'
    return
  }

  isSaving.value = true
  const previousItems = JSON.parse(JSON.stringify(howtoItems.value)) as HowtoItem[]

  if (modalMode.value === 'add') {
    const tempId = `temp-${Date.now()}`
    pendingItemId.value = tempId
    howtoItems.value.push({ id: tempId, title, description, rank, slug })
    showModal.value = false

    try {
      const created = await $fetch<HowtoItem>('/api/howtos', {
        method: 'POST',
        body: { title, description, rank, slug }
      })
      const idx = howtoItems.value.findIndex(i => i.id === tempId)
      if (idx !== -1) {
        howtoItems.value[idx] = created
      }
      brokenImageSlugs.value = { ...brokenImageSlugs.value, [created.slug]: false }
    } catch (err: any) {
      howtoItems.value = previousItems
      saveError.value = err?.data?.statusMessage || err?.message || 'Failed to create howto item.'
      showModal.value = true
    } finally {
      pendingItemId.value = null
      isSaving.value = false
    }
  } else {
    const targetId = formItem.value.id
    pendingItemId.value = targetId
    const idx = howtoItems.value.findIndex(i => i.id === targetId)
    if (idx !== -1) {
      howtoItems.value[idx] = { ...howtoItems.value[idx], title, description, rank, slug }
    }
    showModal.value = false

    try {
      const updated = await ($fetch as any)(`/api/howtos/${targetId}`, {
        method: 'PUT',
        body: { title, description, rank, slug }
      }) as HowtoItem
      const updatedIdx = howtoItems.value.findIndex(i => i.id === updated.id)
      if (updatedIdx !== -1) {
        howtoItems.value[updatedIdx] = updated
      }
      brokenImageSlugs.value = { ...brokenImageSlugs.value, [updated.slug]: false }
    } catch (err: any) {
      howtoItems.value = previousItems
      saveError.value = err?.data?.statusMessage || err?.message || 'Failed to update howto item.'
      showModal.value = true
    } finally {
      pendingItemId.value = null
      isSaving.value = false
    }
  }
}

function confirmDelete(item: HowtoItem) {
  itemToDelete.value = item
  showDeleteConfirm.value = true
}

async function executeDelete() {
  if (!itemToDelete.value || isDeleting.value) return
  const target = itemToDelete.value
  isDeleting.value = true
  const previousItems = JSON.parse(JSON.stringify(howtoItems.value)) as HowtoItem[]

  howtoItems.value = howtoItems.value.filter(i => i.id !== target.id)
  showDeleteConfirm.value = false

  try {
    await ($fetch as any)(`/api/howtos/${target.id}`, {
      method: 'DELETE'
    })
    itemToDelete.value = null
  } catch (err) {
    console.error('Failed to delete howto item:', err)
    howtoItems.value = previousItems
  } finally {
    isDeleting.value = false
  }
}

async function moveItem(items: HowtoItem[], index: number, direction: 'up' | 'down') {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= items.length) return

  const item1 = items[index]
  const item2 = items[targetIndex]
  if (!item1 || !item2) return

  const prevItems = JSON.parse(JSON.stringify(howtoItems.value)) as HowtoItem[]
  const ordered = [...items]
  ordered[index] = item2
  ordered[targetIndex] = item1

  const n = ordered.length
  const step = n > 1 ? 4.0 / (n - 1) : 0
  const updates: Promise<any>[] = []

  ordered.forEach((item, idx) => {
    const newRank = n > 1 ? Number((4.5 - idx * step).toFixed(4)) : 2.5
    const original = howtoItems.value.find(x => x.id === item.id)
    if (original && original.rank !== newRank) {
      original.rank = newRank
      updates.push(
        ($fetch as any)(`/api/howtos/${item.id}`, {
          method: 'PUT',
          body: { rank: newRank }
        })
      )
    }
  })

  try {
    await Promise.all(updates)
  } catch (err) {
    console.error('Failed to reorder howto items:', err)
    howtoItems.value = prevItems
  }
}

const syntaxExamples = [
  {
    code: '//498',
    meaning: 'Assigns rank 4.98 (very high priority, 0.0–5.0)',
    example: 'Au fur et à mesure //498'
  },
  {
    code: '//43',
    meaning: 'Assigns rank 4.3 (first digit is integer, rest is decimal)',
    example: 'Ça vaut le coup //43'
  },
  {
    code: '//p.TEXT',
    meaning: 'Sets the pronunciation hint shown on the card',
    example: 'L\'accueil //p.lah-kuhy'
  },
  {
    code: '//m.TEXT',
    meaning: 'Sets a personal memory hook on the back of the card',
    example: 'La gare //m.the train gate'
  },
  {
    code: '//t.TAG',
    meaning: 'Adds a tag to the card (//t.a automatically becomes "à")',
    example: 'Penser à quelqu\'un //t.a'
  },
  {
    code: '*word*',
    meaning: 'Highlights target phrase for examples & Drag/Drop activity',
    example: 'Il fait *beau* aujourd\'hui'
  },
  {
    code: '<verb>',
    meaning: 'Unlocks instant verb conjugation lookup links on card back',
    example: 'Je <vouloir> partir tôt'
  }
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-8 min-h-[600px]">
    <!-- Header -->
    <div class="space-y-2 border-b border-gray-200 dark:border-gray-800 pb-5">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <BookOpenIcon class="w-7 h-7 text-gray-900 dark:text-white shrink-0" />
          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Guide
          </h1>
        </div>
        <button
          v-if="isAdmin"
          type="button"
          @click="openAddModal"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <PlusIcon class="w-4 h-4" />
          <span>Add How-To</span>
        </button>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        How to get the most out of LangLearn — recommended settings, daily workflow, and Google Translate import codes.
      </p>
    </div>

    <!-- How I Use LangLearn & Best Options -->
    <section class="space-y-4">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <SparklesIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span>How I Use the Site &amp; Best Options</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-sm">
        <div class="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
          <h3 class="font-bold text-gray-900 dark:text-white">1. Save Phrases in Google Translate</h3>
          <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Whenever you hear or read a useful phrase, look it up in Google Translate and star it. Add quick inline codes like <code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-gray-900 dark:text-white">//498</code> before exporting so your best phrases automatically get top priority.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
          <h3 class="font-bold text-gray-900 dark:text-white">2. Import &amp; Preview (<NuxtLink to="/import" class="underline text-gray-900 dark:text-white">/import</NuxtLink>)</h3>
          <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Set your native language in <NuxtLink to="/profile" class="underline text-gray-900 dark:text-white">Profile</NuxtLink>, then paste or upload your exported phrases. Cards without an explicit rank are scored automatically by optimal length (around 34 characters).
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
          <h3 class="font-bold text-gray-900 dark:text-white">3. Best Flashcard Modes (<NuxtLink to="/flashcards" class="underline text-gray-900 dark:text-white">/flashcards</NuxtLink>)</h3>
          <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Start with <strong>Newly imported untested</strong> to clear fresh imports, then switch to <strong>Most important unlearned</strong> for high-rank cards, and periodically use <strong>Most important learned</strong> to refresh old cards. Batch progress saves automatically if you leave mid-batch.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
          <h3 class="font-bold text-gray-900 dark:text-white">4. Mix in Activities (<NuxtLink to="/activities" class="underline text-gray-900 dark:text-white">/activities</NuxtLink>)</h3>
          <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Use <strong>Random Testing</strong> in Spanish Verbs for quick recall drills, <strong>Gemini Quiz Prompts</strong> for AI-generated reading &amp; grammar tests, and <strong>Drag/Drop Highlighted Words</strong> for active recall in context.
          </p>
        </div>
      </div>
    </section>

    <!-- Google Translate Import Codes & Card Syntax -->
    <section class="space-y-4">
      <div class="space-y-1">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CommandLineIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span>Google Translate Codes &amp; Card Syntax</span>
        </h2>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          Include these markers when saving phrases in Google Translate to automatically set rank, pronunciation, memory hooks, and tags on import.
        </p>
      </div>

      <div class="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="item in syntaxExamples"
            :key="item.code"
            class="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div class="flex items-start sm:items-center gap-3 min-w-0">
              <code class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono font-bold text-gray-900 dark:text-white shrink-0">
                {{ item.code }}
              </code>
              <span class="text-gray-700 dark:text-gray-300">{{ item.meaning }}</span>
            </div>
            <code class="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 font-mono text-[11px] text-gray-600 dark:text-gray-300 shrink-0">
              {{ item.example }}
            </code>
          </div>
        </div>
      </div>
    </section>

    <!-- How-To Items from Database -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          How-To Examples
        </h2>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 flex flex-col items-center justify-center space-y-3">
        <div class="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">Loading guide items...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedHowtoItems.length === 0" class="py-10 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">No how-to items yet.</p>
      </div>

      <!-- Items List -->
      <div v-else class="space-y-4">
        <article
          v-for="(item, idx) in sortedHowtoItems"
          :key="item.id"
          class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {{ item.title }}
                </h3>
                <span class="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300">
                  rank {{ Number(item.rank).toFixed(2) }}
                </span>
                <span v-if="pendingItemId === item.id" class="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ item.description }}
              </p>
              <p class="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                images/howtos/{{ item.slug }}.jpg
              </p>
            </div>

            <!-- Admin CRUD Controls -->
            <div v-if="isAdmin" class="flex items-center gap-1 shrink-0">
              <template v-if="sortedHowtoItems.length > 1">
                <button
                  type="button"
                  @click="moveItem(sortedHowtoItems, idx, 'up')"
                  :disabled="idx === 0"
                  title="Move Up"
                  class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                >
                  <ArrowUpIcon class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  @click="moveItem(sortedHowtoItems, idx, 'down')"
                  :disabled="idx === sortedHowtoItems.length - 1"
                  title="Move Down"
                  class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                >
                  <ArrowDownIcon class="w-4 h-4" />
                </button>
              </template>
              <button
                type="button"
                @click="openEditModal(item)"
                title="Edit How-To"
                class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </button>
              <button
                type="button"
                @click="confirmDelete(item)"
                title="Delete How-To"
                class="px-1.5 py-1 text-[11px] font-medium text-red-900 dark:text-red-900/90 hover:text-red-700 dark:hover:text-red-600 underline cursor-pointer transition-colors"
              >
                delete
              </button>
            </div>
          </div>

          <!-- Image Preview (renders when images/howtos/<slug>.jpg exists) -->
          <div
            v-if="item.slug && !brokenImageSlugs[item.slug]"
            class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-950"
          >
            <img
              :src="getImagePath(item.slug)"
              :alt="item.title"
              @error="handleImageError(item.slug)"
              class="w-full max-h-80 object-contain mx-auto block"
            />
          </div>
        </article>
      </div>
    </section>

    <!-- Admin Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-5 text-left">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'add' ? 'Add How-To Item' : 'Edit How-To Item' }}
          </h3>
          <button
            type="button"
            @click="showModal = false"
            :disabled="isSaving"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 cursor-pointer disabled:opacity-50"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
          {{ saveError }}
        </div>

        <form @submit.prevent="saveItem" @keydown.enter.exact.prevent="saveItem" class="space-y-4 text-xs">
          <fieldset :disabled="isSaving" class="space-y-4">
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Title</label>
              <input
                type="text"
                v-model="formItem.title"
                placeholder="e.g. Assign Rank with //498"
                required
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Slug (used for images/howtos/&lt;slug&gt;.jpg)</label>
              <input
                type="text"
                v-model="formItem.slug"
                placeholder="e.g. addRankToPhrase"
                required
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Description</label>
              <textarea
                v-model="formItem.description"
                rows="3"
                placeholder="Explain how this option or syntax works... (Shift+Enter for newline, Enter to save)"
                required
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Rank (0.0 to 5.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                v-model.number="formItem.rank"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono"
              />
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                @click="showModal = false"
                :disabled="isSaving"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <span v-if="isSaving" class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm && itemToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-red-900/50 space-y-4 text-left">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Delete How-To Item?</h3>
        <p class="text-xs text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong class="text-gray-900 dark:text-white">{{ itemToDelete.title }}</strong>? This action cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="showDeleteConfirm = false"
            :disabled="isDeleting"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="executeDelete"
            :disabled="isDeleting"
            class="px-3 py-1.5 text-red-700 dark:text-red-500 hover:text-red-500 underline text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {{ isDeleting ? 'Deleting...' : 'Confirm Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

