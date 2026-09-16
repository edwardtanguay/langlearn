<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import rawBasicsData from '../../../data-parsed/basics.json'

interface BasicItem {
  id: string
  en: string
  fr: string
  es: string
  it: string
  nl: string
}

interface CategoryVideo {
  url: string
  title: string
}

interface BasicCategory {
  id: string
  title: string
  items: BasicItem[]
  videos?: Record<string, CategoryVideo[]>
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
  es: '#e11d48',
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
    return '#f43f5e'
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

// Set of item IDs currently learned for the current language
const revealedSet = ref<Set<string>>(new Set())

// Word pill learning & unlearning states
const activeLearningWords = ref<Set<string>>(new Set())

// Learned word pills clicked again: showing translation + '✕' unlearn button
const activeUnlearnWords = ref<Set<string>>(new Set())

// Stats loading state: blurs all numeric progress values until data is ready
const isStatsLoading = ref(true)
let statsLoadTimer: ReturnType<typeof setTimeout> | null = null

function clearStatsLoading() {
  if (statsLoadTimer) clearTimeout(statsLoadTimer)
  statsLoadTimer = setTimeout(() => {
    isStatsLoading.value = false
  }, 250)
}

const searchInputRef = ref<HTMLInputElement | null>(null)

// Sticky header scroll state
const isScrolled = ref(false)

// Temporary toggles during search mode (does not affect saved progress or counts)
const searchTemporaryToggles = ref<Map<string, boolean>>(new Map())

// Pronunciation Tips Map: itemId -> pronunciation string
const pronunciationMap = ref<Map<string, string>>(new Map())

// Pronunciation Modal State
const showPronunciationModal = ref(false)
const activePronunciationItem = ref<BasicItem | null>(null)
const pronunciationInput = ref('')
const pronunciationInputRef = ref<HTMLInputElement | null>(null)

// Multilingual Comparison Modal ("C" icon)
const showCrossLanguageModal = ref(false)
const activeCrossLanguageItem = ref<BasicItem | null>(null)

// Test Pronunciation Mode State
const isTestPronunciationMode = ref(false)
const testPronunciationRevealed = ref<Set<string>>(new Set())

const storageKey = computed(() => `lang-basics-revealed-${selectedLang.value}`)
const pronunciationStorageKey = computed(() => `lang-basics-pronunciation-${selectedLang.value}`)

// Helper: extract category ID from item ID
function getCategoryId(itemId: string): string {
  return itemId.replace(/-\d+$/, '')
}

function clearAllTimers() {
  activeLearningWords.value.clear()
  activeUnlearnWords.value.clear()
}

function clearLearningTimer(itemId: string) {
  activeLearningWords.value.delete(itemId)
}

function clearUnlearnTimer(itemId: string) {
  activeUnlearnWords.value.delete(itemId)
}

async function loadSavedProgress() {
  // 1. Read from localStorage for immediate display
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem(storageKey.value)
      if (saved) {
        const ids = JSON.parse(saved) as string[]
        revealedSet.value = new Set(ids)
      }
    } catch {
      // Ignore storage errors
    }
  }

  // 2. Fetch from DB
  try {
    const data = await $fetch<{ items: Array<{ wordId: string; isLearned?: boolean; pronunciation?: string | null }> }>(
      `/api/basics/word-info?language=${selectedLang.value}`
    )
    if (data?.items) {
      const dbLearnedIds = new Set<string>()
      for (const it of data.items) {
        if (it.isLearned) {
          dbLearnedIds.add(it.wordId)
        }
      }

      // Sync any items present in localStorage that might not be in DB yet
      const localOnlyIds: string[] = []
      for (const localId of revealedSet.value) {
        if (!dbLearnedIds.has(localId)) {
          localOnlyIds.push(localId)
          dbLearnedIds.add(localId)
        }
      }

      if (localOnlyIds.length > 0) {
        $fetch('/api/basics/word-info', {
          method: 'PUT',
          body: {
            language: selectedLang.value,
            syncLearnedWordIds: localOnlyIds
          }
        }).catch(() => {})
      }

      revealedSet.value = dbLearnedIds
      if (import.meta.client) {
        localStorage.setItem(storageKey.value, JSON.stringify(Array.from(dbLearnedIds)))
      }
    }
  } catch {
    // Unauthenticated or offline: localStorage remains active
  } finally {
    clearStatsLoading()
    updateAllLangProgress()
  }
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
  } catch {
    // If offline or unauthenticated, local map remains active
  }

  pronunciationMap.value = newMap
}

