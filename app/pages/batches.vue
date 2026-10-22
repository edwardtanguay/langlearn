<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronDownIcon, ChevronUpIcon, QueueListIcon } from '@heroicons/vue/24/outline'
import { languageColors } from '~/utils/languageColors'

useHead({
  title: 'LangLearn - Import Batches',
  meta: [
    { name: 'description', content: 'Overview of imported flashcard batches and data integrity.' }
  ]
})

interface BatchCardItem {
  id: string
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  memoryHook?: string | null
  rank: number
  tags: string[]
}

interface ImportBatch {
  id: string
  batchTime: string
  count: number
  cards: BatchCardItem[]
}

const { loggedIn } = useCurrentUser()

const batches = ref<ImportBatch[]>([])
const isLoading = ref(true)
const loadError = ref<string | null>(null)
const expandedBatchIds = ref<Set<string>>(new Set())
const visibleLimit = ref(3)

const visibleBatches = computed(() => {
  return batches.value.slice(0, visibleLimit.value)
})

const hasMoreBatches = computed(() => {
  return batches.value.length > visibleLimit.value
})

const toggleBatch = (id: string) => {
  if (expandedBatchIds.value.has(id)) {
    expandedBatchIds.value.delete(id)
  } else {
    expandedBatchIds.value.add(id)
  }
}

const loadMore = () => {
  visibleLimit.value += 3
}

const fetchBatches = async () => {
  if (!loggedIn.value) return
  isLoading.value = true
  loadError.value = null

  try {
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''
    const res = await $fetch<{ batches: ImportBatch[]; totalBatches: number }>('/api/batches', {
      headers: tz ? { 'x-client-timezone': tz } : {},
      query: tz ? { tz } : {}
    })
    batches.value = res.batches || []
  } catch (err: any) {
    console.error('Failed to load batches:', err)
    loadError.value = err.data?.statusMessage || err.message || 'Failed to load import batches.'
  } finally {
    isLoading.value = false
  }
}

function extractDate(batchTime: string): string {
  const parts = batchTime.split(' ')
  return parts[0] || batchTime
}

function extractTime(batchTime: string): string {
  const parts = batchTime.split(' ')
  return parts.length > 1 ? parts.slice(1).join(' ') : ''
}

onMounted(() => {
  fetchBatches()
})
</script>

