<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  BookOpenIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Correction Journal',
  meta: [
    { name: 'description', content: 'Practice text corrections and master language patterns from your daily correction journal.' }
  ]
})

interface TextBit {
  type: 'text'
  text: string
}

interface FlashcardBit {
  type: 'flashcard'
  id: string
  incorrect: string
  correct: string
}

type SectionBit = TextBit | FlashcardBit

interface JournalSection {
  id: string
  day: string
  sectionIndex: number
  language: string
  rawText: string
  bits: SectionBit[]
  flashcardsCount: number
  wordCount: number
  isLearned: boolean
  timesTested: number
  lastTestedAt?: string | null
  learnedFlashcardIds?: string[]
}

interface DayGroup {
  date: string
  sections: JournalSection[]
  totalWords: number
  totalFlashcards: number
  learnedCount: number
}

interface JournalApiResponse {
  days: DayGroup[]
  totalSections: number
  totalWords: number
  totalFlashcards: number
  totalLearnedCount: number
}

const isLoading = ref(true)
const days = ref<DayGroup[]>([])
const totalSections = ref(0)
const totalWords = ref(0)
const totalFlashcards = ref(0)
const totalLearnedCount = ref(0)

// Active review state
const activeSectionId = ref<string | undefined>(undefined)
const toggledStates = ref<Record<string, boolean>>({}) // flashcardId -> true (shows correct) | false (shows incorrect)
const everTurnedGreenSet = ref<Set<string>>(new Set()) // tracks flashcards that turned green at least once

// Helper to keep punctuation together with preceding words (non-breaking spaces before ?, !, :, ;)
function formatFrenchText(text: string): string {
  if (!text) return ''
  return text.replace(/ ([?!:;])/g, '\u00A0$1')
}

// UI controls
const showStats = ref(false)
const showAllStatsDays = ref(false)
const selectedFilter = ref<'all' | 'unlearned'>('unlearned')

async function loadData() {
  isLoading.value = true
  try {
    const res = await $fetch<JournalApiResponse>('/api/activities/correction-journal')
    if (res) {
      days.value = res.days
      totalSections.value = res.totalSections
      totalWords.value = res.totalWords
      totalFlashcards.value = res.totalFlashcards
      totalLearnedCount.value = res.totalLearnedCount

      // Ensure zero-flashcard sections are immediately marked learned
      for (const day of res.days) {
        for (const sec of day.sections) {
          if (sec.flashcardsCount === 0) {
            sec.isLearned = true
          }
        }
      }

      // Select initial active section
      pickInitialSection()
    }
  } catch (err) {
    console.error('Failed to load correction journal:', err)
  } finally {
    isLoading.value = false
  }
}

// Flat list of all sections across all days
const allSections = computed<JournalSection[]>(() => {
  const list: JournalSection[] = []
  for (const day of days.value) {
    list.push(...day.sections)
  }
  return list
})

// Queue of sections based on active filter
const queue = computed<JournalSection[]>(() => {
  if (selectedFilter.value === 'unlearned') {
    return allSections.value.filter(s => !s.isLearned)
  }
  return allSections.value
})

function setFilter(filter: 'all' | 'unlearned') {
  selectedFilter.value = filter
  if (queue.value.length > 0) {
    selectSection(queue.value[0]!.id)
  } else {
    activeSectionId.value = undefined
  }
}

const currentSection = computed<JournalSection | null>(() => {
  if (!activeSectionId.value) return null
  return allSections.value.find(s => s.id === activeSectionId.value) || null
})

const currentSectionIndexInQueue = computed(() => {
  if (!activeSectionId.value) return 0
  const idx = queue.value.findIndex(s => s.id === activeSectionId.value)
  return idx !== -1 ? idx : 0
})

function pickInitialSection() {
  if (queue.value.length > 0) {
    selectSection(queue.value[0]!.id)
  }
}

function goToNextSection() {
  if (queue.value.length === 0) return
  const currentIdx = queue.value.findIndex(s => s.id === activeSectionId.value)
  const nextIdx = (currentIdx + 1) % queue.value.length
  selectSection(queue.value[nextIdx]!.id)
}