function scrollToTop() {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}

watch(selectedLang, () => {
  clearAllTimers()
  openCategoryId.value = null
  isTestPronunciationMode.value = false
  testPronunciationRevealed.value.clear()
  isStatsLoading.value = true
  loadSavedProgress()
  loadPronunciations()
  updateAllLangProgress()
  showResetConfirm.value = false
  resetCategoryConfirmId.value = null
})

// Watch search query: when returning to "no search", reset temporary toggles, close categories, and scroll to top
watch(searchQuery, (newVal, oldVal) => {
  if (!newVal.trim()) {
    searchTemporaryToggles.value.clear()
    openCategoryId.value = null
    if (oldVal && oldVal.trim()) {
      nextTick(() => {
        scrollToTop()
        searchInputRef.value?.focus()
      })
    }
  }
})

function clearSearch() {
  const hadSearch = searchQuery.value.trim().length > 0
  searchQuery.value = ''
  searchTemporaryToggles.value.clear()
  openCategoryId.value = null
  nextTick(() => {
    if (hadSearch) {
      scrollToTop()
    }
    searchInputRef.value?.focus()
  })
}

function handleScroll() {
  if (import.meta.client) {
    isScrolled.value = window.scrollY > 10
  }
}

function selectLanguage(code: LangCode) {
  if (selectedLang.value === code) return
  selectedLang.value = code
  openCategoryId.value = null
  scrollToTop()
}

onMounted(() => {
  loadSavedProgress()
  loadPronunciations()
  updateAllLangProgress()
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
})

onUnmounted(() => {
  clearAllTimers()
  if (statsLoadTimer) clearTimeout(statsLoadTimer)
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
  }
  if (toastTimeout) clearTimeout(toastTimeout)
})

function toggleWord(itemId: string) {
  // In search mode, toggles are temporary: flips visual state without affecting progress or percentage
  if (searchQuery.value.trim().length > 0) {
    const allItems = categories.flatMap(c => c.items)
    const item = allItems.find(i => i.id === itemId)
    if (!item) return
    const currentlyRevealed = isItemDisplayedRevealed(item)
    searchTemporaryToggles.value.set(itemId, !currentlyRevealed)
    searchTemporaryToggles.value = new Map(searchTemporaryToggles.value)
    return
  }

  // Case 1: Word is already learned
  if (revealedSet.value.has(itemId)) {
    if (activeUnlearnWords.value.has(itemId)) {
      // Toggle unlearn view off if tapped again
      activeUnlearnWords.value.delete(itemId)
      activeUnlearnWords.value = new Set(activeUnlearnWords.value)
    } else {
      // Reveal target translation with '✕' unlearn button (stays open until clicked again or unlearned)
      activeUnlearnWords.value.add(itemId)
      activeUnlearnWords.value = new Set(activeUnlearnWords.value)
    }
    return
  }

  // Case 2: Word is unlearned
  if (activeLearningWords.value.has(itemId)) {
    // Tapped again while revealed: close/revert without learning
    activeLearningWords.value.delete(itemId)
    activeLearningWords.value = new Set(activeLearningWords.value)
    return
  }

  // Reveal target translation with '✓' learn button (stays open until clicked again or checked)
  activeLearningWords.value.add(itemId)
  activeLearningWords.value = new Set(activeLearningWords.value)
}

function finalizeWordLearned(itemId: string, event?: Event) {
  if (event) event.stopPropagation()
  activeLearningWords.value.delete(itemId)
  activeLearningWords.value = new Set(activeLearningWords.value)

  revealedSet.value.add(itemId)
  revealedSet.value = new Set(revealedSet.value)
  saveProgress()

  // Persist to DB in background
  $fetch('/api/basics/word-info', {
    method: 'PUT',
    body: {
      wordId: itemId,
      language: selectedLang.value,
      isLearned: true
    }
  }).catch(() => {})
}