<template>
  <div class="max-w-5xl mx-auto py-10 px-4 space-y-8 min-h-[600px]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <QueueListIcon class="w-8 h-8 text-amber-500" />
          <span>Import Batches</span>
        </h1>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Review your imported flashcard records to check for missing details or formatting issues.
        </p>
      </div>

      <NuxtLink
        to="/import"
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
      >
        <span>+ New Import</span>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-16 flex flex-col items-center justify-center space-y-3">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">Loading batches...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs">
      {{ loadError }}
    </div>

    <!-- Empty State -->
    <div v-else-if="batches.length === 0" class="py-16 text-center space-y-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xs">
      <div class="w-12 h-12 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center">
        <QueueListIcon class="w-6 h-6" />
      </div>
      <div class="space-y-1">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">No import batches found</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          You haven't imported any flashcards yet. Import cards from Google Translate to see your batches here.
        </p>
      </div>
      <NuxtLink
        to="/import"
        class="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        Go to Import &rarr;
      </NuxtLink>
    </div>

    <!-- Batches List -->
    <div v-else class="space-y-4">
      <div
        v-for="batch in visibleBatches"
        :key="batch.id"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs transition-shadow hover:shadow-md"
      >
        <!-- Batch Header (Clickable title reveals cards) -->
        <button
          type="button"
          @click="toggleBatch(batch.id)"
          class="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer select-none"
        >
          <div class="flex items-center gap-3">
            <span class="font-mono text-sm sm:text-base font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-1.5">
              <span class="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-bold">
                {{ extractDate(batch.batchTime) }}
              </span>
              <span v-if="extractTime(batch.batchTime)">{{ extractTime(batch.batchTime) }}</span>
              <span class="text-gray-400">=></span>
              <span class="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-bold">
                {{ batch.count }}
              </span>
              <span>{{ batch.count === 1 ? 'flashcard' : 'flashcards' }}</span>
            </span>
          </div>

          <div class="flex items-center gap-2 text-gray-400">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {{ expandedBatchIds.has(batch.id) ? 'Collapse' : 'Reveal' }}
            </span>
            <ChevronUpIcon v-if="expandedBatchIds.has(batch.id)" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <ChevronDownIcon v-else class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </button>

        <!-- Batch Content (Revealed on click) -->
        <div v-if="expandedBatchIds.has(batch.id)" class="border-t border-gray-200 dark:border-gray-800 p-4 sm:p-5">
          <!-- Desktop View: Classic Minimal Table with cells -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th class="p-2.5 font-bold uppercase tracking-wider border-r border-gray-200 dark:border-gray-800 w-12 text-center">#</th>
                  <th class="p-2.5 font-bold uppercase tracking-wider border-r border-gray-200 dark:border-gray-800 w-1/3">Front</th>
                  <th class="p-2.5 font-bold uppercase tracking-wider border-r border-gray-200 dark:border-gray-800 w-1/3">Back</th>
                  <th class="p-2.5 font-bold uppercase tracking-wider border-r border-gray-200 dark:border-gray-800 w-16 text-center">Rank</th>
                  <th class="p-2.5 font-bold uppercase tracking-wider border-r border-gray-200 dark:border-gray-800">Pronunciation</th>
                  <th class="p-2.5 font-bold uppercase tracking-wider border-r border-gray-200 dark:border-gray-800">Memory Hook</th>
                  <th class="p-2.5 font-bold uppercase tracking-wider">Tags</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-800 font-sans">
                <tr
                  v-for="(card, idx) in batch.cards"
                  :key="card.id"
                  class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td class="p-2.5 border-r border-gray-200 dark:border-gray-800 text-center font-mono text-gray-400 text-[11px]">
                    {{ idx + 1 }}
                  </td>
                  <td class="p-2.5 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white mr-1.5 uppercase font-mono"
                          :style="{ backgroundColor: languageColors[card.frontLanguage?.toLowerCase()] || '#6366f1' }">
                      {{ card.frontLanguage }}
                    </span>
                    <span>{{ card.front }}</span>
                  </td>
                  <td class="p-2.5 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white mr-1.5 uppercase font-mono"
                          :style="{ backgroundColor: languageColors[card.backLanguage?.toLowerCase()] || '#6366f1' }">
                      {{ card.backLanguage }}
                    </span>
                    <span>{{ card.back }}</span>
                  </td>
                  <td class="p-2.5 border-r border-gray-200 dark:border-gray-800 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {{ card.rank }}
                  </td>
                  <td class="p-2.5 border-r border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 italic">
                    {{ card.pronunciation || '—' }}
                  </td>
                  <td class="p-2.5 border-r border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
                    {{ card.memoryHook || '—' }}
                  </td>
                  <td class="p-2.5 text-gray-600 dark:text-gray-300">
                    <div v-if="card.tags && card.tags.length > 0" class="flex flex-wrap gap-1">
                      <span v-for="t in card.tags" :key="t" class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-mono text-gray-700 dark:text-gray-300 font-semibold">
                        #{{ t }}
                      </span>
                    </div>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile View: Small minimal panel per flashcard, field label/data shown per line -->
          <div class="md:hidden space-y-3">
            <div
              v-for="(card, idx) in batch.cards"
              :key="card.id"
              class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-750 text-xs space-y-1.5"
            >
              <div class="text-[10px] font-mono font-bold text-gray-400 pb-0.5 border-b border-gray-200/50 dark:border-gray-700/50">
                Card #{{ idx + 1 }}
              </div>
              <div>
                <span class="font-bold text-gray-700 dark:text-gray-300">Front ({{ card.frontLanguage.toUpperCase() }}):</span>
                <span class="text-gray-900 dark:text-white font-medium ml-1.5">{{ card.front }}</span>
              </div>
              <div>
                <span class="font-bold text-gray-700 dark:text-gray-300">Back ({{ card.backLanguage.toUpperCase() }}):</span>
                <span class="text-gray-900 dark:text-white font-medium ml-1.5">{{ card.back }}</span>
              </div>
              <div>
                <span class="font-bold text-gray-700 dark:text-gray-300">Rank:</span>
                <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400 ml-1.5">{{ card.rank }}</span>
              </div>
              <div v-if="card.pronunciation">
                <span class="font-bold text-gray-700 dark:text-gray-300">Pronunciation:</span>
                <span class="italic text-gray-800 dark:text-gray-200 ml-1.5">{{ card.pronunciation }}</span>
              </div>
              <div v-if="card.memoryHook">
                <span class="font-bold text-gray-700 dark:text-gray-300">Memory Hook:</span>
                <span class="text-gray-800 dark:text-gray-200 ml-1.5">{{ card.memoryHook }}</span>
              </div>
              <div v-if="card.tags && card.tags.length > 0">
                <span class="font-bold text-gray-700 dark:text-gray-300">Tags:</span>
                <span class="font-mono text-gray-800 dark:text-gray-200 ml-1.5">{{ card.tags.map(t => '#' + t).join(' ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load Next 3 Batches Pagination Button -->
      <div v-if="hasMoreBatches" class="pt-4 text-center">
        <button
          type="button"
          @click="loadMore"
          class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Load the next 3
        </button>
      </div>
    </div>
  </div>
</template>
