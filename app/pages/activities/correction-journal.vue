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
const activeSectionId = ref<string | null>(null)
const toggledStates = ref<Record<string, boolean>>({}) // flashcardId -> true (shows correct) | false (shows incorrect)
const everTurnedGreenSet = ref<Set<string>>(new Set()) // tracks flashcards that turned green at least once
const isSubmitting = ref(false)

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
    const unlearned = allSections.value.filter(s => !s.isLearned)
    return unlearned.length > 0 ? unlearned : allSections.value
  }
  return allSections.value
})

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

function selectSection(id: string) {
  activeSectionId.value = id
  toggledStates.value = {}
  everTurnedGreenSet.value = new Set()
}

function handlePillClick(fcId: string) {
  // If user selected text across the pill, don't trigger toggle
  const sel = window.getSelection()?.toString()
  if (sel && sel.trim().length > 0) {
    return
  }
  toggleFlashcard(fcId)
}

function toggleFlashcard(fcId: string) {
  const current = !!toggledStates.value[fcId]
  const next = !current
  toggledStates.value[fcId] = next
  if (next) {
    everTurnedGreenSet.value.add(fcId)
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

async function handleAction(action: 'LEARNED' | 'KEEP_TESTING') {
  if (!currentSection.value || isSubmitting.value) return
  const sectionId = currentSection.value.id
  isSubmitting.value = true

  try {
    await $fetch('/api/activities/correction-journal', {
      method: 'POST',
      body: { sectionId, action }
    })

    // Update local state
    const sec = allSections.value.find(s => s.id === sectionId)
    if (sec) {
      if (action === 'LEARNED') {
        if (!sec.isLearned) totalLearnedCount.value++
        sec.isLearned = true
      }
      sec.timesTested++
    }

    // Determine next section
    const currentIdx = queue.value.findIndex(s => s.id === sectionId)
    if (action === 'KEEP_TESTING') {
      // Advance to next unlearned section
      const nextIdx = (currentIdx + 1) % queue.value.length
      selectSection(queue.value[nextIdx]!.id)
    } else {
      // Action is LEARNED: advance to next item
      const remaining = queue.value.filter(s => s.id !== sectionId && !s.isLearned)
      if (remaining.length > 0) {
        selectSection(remaining[0]!.id)
      } else if (queue.value.length > 1) {
        const nextIdx = (currentIdx + 1) % queue.value.length
        selectSection(queue.value[nextIdx]!.id)
      }
    }
  } catch (err) {
    console.error('Failed to submit section action:', err)
  } finally {
    isSubmitting.value = false
  }
}

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

// Dropdown options with (wordCount/flashcardsCount)
const sectionSelectItems = computed(() => {
  return queue.value.map(sec => ({
    id: sec.id,
    label: `${sec.day} — Section ${sec.sectionIndex} (${sec.language.toUpperCase()}) (${sec.wordCount}/${sec.flashcardsCount})${sec.isLearned ? ' ✓' : ''}`
  }))
})

const currentSelectItem = computed(() => {
  return sectionSelectItems.value.find(item => item.id === activeSectionId.value) || null
})

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
            @click="selectedFilter = 'unlearned'"
            class="px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
            :class="selectedFilter === 'unlearned' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-bold' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            Unlearned
          </button>
          <button
            @click="selectedFilter = 'all'"
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
                : 'bg-gray-100/70 dark:bg-gray-900/40 border-gray-200/70 dark:border-gray-800/60 opacity-60 dark:opacity-50 grayscale',
              d.isToday ? 'ring-2 ring-amber-500/80 border-amber-500' : ''
            ]"
          >
            <!-- Today badge -->
            <div
              v-if="d.isToday"
              class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500 text-white inline-block mb-0.5 shadow-xs"
            >
              Today
            </div>

            <div class="text-[11px] font-mono text-gray-400 dark:text-gray-500 font-semibold truncate">
              {{ d.date }}
            </div>

            <template v-if="d.hasActivity">
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {{ d.totalWords }} <span class="text-[10px] font-normal text-gray-400">words</span>
              </div>
              <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {{ d.learnedCount }}/{{ d.sectionsCount }} learned
              </div>
            </template>

            <template v-else>
              <div class="text-lg font-bold text-gray-400 dark:text-gray-500">
                0 <span class="text-[10px] font-normal text-gray-400 dark:text-gray-500">words</span>
              </div>
              <div class="text-[11px] text-gray-400 dark:text-gray-500 font-semibold flex items-center justify-center">
                <span>failed</span>
              </div>
            </template>
          </div>
        </div>

        <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Total: <strong>{{ totalSections }}</strong> sections &bull; <strong>{{ totalWords }}</strong> words &bull; <strong>{{ totalFlashcards }}</strong> flashcards</span>
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold">Overall Learned: {{ totalLearnedCount }} / {{ totalSections }}</span>
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
        @click="selectedFilter = 'all'; pickInitialSection()"
        class="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
      >
        Review All Sections
      </button>
    </div>

    <div v-else class="space-y-4">
      <!-- Section Navigation Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Nuxt UI Select Menu for clean desktop & mobile appearance -->
          <USelectMenu
            :items="sectionSelectItems"
            :model-value="currentSelectItem"
            @update:model-value="onSelectSectionChange"
            label-key="label"
            value-key="id"
            class="w-64 sm:w-84 text-xs font-bold"
          />

          <!-- Section count pill -->
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 shrink-0">
            {{ currentSectionIndexInQueue + 1 }} of {{ queue.length }}
          </span>

          <span
            v-if="currentSection.isLearned"
            class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider shrink-0"
          >
            Learned
          </span>
        </div>

        <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
          <span>{{ currentSection.wordCount }} words</span>
          <span>&bull;</span>
          <span>{{ currentSection.flashcardsCount }} flashcards</span>
        </div>
      </div>

      <!-- Section Text Card -->
      <div class="p-6 sm:p-8 bg-white dark:bg-[#182030] rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-md space-y-6">
        <!-- Interactive Text Display: User can select text smoothly across plain text and pills -->
        <div class="text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-sans whitespace-pre-wrap select-text">
          <template v-for="(bit, bIdx) in currentSection.bits" :key="bIdx">
            <!-- Plain Text Segment -->
            <span v-if="bit.type === 'text'">{{ bit.text }}</span>

            <!-- Flashcard Interactive Pill -->
            <span
              v-else-if="bit.type === 'flashcard'"
              role="button"
              tabindex="0"
              @click="handlePillClick(bit.id)"
              @keydown.enter.prevent="toggleFlashcard(bit.id)"
              @keydown.space.prevent="toggleFlashcard(bit.id)"
              :title="toggledStates[bit.id] ? 'Showing correct (click to show incorrect)' : 'Incorrect text (click to reveal correction)'"
              class="inline-flex items-center mx-1 my-0.5 px-1.5 py-0 rounded-md font-bold transition-all duration-150 cursor-pointer shadow-xs border select-text group"
              :class="[
                toggledStates[bit.id]
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 hover:scale-105'
                  : [
                      'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 hover:scale-105',
                      everTurnedGreenSet.has(bit.id)
                        ? 'border-transparent'
                        : 'border-red-400 dark:border-red-600'
                    ]
              ]"
            >
              <span>{{ toggledStates[bit.id] ? bit.correct : bit.incorrect }}</span>
            </span>
          </template>
        </div>

        <!-- Hint or Completion Notice -->
        <div class="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span v-if="!canAdvance">
            💡 Click each red error ({{ revealedCount }}/{{ currentSection.flashcardsCount }}) to reveal the correction. All pills must be correct to unlock progress.
          </span>
          <span v-else class="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircleIcon class="w-4 h-4" />
            All flashcards revealed! Choose whether you've learned this section or want to keep testing.
          </span>
        </div>

        <!-- Action Buttons: Learned & Keep Testing (ONLY shows when ALL pills are turned to correct) -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="canAdvance" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <!-- Learned Button -->
            <button
              @click="handleAction('LEARNED')"
              :disabled="isSubmitting"
              class="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
            >
              <CheckCircleIcon class="w-5 h-5" />
              <span>Learned</span>
            </button>

            <!-- Keep Testing Button -->
            <button
              @click="handleAction('KEEP_TESTING')"
              :disabled="isSubmitting"
              class="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
            >
              <ArrowPathIcon class="w-5 h-5" />
              <span>Keep testing</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