function unlearnWord(itemId: string, event?: Event) {
  if (event) event.stopPropagation()
  activeUnlearnWords.value.delete(itemId)
  activeUnlearnWords.value = new Set(activeUnlearnWords.value)

  revealedSet.value.delete(itemId)
  revealedSet.value = new Set(revealedSet.value)
  saveProgress()

  // Persist to DB in background
  $fetch('/api/basics/word-info', {
    method: 'PUT',
    body: {
      wordId: itemId,
      language: selectedLang.value,
      isLearned: false
    }
  }).catch(() => {})
}

async function resetAll() {
  revealedSet.value = new Set()
  clearAllTimers()
  if (import.meta.client) {
    try {
      localStorage.removeItem(storageKey.value)
    } catch {}
  }
  updateAllLangProgress()
  showResetConfirm.value = false

  try {
    await $fetch('/api/basics/reset', {
      method: 'POST',
      body: { language: selectedLang.value }
    })
  } catch {}
}

async function resetCategory(catId: string, event?: Event) {
  if (event) event.stopPropagation()
  const cat = categories.find(c => c.id === catId)
  if (!cat) return

  const newSet = new Set(revealedSet.value)
  const wordIdsToReset: string[] = []
  for (const item of cat.items) {
    if (newSet.has(item.id)) {
      newSet.delete(item.id)
      wordIdsToReset.push(item.id)
    }
    clearLearningTimer(item.id)
    clearUnlearnTimer(item.id)
    activeLearningWords.value.delete(item.id)
    activeUnlearnWords.value.delete(item.id)
  }
  revealedSet.value = newSet
  saveProgress()
  resetCategoryConfirmId.value = null

  try {
    await $fetch('/api/basics/reset', {
      method: 'POST',
      body: {
        language: selectedLang.value,
        wordIds: wordIdsToReset
      }
    })
  } catch {}
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

// Words that have pronunciation tips in current language
const wordsWithPronunciation = computed(() => {
  const allItems = categories.flatMap(c => c.items)
  return allItems.filter(item => Boolean(pronunciationMap.value.get(item.id)))
})

const hasAnyPronunciationTips = computed(() => {
  return wordsWithPronunciation.value.length > 0
})

function toggleTestPronunciation() {
  isTestPronunciationMode.value = !isTestPronunciationMode.value
  testPronunciationRevealed.value.clear()
  scrollToTop()
}

function toggleTestPronunciationItem(itemId: string) {
  if (testPronunciationRevealed.value.has(itemId)) {
    testPronunciationRevealed.value.delete(itemId)
  } else {
    testPronunciationRevealed.value.add(itemId)
  }
  testPronunciationRevealed.value = new Set(testPronunciationRevealed.value)
}

// Filtered categories based on immediate search input
const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories

  const canSearchCategoryTitle = q.length >= 4

  return categories
    .map(cat => {
      const titleMatches = canSearchCategoryTitle && cat.title.toLowerCase().includes(q)
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
    } catch {}
  }
}

// Pronunciation modal handlers
function openPronunciationModal(item: BasicItem, event: Event) {
  event.stopPropagation()
  activePronunciationItem.value = item
  pronunciationInput.value = pronunciationMap.value.get(item.id) || ''
  showPronunciationModal.value = true
  nextTick(() => {
    pronunciationInputRef.value?.focus()
  })
}

// Cross-language modal handlers ("C" icon)
function openCrossLanguageModal(item: BasicItem, event: Event) {
  event.stopPropagation()
  activeCrossLanguageItem.value = item
  showCrossLanguageModal.value = true
}

