<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import rawBasicsData from '../../../data-parsed/basics.json'

interface BasicItem {
  id: string
  en: string
  fr: string
  es: string
  it: string
  nl: string
}

interface BasicCategory {
  id: string
  title: string
  items: BasicItem[]
}

const languages = [
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'nl', label: 'Dutch', flag: '🇳🇱' }
] as const

type LangCode = typeof languages[number]['code']

useHead({
  title: 'LangLearn - Language Basics',
  meta: [
    { name: 'description', content: 'Practice core vocabulary across French, Spanish, Italian, and Dutch.' }
  ]
})

const categories = rawBasicsData as BasicCategory[]
const selectedLang = ref<LangCode>('fr')
const searchQuery = ref('')
const showResetConfirm = ref(false)

// Set of item IDs currently revealed/learned for the current language
const revealedSet = ref<Set<string>>(new Set())

const storageKey = computed(() => `lang-basics-revealed-${selectedLang.value}`)

function loadSavedProgress() {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem(storageKey.value)
      if (saved) {
        const ids = JSON.parse(saved) as string[]
        revealedSet.value = new Set(ids)
        return
      }
    } catch {
      // Ignore storage errors
    }
  }
  revealedSet.value = new Set()
}

function saveProgress() {
  if (import.meta.client) {
    try {
      localStorage.setItem(
        storageKey.value,
        JSON.stringify(Array.from(revealedSet.value))
      )
    } catch {
      // Ignore storage errors
    }
  }
}

watch(selectedLang, () => {
  loadSavedProgress()
  showResetConfirm.value = false
})

onMounted(() => {
  loadSavedProgress()
})

function toggleWord(itemId: string) {
  const newSet = new Set(revealedSet.value)
  if (newSet.has(itemId)) {
    newSet.delete(itemId)
  } else {
    newSet.add(itemId)
  }
  revealedSet.value = newSet
  saveProgress()
}

function resetAll() {
  revealedSet.value = new Set()
  if (import.meta.client) {
    try {
      localStorage.removeItem(storageKey.value)
    } catch {
      // Ignore storage errors
    }
  }
  showResetConfirm.value = false
}

// Total word count
const totalWordsCount = computed(() => {
  return categories.reduce((sum, cat) => sum + cat.items.length, 0)
})

const revealedCount = computed(() => {
  return revealedSet.value.size
})

const progressPercentage = computed(() => {
  if (totalWordsCount.value === 0) return 0
  return Math.round((revealedCount.value / totalWordsCount.value) * 100)
})

// Filtered categories based on search input
const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories

  return categories
    .map(cat => {
      const titleMatches = cat.title.toLowerCase().includes(q)
      if (titleMatches) return cat

      const matchingItems = cat.items.filter(item => {
        const enMatch = item.en.toLowerCase().includes(q)
        const targetWord = item[selectedLang.value]?.toLowerCase() || ''
        const targetMatch = targetWord.includes(q)
        return enMatch || targetMatch
      })

      if (matchingItems.length > 0) {
        return {
          ...cat,
          items: matchingItems
        }
      }
      return null
    })
    .filter((cat): cat is BasicCategory => cat !== null)
})

const activeLangLabel = computed(() => {
  return languages.find(l => l.code === selectedLang.value)?.label || 'French'
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
    <!-- Navigation back -->
    <div>
      <NuxtLink
        to="/activities"
        class="inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
      >
        ← Back to Activities
      </NuxtLink>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Language Basics
          </h1>
          <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30">
            Basics
          </span>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mt-1.5 max-w-2xl text-sm leading-relaxed">
          Master core vocabulary by category. Click any faded English word to reveal its translation into {{ activeLangLabel }}. Click again to toggle back.
        </p>
      </div>

      <!-- Language Selector -->
      <div class="flex items-center gap-2 self-start md:self-end">
        <label for="language-select" class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Language:
        </label>
        <div class="relative">
          <select
            id="language-select"
            v-model="selectedLang"
            class="appearance-none bg-white dark:bg-[#182030] text-gray-900 dark:text-white text-sm font-semibold py-2 pl-3 pr-8 rounded-xl border border-gray-300 dark:border-gray-700/80 shadow-xs hover:border-amber-500/50 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 cursor-pointer transition-colors"
          >
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.flag }} {{ lang.label }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress and Controls Bar -->
    <div class="p-4 rounded-2xl bg-white dark:bg-[#182030] border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Progress Summary -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            {{ progressPercentage }}%
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ activeLangLabel }} Progress
            </div>
            <div class="text-sm font-bold text-gray-900 dark:text-white">
              {{ revealedCount }} / {{ totalWordsCount }} words revealed
            </div>
          </div>
        </div>

        <!-- Progress bar and Reset controls -->
        <div class="flex items-center gap-3">
          <!-- Reset button / confirmation -->
          <div v-if="!showResetConfirm">
            <button
              @click="showResetConfirm = true"
              :disabled="revealedCount === 0"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
              :class="revealedCount === 0
                ? 'border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'"
              title="Reset revealed words for current language"
            >
              Reset all words
            </button>
          </div>
          <div v-else class="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-xs">
            <span class="text-red-700 dark:text-red-300 font-medium pl-1">Reset all?</span>
            <button
              @click="resetAll"
              class="px-2 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors cursor-pointer"
            >
              Yes
            </button>
            <button
              @click="showResetConfirm = false"
              class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Linear Progress Bar -->
      <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          class="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <!-- Search Input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter categories or words..."
          class="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-[#121824] text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700/60 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- No search results -->
    <div v-if="filteredCategories.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
      No categories or words match "<span class="font-semibold">{{ searchQuery }}</span>".
    </div>

    <!-- Categories List -->
    <div v-else class="space-y-8">
      <section
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="space-y-3"
      >
        <!-- Category Title Header -->
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{{ cat.title }}</span>
          </h2>
          <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {{ cat.items.length }} {{ cat.items.length === 1 ? 'word' : 'words' }}
          </span>
        </div>

        <!-- Word Badges / Chips Cloud -->
        <div class="flex flex-wrap gap-2 pt-1">
          <button
            v-for="item in cat.items"
            :key="item.id"
            @click="toggleWord(item.id)"
            type="button"
            class="px-3 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer select-none text-left"
            :class="revealedSet.has(item.id)
              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40 font-semibold shadow-xs hover:bg-emerald-500/25'
              : 'bg-gray-100/90 dark:bg-[#1a2233] text-gray-500 dark:text-gray-400 border border-gray-200/80 dark:border-gray-700/60 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            :title="revealedSet.has(item.id) ? 'Click to show English' : `Click to show in ${activeLangLabel}`"
          >
            <!-- Revealed: Target Language -->
            <span v-if="revealedSet.has(item.id)" class="inline-flex items-center gap-1.5">
              <span>{{ item[selectedLang] || item.en }}</span>
              <span class="text-[10px] font-normal opacity-60 uppercase tracking-wider">
                ({{ selectedLang }})
              </span>
            </span>

            <!-- Unrevealed: English faded out with light background -->
            <span v-else class="inline-block">
              {{ item.en }}
            </span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
