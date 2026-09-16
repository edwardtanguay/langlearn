<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' }
] as const

type LangCode = typeof languages[number]['code']

// Language colors per agents.md (with vibrant Spanish red)
const languageColors: Record<string, string> = {
  fr: '#333388',
  es: '#e11d48', // Brighter vibrant Spanish red
  it: '#194d19',
  nl: '#d97706',
}

const languageNames: Record<string, string> = {
  fr: 'french',
  es: 'spanish',
  it: 'italian',
  nl: 'dutch',
}

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
const resetCategoryConfirmId = ref<string | null>(null)

// Accordion open category (single-open structure; initial state is all closed)
const openCategoryId = ref<string | null>(null)

// Current language color
const currentColor = computed(() => languageColors[selectedLang.value] || '#333388')

// Brighter color for percentage text and progress bar
const brightColor = computed(() => {
  if (selectedLang.value === 'es') {
    return '#f43f5e' // Bright vivid red for Spanish percentage and progress bar
  }
  const base = currentColor.value
  if (selectedLang.value === 'fr' || selectedLang.value === 'it') {
    return `color-mix(in srgb, ${base} 70%, white)`
  }
  return base
})

// Button-specific colors
const buttonColors: Record<string, string> = {
  fr: '#5566bb',
  es: '#e11d48',
  it: '#2d8a2d',
  nl: '#d97706',
}
const currentButtonColor = computed(() => buttonColors[selectedLang.value] || '#5566bb')

// Set of item IDs currently revealed/learned for the current language
const revealedSet = ref<Set<string>>(new Set())

// Numbers blur state: tracks which number items are blurred vs clear
const numberBlurState = ref<Map<string, 'clear' | 'blurred'>>(new Map())
const numberTimers = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map())
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Pronunciation Tips Map: itemId -> pronunciation string
const pronunciationMap = ref<Map<string, string>>(new Map())

// Pronunciation Modal State
const showPronunciationModal = ref(false)
const activePronunciationItem = ref<BasicItem | null>(null)
const pronunciationInput = ref('')

const storageKey = computed(() => `lang-basics-revealed-${selectedLang.value}`)
const pronunciationStorageKey = computed(() => `lang-basics-pronunciation-${selectedLang.value}`)

// Helper: extract category ID from item ID (e.g. "numbers-1-100-5" → "numbers-1-100")
function getCategoryId(itemId: string): string {
  return itemId.replace(/-\d+$/, '')
}

function loadSavedProgress() {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem(storageKey.value)
      if (saved) {
        const ids = JSON.parse(saved) as string[]
        revealedSet.value = new Set(ids)
        // Restore blur state for any revealed number items
        const newBlurState = new Map<string, 'clear' | 'blurred'>()
        for (const id of ids) {
          if (getCategoryId(id) === 'numbers-1-100') {
            newBlurState.set(id, 'blurred')
          }
        }
        numberBlurState.value = newBlurState
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
    updateAllLangProgress()
  }
}