async function savePronunciationTip() {
  if (!activePronunciationItem.value) return
  const item = activePronunciationItem.value
  const note = pronunciationInput.value.trim()
  const previousNote = pronunciationMap.value.get(item.id)

  showPronunciationModal.value = false
  activePronunciationItem.value = null

  if (note) {
    pronunciationMap.value.set(item.id, note)
  } else {
    pronunciationMap.value.delete(item.id)
  }
  pronunciationMap.value = new Map(pronunciationMap.value)
  savePronunciationToLocalStorage()

  try {
    await $fetch('/api/basics/word-info', {
      method: 'PUT',
      body: {
        wordId: item.id,
        language: selectedLang.value,
        pronunciation: note || null
      }
    })
  } catch {
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

// Check if an item is a pronunciation item (Letters)
function isPronunciation(itemId: string): boolean {
  const catId = getCategoryId(itemId)
  return catId === 'pronunciation-of-letters' || catId === 'letters'
}

// Get uppercase letter for pronunciation items (e.g. "letters-1" → "A")
function getLetterForPronunciation(itemId: string): string {
  const cleanId = itemId.replace('pronunciation-of-letters-', '').replace('letters-', '')
  const num = parseInt(cleanId, 10)
  return String.fromCharCode(64 + num)
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
  if (q.length < 4) return false
  return cat.title.toLowerCase().includes(q)
}

// Determine if the item should currently be displayed as revealed (target language) or unrevealed (English)
function isItemDisplayedRevealed(item: BasicItem): boolean {
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    if (searchTemporaryToggles.value.has(item.id)) {
      return searchTemporaryToggles.value.get(item.id)!
    }

    const enMatch = item.en.toLowerCase().includes(q)
    const targetMatch = (item[selectedLang.value]?.toLowerCase() || '').includes(q)

    if (targetMatch && !enMatch) {
      return true
    }
    if (enMatch && !targetMatch) {
      return false
    }
    return revealedSet.value.has(item.id)
  }

  // Active 3s learning window or unlearn click
  if (activeLearningWords.value.has(item.id) || activeUnlearnWords.value.has(item.id)) {
    return true
  }

  // Learned words display in English with checkmark!
  return false
}

// Check if a word is accomplished/learned
function isWordLearned(itemId: string): boolean {
  return revealedSet.value.has(itemId)
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-4 space-y-6">
    <!-- Sticky Header -->
    <div
      class="sticky top-16 z-30 bg-white/95 dark:bg-[#121824]/95 backdrop-blur-md pt-2 pb-3 space-y-3 -mx-4 px-4 transition-all duration-200"
      :class="isScrolled
        ? 'shadow-md border-b border-gray-300 dark:border-gray-700'
        : 'shadow-xs border-b border-gray-200/80 dark:border-gray-800/80'"
    >
      <!-- Top Navigation Link: off-white to keep language colors meaningful -->
      <div>
        <NuxtLink
          to="/activities"
          class="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-200 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          ← Back to Activities
        </NuxtLink>
      </div>

      <!-- Centered Title on a line of its own in smaller font -->
      <div class="text-center pt-0.5 pb-0.5">
        <h1 class="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 tracking-tight">
          Learn Language Basics
        </h1>
      </div>

      <!-- Full-width line of four buttons: French 3%, Spanish 12%, Italian 7%, Dutch 43% -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        <button
          v-for="lang in languages"
          :key="lang.code"
          type="button"
          @click="selectLanguage(lang.code)"
          class="py-2 px-3 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-between transition-all cursor-pointer shadow-xs select-none"
          :class="selectedLang === lang.code ? 'ring-1 ring-gray-400/50 dark:ring-gray-400/40' : ''"
          :style="{
            backgroundColor: languageColors[lang.code],
            opacity: selectedLang === lang.code ? 1 : 0.45,
            transform: selectedLang === lang.code ? 'scale(1.01)' : 'scale(1)',
            boxShadow: selectedLang === lang.code ? '0 0 0 1px rgba(156, 163, 175, 0.45)' : 'none'
          }"
        >
          <span class="truncate">{{ lang.label }}</span>
          <span
            class="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-black/25 text-white/95 shrink-0 ml-1"
            :class="isStatsLoading ? 'blur-[2px] opacity-30 select-none' : 'blur-none opacity-100'"
          >
            {{ isStatsLoading ? '0%' : `${allLangProgress[lang.code]}%` }}
          </span>
        </button>
      </div>

      <!-- Progress Panel: NO PERCENTAGE on left, stats + controls, then progress bar -->
      <div class="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200/90 dark:border-gray-800 shadow-xs space-y-2">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div
            class="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 truncate"
            style="transition: opacity 0.3s ease, filter 0.3s ease;"
            :class="isStatsLoading ? 'blur-[2px] opacity-30 select-none' : 'blur-none opacity-100'"
          >
            {{ isStatsLoading ? `0 / ${totalWordsCount} ${activeLangLabel} words learned` : `${revealedCount} / ${totalWordsCount} ${activeLangLabel} words learned` }}
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Test Pronunciation button (to left of Reset all words) -->
            <button
              v-if="hasAnyPronunciationTips"
              type="button"
              @click="toggleTestPronunciation"
              class="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
              :class="isTestPronunciationMode
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-600 dark:hover:text-amber-400'"
            >
              {{ isTestPronunciationMode ? 'Back to Categories' : 'Test Pronunciation' }}
            </button>

            <!-- Reset All Button / Confirmation -->
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

        <!-- Linear Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div
            class="h-2.5 rounded-full transition-all duration-300 ease-out"
            style="transition: opacity 0.3s ease, filter 0.3s ease, width 0.3s ease-out;"
            :class="isStatsLoading ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-none'"
            :style="{ width: isStatsLoading ? '0%' : `${progressPercentage}%`, backgroundColor: brightColor }"
          ></div>
        </div>
      </div>

      <!-- Search Input -->
      <div v-if="!isTestPronunciationMode" class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Filter categories or words..."
          class="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-[#182030] text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
        />
        <button
          v-if="searchQuery"
          type="button"
          @mousedown.prevent
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- VIEW 1: Test Pronunciation Mode -->
    <div v-if="isTestPronunciationMode" class="space-y-4 pt-2">
      <div class="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="isTestPronunciationMode = false"
            class="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer inline-flex items-center gap-1"
          >
            ← Back to Categories
          </button>
          <span class="text-xs text-gray-300 dark:text-gray-600">|</span>
          <span class="text-xs font-bold text-gray-800 dark:text-gray-200">
            Test Pronunciation ({{ wordsWithPronunciation.length }} words with tips)
          </span>
        </div>
        <span class="text-xs text-gray-400">Click word to reveal pronunciation</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        <div
          v-for="item in wordsWithPronunciation"
          :key="item.id"
          @click="toggleTestPronunciationItem(item.id)"
          class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151d2c] flex items-center justify-between gap-2 cursor-pointer hover:border-amber-500/50 transition-all select-none shadow-xs"
        >
          <div class="min-w-0 flex-1">
            <div class="text-sm font-bold text-gray-900 dark:text-white truncate">
              {{ item[selectedLang] || item.en }}
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500 truncate">
              {{ item.en }}
            </div>
          </div>

          <div class="shrink-0 text-right min-w-[90px]">
            <span
              v-if="testPronunciationRevealed.has(item.id)"
              class="text-xs font-mono font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-block"
            >
              [{{ pronunciationMap.get(item.id) }}]
            </span>
            <span
              v-else
              class="text-[11px] font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 italic"
            >
              Click to reveal
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: Normal Categories View -->
    <div v-else>
      <!-- No search results -->
      <div v-if="filteredCategories.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
        No categories or words match "<span class="font-semibold">{{ searchQuery }}</span>".
      </div>

      <!-- Categories List in Accordion Structure -->
      <div v-else class="space-y-3 pt-2">
        <div
          v-for="cat in filteredCategories"
          :key="cat.id"
          class="rounded-xl border bg-white dark:bg-[#151d2c] overflow-hidden transition-all duration-200"
          :class="[
            isCategoryExpanded(cat.id)
              ? 'border-gray-300 dark:border-gray-600 ring-1 ring-black/5 dark:ring-white/10 shadow-sm'
              : 'border-gray-200 dark:border-gray-800/90 shadow-xs',
            isCategoryFoundBySearch(cat)
              ? 'shadow-[0_0_14px_rgba(217,119,6,0.5)] dark:shadow-[0_0_16px_rgba(255,255,255,0.75)]'
              : ''
          ]"
        >
          <!-- Accordion Header Button: title left, 100% or progress bar right -->
          <button
            type="button"
            @click="toggleCategory(cat.id)"
            class="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer transition-colors select-none"
            :class="isCategoryExpanded(cat.id)
              ? 'bg-gray-100/90 dark:bg-[#1c273a]'
              : 'bg-gray-50 dark:bg-[#192335]'"
          >
            <div class="flex items-center gap-2 min-w-0 pr-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white truncate">
                {{ cat.title }}
              </span>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <!-- Visual indication when category is 100%: bold 100% and accomplished checkmark -->
              <div
                v-if="!isStatsLoading && getCategoryLearnedPercentage(cat) === 100"
                class="flex items-center gap-1.5 px-2 py-0.5 rounded font-black text-xs shrink-0"
                :style="{ color: brightColor }"
              >
                <span>100%</span>
                <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
              </div>

              <!-- Learned percentage loading bar for this category (<100% or loading) -->
              <div
                v-else
                class="relative w-24 sm:w-28 h-5 bg-gray-200 dark:bg-gray-800 rounded-none overflow-hidden border border-gray-300/70 dark:border-gray-700/70 shrink-0"
                :class="isStatsLoading ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-none'"
                style="transition: opacity 0.3s ease, filter 0.3s ease;"
              >
                <div
                  class="h-full rounded-none transition-all duration-300 ease-out"
                  :style="{
                    width: isStatsLoading ? '0%' : `${getCategoryLearnedPercentage(cat)}%`,
                    backgroundColor: brightColor
                  }"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-gray-800 dark:text-gray-100 drop-shadow-xs pointer-events-none">
                  {{ isStatsLoading ? '0%' : `${getCategoryLearnedPercentage(cat)}%` }}
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
          <div v-if="isCategoryExpanded(cat.id)" class="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700/80 space-y-3">
            <!-- Sub-bar: Reset Category -->
            <div class="flex items-center justify-between pt-1">
              <span
                class="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
                style="transition: opacity 0.3s ease, filter 0.3s ease;"
                :class="isStatsLoading ? 'blur-[2px] opacity-30 select-none' : 'blur-none opacity-100'"
              >
                {{ isStatsLoading ? `0 / ${cat.items.length} learned` : `${getCategoryLearnedCount(cat)} / ${cat.items.length} learned` }}
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
                class="px-3 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer select-none text-left relative"
                :class="[
                  // STATE 1: Counting down in 3s learning window or unlearn view -> bright target translation
                  (activeLearningWords.has(item.id) || activeUnlearnWords.has(item.id) || (searchQuery && isItemDisplayedRevealed(item)))
                    ? 'font-semibold shadow-xs'
                    : isWordLearned(item.id)
                      // STATE 2: Learned/accomplished -> English with checkmark, dimmed language color, not bold
                      ? 'font-normal shadow-xs'
                      // STATE 3: Unlearned English pill
                      : 'font-normal bg-gray-100/90 dark:bg-[#1a2233] text-gray-500 dark:text-gray-400 border border-gray-200/80 dark:border-gray-700/60 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
                  isItemFoundBySearch(item) ? 'shadow-[0_0_10px_rgba(217,119,6,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.85)]' : ''
                ]"
                :style="(activeLearningWords.has(item.id) || activeUnlearnWords.has(item.id) || (searchQuery && isItemDisplayedRevealed(item))) ? {
                  backgroundColor: `color-mix(in srgb, ${currentButtonColor} 20%, transparent)`,
                  color: `color-mix(in srgb, ${currentButtonColor} 50%, white)`,
                  border: `1px solid color-mix(in srgb, ${currentButtonColor} 45%, transparent)`,
                } : isWordLearned(item.id) ? {
                  backgroundColor: `color-mix(in srgb, ${currentButtonColor} 14%, transparent)`,
                  color: `color-mix(in srgb, ${currentButtonColor} 75%, white)`,
                  border: `1px solid color-mix(in srgb, ${currentButtonColor} 28%, transparent)`,
                } : undefined"
                :title="isWordLearned(item.id) ? 'Learned word. Click to view translation / unlearn' : `Click to learn in ${activeLangLabel}`"
              >
                <!-- CASE A: Active 3s Learning OR Unlearn click OR Search match: show target translation + icons -->
                <span v-if="activeLearningWords.has(item.id) || activeUnlearnWords.has(item.id) || (searchQuery && isItemDisplayedRevealed(item))" class="inline-flex items-center gap-1.5">
                  <!-- Letters category -->
                  <template v-if="isPronunciation(item.id)">
                    <span style="font-family: 'Courier New', Courier, monospace;">[{{ item[selectedLang] || item.en }}]</span>
                  </template>

                  <!-- Standard category & Numbers -->
                  <template v-else>
                    <span>{{ item[selectedLang] || item.en }}</span>
                    <!-- Pronunciation Note in brackets -->
                    <span v-if="pronunciationMap.get(item.id)" class="text-xs font-mono opacity-60 font-normal ml-0.5">
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

                    <!-- Comparison 'C' button (new feature) -->
                    <span
                      class="inline-flex items-center justify-center w-4 h-4 text-xs font-bold font-mono opacity-60 hover:opacity-100 transition-opacity rounded cursor-pointer"
                      title="Compare across all 4 languages"
                      @click="openCrossLanguageModal(item, $event)"
                    >
                      C
                    </span>
                  </template>

                  <!-- '✓' learn button when active in learning mode (unlearned word revealed) -->
                  <span
                    v-if="activeLearningWords.has(item.id)"
                    @click="finalizeWordLearned(item.id, $event)"
                    class="ml-1 px-1 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors shrink-0 leading-none"
                    title="Mark as learned"
                  >
                    ✓
                  </span>

                  <!-- '✕' unlearn button when active in unlearn mode -->
                  <span
                    v-if="activeUnlearnWords.has(item.id)"
                    @click="unlearnWord(item.id, $event)"
                    class="ml-1 px-1 py-0.5 rounded bg-red-600/80 hover:bg-red-600 text-white text-[11px] font-bold cursor-pointer transition-colors shrink-0 leading-none"
                    title="Mark as unlearned"
                  >
                    ✕
                  </span>
                </span>

                <!-- CASE B: Learned word -> English, dimmed language color, with checkmark icon -->
                <span v-else-if="isWordLearned(item.id)" class="inline-flex items-center gap-1.5">
                  <span>{{ isPronunciation(item.id) ? getLetterForPronunciation(item.id) : item.en }}</span>
                  <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>

                <!-- CASE C: Unlearned word -> English default -->
                <span v-else class="inline-block">
                  {{ isPronunciation(item.id) ? getLetterForPronunciation(item.id) : item.en }}
                </span>
              </button>
            </div>

            <!-- YouTube Videos Section at bottom of category -->
            <div
              v-if="cat.videos?.[selectedLang]?.length"
              class="pt-3 border-t border-gray-100 dark:border-gray-800/80"
            >
              <div class="flex flex-wrap gap-2.5">
                <a
                  v-for="(vid, vIdx) in cat.videos[selectedLang]"
                  :key="vIdx"
                  :href="vid.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  <svg class="w-3.5 h-3.5 text-red-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>{{ vid.title }}</span>
                  <svg class="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0 opacity-75" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pronunciation Modal ("P" icon) -->
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
              ref="pronunciationInputRef"
              v-model="pronunciationInput"
              type="text"
              placeholder="e.g. bohn-zhoor or phonetic guide"
              class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#121824] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
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

    <!-- Multilingual Comparison Modal ("C" icon) -->
    <div
      v-if="showCrossLanguageModal && activeCrossLanguageItem"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      @click.self="showCrossLanguageModal = false"
    >
      <div class="bg-white dark:bg-[#161f30] border border-gray-200 dark:border-gray-700/80 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">
            Multilingual Comparison
          </h3>
          <button
            @click="showCrossLanguageModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="space-y-1">
          <div class="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">English</div>
          <div class="text-lg font-extrabold text-gray-900 dark:text-white">
            {{ activeCrossLanguageItem.en }}
          </div>
        </div>

        <div class="space-y-2.5 pt-1">
          <div
            v-for="l in languages"
            :key="l.code"
            class="flex items-center justify-between p-3 rounded-xl border"
            :style="{
              borderColor: `color-mix(in srgb, ${languageColors[l.code]} 40%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${languageColors[l.code]} 10%, transparent)`
            }"
          >
            <span
              class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded text-white shadow-xs"
              :style="{ backgroundColor: languageColors[l.code] }"
            >
              {{ l.label }}
            </span>
            <span
              class="text-base font-bold tracking-tight"
              :style="{ color: `color-mix(in srgb, ${languageColors[l.code]} 55%, white)` }"
            >
              {{ activeCrossLanguageItem[l.code] || '—' }}
            </span>
          </div>
        </div>
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