function goToPreviousSection() {
  if (queue.value.length === 0) return
  const currentIdx = queue.value.findIndex(s => s.id === activeSectionId.value)
  const prevIdx = (currentIdx - 1 + queue.value.length) % queue.value.length
  selectSection(queue.value[prevIdx]!.id)
}

async function resetCurrentSection() {
  const sec = currentSection.value
  if (!sec || sec.flashcardsCount === 0) return

  toggledStates.value = {}
  everTurnedGreenSet.value = new Set()
  sec.learnedFlashcardIds = []
  if (sec.isLearned) {
    sec.isLearned = false
    totalLearnedCount.value = Math.max(0, totalLearnedCount.value - 1)
  }

  try {
    await $fetch('/api/activities/correction-journal', {
      method: 'POST',
      body: {
        sectionId: sec.id,
        learnedFlashcardIds: [],
        isLearned: false
      }
    })
  } catch (err) {
    console.error('Failed to reset section flashcards:', err)
  }
}

function selectSection(id: string) {
  activeSectionId.value = id
  toggledStates.value = {}
  everTurnedGreenSet.value = new Set()

  const sec = allSections.value.find(s => s.id === id)
  if (sec) {
    if (Array.isArray(sec.learnedFlashcardIds) && sec.learnedFlashcardIds.length > 0) {
      for (const fcId of sec.learnedFlashcardIds) {
        toggledStates.value[fcId] = true
        everTurnedGreenSet.value.add(fcId)
      }
    } else if (sec.isLearned) {
      // If marked learned, ensure all its flashcards are green
      for (const b of sec.bits) {
        if (b.type === 'flashcard') {
          toggledStates.value[b.id] = true
          everTurnedGreenSet.value.add(b.id)
        }
      }
    }
  }
}

function handlePillClick(fcId: string) {
  // If user selected text across the pill, don't trigger toggle
  const sel = window.getSelection()?.toString()
  if (sel && sel.trim().length > 0) {
    return
  }
  toggleFlashcard(fcId)
}

async function toggleFlashcard(fcId: string) {
  const current = !!toggledStates.value[fcId]
  const next = !current
  toggledStates.value[fcId] = next
  if (next) {
    everTurnedGreenSet.value.add(fcId)
  }

  const sec = currentSection.value
  if (!sec) return

  const allFlashcards = sec.bits.filter((b): b is FlashcardBit => b.type === 'flashcard')
  const currentLearnedIds = allFlashcards
    .filter(b => !!toggledStates.value[b.id])
    .map(b => b.id)

  sec.learnedFlashcardIds = currentLearnedIds

  const allGreen = allFlashcards.length > 0 && currentLearnedIds.length === allFlashcards.length

  const wasLearned = sec.isLearned
  if (allGreen && !wasLearned) {
    sec.isLearned = true
    totalLearnedCount.value++
  } else if (!allGreen && wasLearned) {
    sec.isLearned = false
    totalLearnedCount.value = Math.max(0, totalLearnedCount.value - 1)
  }

  // Persist to database
  try {
    await $fetch('/api/activities/correction-journal', {
      method: 'POST',
      body: {
        sectionId: sec.id,
        learnedFlashcardIds: currentLearnedIds,
        isLearned: sec.isLearned
      }
    })
  } catch (err) {
    console.error('Failed to sync flashcard state:', err)
  }
}

const flashcardBits = computed<FlashcardBit[]>(() => {
  if (!currentSection.value) return []
  return currentSection.value.bits.filter((b): b is FlashcardBit => b.type === 'flashcard')
})

const canAdvance = computed(() => {
  if (!currentSection.value) return false
  if (flashcardBits.value.length === 0) return true
  return flashcardBits.value.every(b => !!toggledStates.value[b.id])
})

const revealedCount = computed(() => {
  return flashcardBits.value.filter(b => !!toggledStates.value[b.id]).length
})

