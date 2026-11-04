<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import rawSpanishVerbs from '../../../data-parsed/spanish-verbs.json'
import {
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

interface SpanishVerb {
  verb: string
  present: string[]
  imperfect: string[]
  preterite: string[]
  future: string[]
  conditional: string[]
  presentSubjunctive: string[]
  imperfectSubjunctive: string[]
  gerund: string
  pastParticiple: string
}

interface DifficultWord {
  id: string // `${verb}-${tenseKey}-${pronounIdx}`
  verb: string
  tenseKey: string
  tenseLabel: string
  pronounIdx: number
  pronounLabel: string
  correctAnswer: string
  errorCount: number
  learned: boolean
}

useHead({
  title: 'LangLearn - Spanish Verbs',
  meta: [
    { name: 'description', content: 'Master Spanish verb conjugations across tenses and pronouns.' }
  ]
})

const verbs = rawSpanishVerbs as SpanishVerb[]

const PRONOUNS = [
  { idx: 0, label: 'yo' },
  { idx: 1, label: 'tú' },
  { idx: 2, label: 'él/ella/Ud.' },
  { idx: 3, label: 'nosotros' },
  { idx: 4, label: 'vosotros' },
  { idx: 5, label: 'ellos/ellas/Uds.' }
]

const TENSES = [
  { key: 'present', label: 'Present' },
  { key: 'imperfect', label: 'Imperfect' },
  { key: 'preterite', label: 'Preterite' },
  { key: 'future', label: 'Future' },
  { key: 'conditional', label: 'Conditional' },
  { key: 'presentSubjunctive', label: 'Present Subjunctive' },
  { key: 'imperfectSubjunctive', label: 'Imperfect Subjunctive' }
] as const

type TenseKey = typeof TENSES[number]['key']

// Selection & Controls State
const selectedVerbs = ref<string[]>(verbs.map(v => v.verb))
const selectedTenses = ref<string[]>(TENSES.map(t => t.key))
const selectedPronouns = ref<number[]>(PRONOUNS.map(p => p.idx))
const isTestMode = ref(false)
const showControls = ref(true)

// Testing Inputs and Validation
const userAnswers = ref<Record<string, string>>({})
const answerStatuses = ref<Record<string, 'correct' | 'incorrect' | null>>({})

// Retest Difficult Words Modal State
const showRetestModal = ref(false)
const difficultWords = ref<DifficultWord[]>([])
const retestAnswers = ref<Record<string, string>>({})
const retestStatuses = ref<Record<string, 'correct' | 'incorrect' | null>>({})

const STORAGE_DIFFICULT_KEY = 'langlearn_spanish_verb_difficulties'

function loadDifficultWords() {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem(STORAGE_DIFFICULT_KEY)
      if (saved) {
        difficultWords.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load difficult words from storage', e)
    }
  }
}

function saveDifficultWords() {
  if (import.meta.client) {
    try {
      localStorage.setItem(STORAGE_DIFFICULT_KEY, JSON.stringify(difficultWords.value))
    } catch (e) {
      console.error('Failed to save difficult words to storage', e)
    }
  }
}

function recordError(
  verbName: string,
  tenseKey: string,
  tenseLabel: string,
  pronounIdx: number,
  pronounLabel: string,
  correctAnswer: string
) {
  const id = `${verbName}-${tenseKey}-${pronounIdx}`
  const existing = difficultWords.value.find(item => item.id === id)

  if (existing) {
    existing.errorCount += 1
    existing.learned = false
    existing.correctAnswer = correctAnswer
  } else {
    difficultWords.value.push({
      id,
      verb: verbName,
      tenseKey,
      tenseLabel,
      pronounIdx,
      pronounLabel,
      correctAnswer,
      errorCount: 1,
      learned: false
    })
  }
  saveDifficultWords()
}

function markAsLearned(id: string) {
  const item = difficultWords.value.find(w => w.id === id)
  if (item) {
    item.learned = true
    saveDifficultWords()
  }
}

function removeDifficultWord(id: string) {
  difficultWords.value = difficultWords.value.filter(w => w.id !== id)
  saveDifficultWords()
}

function clearAllDifficultWords() {
  difficultWords.value = []
  saveDifficultWords()
}

const activeDifficultWords = computed(() => {
  return difficultWords.value
    .filter(w => !w.learned)
    .sort((a, b) => b.errorCount - a.errorCount)
})

function getCellKey(verb: string, tenseKey: string, pronounIdx: number): string {
  return `${verb}-${tenseKey}-${pronounIdx}`
}

function isCellTested(tenseKey: string, pronounIdx: number): boolean {
  if (!isTestMode.value) return false
  return selectedTenses.value.includes(tenseKey) && selectedPronouns.value.includes(pronounIdx)
}

function normalizeAnswer(text: string): string {
  return text.trim().toLowerCase()
}

