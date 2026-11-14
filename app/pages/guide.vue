<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon
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
  imageFileMain?: string | null
  imageFileThumb?: string | null
  imageUrl?: string | null
  thumbUrl?: string | null
  createdAt?: string
  updatedAt?: string
}

const howtoItems = ref<HowtoItem[]>([])
const isLoading = ref(true)
const brokenMainSlugs = ref<Record<string, boolean>>({})
const brokenThumbSlugs = ref<Record<string, boolean>>({})
const selectedItemId = ref<string | null>(null)

const sortedHowtoItems = computed(() => {
  return [...howtoItems.value].sort((a, b) => (b.rank ?? 2.5) - (a.rank ?? 2.5))
})

const selectedItem = computed(() => {
  if (!selectedItemId.value) return null
  return sortedHowtoItems.value.find(i => i.id === selectedItemId.value) ?? null
})

const selectedItemIndex = computed(() => {
  if (!selectedItem.value) return -1
  return sortedHowtoItems.value.findIndex(i => i.id === selectedItem.value!.id)
})

const gridItems = computed(() => {
  if (!selectedItem.value) return sortedHowtoItems.value
  return sortedHowtoItems.value.filter(i => i.id !== selectedItem.value!.id)
})

function getMainImageUrl(item: HowtoItem): string | null {
  if (item.imageUrl) return item.imageUrl
  if (item.imageFileMain) return `/images/howtos/${item.imageFileMain}`
  return null
}

function getThumbImageUrl(item: HowtoItem): string | null {
  if (item.thumbUrl) return item.thumbUrl
  if (item.imageFileThumb) return `/images/howtos/${item.imageFileThumb}`
  return null
}

function handleMainImageError(slug: string) {
  brokenMainSlugs.value = { ...brokenMainSlugs.value, [slug]: true }
}

function handleThumbImageError(slug: string) {
  brokenThumbSlugs.value = { ...brokenThumbSlugs.value, [slug]: true }
}