// Format local date YYYY-MM-DD
function formatIsoDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Rolling last 7 consecutive calendar days ending on today
const rollingLast7Days = computed(() => {
  const result: Array<{
    date: string
    isToday: boolean
    hasActivity: boolean
    totalWords: number
    learnedCount: number
    sectionsCount: number
  }> = []

  const now = new Date()
  const todayStr = formatIsoDate(now)

  const dayMap = new Map<string, DayGroup>()
  for (const d of days.value) {
    dayMap.set(d.date, d)
  }

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(now.getDate() - i)
    const dateStr = formatIsoDate(d)
    const existing = dayMap.get(dateStr)

    if (existing && existing.totalWords > 0) {
      result.push({
        date: dateStr,
        isToday: dateStr === todayStr,
        hasActivity: true,
        totalWords: existing.totalWords,
        learnedCount: existing.learnedCount,
        sectionsCount: existing.sections.length
      })
    } else {
      result.push({
        date: dateStr,
        isToday: dateStr === todayStr,
        hasActivity: false,
        totalWords: 0,
        learnedCount: 0,
        sectionsCount: 0
      })
    }
  }

  return result
})

// Stats display: rolling 7 days or all historical recorded days
const displayStatsDays = computed(() => {
  if (showAllStatsDays.value) {
    const todayStr = formatIsoDate(new Date())
    return days.value.map(d => ({
      date: d.date,
      isToday: d.date === todayStr,
      hasActivity: d.totalWords > 0,
      totalWords: d.totalWords,
      learnedCount: d.learnedCount,
      sectionsCount: d.sections.length
    }))
  }
  return rollingLast7Days.value
})

function formatDropdownDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-').map(Number)
  if (parts.length < 3 || isNaN(parts[0]!) || isNaN(parts[1]!) || isNaN(parts[2]!)) return dateStr
  const dt = new Date(parts[0]!, parts[1]! - 1, parts[2]!)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayName = days[dt.getDay()]
  const monthName = months[dt.getMonth()]
  return `${dayName} ${monthName} ${parts[2]}`
}

// Dropdown options showing: "Wed Sep 23 --> FR (2 unlearned)"
const sectionSelectItems = computed(() => {
  return queue.value.map(sec => {
    const learned = sec.learnedFlashcardIds?.length ?? (sec.isLearned ? sec.flashcardsCount : 0)
    const total = sec.flashcardsCount
    const unlearned = Math.max(0, total - learned)
    const lang = (sec.language || 'fr').toUpperCase()
    const dateFormatted = formatDropdownDate(sec.day)
    const isAllLearned = unlearned === 0
    const statusText = isAllLearned ? '(all learned)' : `(${unlearned} unlearned)`
    return {
      id: sec.id,
      isLearned: sec.isLearned,
      dateFormatted,
      lang,
      learned,
      total,
      unlearned,
      isAllLearned,
      statusText,
      label: `${dateFormatted} --> ${lang} ${statusText}`,
      class: sec.id === activeSectionId.value ? '!bg-gray-100 dark:!bg-gray-800' : ''
    }
  })
})

const currentSectionSelectItem = computed(() => {
  return sectionSelectItems.value.find(item => item.id === activeSectionId.value) || null
})

// Reset modal state
const showResetModal = ref(false)

function promptResetCurrentSection() {
  showResetModal.value = true
}

function confirmResetSection() {
  showResetModal.value = false
  resetCurrentSection()
}

// 7-day activity word count color: 100+ green, 50+ yellow, 1+ gray, 0 red
function getWordCountColor(words: number): string {
  if (words >= 100) return 'text-emerald-500 dark:text-emerald-400'
  if (words >= 50) return 'text-amber-500 dark:text-amber-400'
  if (words >= 1) return 'text-gray-500 dark:text-gray-400'
  return 'text-red-500 dark:text-red-400'
}