function validateCell(verb: SpanishVerb, tenseKey: TenseKey, pronounIdx: number) {
  const key = getCellKey(verb.verb, tenseKey, pronounIdx)
  const userText = userAnswers.value[key] || ''
  const trimmed = normalizeAnswer(userText)

  if (!trimmed) {
    answerStatuses.value[key] = null
    return
  }

  const expectedList = verb[tenseKey] || []
  const expected = expectedList[pronounIdx] || ''
  const normalizedExpected = normalizeAnswer(expected)

  // Check multiple variations (e.g. "ha/hay")
  const expectedOptions = normalizedExpected.split('/').map(s => s.trim())
  const isMatch = expectedOptions.includes(trimmed)

  if (isMatch) {
    answerStatuses.value[key] = 'correct'
  } else {
    answerStatuses.value[key] = 'incorrect'
    const tenseObj = TENSES.find(t => t.key === tenseKey)
    const pronounObj = PRONOUNS.find(p => p.idx === pronounIdx)
    recordError(
      verb.verb,
      tenseKey,
      tenseObj ? tenseObj.label : tenseKey,
      pronounIdx,
      pronounObj ? pronounObj.label : `p${pronounIdx}`,
      expected
    )
  }
}

function validateRetestItem(item: DifficultWord) {
  const userText = retestAnswers.value[item.id] || ''
  const trimmed = normalizeAnswer(userText)

  if (!trimmed) {
    retestStatuses.value[item.id] = null
    return
  }

  const expectedOptions = normalizeAnswer(item.correctAnswer).split('/').map(s => s.trim())
  const isMatch = expectedOptions.includes(trimmed)

  if (isMatch) {
    retestStatuses.value[item.id] = 'correct'
  } else {
    retestStatuses.value[item.id] = 'incorrect'
    item.errorCount += 1
    saveDifficultWords()
  }
}

function resetTestInputs() {
  userAnswers.value = {}
  answerStatuses.value = {}
}

function toggleAllVerbs() {
  if (selectedVerbs.value.length === verbs.length) {
    selectedVerbs.value = []
  } else {
    selectedVerbs.value = verbs.map(v => v.verb)
  }
}

function toggleAllTenses() {
  if (selectedTenses.value.length === TENSES.length) {
    selectedTenses.value = []
  } else {
    selectedTenses.value = TENSES.map(t => t.key)
  }
}

function toggleAllPronouns() {
  if (selectedPronouns.value.length === PRONOUNS.length) {
    selectedPronouns.value = []
  } else {
    selectedPronouns.value = PRONOUNS.map(p => p.idx)
  }
}

const filteredVerbList = computed(() => {
  return verbs.filter(v => selectedVerbs.value.includes(v.verb))
})