function openHowtoItem(item: HowtoItem) {
  selectedItemId.value = item.id
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
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
  slug: '',
  imageFileMain: '',
  imageFileThumb: ''
})
const slugManuallyEdited = ref(false)
watch(() => formItem.value.title, (newTitle) => {
  if (!editingItem.value && !slugManuallyEdited.value) {
    formItem.value.slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// Delete confirmation modal state
const showDeleteConfirm = ref(false)
const itemToDelete = ref<HowtoItem | null>(null)
const isDeleting = ref(false)

function openAddModal(initialRank = 2.5) {
  modalMode.value = 'add'
  saveError.value = ''
  formItem.value = {
    id: '',
    title: '',
    description: '',
    rank: initialRank,
    slug: '',
    imageFileMain: '',
    imageFileThumb: ''
  }
  showModal.value = true
}

function openAddAboveModal(idx: number) {
  slugManuallyEdited.value = false
  const clicked = sortedHowtoItems.value[idx]
  if (!clicked) {
    openAddModal(2.5)
    return
  }
  const clickedRank = Number(clicked.rank ?? 2.5)
  let prefilledRank: number
  if (idx === 0) {
    prefilledRank = clickedRank < 5 ? Number(((5 + clickedRank) / 2).toFixed(4)) : 5
  } else {
    const above = sortedHowtoItems.value[idx - 1]
    const aboveRank = Number(above?.rank ?? 5)
    if (aboveRank > clickedRank) {
      prefilledRank = Number(((aboveRank + clickedRank) / 2).toFixed(4))
    } else {
      prefilledRank = Number(Math.min(5, clickedRank + 0.01).toFixed(4))
    }
  }
  openAddModal(prefilledRank)
}

function openEditModal(item: HowtoItem) {
  slugManuallyEdited.value = true
  modalMode.value = 'edit'
  saveError.value = ''
  formItem.value = {
    id: item.id,
    title: item.title,
    description: item.description,
    rank: item.rank ?? 2.5,
    slug: item.slug,
    imageFileMain: item.imageFileMain || '',
    imageFileThumb: item.imageFileThumb || ''
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
  const imageFileMain = formItem.value.imageFileMain.trim() || null
  const imageFileThumb = formItem.value.imageFileThumb.trim() || null

  if (!title || !description || !slug) {
    saveError.value = 'Title, description, and slug are required.'
    return
  }

  isSaving.value = true
  const previousItems = JSON.parse(JSON.stringify(howtoItems.value)) as HowtoItem[]

  if (modalMode.value === 'add') {
    const tempId = `temp-${Date.now()}`
    pendingItemId.value = tempId
    howtoItems.value.push({ id: tempId, title, description, rank, slug, imageFileMain, imageFileThumb })
    showModal.value = false

    try {
      const created = await $fetch<HowtoItem>('/api/howtos', {
        method: 'POST',
        body: { title, description, rank, slug, imageFileMain, imageFileThumb }
      })
      const idx = howtoItems.value.findIndex(i => i.id === tempId)
      if (idx !== -1) {
        howtoItems.value[idx] = created
      }
      brokenMainSlugs.value = { ...brokenMainSlugs.value, [created.slug]: false }
      brokenThumbSlugs.value = { ...brokenThumbSlugs.value, [created.slug]: false }
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
    const existing = howtoItems.value[idx]
    if (existing) {
      howtoItems.value[idx] = { ...existing, title, description, rank, slug, imageFileMain, imageFileThumb }
    }
    showModal.value = false

    try {
      const updated = await ($fetch as any)(`/api/howtos/${targetId}`, {
        method: 'PUT',
        body: { title, description, rank, slug, imageFileMain, imageFileThumb }
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

</script>

<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 min-h-[600px]">
    <h1 class="sr-only">Guide</h1>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      This page is a collection of howtos and tips for using LangLearn. If you have any suggestions for howtos or tips you would like to see, add your idea as a bug-fix or feature above, and I'll add it as a howto here.
    </p>

    <!-- How-To Items from Database -->
    <section class="space-y-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 flex flex-col items-center justify-center space-y-3">
        <div class="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">Loading guide items...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedHowtoItems.length === 0" class="py-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">No how-to items yet.</p>
        <button
          v-if="isAdmin"
          type="button"
          @click="openAddModal()"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          <PlusIcon class="w-5 h-5" />
          <span>Add How-to</span>
        </button>
      </div>

      <div v-else class="space-y-6">
        <!-- Open Full Item at Top -->
        <article
          v-if="selectedItem"
          @click="selectedItemId = null"
          class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3 cursor-pointer"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {{ selectedItem.title }}
                </h3>
                <span v-if="pendingItemId === selectedItem.id" class="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ selectedItem.description }}
              </p>
              <p v-if="isAdmin" class="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                {{ selectedItem.imageFileMain || ('images/howtos/' + selectedItem.slug) }}
              </p>
            </div>

            <!-- Admin CRUD Controls -->
            <div v-if="isAdmin" class="flex items-center gap-1 shrink-0" @click.stop>
              <button
                type="button"
                @click.stop="openAddAboveModal(selectedItemIndex)"
                title="Add How-To Above"
                class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
              <template v-if="sortedHowtoItems.length > 1">
                <button
                  type="button"
                  @click.stop="moveItem(sortedHowtoItems, selectedItemIndex, 'up')"
                  :disabled="selectedItemIndex === 0"
                  title="Move Up"
                  class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                >
                  <ArrowUpIcon class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  @click.stop="moveItem(sortedHowtoItems, selectedItemIndex, 'down')"
                  :disabled="selectedItemIndex === sortedHowtoItems.length - 1"
                  title="Move Down"
                  class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                >
                  <ArrowDownIcon class="w-4 h-4" />
                </button>
              </template>
              <button
                type="button"
                @click.stop="openEditModal(selectedItem)"
                title="Edit How-To"
                class="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </button>
              <button
                type="button"
                @click.stop="confirmDelete(selectedItem)"
                title="Delete How-To"
                class="p-1.5 text-red-900/70 dark:text-red-900/80 hover:text-red-700 dark:hover:text-red-600 cursor-pointer transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Main Image Preview -->
          <div
            v-if="getMainImageUrl(selectedItem) && !brokenMainSlugs[selectedItem.slug]"
            class="overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-950 rounded-xl"
          >
            <img
              :src="getMainImageUrl(selectedItem)!"
              :alt="selectedItem.title"
              @error="handleMainImageError(selectedItem.slug)"
              class="w-full max-h-[28rem] object-contain mx-auto block"
            />
          </div>
        </article>

        <!-- Thumbnails Grid -->
        <div v-if="gridItems.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          <button
            v-for="item in gridItems"
            :key="item.id"
            type="button"
            :title="item.title"
            @click="openHowtoItem(item)"
            class="aspect-square w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-gray-400"
          >
            <img
              v-if="getThumbImageUrl(item) && !brokenThumbSlugs[item.slug]"
              :src="getThumbImageUrl(item)!"
              :alt="item.title"
              @error="handleThumbImageError(item.slug)"
              class="w-full h-full object-cover block"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-200 text-xs sm:text-sm font-semibold select-none"
            >
              no image
            </div>
          </button>
        </div>
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
                v-model="formItem.slug" @input="slugManuallyEdited = true"
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

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Main Image File (optional)</label>
                <input
                  type="text"
                  v-model="formItem.imageFileMain"
                  placeholder="e.g. savepronunc.png"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Thumb Image File (optional)</label>
                <input
                  type="text"
                  v-model="formItem.imageFileThumb"
                  placeholder="e.g. savepronunc-thumb.png"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">Rank (0.0 to 5.0)</label>
              <input
                type="number"
                step="any"
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