function onSelectSectionChange(val: any) {
  if (!val) return
  const id = typeof val === 'object' ? val.id : val
  if (id) {
    selectSection(id)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
      <div>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/activities"
            class="text-xs font-semibold text-gray-400 hover:text-amber-500 transition-colors uppercase tracking-wider flex items-center gap-1"
          >
            ← Activities
          </NuxtLink>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5 mt-1">
          <span class="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <BookOpenIcon class="w-6 h-6" />
          </span>
          Correction Journal
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Interactive daily corrections. Click red text to reveal corrections, then master each entry.
        </p>
      </div>

      <!-- Action buttons in header -->
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <!-- Stats Toggle Button -->
        <button
          @click="showStats = !showStats"
          class="px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          :class="showStats 
            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'"
        >
          <ChartBarIcon class="w-4 h-4" />
          <span>{{ showStats ? 'Hide Stats' : 'Stats' }}</span>
        </button>

        <!-- Filter toggle -->
        <div class="inline-flex rounded-xl p-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs">
          <button
            @click="setFilter('unlearned')"
            class="px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
            :class="selectedFilter === 'unlearned' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-bold' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            Unlearned
          </button>
          <button
            @click="setFilter('all')"
            class="px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
            :class="selectedFilter === 'all' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-bold' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            All
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Drawer / Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showStats"
        class="p-5 rounded-2xl bg-white dark:bg-[#182030] border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <CalendarDaysIcon class="w-5 h-5 text-amber-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {{ showAllStatsDays ? 'All Days Word Count & Progress' : 'Last 7 Days Activity' }}
            </h3>
          </div>
          <!-- Show all / Show last 7 days link: only show if total days in history > 7 -->
          <button
            v-if="days.length > 7"
            @click="showAllStatsDays = !showAllStatsDays"
            class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {{ showAllStatsDays ? 'Show last 7 days' : 'Show all' }}
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          <div
            v-for="d in displayStatsDays"
            :key="d.date"
            class="p-3 rounded-xl border text-center space-y-1 transition-all relative overflow-hidden"
            :class="[
              d.hasActivity 
                ? 'bg-gray-50 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800 hover:border-amber-400/50' 
                : 'bg-gray-100/70 dark:bg-gray-900/40 border-gray-200/70 dark:border-gray-800/60 opacity-80',
              d.isToday ? 'ring-2 ring-gray-900 border-gray-900 dark:ring-white dark:border-white' : ''
            ]"
          >
            <!-- Date at top (a bit larger) -->
            <div class="text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400 font-bold truncate">
              {{ d.date }}
            </div>

            <div
              class="text-2xl sm:text-3xl font-extrabold leading-tight"
              :class="getWordCountColor(d.totalWords)"
            >
              {{ d.totalWords }}
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500 font-medium">
              words
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content Area -->
    <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center text-center space-y-3">
      <ArrowPathIcon class="w-8 h-8 text-amber-500 animate-spin" />
      <span class="text-sm font-medium text-gray-500">Loading Correction Journal...</span>
    </div>

    <div v-else-if="!currentSection" class="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
      <CheckCircleIcon class="w-12 h-12 text-emerald-500 mx-auto" />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">All Caught Up!</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        You've completed all sections in this view. Switch to "All" to review previous sections or check back later!
      </p>
      <button
        @click="setFilter('all'); pickInitialSection()"
        class="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
      >
        Review All Sections
      </button>
    </div>

    <div v-else class="space-y-4">
      <!-- Section Navigation Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <!-- Nuxt UI Select Menu for clean desktop & mobile appearance -->
          <USelectMenu
            :items="sectionSelectItems"
            :model-value="activeSectionId"
            @update:model-value="onSelectSectionChange"
            label-key="label"
            value-key="id"
            :ui="{
              item: 'data-[state=checked]:!bg-gray-100 dark:data-[state=checked]:!bg-gray-800',
              itemTrailing: 'hidden'
            }"
            class="w-full sm:w-96 text-xs font-bold"
          >
            <template #default>
              <span v-if="currentSectionSelectItem" class="flex items-center gap-1.5 truncate">
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{ currentSectionSelectItem.dateFormatted }} --></span>
                <span class="text-gray-900 dark:text-white font-bold">{{ currentSectionSelectItem.lang }}</span>
                <span
                  class="font-bold transition-all"
                  :class="currentSectionSelectItem.isAllLearned
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'"
                >
                  {{ currentSectionSelectItem.statusText }}
                </span>
              </span>
            </template>
            <template #item-label="{ item }">
              <span class="flex items-center gap-1.5 py-0.5">
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{ item.dateFormatted }} --></span>
                <span class="text-gray-900 dark:text-white font-bold">{{ item.lang }}</span>
                <span
                  class="text-[11px] font-bold transition-all"
                  :class="item.isAllLearned
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'"
                >
                  {{ item.statusText }}
                </span>
              </span>
            </template>
          </USelectMenu>
        </div>
      </div>

      <!-- Section Text Card -->
      <div class="p-6 sm:p-8 bg-white dark:bg-[#182030] rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-md space-y-6">
        <!-- Interactive Text Display: User can select text smoothly across plain text and pills -->
        <div class="text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-sans whitespace-pre-wrap select-text">
          <template v-for="(bit, bIdx) in currentSection.bits" :key="bIdx">
            <!-- Plain Text Segment -->
            <span v-if="bit.type === 'text'">{{ formatFrenchText(bit.text) }}</span>

            <!-- Flashcard Interactive Pill (No mouseover title, reduced spacing so it fits in sentences seamlessly) -->
            <span
              v-else-if="bit.type === 'flashcard'"
              role="button"
              tabindex="0"
              @click="handlePillClick(bit.id)"
              @keydown.enter.prevent="toggleFlashcard(bit.id)"
              @keydown.space.prevent="toggleFlashcard(bit.id)"
              class="inline-flex items-center mx-0.5 my-0 px-1 py-0 rounded font-bold transition-all duration-150 cursor-pointer shadow-xs border select-text group"
              :class="[
                toggledStates[bit.id]
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 hover:brightness-110 hover:bg-emerald-200/90 dark:hover:bg-emerald-900/90'
                  : [
                      'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 hover:brightness-110 hover:bg-red-200/90 dark:hover:bg-red-900/90',
                      everTurnedGreenSet.has(bit.id)
                        ? 'border-transparent'
                        : 'border-red-400 dark:border-red-600'
                    ]
              ]"
            >
              <span>{{ formatFrenchText(toggledStates[bit.id] ? bit.correct : bit.incorrect) }}</span>
            </span>
          </template>
        </div>

        <!-- Card Footer Actions: Previous (left), Reset (middle), and Next (right) -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/80">
          <div>
            <!-- Yellow Previous button: goes to previous text, wraps to last -->
            <button
              @click="goToPreviousSection"
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Previous text"
            >
              <span class="text-sm font-bold">⬅</span>
              <span>Previous</span>
            </button>
          </div>
          <div>
            <!-- Gray Reset button in the middle: only shown on texts that have flashcards -->
            <button
              v-if="currentSection.flashcardsCount > 0"
              @click="promptResetCurrentSection"
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200/80 dark:bg-gray-800/60 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Reset all flashcards in this text to unlearned"
            >
              Reset
            </button>
          </div>
          <div>
            <!-- Yellow Next button: goes to next text, last goes to first -->
            <button
              @click="goToNextSection"
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Next text"
            >
              <span>Next</span>
              <span class="text-sm font-bold">➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dark Red Reset Confirmation Modal -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      @click.self="showResetModal = false"
    >
      <div class="bg-white dark:bg-[#1a0f12] border-2 border-red-300 dark:border-red-900/80 rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div class="flex items-center gap-2.5 text-red-600 dark:text-red-400 border-b border-red-100 dark:border-red-950/80 pb-3">
          <div class="p-2 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400">
            <ArrowPathIcon class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Reset this text?</h3>
            <p class="text-xs text-red-600 dark:text-red-400 font-medium">Are you sure?</p>
          </div>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          All flashcards in this text will be marked as unlearned so you can practice them again.
        </p>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            @click="showResetModal = false"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmResetSection"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors shadow-xs cursor-pointer"
          >
            Reset Text
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