// Load pronunciation tips from localStorage and server
async function loadPronunciations() {
  const newMap = new Map<string, string>()

  // 1. Read from localStorage for immediate display
  if (import.meta.client) {
    try {
      const localData = localStorage.getItem(pronunciationStorageKey.value)
      if (localData) {
        const parsed = JSON.parse(localData) as Record<string, string>
        for (const [key, val] of Object.entries(parsed)) {
          if (val) newMap.set(key, val)
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  // 2. Fetch from database endpoint
  try {
    const data = await $fetch<{ items: Array<{ wordId: string; pronunciation: string | null }> }>(
      `/api/basics/word-info?language=${selectedLang.value}`
    )
    if (data?.items) {
      for (const it of data.items) {
        if (it.pronunciation) {
          newMap.set(it.wordId, it.pronunciation)
        } else {
          newMap.delete(it.wordId)
        }
      }
      // Sync merged back to localStorage
      if (import.meta.client) {
        const obj: Record<string, string> = {}
        newMap.forEach((v, k) => { obj[k] = v })
        localStorage.setItem(pronunciationStorageKey.value, JSON.stringify(obj))
      }
    }
  } catch (e) {
    // If offline or unauthenticated, local map remains active
  }

  pronunciationMap.value = newMap
}

watch(selectedLang, () => {
  // Clear all number timers on language switch
  clearAllNumberTimers()
  loadSavedProgress()
  loadPronunciations()
  updateAllLangProgress()
  showResetConfirm.value = false
  resetCategoryConfirmId.value = null
})

function selectLanguage(code: LangCode) {
  selectedLang.value = code
  dropdownOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  loadSavedProgress()
  loadPronunciations()
  updateAllLangProgress()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  clearAllNumberTimers()
  document.removeEventListener('click', handleClickOutside)
  if (toastTimeout) clearTimeout(toastTimeout)
})

function clearAllNumberTimers() {
  for (const timer of numberTimers.value.values()) {
    clearTimeout(timer)
  }
  numberTimers.value.clear()
}

function toggleWord(itemId: string) {
  const newSet = new Set(revealedSet.value)
  const catId = getCategoryId(itemId)

  if (newSet.has(itemId)) {
    newSet.delete(itemId)
    // Clean up number blur state
    if (catId === 'numbers-1-100') {
      numberBlurState.value.delete(itemId)
      const timer = numberTimers.value.get(itemId)
      if (timer) {
        clearTimeout(timer)
        numberTimers.value.delete(itemId)
      }
    }
  } else {
    newSet.add(itemId)
    // Start blur timer for numbers
    if (catId === 'numbers-1-100') {
      numberBlurState.value.set(itemId, 'clear')
      const timer = setTimeout(() => {
        numberBlurState.value.set(itemId, 'blurred')
        // Force reactivity by creating new Map
        numberBlurState.value = new Map(numberBlurState.value)
        numberTimers.value.delete(itemId)
      }, 3000)
      numberTimers.value.set(itemId, timer)
    }
  }
  revealedSet.value = newSet
  saveProgress()
}

function resetAll() {
  revealedSet.value = new Set()
  clearAllNumberTimers()
  numberBlurState.value = new Map()
  if (import.meta.client) {
    try {
      localStorage.removeItem(storageKey.value)
    } catch {
      // Ignore storage errors
    }
  }
  updateAllLangProgress()
  showResetConfirm.value = false
}

function resetCategory(catId: string, event?: Event) {
  if (event) event.stopPropagation()
  const cat = categories.find(c => c.id === catId)
  if (!cat) return

  const newSet = new Set(revealedSet.value)
  for (const item of cat.items) {
    newSet.delete(item.id)
    if (catId === 'numbers-1-100') {
      numberBlurState.value.delete(item.id)
      const timer = numberTimers.value.get(item.id)
      if (timer) {
        clearTimeout(timer)
        numberTimers.value.delete(item.id)
      }
    }
  }
  revealedSet.value = newSet
  numberBlurState.value = new Map(numberBlurState.value)
  saveProgress()
  resetCategoryConfirmId.value = null
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

// Progress percentage across all languages
const allLangProgress = ref<Record<LangCode, number>>({
  fr: 0,
  es: 0,
  it: 0,
  nl: 0
})

function updateAllLangProgress() {
  if (import.meta.client && totalWordsCount.value > 0) {
    for (const l of languages) {
      if (l.code === selectedLang.value) {
        allLangProgress.value[l.code] = progressPercentage.value
      } else {
        try {
          const saved = localStorage.getItem(`lang-basics-revealed-${l.code}`)
          if (saved) {
            const ids = JSON.parse(saved) as string[]
            allLangProgress.value[l.code] = Math.round((ids.length / totalWordsCount.value) * 100)
          } else {
            allLangProgress.value[l.code] = 0
          }
        } catch {
          allLangProgress.value[l.code] = 0
        }
      }
    }
  }
}

// Filtered categories based on immediate search input
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

// Accordion toggle handler
function toggleCategory(catId: string) {
  if (openCategoryId.value === catId) {
    openCategoryId.value = null
  } else {
    openCategoryId.value = catId
  }
}

// Determine if a category is open: auto-expanded when search is active, or user-selected
function isCategoryExpanded(catId: string): boolean {
  if (searchQuery.value.trim().length > 0) {
    return true
  }
  return openCategoryId.value === catId
}

// Category learned stats
function getCategoryLearnedCount(cat: BasicCategory): number {
  return cat.items.filter(item => revealedSet.value.has(item.id)).length
}

function getCategoryLearnedPercentage(cat: BasicCategory): number {
  if (cat.items.length === 0) return 0
  return Math.round((getCategoryLearnedCount(cat) / cat.items.length) * 100)
}

const activeLangLabel = computed(() => {
  return languages.find(l => l.code === selectedLang.value)?.label || 'French'
})

// Dropdown options: exclude the currently selected language
const dropdownLanguageOptions = computed(() => {
  return languages.filter(l => l.code !== selectedLang.value)
})

// Action handlers for icons
function handleExampleSearch(item: BasicItem, event: Event) {
  event.stopPropagation()
  const langName = languageNames[selectedLang.value] || 'french'
  const targetWord = item[selectedLang.value] || item.en
  const catId = getCategoryId(item.id)

  let query: string
  if (catId === 'opposites' && targetWord.includes('/')) {
    const [word1, word2] = targetWord.split('/')
    query = `create 3 ${langName} examples with both "${word1}" and "${word2}"`
  } else {
    query = `create 3 ${langName} examples with "${targetWord}"`
  }

  window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
}

function handleGoogleTranslate(item: BasicItem, event: Event) {
  event.stopPropagation()
  const targetWord = item[selectedLang.value] || item.en
  const url = `https://translate.google.com/?sl=${selectedLang.value}&tl=en&text=${encodeURIComponent(targetWord)}&op=translate`
  window.open(url, '_blank')
}

// Toast notification for background operations
const toastMessage = ref('')
let toastTimeout: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
}

function savePronunciationToLocalStorage() {
  if (import.meta.client) {
    try {
      const obj: Record<string, string> = {}
      pronunciationMap.value.forEach((v, k) => { obj[k] = v })
      localStorage.setItem(pronunciationStorageKey.value, JSON.stringify(obj))
    } catch {
      // Ignore
    }
  }
}

// Pronunciation modal handlers
function openPronunciationModal(item: BasicItem, event: Event) {
  event.stopPropagation()
  activePronunciationItem.value = item
  pronunciationInput.value = pronunciationMap.value.get(item.id) || ''
  showPronunciationModal.value = true
}

async function savePronunciationTip() {
  if (!activePronunciationItem.value) return
  const item = activePronunciationItem.value
  const note = pronunciationInput.value.trim()
  const previousNote = pronunciationMap.value.get(item.id)

  // 1. Optimistic and immediate close
  showPronunciationModal.value = false
  activePronunciationItem.value = null

  // 2. Optimistically update local state & localStorage
  if (note) {
    pronunciationMap.value.set(item.id, note)
  } else {
    pronunciationMap.value.delete(item.id)
  }
  pronunciationMap.value = new Map(pronunciationMap.value)
  savePronunciationToLocalStorage()

  // 3. Save to server in the background
  try {
    await $fetch('/api/basics/word-info', {
      method: 'PUT',
      body: {
        wordId: item.id,
        language: selectedLang.value,
        pronunciation: note || null
      }
    })
  } catch (err: any) {
    // If saving fails, rollback local state and notify user
    if (previousNote !== undefined) {
      pronunciationMap.value.set(item.id, previousNote)
    } else {
      pronunciationMap.value.delete(item.id)
    }
    pronunciationMap.value = new Map(pronunciationMap.value)
    savePronunciationToLocalStorage()
    showToast('Failed to save pronunciation note online. Reverted changes.')
  }
}

// Check if an item should show icons (not pronunciation, not numbers)
function shouldShowIcons(itemId: string): boolean {
  const catId = getCategoryId(itemId)
  return catId !== 'pronunciation-of-letters' && catId !== 'numbers-1-100'
}

// Check if an item is a pronunciation item
function isPronunciation(itemId: string): boolean {
  return getCategoryId(itemId) === 'pronunciation-of-letters'
}

// Get uppercase letter for pronunciation items (e.g. "pronunciation-of-letters-1" → "A")
function getLetterForPronunciation(itemId: string): string {
  const num = parseInt(itemId.replace('pronunciation-of-letters-', ''), 10)
  return String.fromCharCode(64 + num)
}

// Check if a number item is blurred
function isNumberBlurred(itemId: string): boolean {
  return numberBlurState.value.get(itemId) === 'blurred'
}

// Check if item is a number
function isNumber(itemId: string): boolean {
  return getCategoryId(itemId) === 'numbers-1-100'
}

// Search helpers
function isItemFoundBySearch(item: BasicItem): boolean {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return false
  const enMatch = item.en.toLowerCase().includes(q)
  const targetMatch = (item[selectedLang.value]?.toLowerCase() || '').includes(q)
  return enMatch || targetMatch
}

function isCategoryFoundBySearch(cat: BasicCategory): boolean {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return false
  return cat.title.toLowerCase().includes(q)
}

// Determine if the item should currently be displayed as revealed (target language) or unrevealed (English)
function isItemDisplayedRevealed(item: BasicItem): boolean {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) {
    return revealedSet.value.has(item.id)
  }

  const enMatch = item.en.toLowerCase().includes(q)
  const targetMatch = (item[selectedLang.value]?.toLowerCase() || '').includes(q)

  // If matched on target language side while unrevealed, flip to revealed
  if (targetMatch && !enMatch) {
    return true
  }
  // If matched on English side while revealed, flip to unrevealed
  if (enMatch && !targetMatch) {
    return false
  }
  // If both match or neither matches directly (category match)
  return revealedSet.value.has(item.id)
}

// Effectively blurred: unblurred if matched in search
function isItemEffectivelyBlurred(itemId: string): boolean {
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    const catId = getCategoryId(itemId)
    const cat = categories.find(c => c.id === catId)
    const item = cat?.items.find(i => i.id === itemId)
    if (item && isItemFoundBySearch(item)) {
      return false
    }
  }
  return isNumberBlurred(itemId)
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-4 space-y-6">
    <!-- Sticky Header: from top navigation link down through search textbox -->
    <div class="sticky top-16 z-30 bg-white/95 dark:bg-[#121824]/95 backdrop-blur-md pt-2 pb-3 shadow-xs space-y-3 border-b border-gray-200/80 dark:border-gray-800/80 -mx-4 px-4">
      <!-- Top Navigation Link inside sticky container -->
      <div>
        <NuxtLink
          to="/activities"
          class="inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
        >
          ← Back to Activities
        </NuxtLink>
      </div>

      <!-- Title row: "Learn language basics for: " + language selector -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Learn language basics for:
          </h1>
          <!-- Language Selector (Fixed width w-44 sm:w-48, showing current language percentage) -->
          <div ref="dropdownRef" class="relative inline-block">
            <button
              type="button"
              @click.stop="dropdownOpen = !dropdownOpen"
              class="w-44 sm:w-48 flex items-center justify-between gap-2 text-white text-sm font-bold py-1.5 px-3 rounded-xl border border-transparent shadow-xs cursor-pointer transition-all focus:outline-none"
              :style="{ backgroundColor: currentColor }"
            >
              <span class="truncate">{{ activeLangLabel }}</span>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-black/20 text-white/90">
                  {{ allLangProgress[selectedLang] }}%
                </span>
                <svg class="w-4 h-4 transition-transform text-white/90" :class="{ 'rotate-180': dropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <!-- Dropdown menu showing other languages with matching width -->
            <div
              v-if="dropdownOpen"
              class="absolute left-0 sm:right-0 sm:left-auto mt-1 w-44 sm:w-48 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 z-50 bg-white dark:bg-gray-800"
            >
              <button
                v-for="lang in dropdownLanguageOptions"
                :key="lang.code"
                type="button"
                @click.stop="selectLanguage(lang.code)"
                class="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer"
                :style="{ backgroundColor: languageColors[lang.code] }"
              >
                <span>{{ lang.label }}</span>
                <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-black/20 text-white/90">
                  {{ allLangProgress[lang.code] }}%
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Panel: LARGE % centered horizontally on left, stats on right -->
      <div class="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200/90 dark:border-gray-800 shadow-xs">
        <div class="flex items-center gap-4">
          <!-- Large Percentage on Left, centered horizontally in allocated column -->
          <div
            class="text-3xl sm:text-4xl font-black tracking-tight shrink-0 min-w-[75px] flex items-center justify-center text-center"
            :style="{ color: brightColor }"
          >
            {{ progressPercentage }}%
          </div>

          <!-- Stats & Progress Controls on Right -->
          <div class="flex-1 min-w-0 space-y-1.5">
            <!-- Line 1: words learned count + Reset all words button -->
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                {{ revealedCount }} / {{ totalWordsCount }} words learned
              </div>

              <!-- Reset All Button / Confirmation -->
              <div class="shrink-0">
                <div v-if="!showResetConfirm">
                  <button
                    @click="showResetConfirm = true"
                    :disabled="revealedCount === 0"
                    class="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                    :class="revealedCount === 0
                      ? 'border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'"
                    title="Reset all revealed words for current language"
                  >
                    Reset all words
                  </button>
                </div>
                <div v-else class="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 p-1 rounded-lg border border-red-200 dark:border-red-900/50 text-xs">
                  <span class="text-red-700 dark:text-red-300 font-medium pl-1 text-[11px]">Reset all?</span>
                  <button
                    @click="resetAll"
                    class="px-2 py-0.5 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors cursor-pointer text-xs"
                  >
                    Yes
                  </button>
                  <button
                    @click="showResetConfirm = false"
                    class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <!-- Line 2: Linear Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                class="h-2.5 rounded-full transition-all duration-300 ease-out"
                :style="{ width: `${progressPercentage}%`, backgroundColor: brightColor }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Input (Full width on mobile, immediate filtering) -->
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter categories or words..."
          class="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-[#182030] text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
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

    <!-- Categories List in Accordion Structure -->
    <div v-else class="space-y-3 pt-2">
      <div
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="rounded-xl border border-gray-200 dark:border-gray-800/90 bg-white dark:bg-[#151d2c] overflow-hidden transition-all duration-200"
        :class="isCategoryFoundBySearch(cat)
          ? 'shadow-[0_0_14px_rgba(217,119,6,0.5)] dark:shadow-[0_0_16px_rgba(255,255,255,0.75)]'
          : 'shadow-xs'"
      >
        <!-- Accordion Header Button (Title left, % learned loading bar right) -->
        <button
          type="button"
          @click="toggleCategory(cat.id)"
          class="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-[#192335] transition-colors select-none"
        >
          <div class="flex items-center gap-2 min-w-0 pr-2">
            <span class="text-sm font-bold text-gray-900 dark:text-white truncate">
              {{ cat.title }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500 font-normal shrink-0">
              ({{ cat.items.length }})
            </span>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <!-- Learned percentage loading bar for this category (with corners, language color, centered % text) -->
            <div
              class="relative w-24 sm:w-28 h-5 bg-gray-200 dark:bg-gray-800 rounded-none overflow-hidden border border-gray-300/70 dark:border-gray-700/70 shrink-0"
            >
              <div
                class="h-full rounded-none transition-all duration-300 ease-out"
                :style="{
                  width: `${getCategoryLearnedPercentage(cat)}%`,
                  backgroundColor: brightColor
                }"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-gray-800 dark:text-gray-100 drop-shadow-xs pointer-events-none">
                {{ getCategoryLearnedPercentage(cat) }}%
              </div>
            </div>

            <!-- Accordion chevron indicator -->
            <svg
              class="w-4 h-4 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': isCategoryExpanded(cat.id) }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Accordion Content Area -->
        <div v-if="isCategoryExpanded(cat.id)" class="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800/60 space-y-3">
          <!-- Sub-bar: Reset Category on the far right with 'Are you sure' step -->
          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {{ getCategoryLearnedCount(cat) }} / {{ cat.items.length }} learned
            </span>

            <!-- Reset Category Controls -->
            <div class="shrink-0">
              <div v-if="resetCategoryConfirmId !== cat.id">
                <button
                  type="button"
                  @click.stop="resetCategoryConfirmId = cat.id"
                  :disabled="getCategoryLearnedCount(cat) === 0"
                  class="px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer"
                  :class="getCategoryLearnedCount(cat) === 0
                    ? 'border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'"
                  title="Reset revealed words for this category"
                >
                  Reset Category
                </button>
              </div>
              <div v-else class="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 p-1 rounded-md border border-red-200 dark:border-red-900/50 text-xs">
                <span class="text-red-700 dark:text-red-300 font-medium pl-1 text-[11px]">Reset category?</span>
                <button
                  type="button"
                  @click.stop="resetCategory(cat.id, $event)"
                  class="px-2 py-0.5 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors cursor-pointer text-xs"
                >
                  Yes
                </button>
                <button
                  type="button"
                  @click.stop="resetCategoryConfirmId = null"
                  class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Word Badges / Chips Cloud -->
          <div class="flex flex-wrap gap-2 pt-0.5">
            <button
              v-for="item in cat.items"
              :key="item.id"
              @click="toggleWord(item.id)"
              type="button"
              class="px-3 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer select-none text-left"
              :class="[
                isItemDisplayedRevealed(item)
                  ? 'font-semibold shadow-xs'
                  : 'bg-gray-100/90 dark:bg-[#1a2233] text-gray-500 dark:text-gray-400 border border-gray-200/80 dark:border-gray-700/60 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
                isItemFoundBySearch(item) ? 'shadow-[0_0_10px_rgba(217,119,6,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.85)]' : ''
              ]"
              :style="isItemDisplayedRevealed(item) ? {
                backgroundColor: `color-mix(in srgb, ${currentButtonColor} 20%, transparent)`,
                color: `color-mix(in srgb, ${currentButtonColor} 50%, white)`,
                border: `1px solid color-mix(in srgb, ${currentButtonColor} 45%, transparent)`,
              } : undefined"
              :title="isItemDisplayedRevealed(item) ? 'Click to show English' : `Click to show in ${activeLangLabel}`"
            >
              <!-- Revealed: Target Language -->
              <span v-if="isItemDisplayedRevealed(item)" class="inline-flex items-center gap-1.5">
                <!-- Pronunciation of Letters: bracketed monospace, no extra icons -->
                <template v-if="isPronunciation(item.id)">
                  <span style="font-family: 'Courier New', Courier, monospace;">[{{ item[selectedLang] || item.en }}]</span>
                </template>

                <!-- Numbers: show word with smooth blur effect without width/layout snapping -->
                <template v-else-if="isNumber(item.id)">
                  <span
                    class="inline-flex items-center gap-1.5 number-cell-content"
                    :class="{ 'number-cell-blurred': isItemEffectivelyBlurred(item.id) }"
                  >
                    <span>{{ item[selectedLang] || item.en }}</span>
                    <!-- Pronunciation Note placed right after the word, before icons -->
                    <span v-if="pronunciationMap.get(item.id)" class="text-xs font-mono opacity-85 font-normal ml-0.5">
                      [{{ pronunciationMap.get(item.id) }}]
                    </span>
                    <!-- Star + Translate + Pronunciation icons -->
                    <span
                      class="inline-flex items-center justify-center w-4 h-4 opacity-60 hover:opacity-100 transition-opacity"
                      :class="isItemEffectivelyBlurred(item.id) ? 'pointer-events-none' : 'cursor-pointer'"
                      title="Search for 3 example sentences"
                      @click="handleExampleSearch(item, $event)"
                    >
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </span>
                    <span
                      class="inline-flex items-center justify-center w-4 h-4 opacity-60 hover:opacity-100 transition-opacity"
                      :class="isItemEffectivelyBlurred(item.id) ? 'pointer-events-none' : 'cursor-pointer'"
                      title="Look up in Google Translate"
                      @click="handleGoogleTranslate(item, $event)"
                    >
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                    </span>
                    <!-- Pronunciation 'P' button -->
                    <span
                      class="inline-flex items-center justify-center w-4 h-4 text-xs font-bold font-mono opacity-60 hover:opacity-100 transition-opacity rounded"
                      :class="isItemEffectivelyBlurred(item.id) ? 'pointer-events-none' : 'cursor-pointer'"
                      title="Add or edit pronunciation tip"
                      @click="openPronunciationModal(item, $event)"
                    >
                      P
                    </span>
                  </span>
                </template>

                <!-- All other categories: word + pronunciation + star + translate + P icons -->
                <template v-else>
                  <span>{{ item[selectedLang] || item.en }}</span>
                  <!-- Pronunciation Note placed right after the word, before icons -->
                  <span v-if="pronunciationMap.get(item.id)" class="text-xs font-mono opacity-85 font-normal ml-0.5">
                    [{{ pronunciationMap.get(item.id) }}]
                  </span>
                  <!-- Star icon: example sentences -->
                  <span
                    class="inline-flex items-center justify-center w-4 h-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Search for 3 example sentences"
                    @click="handleExampleSearch(item, $event)"
                  >
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </span>
                  <!-- Google Translate icon -->
                  <span
                    class="inline-flex items-center justify-center w-4 h-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Look up in Google Translate"
                    @click="handleGoogleTranslate(item, $event)"
                  >
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                  </span>
                  <!-- Pronunciation 'P' button -->
                  <span
                    class="inline-flex items-center justify-center w-4 h-4 text-xs font-bold font-mono opacity-60 hover:opacity-100 transition-opacity rounded cursor-pointer"
                    title="Add or edit pronunciation tip"
                    @click="openPronunciationModal(item, $event)"
                  >
                    P
                  </span>
                </template>
              </span>

              <!-- Unrevealed: English faded out with light background -->
              <span v-else class="inline-block">
                {{ isPronunciation(item.id) ? getLetterForPronunciation(item.id) : item.en }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pronunciation Modal -->
    <div
      v-if="showPronunciationModal && activePronunciationItem"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      @click.self="showPronunciationModal = false"
    >
      <div class="bg-white dark:bg-[#161f30] border border-gray-200 dark:border-gray-700/80 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Pronunciation Tip</span>
            <span class="text-xs px-2 py-0.5 rounded font-mono font-normal uppercase" :style="{ backgroundColor: `color-mix(in srgb, ${currentColor} 20%, transparent)`, color: brightColor }">
              {{ activeLangLabel }}
            </span>
          </h3>
          <button
            @click="showPronunciationModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="space-y-1.5">
          <div class="text-xs text-gray-500 dark:text-gray-400">Word:</div>
          <div class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{{ activePronunciationItem[selectedLang] || activePronunciationItem.en }}</span>
            <span class="text-xs font-normal text-gray-400">({{ activePronunciationItem.en }})</span>
          </div>
        </div>

        <form @submit.prevent="savePronunciationTip" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Pronunciation note will show in brackets [ ]
            </label>
            <input
              v-model="pronunciationInput"
              type="text"
              placeholder="e.g. bohn-zhoor or phonetic guide"
              class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#121824] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              autofocus
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showPronunciationModal = false"
              class="px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-2"
      >
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.number-cell-content {
  transition: filter 0.5s ease-out, opacity 0.5s ease-out;
  filter: blur(0);
}

.number-cell-blurred {
  filter: blur(4px);
  user-select: none;
}
</style>