onMounted(() => {
  loadDifficultWords()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6 space-y-6">
    <!-- Top Bar: Navigation & Difficult Words Button -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <NuxtLink
        to="/activities"
        class="inline-flex items-center text-sm font-semibold !text-gray-300 dark:!text-gray-300 hover:!text-gray-900 dark:hover:!text-white opacity-70 hover:opacity-100 transition-all"
      >
        ← Back to Activities
      </NuxtLink>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="showRetestModal = true"
          class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs inline-flex items-center gap-2 bg-[#be185d]/10 text-[#be185d] dark:text-[#f43f5e] border-[#be185d]/40 hover:bg-[#be185d]/20"
        >
          <AcademicCapIcon class="w-4 h-4" />
          <span>Retest difficult words</span>
          <span
            v-if="activeDifficultWords.length > 0"
            class="px-1.5 py-0.2 rounded-full text-[11px] font-extrabold bg-[#be185d] text-white"
          >
            {{ activeDifficultWords.length }}
          </span>
        </button>

        <button
          type="button"
          @click="showControls = !showControls"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          :title="showControls ? 'Hide Controls' : 'Show Controls'"
        >
          <AdjustmentsHorizontalIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Header Section -->
    <div class="space-y-1">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
        <span class="text-[#be185d] dark:text-[#f43f5e]">Spanish Verbs</span>
        <span class="text-xs px-2 py-0.5 rounded font-bold uppercase bg-[#be185d]/20 text-[#be185d] dark:text-[#f43f5e] border border-[#be185d]/30">
          ES
        </span>
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Review conjugations, customize tenses and pronouns, and practice testing your recall.
      </p>
    </div>

    <!-- Controls Panel -->
    <div
      v-show="showControls"
      class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#182030] border-2 border-gray-200 dark:border-gray-700 shadow-sm space-y-4"
    >
      <!-- Top Action Row inside controls: Test Mode Toggle and Clear/Reset -->
      <div class="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isTestMode = !isTestMode"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm inline-flex items-center gap-2"
            :class="isTestMode
              ? 'bg-[#be185d] text-white hover:bg-[#a2134e]'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'"
          >
            <SparklesIcon class="w-4 h-4" />
            <span>{{ isTestMode ? 'Test Mode Active (Click to Study)' : 'Enter Test Mode' }}</span>
          </button>

          <span v-if="isTestMode" class="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Type your answers in the boxes below and hit Enter or click out to check.
          </span>
        </div>

        <button
          v-if="isTestMode"
          type="button"
          @click="resetTestInputs"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
        >
          Clear Answers
        </button>
      </div>

      <!-- Verbs Selector -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Verbs to Show ({{ selectedVerbs.length }} of {{ verbs.length }})
          </span>
          <button
            type="button"
            @click="toggleAllVerbs"
            class="text-xs font-semibold text-[#be185d] dark:text-[#f43f5e] hover:underline cursor-pointer"
          >
            {{ selectedVerbs.length === verbs.length ? 'Deselect All' : 'Select All' }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="v in verbs"
            :key="v.verb"
            type="button"
            @click="selectedVerbs.includes(v.verb) ? selectedVerbs = selectedVerbs.filter(x => x !== v.verb) : selectedVerbs.push(v.verb)"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border select-none"
            :class="selectedVerbs.includes(v.verb)
              ? 'bg-[#be185d] text-white border-[#be185d]'
              : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'"
          >
            {{ v.verb }}
          </button>
        </div>
      </div>

      <!-- Tenses to test on -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Tenses to Test ({{ selectedTenses.length }} of {{ TENSES.length }})
          </span>
          <button
            type="button"
            @click="toggleAllTenses"
            class="text-xs font-semibold text-[#be185d] dark:text-[#f43f5e] hover:underline cursor-pointer"
          >
            {{ selectedTenses.length === TENSES.length ? 'Deselect All' : 'Select All' }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in TENSES"
            :key="t.key"
            type="button"
            @click="selectedTenses.includes(t.key) ? selectedTenses = selectedTenses.filter(x => x !== t.key) : selectedTenses.push(t.key)"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border select-none"
            :class="selectedTenses.includes(t.key)
              ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-900 dark:border-white font-bold'
              : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- Pronouns to test on -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Pronouns to Test ({{ selectedPronouns.length }} of {{ PRONOUNS.length }})
          </span>
          <button
            type="button"
            @click="toggleAllPronouns"
            class="text-xs font-semibold text-[#be185d] dark:text-[#f43f5e] hover:underline cursor-pointer"
          >
            {{ selectedPronouns.length === PRONOUNS.length ? 'Deselect All' : 'Select All' }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in PRONOUNS"
            :key="p.idx"
            type="button"
            @click="selectedPronouns.includes(p.idx) ? selectedPronouns = selectedPronouns.filter(x => x !== p.idx) : selectedPronouns.push(p.idx)"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border select-none"
            :class="selectedPronouns.includes(p.idx)
              ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-900 dark:border-white font-bold'
              : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredVerbList.length === 0"
      class="text-center py-16 bg-white dark:bg-[#182030] rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 space-y-3"
    >
      <p class="text-gray-700 dark:text-gray-300 font-bold text-base">No verbs selected.</p>
      <button
        type="button"
        @click="selectedVerbs = verbs.map(v => v.verb)"
        class="text-xs font-bold text-[#be185d] dark:text-[#f43f5e] underline cursor-pointer"
      >
        Select All Verbs
      </button>
    </div>

    <!-- Verb Tables: Vertically Stacked -->
    <div v-else class="space-y-8">
      <div
        v-for="verb in filteredVerbList"
        :key="verb.verb"
        class="bg-white dark:bg-[#182030] rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <!-- Verb Header with Gerund and Past Participle Badges -->
        <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-[#151d2c] flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
              {{ verb.verb }}
            </h2>
          </div>

          <!-- Non-finite form tags/cards directly above table -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              <span class="text-gray-400 font-mono text-[10px] uppercase">Gerund:</span>
              <span class="font-bold text-[#be185d] dark:text-[#f43f5e]">{{ verb.gerund }}</span>
            </span>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              <span class="text-gray-400 font-mono text-[10px] uppercase">Participle:</span>
              <span class="font-bold text-[#be185d] dark:text-[#f43f5e]">{{ verb.pastParticiple }}</span>
            </span>
          </div>
        </div>

        <!-- Conjugation Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-[#121824]/60 text-gray-600 dark:text-gray-400 font-bold">
                <th class="py-2.5 px-3 sm:px-4 font-mono uppercase text-[11px] tracking-wider w-36 shrink-0">
                  Tense
                </th>
                <th
                  v-for="p in PRONOUNS"
                  :key="p.idx"
                  class="py-2.5 px-2.5 sm:px-3 text-center min-w-[110px]"
                >
                  <span class="font-mono text-[11px]">{{ p.label }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="tense in TENSES"
                :key="tense.key"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <!-- Tense Name Left Column -->
                <td class="py-2.5 px-3 sm:px-4 font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap bg-gray-50/30 dark:bg-[#151d2c]/30">
                  {{ tense.label }}
                </td>

                <!-- 6 Pronoun Columns -->
                <td
                  v-for="p in PRONOUNS"
                  :key="p.idx"
                  class="py-2 px-2 sm:px-3 text-center"
                >
                  <!-- Testing Input Mode -->
                  <div v-if="isCellTested(tense.key, p.idx)" class="relative inline-block w-full max-w-[130px]">
                    <input
                      type="text"
                      v-model="userAnswers[getCellKey(verb.verb, tense.key, p.idx)]"
                      @keydown.enter="validateCell(verb, tense.key, p.idx)"
                      @blur="validateCell(verb, tense.key, p.idx)"
                      placeholder="..."
                      class="w-full px-2 py-1 text-xs text-center rounded-lg border font-medium focus:outline-none focus:ring-2 transition-all"
                      :class="{
                        'bg-white dark:bg-[#121824] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-pink-500/30 focus:border-[#be185d]': !answerStatuses[getCellKey(verb.verb, tense.key, p.idx)],
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold focus:ring-emerald-500/30': answerStatuses[getCellKey(verb.verb, tense.key, p.idx)] === 'correct',
                        'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 font-bold focus:ring-rose-500/30': answerStatuses[getCellKey(verb.verb, tense.key, p.idx)] === 'incorrect'
                      }"
                    />
                  </div>

                  <!-- Standard Static Conjugation Mode -->
                  <span
                    v-else
                    class="font-medium text-gray-800 dark:text-gray-200"
                  >
                    {{ verb[tense.key]?.[p.idx] || '—' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Retest Difficult Words Modal -->
    <div
      v-if="showRetestModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      @click.self="showRetestModal = false"
    >
      <div class="bg-white dark:bg-[#161f30] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col space-y-4">
        <!-- Modal Top Bar -->
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 shrink-0">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <AcademicCapIcon class="w-5 h-5 text-[#be185d]" />
              <span>Retest Difficult Words</span>
            </h3>
            <span
              v-if="activeDifficultWords.length > 0"
              class="text-xs px-2 py-0.5 rounded-full font-bold bg-[#be185d]/20 text-[#be185d] dark:text-[#f43f5e]"
            >
              {{ activeDifficultWords.length }} to review
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="activeDifficultWords.length > 0"
              type="button"
              @click="clearAllDifficultWords"
              class="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear All
            </button>
            <button
              type="button"
              @click="showRetestModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Modal Body Content -->
        <div class="overflow-y-auto space-y-3 flex-1 pr-1">
          <div
            v-if="activeDifficultWords.length === 0"
            class="text-center py-12 space-y-2 text-gray-500 dark:text-gray-400"
          >
            <p class="text-sm font-bold">🎉 No difficult words recorded!</p>
            <p class="text-xs">
              When you enter Test Mode and answer any tense/pronoun incorrectly, it will automatically appear here for focused retesting.
            </p>
          </div>

          <div
            v-else
            v-for="item in activeDifficultWords"
            :key="item.id"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-[#121824]/60 flex items-center justify-between gap-3 flex-wrap"
          >
            <!-- Word description (e.g. "hablar · tú / imperfect") -->
            <div class="space-y-0.5 min-w-[160px]">
              <div class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="capitalize">{{ item.verb }}</span>
                <span class="text-xs px-1.5 py-0.2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                  {{ item.pronounLabel }}
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                <span>{{ item.tenseLabel }}</span>
                <span class="text-rose-500 dark:text-rose-400 font-semibold ml-2">
                  ({{ item.errorCount }} {{ item.errorCount === 1 ? 'error' : 'errors' }})
                </span>
              </div>
            </div>

            <!-- Input & Validation Box -->
            <div class="flex items-center gap-2 min-w-[200px]">
              <input
                type="text"
                v-model="retestAnswers[item.id]"
                @keydown.enter="validateRetestItem(item)"
                @blur="validateRetestItem(item)"
                placeholder="Type answer..."
                class="px-3 py-1.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 w-36 transition-all"
                :class="{
                  'bg-white dark:bg-[#182030] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-pink-500/30 focus:border-[#be185d]': !retestStatuses[item.id],
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold': retestStatuses[item.id] === 'correct',
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 font-bold': retestStatuses[item.id] === 'incorrect'
                }"
              />

              <!-- "Mark as learned" button -->
              <button
                type="button"
                @click="markAsLearned(item.id)"
                class="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                title="Mark as learned and remove from list"
              >
                Mark as learned
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end shrink-0">
          <button
            type="button"
            @click="showRetestModal = false"
            class="px-4 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-300 dark:border-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

