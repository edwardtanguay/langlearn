<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import rawSpanishVerbs from '../../../data-parsed/spanish-verbs.json'
import {
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  AcademicCapIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  AdjustmentsHorizontalIcon
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

const FINITE_TENSES = [
  { key: 'present', label: 'Presente' },
  { key: 'imperfect', label: 'Imperfecto' },
  { key: 'preterite', label: 'Pretérito' },
  { key: 'future', label: 'Futuro' },
  { key: 'conditional', label: 'Condicional' },
  { key: 'presentSubjunctive', label: 'Pres. subj.' },
  { key: 'imperfectSubjunctive', label: 'Imp. subj.' }
] as const

const TENSES = [
  { key: 'present', label: 'Presente' },
  { key: 'imperfect', label: 'Imperfecto' },
  { key: 'preterite', label: 'Pretérito' },
  { key: 'future', label: 'Futuro' },
  { key: 'conditional', label: 'Condicional' },
  { key: 'presentSubjunctive', label: 'Pres. subj.' },
  { key: 'imperfectSubjunctive', label: 'Imp. subj.' },
  { key: 'gerund', label: 'Gerundio' },
  { key: 'pastParticiple', label: 'Participio' }
] as const

type TenseKey = typeof TENSES[number]['key']

// Selection & Controls State
const selectedVerbs = ref<string[]>(verbs.map(v => v.verb))
const selectedTenses = ref<string[]>(TENSES.map(t => t.key))
const selectedPronouns = ref<number[]>(PRONOUNS.map(p => p.idx))
const isTestMode = ref(false)
const showControls = ref(true)

// Mobile & Layout State
const isMobile = ref(false)
const isMobileDrawerOpen = ref(false)
const currentMobilePronounIdx = ref(0)
const activeStudyVerb = ref<string | null>(null)

function checkMobile() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 640
  }
}

function prevMobilePronoun() {
  currentMobilePronounIdx.value = (currentMobilePronounIdx.value - 1 + PRONOUNS.length) % PRONOUNS.length
}

function nextMobilePronoun() {
  currentMobilePronounIdx.value = (currentMobilePronounIdx.value + 1) % PRONOUNS.length
}

function setMobilePronoun(idx: number) {
  if (idx >= 0 && idx < PRONOUNS.length) {
    currentMobilePronounIdx.value = idx
  }
}

const displayedPronouns = computed(() => {
  if (isMobile.value) {
    const p = PRONOUNS[currentMobilePronounIdx.value]
    return p ? [p] : [PRONOUNS[0]]
  }
  return PRONOUNS
})

function handleVerbCardClick(verbName: string) {
  activeStudyVerb.value = verbName
  lastFocusedVerb.value = verbName
}

// Verb Groups
interface VerbGroup {
  id: string
  name: string
  verbs: string[]
}

const VERB_GROUPS: VerbGroup[] = [
  {
    id: 'all',
    name: 'All Verbs',
    verbs: verbs.map(v => v.verb)
  },
  {
    id: 'reg1',
    name: 'Regular Verbs Set 1',
    verbs: ['hablar', 'comer', 'vivir']
  },
  {
    id: 'reg2',
    name: 'Regular Verbs Set 2',
    verbs: ['trabajar', 'aprender', 'abrir']
  },
  {
    id: 'reg3',
    name: 'Regular Verbs Set 3',
    verbs: ['tomar', 'beber', 'escribir']
  },
  {
    id: 'core1',
    name: 'Core I verbs',
    verbs: ['ir', 'ser', 'estar']
  },
  {
    id: 'core2',
    name: 'Core II verbs',
    verbs: ['haber', 'hacer', 'quedar']
  },
  {
    id: 'modal',
    name: 'Modal verbs',
    verbs: ['poder', 'deber', 'querer', 'saber', 'soler', 'tener', 'necesitar', 'gustar']
  },
  {
    id: 'll-words',
    name: 'LL-words',
    verbs: ['llegar', 'llevar', 'llamar', 'llenar', 'llorar', 'llover']
  }
]

function selectVerbGroup(group: VerbGroup) {
  if (group.id === 'all') {
    selectedVerbs.value = verbs.map(v => v.verb)
  } else {
    selectedVerbs.value = [...group.verbs]
  }
}

function isGroupActive(group: VerbGroup): boolean {
  if (group.id === 'all') {
    return selectedVerbs.value.length === verbs.length
  }
  if (selectedVerbs.value.length !== group.verbs.length) return false
  return group.verbs.every(v => selectedVerbs.value.includes(v))
}

// Search state & helper functions
const searchQuery = ref('')
const previousShowControls = ref(true)
const pausedRandomTest = ref(false)
const pausedFullTest = ref(false)
const savedFocusInputId = ref('')

function normalizeForSearch(str: string): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function highlightWordMatches(word: string, normQuery: string): string {
  const normWord = normalizeForSearch(word)
  let res = ''
  let lastIdx = 0
  let searchPos = 0
  while ((searchPos = normWord.indexOf(normQuery, lastIdx)) !== -1) {
    res += escapeHtml(word.slice(lastIdx, searchPos))
    const matchSlice = word.slice(searchPos, searchPos + normQuery.length)
    res += `<span class="bg-yellow-200/90 dark:bg-yellow-500/30 rounded-xs">${escapeHtml(matchSlice)}</span>`
    lastIdx = searchPos + normQuery.length
  }
  res += escapeHtml(word.slice(lastIdx))
  return `<span class="text-amber-600 dark:text-yellow-400 font-semibold">${res}</span>`
}

function highlightText(text: string): string {
  if (!text || text === '—' || !searchQuery.value.trim()) {
    return escapeHtml(text || '')
  }

  const query = searchQuery.value.trim()
  const normQuery = normalizeForSearch(query)
  if (!normQuery) return escapeHtml(text)

  const normText = normalizeForSearch(text)
  if (!normText.includes(normQuery)) {
    return escapeHtml(text)
  }

  // Tokenize into words and delimiters (spaces, slashes, punctuation)
  const tokens = text.split(/([^\p{L}\p{M}]+)/u)
  let result = ''
  for (const token of tokens) {
    if (!token) continue
    const normToken = normalizeForSearch(token)
    if (normToken && normToken.includes(normQuery)) {
      result += highlightWordMatches(token, normQuery)
    } else {
      result += escapeHtml(token)
    }
  }
  return result
}

function verbMatchesSearch(v: SpanishVerb, normQuery: string): boolean {
  if (normalizeForSearch(v.verb).includes(normQuery)) return true
  if (v.gerund && normalizeForSearch(v.gerund).includes(normQuery)) return true
  if (v.pastParticiple && normalizeForSearch(v.pastParticiple).includes(normQuery)) return true
  for (const tense of FINITE_TENSES) {
    const forms = (v as any)[tense.key] as string[] || []
    for (const form of forms) {
      if (form && form !== '-' && normalizeForSearch(form).includes(normQuery)) {
        return true
      }
    }
  }
  return false
}

const isSearching = computed(() => !!searchQuery.value.trim())

const searchMatchingVerbs = computed(() => {
  const q = normalizeForSearch(searchQuery.value.trim())
  if (!q) return []
  return verbs.filter(v => verbMatchesSearch(v, q))
})

function handleSearchFocus() {
  const activeEl = typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
  if (activeEl && activeEl.id && !activeEl.id.startsWith('verb-search-input')) {
    savedFocusInputId.value = activeEl.id
  } else if (lastFocusedInputId.value && !lastFocusedInputId.value.startsWith('verb-search-input')) {
    savedFocusInputId.value = lastFocusedInputId.value
  }
  if (isRandomTestMode.value) {
    pausedRandomTest.value = true
  }
  if (isTestMode.value) {
    pausedFullTest.value = true
  }
}

function handleSearchInput() {
  if (searchQuery.value.trim()) {
    if (isRandomTestMode.value) {
      pausedRandomTest.value = true
    }
    if (isTestMode.value) {
      pausedFullTest.value = true
    }
    if (showControls.value) {
      previousShowControls.value = true
      showControls.value = false
    }
  } else {
    // When backspacing to empty, stay focused in the search box so the user can type a new word
    showControls.value = previousShowControls.value
  }
}

function handleSearchBlur(event: FocusEvent) {
  const related = event.relatedTarget as HTMLElement | null
  if (related && (related.id === 'verb-search-clear-btn' || related.closest('#verb-search-clear-btn'))) {
    return
  }
  if (!searchQuery.value.trim()) {
    resumePausedTests()
  }
}

function resumePausedTests() {
  showControls.value = previousShowControls.value
  if (pausedRandomTest.value) {
    pausedRandomTest.value = false
    nextTick(() => {
      const el = document.getElementById('random-test-input') as HTMLInputElement | null
      if (el) {
        el.focus()
        if (randomTestAnswer.value) {
          const len = randomTestAnswer.value.length
          el.setSelectionRange(len, len)
        }
      }
    })
  } else if (pausedFullTest.value) {
    pausedFullTest.value = false
    if (savedFocusInputId.value) {
      nextTick(() => {
        const el = document.getElementById(savedFocusInputId.value) as HTMLInputElement | null
        if (el) {
          el.focus()
        }
      })
    }
  }
}

function clearSearch() {
  searchQuery.value = ''
  resumePausedTests()
}

// Clear confirmation states
const confirmClearAnswers = ref(false)
const confirmClearDifficult = ref(false)

// Testing Inputs and Validation
const userAnswers = ref<Record<string, string>>({})
const answerStatuses = ref<Record<string, 'correct' | 'incorrect' | null>>({})

// Retest Difficult Words Modal State
const showRetestModal = ref(false)
const difficultWords = ref<DifficultWord[]>([])
const retestAnswers = ref<Record<string, string>>({})
const retestStatuses = ref<Record<string, 'correct' | 'incorrect' | null>>({})

// Random Test Mode State
interface RandomTarget {
  verb: SpanishVerb
  tenseKey: string
  tenseLabel: string
  pronounIdx: number
  pronounLabel: string
  expected: string
}

const isRandomTestMode = ref(false)
const currentRandomTarget = ref<RandomTarget | null>(null)
const randomTestAnswer = ref('')
const randomTestStatus = ref<'correct' | 'incorrect' | null>(null)
const waitingForNextRandomKey = ref(false)
let ignoreNextRandomKey = false
const isVerbZooming = ref(false)
let verbZoomTimer: any = null

function triggerVerbZoom() {
  if (verbZoomTimer) clearTimeout(verbZoomTimer)
  isVerbZooming.value = false
  nextTick(() => {
    isVerbZooming.value = true
    verbZoomTimer = setTimeout(() => {
      isVerbZooming.value = false
    }, 1400)
  })
}

const isPillPulsing = ref(false)
let pillPulseTimer: any = null
let pillDelayTimer: any = null

function triggerPillPulse() {
  if (pillPulseTimer) clearTimeout(pillPulseTimer)
  isPillPulsing.value = false
  nextTick(() => {
    isPillPulsing.value = true
    pillPulseTimer = setTimeout(() => {
      isPillPulsing.value = false
    }, 700)
  })
}

function schedulePillPulse(delayMs: number = 0) {
  if (pillDelayTimer) clearTimeout(pillDelayTimer)
  isPillPulsing.value = false
  if (delayMs > 0) {
    pillDelayTimer = setTimeout(() => {
      triggerPillPulse()
    }, delayMs)
  } else {
    triggerPillPulse()
  }
}

const randomKey = computed(() => {
  if (!currentRandomTarget.value) return ''
  return `random-${currentRandomTarget.value.verb.verb}-${currentRandomTarget.value.tenseKey}-${currentRandomTarget.value.pronounIdx}`
})

// Hint state for ESC keypress
const hintState = ref<{
  cellKey: string
  originalValue: string
  count: number
  timer: any
  active: boolean
} | null>(null)

// Peek state for CTRL-ENTER keypress
const isPeeking = ref(false)
const peekFading = ref(false)
const peekingVerb = ref<string | null>(null)
const peekingExcludedInputId = ref<string | null>(null)
const lastFocusedVerb = ref('')
const lastFocusedInputId = ref('')
let peekTimer: any = null
let peekFadeTimer: any = null

function isVerbPeeking(verbName: string): boolean {
  if (!isPeeking.value) return false
  if (isRandomTestMode.value) {
    return currentRandomTarget.value?.verb?.verb === verbName
  }
  if (isTestMode.value) {
    return peekingVerb.value === verbName
  }
  if (peekingVerb.value === 'ALL') return true
  return peekingVerb.value === verbName
}

function isCellPeeking(inputId: string, verbName: string): boolean {
  if (!isVerbPeeking(verbName)) return false
  if (peekingExcludedInputId.value && peekingExcludedInputId.value === inputId) {
    return false
  }
  return true
}

function blankActiveCell() {
  if (import.meta.server) return

  if (isRandomTestMode.value) {
    if (waitingForNextRandomKey.value || randomTestStatus.value === 'correct') {
      return
    }
    randomTestAnswer.value = ''
    if (hintState.value && hintState.value.cellKey === randomKey.value) {
      if (hintState.value.timer) clearTimeout(hintState.value.timer)
      hintState.value = null
    }
    const el = document.getElementById('random-test-input') as HTMLInputElement | null
    if (el) {
      el.value = ''
      el.setSelectionRange(0, 0)
    }
    return
  }

  const activeEl = document.activeElement as HTMLInputElement | null
  if (!activeEl || !activeEl.id || !activeEl.id.startsWith('input-')) return

  const rawId = activeEl.id.slice('input-'.length)
  if (rawId.endsWith('-gerund')) {
    const verbName = rawId.slice(0, -'-gerund'.length)
    const cellKey = getCellKey(verbName, 'gerund', 0)
    userAnswers.value[cellKey] = ''
    answerStatuses.value[cellKey] = null
    if (hintState.value && hintState.value.cellKey === cellKey) {
      if (hintState.value.timer) clearTimeout(hintState.value.timer)
      hintState.value = null
    }
  } else if (rawId.endsWith('-pastParticiple')) {
    const verbName = rawId.slice(0, -'-pastParticiple'.length)
    const cellKey = getCellKey(verbName, 'pastParticiple', 0)
    userAnswers.value[cellKey] = ''
    answerStatuses.value[cellKey] = null
    if (hintState.value && hintState.value.cellKey === cellKey) {
      if (hintState.value.timer) clearTimeout(hintState.value.timer)
      hintState.value = null
    }
  } else {
    const lastDash = rawId.lastIndexOf('-')
    if (lastDash !== -1) {
      const pIdx = parseInt(rawId.slice(lastDash + 1), 10)
      const rest = rawId.slice(0, lastDash)
      const secondLastDash = rest.lastIndexOf('-')
      if (secondLastDash !== -1) {
        const tenseKey = rest.slice(secondLastDash + 1)
        const verbName = rest.slice(0, secondLastDash)
        const cellKey = getCellKey(verbName, tenseKey, pIdx)
        userAnswers.value[cellKey] = ''
        answerStatuses.value[cellKey] = null
        if (hintState.value && hintState.value.cellKey === cellKey) {
          if (hintState.value.timer) clearTimeout(hintState.value.timer)
          hintState.value = null
        }
      }
    }
  }

  activeEl.value = ''
  activeEl.setSelectionRange(0, 0)
}

function triggerPeek() {
  if (!isTestMode.value && !isRandomTestMode.value) {
    if (activeStudyVerb.value) {
      peekingVerb.value = activeStudyVerb.value
    } else {
      peekingVerb.value = 'ALL'
    }
    peekingExcludedInputId.value = null

    if (peekTimer) clearTimeout(peekTimer)
    if (peekFadeTimer) clearTimeout(peekFadeTimer)

    isPeeking.value = true
    peekFading.value = false

    peekTimer = setTimeout(() => {
      peekFading.value = true
      peekFadeTimer = setTimeout(() => {
        isPeeking.value = false
        peekFading.value = false
        peekingVerb.value = null
      }, 300)
    }, 1000)
    return
  }

  let targetInputIdToRestore = ''
  if (isRandomTestMode.value) {
    peekingVerb.value = currentRandomTarget.value?.verb?.verb || null
    targetInputIdToRestore = 'random-test-input'
  } else {
    const activeEl = typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
    let targetVerb = ''
    if (activeEl && activeEl.id && activeEl.id.startsWith('input-')) {
      targetInputIdToRestore = activeEl.id
      const rawId = activeEl.id.slice('input-'.length)
      if (rawId.endsWith('-gerund')) {
        targetVerb = rawId.slice(0, -'-gerund'.length)
      } else if (rawId.endsWith('-pastParticiple')) {
        targetVerb = rawId.slice(0, -'-pastParticiple'.length)
      } else {
        const lastDash = rawId.lastIndexOf('-')
        if (lastDash !== -1) {
          const rest = rawId.slice(0, lastDash)
          const secondLastDash = rest.lastIndexOf('-')
          if (secondLastDash !== -1) {
            targetVerb = rest.slice(0, secondLastDash)
          }
        }
      }
    }
    if (!targetVerb) {
      targetVerb = lastFocusedVerb.value || filteredVerbList.value[0]?.verb || ''
      if (lastFocusedInputId.value) {
        targetInputIdToRestore = lastFocusedInputId.value
      }
    }
    peekingVerb.value = targetVerb
  }

  peekingExcludedInputId.value = targetInputIdToRestore || null

  blankActiveCell()

  if (peekTimer) clearTimeout(peekTimer)
  if (peekFadeTimer) clearTimeout(peekFadeTimer)

  isPeeking.value = true
  peekFading.value = false

  peekTimer = setTimeout(() => {
    peekFading.value = true
    peekFadeTimer = setTimeout(() => {
      isPeeking.value = false
      peekFading.value = false
      peekingVerb.value = null
      peekingExcludedInputId.value = null
      if (targetInputIdToRestore && typeof document !== 'undefined') {
        nextTick(() => {
          const el = document.getElementById(targetInputIdToRestore) as HTMLInputElement | null
          if (el) {
            el.focus()
          }
        })
      }
    }, 300)
  }, 1000)
}

function openGoogleExamples(rawWord: string) {
  if (!rawWord || !import.meta.client) return
  const cleanWord = rawWord.split('/')[0].trim()
  if (!cleanWord || cleanWord === '—' || cleanWord === '---' || cleanWord === '-' || cleanWord === 'n/a') return
  const query = `give me three Spanish sentences using the verb "${cleanWord}" with English translations`
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
  window.open(url, '_blank')
}

function handleCellClick(event: MouseEvent, rawWord: string) {
  if (event.detail === 3) {
    openGoogleExamples(rawWord)
  }
}

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
  if (isSearching.value) return false
  if (!isTestMode.value) return false
  if (tenseKey === 'gerund' || tenseKey === 'pastParticiple') {
    return selectedTenses.value.includes(tenseKey)
  }
  return selectedTenses.value.includes(tenseKey) && selectedPronouns.value.includes(pronounIdx)
}

function isCellHidden(tenseKey: string, pronounIdx: number): boolean {
  if (isSearching.value) return false
  if (isTestMode.value) {
    return !isCellTested(tenseKey, pronounIdx)
  }
  return !selectedTenses.value.includes(tenseKey) || !selectedPronouns.value.includes(pronounIdx)
}

function normalizeAnswer(text: string): string {
  return text.trim().toLowerCase()
}

function validateCell(verb: SpanishVerb, tenseKey: string, pronounIdx: number) {
  const key = getCellKey(verb.verb, tenseKey, pronounIdx)
  const userText = userAnswers.value[key] || ''
  const trimmed = normalizeAnswer(userText)

  if (!trimmed) {
    answerStatuses.value[key] = null
    return
  }

  let expected = ''
  let tenseLabel = ''
  let pronounLabel = ''

  if (tenseKey === 'gerund') {
    expected = verb.gerund || ''
    tenseLabel = 'Gerundio'
    pronounLabel = ''
  } else if (tenseKey === 'pastParticiple') {
    expected = verb.pastParticiple || ''
    tenseLabel = 'Participio'
    pronounLabel = ''
  } else {
    const expectedList = (verb as any)[tenseKey] || []
    expected = expectedList[pronounIdx] || ''
    const tenseObj = TENSES.find(t => t.key === tenseKey)
    const pronounObj = PRONOUNS.find(p => p.idx === pronounIdx)
    tenseLabel = tenseObj ? tenseObj.label : tenseKey
    pronounLabel = pronounObj ? pronounObj.label : `p${pronounIdx}`
  }

  if (!expected || expected === '-') {
    return
  }

  const normalizedExpected = normalizeAnswer(expected)
  const expectedOptions = normalizedExpected.split('/').map(s => s.trim())
  const isMatch = expectedOptions.includes(trimmed)

  if (isMatch) {
    answerStatuses.value[key] = 'correct'
  } else {
    answerStatuses.value[key] = 'incorrect'
    recordError(
      verb.verb,
      tenseKey,
      tenseLabel,
      pronounIdx,
      pronounLabel,
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
  if (isSearching.value) {
    return searchMatchingVerbs.value
  }
  return verbs.filter(v => selectedVerbs.value.includes(v.verb))
})

function formatDifficultWordTag(item: DifficultWord): string {
  if (item.tenseKey === 'gerund') return 'gerundio'
  if (item.tenseKey === 'pastParticiple') return 'participio'
  const tense = item.tenseLabel.toLowerCase()
  return item.pronounLabel ? `${tense} ${item.pronounLabel}` : tense
}

function isHintActive(cellKey: string): boolean {
  return !!(hintState.value && hintState.value.cellKey === cellKey && hintState.value.active)
}

function handleRetestInput(id: string) {
  if (retestStatuses.value[id]) {
    retestStatuses.value[id] = null
  }
}

function handleInput(cellKey: string) {
  if (answerStatuses.value[cellKey]) {
    answerStatuses.value[cellKey] = null
  }
  if (hintState.value && hintState.value.cellKey === cellKey) {
    if (hintState.value.timer) clearTimeout(hintState.value.timer)
    hintState.value = null
  }
}

function triggerHint(cellKey: string, expectedAnswer: string, event: KeyboardEvent) {
  event.preventDefault()
  if (!expectedAnswer) return

  const inputEl = event.target as HTMLInputElement
  const cleanAnswer = expectedAnswer.split('/')[0].trim()

  const isRandom = cellKey.startsWith('random-')
  const getCurrentVal = () => isRandom ? randomTestAnswer.value : (userAnswers.value[cellKey] || '')
  const setCurrentVal = (val: string) => {
    if (isRandom) randomTestAnswer.value = val
    else userAnswers.value[cellKey] = val
  }

  if (hintState.value && hintState.value.cellKey === cellKey) {
    if (hintState.value.timer) clearTimeout(hintState.value.timer)
    let newCount = hintState.value.count + 1
    if (newCount > cleanAnswer.length) {
      newCount = cleanAnswer.length
    }
    hintState.value.count = newCount
    hintState.value.active = true
    setCurrentVal(cleanAnswer.slice(0, newCount))
  } else {
    const orig = getCurrentVal()
    hintState.value = {
      cellKey,
      originalValue: orig,
      count: 1,
      timer: null,
      active: true
    }
    setCurrentVal(cleanAnswer.slice(0, 1))
  }

  nextTick(() => {
    inputEl.focus()
    const len = getCurrentVal().length
    inputEl.setSelectionRange(len, len)
  })

  hintState.value.timer = setTimeout(() => {
    if (hintState.value && hintState.value.cellKey === cellKey && hintState.value.active) {
      setCurrentVal('')
      hintState.value.active = false
      nextTick(() => {
        inputEl.focus()
        inputEl.setSelectionRange(0, 0)
      })
    }
  }, 1000)
}

function handleBlur(verb: SpanishVerb, tenseKey: string, pronounIdx: number, event: FocusEvent) {
  const related = event?.relatedTarget as HTMLElement | null
  if (related && related.id === 'verb-search-input') {
    return
  }
  if (typeof document !== 'undefined' && document.activeElement?.id === 'verb-search-input') {
    return
  }
  if (isSearching.value) {
    return
  }
  const cellKey = getCellKey(verb.verb, tenseKey, pronounIdx)
  if (hintState.value && hintState.value.cellKey === cellKey) {
    if (hintState.value.active) {
      if (hintState.value.timer) clearTimeout(hintState.value.timer)
      userAnswers.value[cellKey] = ''
    }
    hintState.value = null
  }
  validateCell(verb, tenseKey, pronounIdx)
}

function focusCell(id: string): boolean {
  const el = document.getElementById(id) as HTMLInputElement | null
  if (el) {
    el.focus()
    el.select()
    return true
  }
  return false
}

function navigateHorizontal(currentInput: HTMLInputElement, direction: 'left' | 'right') {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[id^="input-"]'))
  const currentIndex = inputs.indexOf(currentInput)
  if (currentIndex === -1) return

  const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1
  if (targetIndex >= 0 && targetIndex < inputs.length) {
    const nextInput = inputs[targetIndex]
    nextInput.focus()
    nextInput.select()
  }
}

function handleKeyDown(
  verbIndex: number,
  rowType: 'gerund' | 'pastParticiple' | number,
  colIdx: number,
  verb: SpanishVerb,
  event: KeyboardEvent
) {
  if (event.key === 'Escape') {
    let expected = ''
    if (rowType === 'gerund') {
      expected = verb.gerund
    } else if (rowType === 'pastParticiple') {
      expected = verb.pastParticiple
    } else {
      const finiteTense = FINITE_TENSES[rowType]
      if (finiteTense) {
        expected = ((verb as any)[finiteTense.key] || [])[colIdx] || ''
      }
    }
    const cellKey = getCellKey(
      verb.verb,
      typeof rowType === 'string' ? rowType : FINITE_TENSES[rowType].key,
      colIdx
    )
    triggerHint(cellKey, expected, event)
    return
  }

  if (event.altKey && event.key === 'Enter') {
    let expected = ''
    if (rowType === 'gerund') {
      expected = verb.gerund
    } else if (rowType === 'pastParticiple') {
      expected = verb.pastParticiple
    } else {
      const finiteTense = FINITE_TENSES[rowType]
      if (finiteTense) {
        expected = ((verb as any)[finiteTense.key] || [])[colIdx] || ''
      }
    }
    event.preventDefault()
    event.stopPropagation()
    openGoogleExamples(expected)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    if (event.ctrlKey || event.metaKey) {
      triggerPeek()
      return
    }
    ;(event.target as HTMLInputElement)?.blur()
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    navigateVertical(verbIndex, rowType, colIdx, 'up')
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    navigateVertical(verbIndex, rowType, colIdx, 'down')
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    const inputEl = event.target as HTMLInputElement
    const val = inputEl.value || ''
    const isLeft = event.key === 'ArrowLeft'
    const isRight = event.key === 'ArrowRight'

    const shouldMoveLeft = isLeft && (val.length === 0 || (inputEl.selectionStart === 0 && inputEl.selectionEnd === 0))
    const shouldMoveRight = isRight && (val.length === 0 || (inputEl.selectionStart === val.length && inputEl.selectionEnd === val.length))

    if (shouldMoveLeft || shouldMoveRight) {
      event.preventDefault()
      navigateHorizontal(inputEl, isLeft ? 'left' : 'right')
    }
  }
}

function navigateVertical(
  verbIndex: number,
  rowType: 'gerund' | 'pastParticiple' | number,
  colIdx: number,
  direction: 'up' | 'down'
) {
  const currentVerb = filteredVerbList.value[verbIndex]
  if (!currentVerb) return

  if (direction === 'up') {
    if (typeof rowType === 'number') {
      if (rowType > 0) {
        for (let r = rowType - 1; r >= 0; r--) {
          const tense = FINITE_TENSES[r]
          if (focusCell(`input-${currentVerb.verb}-${tense.key}-${colIdx}`)) return
        }
      }
      const hasGerund = isCellTested('gerund', 0)
      const hasParticiple = isCellTested('pastParticiple', 0)
      if (colIdx <= 2 && hasGerund && focusCell(`input-${currentVerb.verb}-gerund`)) return
      if (colIdx > 2 && hasParticiple && focusCell(`input-${currentVerb.verb}-pastParticiple`)) return
      if (hasGerund && focusCell(`input-${currentVerb.verb}-gerund`)) return
      if (hasParticiple && focusCell(`input-${currentVerb.verb}-pastParticiple`)) return

      if (verbIndex > 0) {
        const prevVerb = filteredVerbList.value[verbIndex - 1]
        for (let r = FINITE_TENSES.length - 1; r >= 0; r--) {
          const tense = FINITE_TENSES[r]
          if (focusCell(`input-${prevVerb.verb}-${tense.key}-${colIdx}`)) return
        }
      }
    } else {
      if (verbIndex > 0) {
        const prevVerb = filteredVerbList.value[verbIndex - 1]
        const targetCol = rowType === 'gerund' ? 0 : 3
        for (let r = FINITE_TENSES.length - 1; r >= 0; r--) {
          const tense = FINITE_TENSES[r]
          if (focusCell(`input-${prevVerb.verb}-${tense.key}-${targetCol}`)) return
        }
      }
    }
  } else if (direction === 'down') {
    if (typeof rowType === 'string') {
      const targetCol = rowType === 'gerund' ? 0 : 3
      for (let r = 0; r < FINITE_TENSES.length; r++) {
        const tense = FINITE_TENSES[r]
        if (focusCell(`input-${currentVerb.verb}-${tense.key}-${targetCol}`)) return
      }
      if (verbIndex < filteredVerbList.value.length - 1) {
        const nextVerb = filteredVerbList.value[verbIndex + 1]
        if (rowType === 'gerund' && focusCell(`input-${nextVerb.verb}-gerund`)) return
        if (focusCell(`input-${nextVerb.verb}-pastParticiple`)) return
      }
    } else {
      for (let r = rowType + 1; r < FINITE_TENSES.length; r++) {
        const tense = FINITE_TENSES[r]
        if (focusCell(`input-${currentVerb.verb}-${tense.key}-${colIdx}`)) return
      }
      if (verbIndex < filteredVerbList.value.length - 1) {
        const nextVerb = filteredVerbList.value[verbIndex + 1]
        const hasGerund = isCellTested('gerund', 0)
        const hasParticiple = isCellTested('pastParticiple', 0)
        if (colIdx <= 2 && hasGerund && focusCell(`input-${nextVerb.verb}-gerund`)) return
        if (colIdx > 2 && hasParticiple && focusCell(`input-${nextVerb.verb}-pastParticiple`)) return
        if (hasGerund && focusCell(`input-${nextVerb.verb}-gerund`)) return
        if (hasParticiple && focusCell(`input-${nextVerb.verb}-pastParticiple`)) return
        for (let r = 0; r < FINITE_TENSES.length; r++) {
          const tense = FINITE_TENSES[r]
          if (focusCell(`input-${nextVerb.verb}-${tense.key}-${colIdx}`)) return
        }
      }
    }
  }
}

function handleCellFocus(event: FocusEvent) {
  if (!isTestMode.value && !isRandomTestMode.value) return
  const el = event.target as HTMLElement | null
  if (!el) return
  if (el.id) {
    lastFocusedInputId.value = el.id
    if (el.id !== 'verb-search-input') {
      savedFocusInputId.value = el.id
    }
    if (el.id.startsWith('input-')) {
      const rawId = el.id.slice('input-'.length)
      if (rawId.endsWith('-gerund')) {
        lastFocusedVerb.value = rawId.slice(0, -'-gerund'.length)
      } else if (rawId.endsWith('-pastParticiple')) {
        lastFocusedVerb.value = rawId.slice(0, -'-pastParticiple'.length)
      } else {
        const lastDash = rawId.lastIndexOf('-')
        if (lastDash !== -1) {
          const pronounStr = rawId.slice(lastDash + 1)
          const pIdx = parseInt(pronounStr, 10)
          if (!isNaN(pIdx) && pIdx >= 0 && pIdx < PRONOUNS.length) {
            currentMobilePronounIdx.value = pIdx
          }
          const rest = rawId.slice(0, lastDash)
          const secondLastDash = rest.lastIndexOf('-')
          if (secondLastDash !== -1) {
            lastFocusedVerb.value = rest.slice(0, secondLastDash)
          }
        }
      }
    }
  }
  const rect = el.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const margin = 120
  if (rect.top < margin || rect.bottom > viewportHeight - margin) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function startRandomTest() {
  isRandomTestMode.value = true
  isTestMode.value = false
  if (import.meta.client) {
    window.addEventListener('keydown', handleRandomGlobalKeyDown)
  }
  pickNextRandomTarget()
}

function exitRandomTest() {
  isRandomTestMode.value = false
  pausedRandomTest.value = false
  currentRandomTarget.value = null
  randomTestAnswer.value = ''
  randomTestStatus.value = null
  waitingForNextRandomKey.value = false
  if (import.meta.client) {
    window.removeEventListener('keydown', handleRandomGlobalKeyDown)
  }
}

function toggleRandomTest() {
  if (isRandomTestMode.value) {
    exitRandomTest()
  } else {
    startRandomTest()
  }
}

function toggleFullTest() {
  if (isRandomTestMode.value) {
    exitRandomTest()
  }
  isTestMode.value = !isTestMode.value
  pausedFullTest.value = false
}

function pickNextRandomTarget() {
  const prevVerb = currentRandomTarget.value?.verb?.verb
  waitingForNextRandomKey.value = false
  ignoreNextRandomKey = false
  randomTestStatus.value = null
  randomTestAnswer.value = ''

  const poolVerbs = verbs.filter(v => selectedVerbs.value.includes(v.verb))
  const targetVerbs = poolVerbs.length > 0 ? poolVerbs : verbs

  const candidates: RandomTarget[] = []

  for (const v of targetVerbs) {
    if (selectedTenses.value.includes('gerund') && v.gerund) {
      candidates.push({
        verb: v,
        tenseKey: 'gerund',
        tenseLabel: 'Gerundio',
        pronounIdx: 0,
        pronounLabel: '',
        expected: v.gerund
      })
    }
    if (selectedTenses.value.includes('pastParticiple') && v.pastParticiple) {
      candidates.push({
        verb: v,
        tenseKey: 'pastParticiple',
        tenseLabel: 'Participio',
        pronounIdx: 0,
        pronounLabel: '',
        expected: v.pastParticiple
      })
    }
    for (const tense of FINITE_TENSES) {
      if (selectedTenses.value.includes(tense.key)) {
        const forms = (v as any)[tense.key] as string[] || []
        for (const pIdx of selectedPronouns.value) {
          if (forms[pIdx] && forms[pIdx] !== '-') {
            candidates.push({
              verb: v,
              tenseKey: tense.key,
              tenseLabel: tense.label,
              pronounIdx: pIdx,
              pronounLabel: PRONOUNS[pIdx]?.label || '',
              expected: forms[pIdx]
            })
          }
        }
      }
    }
  }

  // Fallback if no candidate found with current filters
  if (candidates.length === 0) {
    for (const v of verbs) {
      for (const tense of FINITE_TENSES) {
        const forms = (v as any)[tense.key] as string[] || []
        for (const p of PRONOUNS) {
          if (forms[p.idx] && forms[p.idx] !== '-') {
            candidates.push({
              verb: v,
              tenseKey: tense.key,
              tenseLabel: tense.label,
              pronounIdx: p.idx,
              pronounLabel: p.label,
              expected: forms[p.idx]
            })
          }
        }
      }
    }
  }

  let filteredCandidates = candidates
  if (currentRandomTarget.value && candidates.length > 1) {
    filteredCandidates = candidates.filter(
      c => !(c.verb.verb === currentRandomTarget.value!.verb.verb &&
             c.tenseKey === currentRandomTarget.value!.tenseKey &&
             c.pronounIdx === currentRandomTarget.value!.pronounIdx)
    )
  }
  const chosenList = filteredCandidates.length > 0 ? filteredCandidates : candidates
  const randomIndex = Math.floor(Math.random() * chosenList.length)
  currentRandomTarget.value = chosenList[randomIndex]
  if (currentRandomTarget.value && currentRandomTarget.value.tenseKey !== 'gerund' && currentRandomTarget.value.tenseKey !== 'pastParticiple') {
    currentMobilePronounIdx.value = currentRandomTarget.value.pronounIdx
  }

  const newVerb = currentRandomTarget.value?.verb?.verb
  if (prevVerb && newVerb && prevVerb !== newVerb) {
    triggerVerbZoom()
    schedulePillPulse(1400)
  } else {
    schedulePillPulse(0)
  }

  nextTick(() => {
    const el = document.getElementById('random-test-input') as HTMLInputElement | null
    if (el) {
      el.focus()
      handleCellFocus({ target: el } as any)
    }
  })
}

function validateRandomTest() {
  if (!currentRandomTarget.value || waitingForNextRandomKey.value) return
  const raw = randomTestAnswer.value
  const trimmed = normalizeAnswer(raw)
  if (!trimmed) {
    randomTestStatus.value = null
    return
  }

  const expectedOptions = normalizeAnswer(currentRandomTarget.value.expected).split('/').map(s => s.trim())
  const isMatch = expectedOptions.includes(trimmed)

  if (isMatch) {
    randomTestStatus.value = 'correct'
    waitingForNextRandomKey.value = true
    ignoreNextRandomKey = true
    setTimeout(() => {
      ignoreNextRandomKey = false
    }, 150)
  } else {
    randomTestStatus.value = 'incorrect'
    recordError(
      currentRandomTarget.value.verb.verb,
      currentRandomTarget.value.tenseKey,
      currentRandomTarget.value.tenseLabel,
      currentRandomTarget.value.pronounIdx,
      currentRandomTarget.value.pronounLabel,
      currentRandomTarget.value.expected
    )
    nextTick(() => {
      if (typeof document !== 'undefined' && document.activeElement?.id === 'verb-search-input') {
        return
      }
      if (isSearching.value) {
        return
      }
      const el = document.getElementById('random-test-input') as HTMLInputElement | null
      if (el) {
        el.focus()
        el.select()
      }
    })
  }
}

function handleRandomBlur(event?: FocusEvent) {
  if (waitingForNextRandomKey.value) return
  const related = event?.relatedTarget as HTMLElement | null
  if (related && related.id === 'verb-search-input') {
    return
  }
  if (typeof document !== 'undefined' && document.activeElement?.id === 'verb-search-input') {
    return
  }
  if (isSearching.value) {
    return
  }
  if (hintState.value && hintState.value.cellKey === randomKey.value) {
    if (hintState.value.active) {
      if (hintState.value.timer) clearTimeout(hintState.value.timer)
      randomTestAnswer.value = ''
    }
    hintState.value = null
  }
  validateRandomTest()
}

function handleRandomInput() {
  if (randomTestStatus.value === 'incorrect') {
    randomTestStatus.value = null
  }
  if (hintState.value && hintState.value.cellKey === randomKey.value) {
    if (hintState.value.timer) clearTimeout(hintState.value.timer)
    hintState.value = null
  }
}

function handleRandomInputKeyDown(event: KeyboardEvent) {
  if (waitingForNextRandomKey.value) {
    if (ignoreNextRandomKey) return
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return
    if (event.altKey && event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      openGoogleExamples(currentRandomTarget.value?.expected || '')
      return
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      triggerPeek()
      return
    }
    event.preventDefault()
    event.stopPropagation()
    pickNextRandomTarget()
    return
  }
  if (event.key === 'Escape') {
    if (!currentRandomTarget.value) return
    triggerHint(randomKey.value, currentRandomTarget.value.expected, event)
    return
  }
  if (event.altKey && event.key === 'Enter') {
    event.preventDefault()
    event.stopPropagation()
    openGoogleExamples(currentRandomTarget.value?.expected || '')
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    event.stopPropagation()
    if (event.ctrlKey || event.metaKey) {
      triggerPeek()
      return
    }
    validateRandomTest()
    if (randomTestStatus.value === 'correct') {
      ;(event.target as HTMLInputElement)?.blur()
    }
  }
}

function handleRandomGlobalKeyDown(e: KeyboardEvent) {
  if (!isRandomTestMode.value) return
  if (waitingForNextRandomKey.value) {
    if (ignoreNextRandomKey) return
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return
    if (e.altKey && e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      openGoogleExamples(currentRandomTarget.value?.expected || '')
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    pickNextRandomTarget()
  }
}

function handleGlobalKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    triggerPeek()
  }
}

onMounted(() => {
  loadDifficultWords()
  checkMobile()
  if (import.meta.client) {
    window.addEventListener('resize', checkMobile)
    window.addEventListener('keydown', handleGlobalKeyDown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', checkMobile)
    window.removeEventListener('keydown', handleRandomGlobalKeyDown)
    window.removeEventListener('keydown', handleGlobalKeyDown)
  }
  if (peekTimer) clearTimeout(peekTimer)
  if (peekFadeTimer) clearTimeout(peekFadeTimer)
  if (verbZoomTimer) clearTimeout(verbZoomTimer)
  if (pillPulseTimer) clearTimeout(pillPulseTimer)
  if (pillDelayTimer) clearTimeout(pillDelayTimer)
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-2.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
    <!-- Mobile Header & Actions Bar (<sm) -->
    <div class="sm:hidden space-y-2.5">
      <!-- Mobile Top Header Bar -->
      <div class="flex items-center justify-between gap-2">
        <NuxtLink
          to="/activities"
          class="inline-flex items-center text-xs font-semibold !text-gray-300 dark:!text-gray-300 hover:!text-gray-900 dark:hover:!text-white opacity-70 hover:opacity-100 transition-all"
        >
          ← Activities
        </NuxtLink>
        <h1 class="text-base font-black text-gray-900 dark:text-white tracking-tight">
          <span class="text-[#be185d] dark:text-[#f43f5e]">Spanish Verbs</span>
        </h1>
      </div>

      <!-- Mobile Search Box -->
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </div>
        <input
          id="verb-search-input-mobile"
          type="text"
          v-model="searchQuery"
          @input="handleSearchInput"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @mousedown="handleSearchFocus"
          @keydown.esc="clearSearch"
          placeholder="Search conjugations..."
          class="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#182030] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be185d] focus:border-[#be185d] transition-all shadow-xs"
        />
        <button
          v-if="searchQuery"
          type="button"
          @mousedown.prevent
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          title="Clear search"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- Mobile Quick Actions Row -->
      <div v-if="!isSearching" class="flex items-center justify-between gap-1.5">
        <div class="flex items-center gap-1.5 flex-1 min-w-0">
          <!-- Random Test -->
          <button
            type="button"
            @click="toggleRandomTest"
            class="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1 min-w-0 truncate"
            :class="isRandomTestMode
              ? 'bg-[#be185d] text-white border-[#be185d]'
              : 'bg-[#be185d]/10 text-[#be185d] dark:text-[#f43f5e] border-[#be185d]/40'"
          >
            <SparklesIcon class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">Random</span>
          </button>

          <!-- Full Test -->
          <button
            type="button"
            @click="toggleFullTest"
            class="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1 min-w-0 truncate"
            :class="isTestMode
              ? 'bg-[#be185d] text-white border-[#be185d]'
              : 'bg-[#be185d]/10 text-[#be185d] dark:text-[#f43f5e] border-[#be185d]/40'"
          >
            <PencilSquareIcon class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">Full Test</span>
          </button>

          <!-- Review Difficult Words (if any) -->
          <button
            v-if="activeDifficultWords.length > 0"
            type="button"
            @click="showRetestModal = true"
            class="py-1.5 px-2 rounded-xl text-xs font-bold border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 inline-flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <AcademicCapIcon class="w-3.5 h-3.5 text-[#be185d]" />
            <span>{{ activeDifficultWords.length }}</span>
          </button>
        </div>

        <!-- Filter & Settings Drawer Button -->
        <button
          type="button"
          @click="isMobileDrawerOpen = true"
          class="py-1.5 px-2.5 rounded-xl text-xs font-bold border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#182030] text-gray-700 dark:text-gray-300 hover:border-[#be185d] transition-all cursor-pointer inline-flex items-center gap-1 shrink-0 shadow-xs"
          title="Filters & Settings"
        >
          <AdjustmentsHorizontalIcon class="w-4 h-4 text-[#be185d] dark:text-[#f43f5e]" />
          <span>Filters</span>
          <span class="text-[10px] font-mono opacity-70">({{ selectedVerbs.length }})</span>
        </button>
      </div>
    </div>

    <!-- Desktop Top Bar: Navigation & Search Box -->
    <div class="hidden sm:flex items-center justify-between gap-3 flex-wrap">
      <NuxtLink
        to="/activities"
        class="inline-flex items-center text-sm font-semibold !text-gray-300 dark:!text-gray-300 hover:!text-gray-900 dark:hover:!text-white opacity-70 hover:opacity-100 transition-all"
      >
        ← Back to Activities
      </NuxtLink>

      <!-- Simple Search Box in Upper Right -->
      <div class="relative w-full sm:w-72 md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </div>
        <input
          id="verb-search-input"
          type="text"
          v-model="searchQuery"
          @input="handleSearchInput"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @mousedown="handleSearchFocus"
          @keydown.esc="clearSearch"
          placeholder="Search conjugations..."
          class="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#182030] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be185d] focus:border-[#be185d] transition-all shadow-xs"
        />
        <button
          v-if="searchQuery"
          id="verb-search-clear-btn"
          type="button"
          @mousedown.prevent
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          title="Clear search"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Header Section with show/hide toggle in front -->
    <div class="hidden sm:flex items-center gap-3">
      <button
        v-if="!searchQuery.trim()"
        type="button"
        @click="showControls = !showControls"
        class="p-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        :title="showControls ? 'Hide Controls' : 'Show Controls'"
      >
        <ChevronDownIcon v-if="showControls" class="w-5 h-5 text-[#be185d] dark:text-[#f43f5e]" />
        <ChevronRightIcon v-else class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        <span class="text-[#be185d] dark:text-[#f43f5e]">Spanish Verbs</span>
      </h1>
    </div>

    <!-- Controls Panel -->
    <div
      v-show="showControls && !isSearching"
      class="hidden sm:block p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#182030] border-2 border-gray-200 dark:border-gray-700 shadow-sm space-y-4"
    >
      <!-- Top Action Row inside controls: Random Test & Full Test on left, Clear/Reset & Retest Link on right -->
      <div class="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-gray-200 dark:border-gray-700">
        <!-- Left Side: Random Test and Full Test (look and act the same) -->
        <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
          <!-- 1. Random Test -->
          <button
            type="button"
            @click="toggleRandomTest"
            class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            :class="isRandomTestMode
              ? 'bg-[#be185d] text-white border-[#be185d] hover:bg-[#a2134e]'
              : 'bg-[#be185d]/10 text-[#be185d] dark:text-[#f43f5e] border-[#be185d]/40 hover:bg-[#be185d]/20'"
          >
            <SparklesIcon class="w-4 h-4" />
            <span>Random Test</span>
          </button>

          <!-- 2. Full Test -->
          <button
            type="button"
            @click="toggleFullTest"
            class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            :class="isTestMode
              ? 'bg-[#be185d] text-white border-[#be185d] hover:bg-[#a2134e]'
              : 'bg-[#be185d]/10 text-[#be185d] dark:text-[#f43f5e] border-[#be185d]/40 hover:bg-[#be185d]/20'"
          >
            <PencilSquareIcon class="w-4 h-4" />
            <span>Full Test</span>
          </button>
        </div>

        <!-- Right Side: Clear Answers button & Retest Difficult Words link -->
        <div class="flex items-center gap-4 flex-wrap">
          <!-- Inline Clear Answers Confirmation -->
          <div v-if="isTestMode" class="flex items-center gap-2">
            <div v-if="!confirmClearAnswers">
              <button
                type="button"
                @click="confirmClearAnswers = true"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-500 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                Clear Answers
              </button>
            </div>
            <div v-else class="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/50">
              <span class="text-gray-700 dark:text-gray-300 font-medium">Are you sure?</span>
              <button
                type="button"
                @click="resetTestInputs(); confirmClearAnswers = false"
                class="font-bold text-red-800 dark:text-red-600 hover:underline cursor-pointer"
              >
                Yes, clear
              </button>
              <button
                type="button"
                @click="confirmClearAnswers = false"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- Retest Difficult Words as a link -->
          <button
            type="button"
            @click="showRetestModal = true"
            class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <AcademicCapIcon class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Retest Difficult Words</span>
            <span
              v-if="activeDifficultWords.length > 0"
              class="px-1.5 py-0.2 rounded-full text-[11px] font-extrabold bg-[#be185d] text-white"
            >
              {{ activeDifficultWords.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Verbs Selector with Groups -->
      <div class="space-y-3">
        <!-- Groups Section -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Groups
          </span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="group in VERB_GROUPS"
              :key="group.id"
              type="button"
              @click="selectVerbGroup(group)"
              class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border select-none"
              :class="isGroupActive(group)
                ? 'bg-[#be185d] text-white border-[#be185d] shadow-xs'
                : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'"
            >
              {{ group.name }}
            </button>
          </div>
        </div>

        <!-- Individual Verbs List -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Verbs to Show ({{ selectedVerbs.length }} of {{ verbs.length }})
            </span>
            <button
              type="button"
              @click="toggleAllVerbs"
              class="text-xs font-semibold text-white hover:underline cursor-pointer"
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
            class="text-xs font-semibold text-white hover:underline cursor-pointer"
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
            class="text-xs font-semibold text-white hover:underline cursor-pointer"
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

    <!-- Mobile Filter & Settings Drawer -->
    <div
      v-if="isMobileDrawerOpen"
      class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs sm:hidden"
      @click.self="isMobileDrawerOpen = false"
    >
      <div class="w-full max-w-sm h-full bg-white dark:bg-[#161f30] border-l border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col">
        <!-- Drawer Header -->
        <div class="px-4 py-3.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdjustmentsHorizontalIcon class="w-5 h-5 text-[#be185d] dark:text-[#f43f5e]" />
            <h2 class="text-base font-extrabold text-gray-900 dark:text-white">Filters & Settings</h2>
          </div>
          <button
            type="button"
            @click="isMobileDrawerOpen = false"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Drawer Body -->
        <div class="flex-1 overflow-y-auto p-4 space-y-5">
          <!-- Groups Section -->
          <div class="space-y-2">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Groups
            </span>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="group in VERB_GROUPS"
                :key="group.id"
                type="button"
                @click="selectVerbGroup(group)"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border select-none"
                :class="isGroupActive(group)
                  ? 'bg-[#be185d] text-white border-[#be185d] shadow-xs'
                  : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'"
              >
                {{ group.name }}
              </button>
            </div>
          </div>

          <!-- Verbs to Show -->
          <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Verbs ({{ selectedVerbs.length }}/{{ verbs.length }})
              </span>
              <button
                type="button"
                @click="toggleAllVerbs"
                class="text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                {{ selectedVerbs.length === verbs.length ? 'Deselect All' : 'Select All' }}
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 bg-gray-50 dark:bg-[#121824]/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                v-for="v in verbs"
                :key="v.verb"
                type="button"
                @click="selectedVerbs.includes(v.verb) ? selectedVerbs = selectedVerbs.filter(x => x !== v.verb) : selectedVerbs.push(v.verb)"
                class="px-2 py-0.5 rounded-md text-xs font-semibold transition-all cursor-pointer border select-none"
                :class="selectedVerbs.includes(v.verb)
                  ? 'bg-[#be185d] text-white border-[#be185d]'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'"
              >
                {{ v.verb }}
              </button>
            </div>
          </div>

          <!-- Tenses to Test -->
          <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Tenses ({{ selectedTenses.length }}/{{ TENSES.length }})
              </span>
              <button
                type="button"
                @click="toggleAllTenses"
                class="text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                {{ selectedTenses.length === TENSES.length ? 'Deselect All' : 'Select All' }}
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5">
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

          <!-- Pronouns to Test -->
          <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Pronouns ({{ selectedPronouns.length }}/{{ PRONOUNS.length }})
              </span>
              <button
                type="button"
                @click="toggleAllPronouns"
                class="text-xs font-semibold text-white hover:underline cursor-pointer"
              >
                {{ selectedPronouns.length === PRONOUNS.length ? 'Deselect All' : 'Select All' }}
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5">
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

          <!-- Test Actions (Clear answers & Retest) -->
          <div class="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div v-if="isTestMode" class="space-y-2">
              <button
                v-if="!confirmClearAnswers"
                type="button"
                @click="confirmClearAnswers = true"
                class="w-full py-2 px-3 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                Clear All Test Answers
              </button>
              <div v-else class="flex items-center justify-between p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50">
                <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">Clear answers?</span>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="resetTestInputs(); confirmClearAnswers = false"
                    class="text-xs font-bold text-red-800 dark:text-red-600 hover:underline cursor-pointer"
                  >
                    Yes, clear
                  </button>
                  <button
                    type="button"
                    @click="confirmClearAnswers = false"
                    class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="showRetestModal = true; isMobileDrawerOpen = false"
              class="w-full py-2 px-3 rounded-xl text-xs font-bold border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <AcademicCapIcon class="w-4 h-4 text-[#be185d]" />
              <span>Retest Difficult Words</span>
              <span
                v-if="activeDifficultWords.length > 0"
                class="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#be185d] text-white"
              >
                {{ activeDifficultWords.length }}
              </span>
            </button>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#121824]/50">
          <button
            type="button"
            @click="isMobileDrawerOpen = false"
            class="w-full py-2.5 rounded-xl font-bold text-xs bg-[#be185d] text-white hover:bg-[#a2134e] transition-colors cursor-pointer shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>

    <!-- Random Test View (when isRandomTestMode is true and not searching) -->
    <div v-if="isRandomTestMode && currentRandomTarget && !isSearching" class="space-y-4">
      <!-- Top banner / indicator -->
      <div class="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#182030] border-2 border-gray-200 dark:border-gray-700 shadow-sm min-h-[58px]">
        <div class="flex items-center gap-3 shrink-0">
          <span class="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-[#be185d] text-white shrink-0">
            Random Test Mode
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
            ESC for hint, CTRL-ENTER to peek, ALT-ENTER for examples
          </span>
        </div>

        <div class="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            v-if="waitingForNextRandomKey"
            @click.stop="pickNextRandomTarget()"
            class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-700 animate-pulse hover:bg-emerald-200 dark:hover:bg-emerald-900/60 cursor-pointer transition-colors whitespace-nowrap"
            title="Click or press any key to continue · ALT-Enter for examples"
          >
            ✓ Correct! (Click for next · ALT-Enter for examples →)
          </button>
          <button
            type="button"
            @click="exitRandomTest"
            class="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Exit Random Test
          </button>
        </div>
      </div>

      <!-- Single Verb Table for Random Target -->
      <div class="bg-white dark:bg-[#182030] rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <!-- Verb Header with Gerund & Participle -->
        <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-[#151d2c] flex items-center justify-between gap-4 flex-wrap">
          <div class="space-y-0.5">
            <h2
              class="text-2xl font-black text-gray-900 dark:text-white capitalize tracking-tight inline-block origin-left"
              :class="{ 'animate-verb-zoom': isVerbZooming }"
            >
              {{ currentRandomTarget.verb.verb }}
            </h2>
            <div
              class="text-xs text-gray-400 dark:text-gray-500 select-none transition-opacity"
              :class="{ 'animate-hint-fade-during-zoom': isVerbZooming }"
            >
              ESC for hint, CTRL-ENTER to peek, ALT-ENTER for examples
            </div>
          </div>

          <!-- Non-finite form tags directly above table -->
          <div class="flex items-center gap-4 flex-wrap">
            <!-- Gerund Box -->
            <div class="flex flex-col items-center gap-1">
              <span class="text-gray-600 dark:text-gray-400 font-mono text-[11px] uppercase font-bold">
                Gerundio
              </span>

              <!-- If this cell is the tested one -->
              <div v-if="currentRandomTarget.tenseKey === 'gerund'" class="relative inline-block w-28 sm:w-32 h-[26px] align-middle">
                <input
                  id="random-test-input"
                  ref="randomTestInputRef"
                  type="text"
                  v-model="randomTestAnswer"
                  @input="handleRandomInput"
                  @keydown="handleRandomInputKeyDown"
                  @blur="handleRandomBlur($event)"
                  @focus="handleCellFocus"
                  @click="handleCellClick($event, currentRandomTarget.expected)"
                  class="w-full h-[26px] px-2 py-1 text-xs text-center rounded-lg border font-medium transition-all text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  :class="{
                    'bg-white dark:bg-[#121824] border-white ring-2 ring-white': !randomTestStatus && !isHintActive(randomKey),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 !text-emerald-500 font-bold ring-2 ring-white': isHintActive(randomKey),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold': !isHintActive(randomKey) && randomTestStatus === 'correct',
                    'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500 text-rose-800 dark:text-rose-200 font-bold': !isHintActive(randomKey) && randomTestStatus === 'incorrect'
                  }"
                />
              </div>

              <!-- Untested: shows '---' or peeks answer -->
              <span
                v-else
                @click="openGoogleExamples(currentRandomTarget.verb.gerund)"
                class="px-3 py-1 rounded-xl text-xs font-mono font-bold select-none min-w-[90px] text-center transition-opacity duration-300 cursor-pointer"
                :class="isPeeking ? (peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100') : 'text-gray-400 dark:text-gray-500 opacity-100'"
              >
                {{ isPeeking ? currentRandomTarget.verb.gerund : '---' }}
              </span>
            </div>

            <!-- Participle Box -->
            <div class="flex flex-col items-center gap-1">
              <span class="text-gray-600 dark:text-gray-400 font-mono text-[11px] uppercase font-bold">
                Participio
              </span>

              <!-- If this cell is the tested one -->
              <div v-if="currentRandomTarget.tenseKey === 'pastParticiple'" class="relative inline-block w-28 sm:w-32 h-[26px] align-middle">
                <input
                  id="random-test-input"
                  ref="randomTestInputRef"
                  type="text"
                  v-model="randomTestAnswer"
                  @input="handleRandomInput"
                  @keydown="handleRandomInputKeyDown"
                  @blur="handleRandomBlur($event)"
                  @focus="handleCellFocus"
                  @click="handleCellClick($event, currentRandomTarget.expected)"
                  class="w-full h-[26px] px-2 py-1 text-xs text-center rounded-lg border font-medium transition-all text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  :class="{
                    'bg-white dark:bg-[#121824] border-white ring-2 ring-white': !randomTestStatus && !isHintActive(randomKey),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 !text-emerald-500 font-bold ring-2 ring-white': isHintActive(randomKey),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold': !isHintActive(randomKey) && randomTestStatus === 'correct',
                    'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500 text-rose-800 dark:text-rose-200 font-bold': !isHintActive(randomKey) && randomTestStatus === 'incorrect'
                  }"
                />
              </div>

              <!-- Untested: shows '---' or peeks answer -->
              <span
                v-else
                @click="openGoogleExamples(currentRandomTarget.verb.pastParticiple)"
                class="px-3 py-1 rounded-xl text-xs font-mono font-bold select-none min-w-[90px] text-center transition-opacity duration-300 cursor-pointer"
                :class="isPeeking ? (peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100') : 'text-gray-400 dark:text-gray-500 opacity-100'"
              >
                {{ isPeeking ? currentRandomTarget.verb.pastParticiple : '---' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Finite Conjugation Table -->
        <div>
          <!-- Mobile Stepper Header -->
          <div class="sm:hidden px-3 py-2 bg-gray-100/90 dark:bg-[#121824]/90 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Pronoun
              </span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click.stop="prevMobilePronoun"
                  class="p-1 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                  title="Previous pronoun"
                >
                  <ChevronLeftIcon class="w-4 h-4" />
                </button>
                <span class="text-xs font-mono font-extrabold text-[#be185d] dark:text-[#f43f5e] min-w-[70px] text-center">
                  {{ PRONOUNS[currentMobilePronounIdx].label }}
                </span>
                <button
                  type="button"
                  @click.stop="nextMobilePronoun"
                  class="p-1 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                  title="Next pronoun"
                >
                  <ChevronRightIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <!-- Quick-jump mini pills -->
            <div class="flex items-center justify-between gap-1 pt-0.5">
              <button
                v-for="p in PRONOUNS"
                :key="p.idx"
                type="button"
                @click.stop="setMobilePronoun(p.idx)"
                class="flex-1 py-1 rounded text-[11px] font-mono font-bold transition-all text-center cursor-pointer select-none"
                :class="currentMobilePronounIdx === p.idx
                  ? 'bg-[#be185d] text-white shadow-2xs'
                  : 'bg-gray-200/50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
              >
                {{ p.idx === 2 ? 'él' : p.idx === 5 ? 'ellos' : p.label.split('/')[0] }}
              </button>
            </div>
          </div>

          <div class="overflow-x-auto sm:overflow-visible">
            <table class="w-full table-fixed text-left text-xs sm:text-sm border-collapse" :class="isMobile ? '' : 'min-w-[760px]'">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-[#121824]/60 text-gray-600 dark:text-gray-400 font-bold">
                  <th class="py-2.5 px-3 sm:px-4 font-mono uppercase text-[11px] tracking-wider w-[42%] sm:w-36 shrink-0">
                    Tiempo
                  </th>
                  <th
                    v-for="p in displayedPronouns"
                    :key="p.idx"
                    class="py-2.5 px-2 text-center"
                    :class="isMobile ? 'w-[58%]' : 'w-[14.285%]' + (p.idx === 2 ? ' border-r border-dotted border-gray-300 dark:border-gray-600' : '')"
                  >
                    <span
                      class="font-mono text-[11px] transition-all duration-300 inline-block"
                      :class="currentRandomTarget.tenseKey !== 'gerund' && currentRandomTarget.tenseKey !== 'pastParticiple' && currentRandomTarget.pronounIdx === p.idx
                        ? ['px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold shadow-2xs', isPillPulsing ? 'animate-pulse-gentle' : '']
                        : 'text-gray-600 dark:text-gray-400 font-bold'"
                    >
                      {{ p.label }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="tense in FINITE_TENSES"
                  :key="tense.key"
                  class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td class="py-2.5 px-3 sm:px-4 font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap bg-gray-50/30 dark:bg-[#151d2c]/30">
                    <span
                      class="transition-all duration-300 inline-block"
                      :class="currentRandomTarget.tenseKey === tense.key
                        ? ['px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold shadow-2xs', isPillPulsing ? 'animate-pulse-gentle' : '']
                        : ''"
                    >
                      {{ tense.label }}
                    </span>
                  </td>

                  <td
                    v-for="p in displayedPronouns"
                    :key="p.idx"
                    class="py-2 px-2 sm:px-3 text-center"
                    :class="{ 'border-r border-dotted border-gray-300 dark:border-gray-600': !isMobile && p.idx === 2 }"
                  >
                  <!-- Defective Form ('-') Displays 'n/a' in light grey -->
                  <span
                    v-if="(((currentRandomTarget.verb as any)[tense.key] || [])[p.idx]) === '-'"
                    class="block py-1 text-xs font-mono select-none text-gray-400/60 dark:text-gray-600"
                  >
                    n/a
                  </span>

                  <!-- If this cell is the tested one -->
                  <div
                    v-else-if="currentRandomTarget.tenseKey === tense.key && currentRandomTarget.pronounIdx === p.idx"
                    class="relative inline-block w-full max-w-[130px] h-[26px] align-middle text-center"
                  >
                    <input
                      id="random-test-input"
                      ref="randomTestInputRef"
                      type="text"
                      v-model="randomTestAnswer"
                      @input="handleRandomInput"
                      @keydown="handleRandomInputKeyDown"
                      @blur="handleRandomBlur($event)"
                      @focus="handleCellFocus"
                      @click="handleCellClick($event, currentRandomTarget.expected)"
                      class="w-full h-[26px] px-2 py-1 text-xs text-center rounded-lg border font-medium transition-all text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                      :class="{
                        'bg-white dark:bg-[#121824] border-white ring-2 ring-white': !randomTestStatus && !isHintActive(randomKey),
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 !text-emerald-500 font-bold ring-2 ring-white': isHintActive(randomKey),
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold': !isHintActive(randomKey) && randomTestStatus === 'correct',
                        'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500 text-rose-800 dark:text-rose-200 font-bold': !isHintActive(randomKey) && randomTestStatus === 'incorrect'
                      }"
                    />
                  </div>

                  <!-- Untested cell in Random Test Mode: shows '---' or peeks answer -->
                  <span
                    v-else
                    @click="openGoogleExamples(((currentRandomTarget.verb as any)[tense.key] || [])[p.idx])"
                    class="font-medium select-none font-mono transition-opacity duration-300 cursor-pointer"
                    :class="isPeeking ? (peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100') : 'text-gray-400 dark:text-gray-500 opacity-100'"
                  >
                    {{ isPeeking ? (((currentRandomTarget.verb as any)[tense.key] || [])[p.idx] || '—') : '---' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredVerbList.length === 0"
      class="text-center py-16 bg-white dark:bg-[#182030] rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 space-y-3"
    >
      <p v-if="isSearching" class="text-gray-700 dark:text-gray-300 font-bold text-base">
        No verbs or conjugations found matching "<span class="text-[#be185d] dark:text-[#f43f5e] font-extrabold">{{ searchQuery }}</span>"
      </p>
      <p v-else class="text-gray-700 dark:text-gray-300 font-bold text-base">No verbs selected.</p>
      <button
        v-if="isSearching"
        type="button"
        @click="clearSearch"
        class="px-4 py-2 rounded-xl text-xs font-bold bg-[#be185d] text-white hover:bg-[#a2134e] cursor-pointer"
      >
        Clear Search
      </button>
      <button
        v-else
        type="button"
        @click="selectedVerbs = verbs.map(v => v.verb)"
        class="text-xs font-bold text-[#be185d] dark:text-[#f43f5e] underline cursor-pointer"
      >
        Select All Verbs
      </button>
    </div>

    <!-- Verb Tables: Vertically Stacked -->
    <div v-else class="space-y-6 sm:space-y-8">
      <div
        v-for="(verb, verbIdx) in filteredVerbList"
        :key="verb.verb"
        @click="handleVerbCardClick(verb.verb)"
        class="bg-white dark:bg-[#182030] rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all cursor-pointer"
        :class="activeStudyVerb === verb.verb ? 'ring-2 ring-[#be185d]/40' : ''"
      >
        <!-- Verb Header with Gerund and Past Participle Badges/Inputs -->
        <div class="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-[#151d2c] flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
          <div class="space-y-0.5">
            <h2
              class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white capitalize tracking-tight"
              v-html="highlightText(verb.verb)"
            ></h2>
            <div v-if="!isSearching && isTestMode" class="text-xs text-gray-400 dark:text-gray-500 select-none">
              ESC for hint, CTRL-ENTER to peek, ALT-ENTER for examples
            </div>
            <div v-else-if="!isSearching && !isTestMode" class="text-xs text-gray-400 dark:text-gray-500 select-none">
              CTRL-ENTER to peek unselected cells
            </div>
          </div>

          <!-- Non-finite form tags/cards directly above table -->
          <div class="flex items-center gap-2 sm:gap-4 flex-wrap">
            <!-- Gerund Box -->
            <div class="flex flex-col items-center gap-1">
              <span class="text-gray-600 dark:text-gray-400 font-mono text-[11px] uppercase font-bold">
                Gerundio
              </span>

              <!-- Test Mode Input -->
              <div v-if="!isSearching && isTestMode && selectedTenses.includes('gerund')" class="relative inline-block w-24 sm:w-32 h-[26px] text-center align-middle">
                <span
                  v-if="isCellPeeking(`input-${verb.verb}-gerund`, verb.verb)"
                  @click.stop="openGoogleExamples(verb.gerund)"
                  class="w-full h-[26px] px-2 py-1 text-xs leading-[16px] border border-transparent font-mono font-bold select-none min-w-[70px] sm:min-w-[90px] text-center inline-flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                  :class="peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100'"
                >
                  {{ verb.gerund }}
                </span>
                <input
                  v-show="!isCellPeeking(`input-${verb.verb}-gerund`, verb.verb)"
                  :id="`input-${verb.verb}-gerund`"
                  type="text"
                  v-model="userAnswers[getCellKey(verb.verb, 'gerund', 0)]"
                  @input="handleInput(getCellKey(verb.verb, 'gerund', 0))"
                  @keydown="handleKeyDown(verbIdx, 'gerund', 0, verb, $event)"
                  @blur="handleBlur(verb, 'gerund', 0, $event)"
                  @focus="handleCellFocus"
                  @click="handleCellClick($event, verb.gerund)"
                  class="w-full h-[26px] px-2 py-1 text-xs text-center rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all text-gray-900 dark:text-white"
                  :class="{
                    'bg-white dark:bg-[#121824] border-gray-300 dark:border-gray-600': !answerStatuses[getCellKey(verb.verb, 'gerund', 0)] && !isHintActive(getCellKey(verb.verb, 'gerund', 0)),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 !text-emerald-500 font-bold': isHintActive(getCellKey(verb.verb, 'gerund', 0)),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold': !isHintActive(getCellKey(verb.verb, 'gerund', 0)) && answerStatuses[getCellKey(verb.verb, 'gerund', 0)] === 'correct',
                    'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 font-bold': !isHintActive(getCellKey(verb.verb, 'gerund', 0)) && answerStatuses[getCellKey(verb.verb, 'gerund', 0)] === 'incorrect'
                  }"
                />
              </div>

              <!-- Test Mode Untested OR Study Mode Unselected: shows '---' or peeks answer -->
              <span
                v-else-if="!isSearching && (isTestMode || !selectedTenses.includes('gerund'))"
                @click.stop="openGoogleExamples(verb.gerund)"
                class="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono font-bold select-none min-w-[70px] sm:min-w-[90px] text-center transition-opacity duration-300 cursor-pointer"
                :class="isVerbPeeking(verb.verb) ? (peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100') : 'text-gray-400 dark:text-gray-500 opacity-100'"
              >
                {{ isVerbPeeking(verb.verb) ? verb.gerund : '---' }}
              </span>

              <!-- Static Display Mode: text is standard color as all others -->
              <span
                v-else
                @click.stop="openGoogleExamples(verb.gerund)"
                class="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 min-w-[70px] sm:min-w-[90px] text-center cursor-pointer"
                v-html="highlightText(verb.gerund)"
              >
              </span>
            </div>

            <!-- Participle Box -->
            <div class="flex flex-col items-center gap-1">
              <span class="text-gray-600 dark:text-gray-400 font-mono text-[11px] uppercase font-bold">
                Participio
              </span>

              <!-- Test Mode Input -->
              <div v-if="!isSearching && isTestMode && selectedTenses.includes('pastParticiple')" class="relative inline-block w-24 sm:w-32 h-[26px] text-center align-middle">
                <span
                  v-if="isCellPeeking(`input-${verb.verb}-pastParticiple`, verb.verb)"
                  @click.stop="openGoogleExamples(verb.pastParticiple)"
                  class="w-full h-[26px] px-2 py-1 text-xs leading-[16px] border border-transparent font-mono font-bold select-none min-w-[70px] sm:min-w-[90px] text-center inline-flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                  :class="peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100'"
                >
                  {{ verb.pastParticiple }}
                </span>
                <input
                  v-show="!isCellPeeking(`input-${verb.verb}-pastParticiple`, verb.verb)"
                  :id="`input-${verb.verb}-pastParticiple`"
                  type="text"
                  v-model="userAnswers[getCellKey(verb.verb, 'pastParticiple', 0)]"
                  @input="handleInput(getCellKey(verb.verb, 'pastParticiple', 0))"
                  @keydown="handleKeyDown(verbIdx, 'pastParticiple', 3, verb, $event)"
                  @blur="handleBlur(verb, 'pastParticiple', 0, $event)"
                  @focus="handleCellFocus"
                  @click="handleCellClick($event, verb.pastParticiple)"
                  class="w-full h-[26px] px-2 py-1 text-xs text-center rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all text-gray-900 dark:text-white"
                  :class="{
                    'bg-white dark:bg-[#121824] border-gray-300 dark:border-gray-600': !answerStatuses[getCellKey(verb.verb, 'pastParticiple', 0)] && !isHintActive(getCellKey(verb.verb, 'pastParticiple', 0)),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 !text-emerald-500 font-bold': isHintActive(getCellKey(verb.verb, 'pastParticiple', 0)),
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold': !isHintActive(getCellKey(verb.verb, 'pastParticiple', 0)) && answerStatuses[getCellKey(verb.verb, 'pastParticiple', 0)] === 'correct',
                    'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 font-bold': !isHintActive(getCellKey(verb.verb, 'pastParticiple', 0)) && answerStatuses[getCellKey(verb.verb, 'pastParticiple', 0)] === 'incorrect'
                  }"
                />
              </div>

              <!-- Test Mode Untested OR Study Mode Unselected: shows '---' or peeks answer -->
              <span
                v-else-if="!isSearching && (isTestMode || !selectedTenses.includes('pastParticiple'))"
                @click.stop="openGoogleExamples(verb.pastParticiple)"
                class="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono font-bold select-none min-w-[70px] sm:min-w-[90px] text-center transition-opacity duration-300 cursor-pointer"
                :class="isVerbPeeking(verb.verb) ? (peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100') : 'text-gray-400 dark:text-gray-500 opacity-100'"
              >
                {{ isVerbPeeking(verb.verb) ? verb.pastParticiple : '---' }}
              </span>

              <!-- Static Display Mode: text is standard color as all others -->
              <span
                v-else
                @click.stop="openGoogleExamples(verb.pastParticiple)"
                class="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 min-w-[70px] sm:min-w-[90px] text-center cursor-pointer"
                v-html="highlightText(verb.pastParticiple)"
              >
              </span>
            </div>
          </div>
        </div>

        <!-- Conjugation Table -->
        <div>
          <!-- Mobile Stepper Header -->
          <div class="sm:hidden px-3 py-2 bg-gray-100/90 dark:bg-[#121824]/90 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Pronoun
              </span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click.stop="prevMobilePronoun"
                  class="p-1 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                  title="Previous pronoun"
                >
                  <ChevronLeftIcon class="w-4 h-4" />
                </button>
                <span class="text-xs font-mono font-extrabold text-[#be185d] dark:text-[#f43f5e] min-w-[70px] text-center">
                  {{ PRONOUNS[currentMobilePronounIdx].label }}
                </span>
                <button
                  type="button"
                  @click.stop="nextMobilePronoun"
                  class="p-1 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                  title="Next pronoun"
                >
                  <ChevronRightIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <!-- Quick-jump mini pills -->
            <div class="flex items-center justify-between gap-1 pt-0.5">
              <button
                v-for="p in PRONOUNS"
                :key="p.idx"
                type="button"
                @click.stop="setMobilePronoun(p.idx)"
                class="flex-1 py-1 rounded text-[11px] font-mono font-bold transition-all text-center cursor-pointer select-none"
                :class="currentMobilePronounIdx === p.idx
                  ? 'bg-[#be185d] text-white shadow-2xs'
                  : 'bg-gray-200/50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
              >
                {{ p.idx === 2 ? 'él' : p.idx === 5 ? 'ellos' : p.label.split('/')[0] }}
              </button>
            </div>
          </div>

          <div class="overflow-x-auto sm:overflow-visible">
            <table class="w-full table-fixed text-left text-xs sm:text-sm border-collapse" :class="isMobile ? '' : 'min-w-[760px]'">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-[#121824]/60 text-gray-600 dark:text-gray-400 font-bold">
                  <th class="py-2.5 px-3 sm:px-4 font-mono uppercase text-[11px] tracking-wider w-[42%] sm:w-36 shrink-0">
                    Tiempo
                  </th>
                  <th
                    v-for="p in displayedPronouns"
                    :key="p.idx"
                    class="py-2.5 px-2 text-center"
                    :class="isMobile ? 'w-[58%]' : 'w-[14.285%]' + (p.idx === 2 ? ' border-r border-dotted border-gray-300 dark:border-gray-600' : '')"
                  >
                    <span class="font-mono text-[11px]">{{ p.label }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(tense, tenseIdx) in FINITE_TENSES"
                  :key="tense.key"
                  class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <!-- Tense Name Left Column -->
                  <td class="py-2.5 px-3 sm:px-4 font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap bg-gray-50/30 dark:bg-[#151d2c]/30">
                    {{ tense.label }}
                  </td>

                  <!-- Pronoun Column(s) -->
                  <td
                    v-for="p in displayedPronouns"
                    :key="p.idx"
                    class="py-2 px-2 sm:px-3 text-center"
                    :class="{ 'border-r border-dotted border-gray-300 dark:border-gray-600': !isMobile && p.idx === 2 }"
                  >
                    <!-- Defective Form ('-') Displays 'n/a' in light grey in all modes -->
                    <span
                      v-if="(((verb as any)[tense.key] || [])[p.idx]) === '-'"
                      class="block py-1 text-xs font-mono select-none text-gray-400/60 dark:text-gray-600"
                    >
                      n/a
                    </span>

                    <!-- Testing Input Mode -->
                    <div v-else-if="isCellTested(tense.key, p.idx)" class="relative inline-block w-full max-w-[130px] h-[26px] text-center align-middle">
                      <span
                        v-if="isCellPeeking(`input-${verb.verb}-${tense.key}-${p.idx}`, verb.verb)"
                        @click.stop="openGoogleExamples(((verb as any)[tense.key] || [])[p.idx])"
                        class="w-full h-[26px] px-2 py-1 text-xs leading-[16px] border border-transparent font-medium select-none font-mono transition-opacity duration-300 inline-flex items-center justify-center cursor-pointer"
                        :class="peekFading ? 'text-amber-500 dark:text-amber-400 italic opacity-0' : 'text-amber-500 dark:text-amber-400 italic opacity-100'"
                      >
                        {{ ((verb as any)[tense.key] || [])[p.idx] || '—' }}
                      </span>
                      <input
                        v-show="!isCellPeeking(`input-${verb.verb}-${tense.key}-${p.idx}`, verb.verb)"
                        :id="`input-${verb.verb}-${tense.key}-${p.idx}`"
                        type="text"
                        v-model="userAnswers[getCellKey(verb.verb, tense.key, p.idx)]"
                        @input="handleInput(getCellKey(verb.verb, tense.key, p.idx))"
                        @keydown="handleKeyDown(verbIdx, tenseIdx, p.idx, verb, $event)"
                        @blur="handleBlur(verb, tense.key, p.idx, $event)"
                        @focus="handleCellFocus"
                        @click="handleCellClick($event, ((verb as any)[tense.key] || [])[p.idx])"
                        class="w-full h-[26px] px-2 py-1 text-xs text-center rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all text-gray-900 dark:text-white"
                        :class="{
                          'bg-white dark:bg-[#121824] border-gray-300 dark:border-gray-600': !answerStatuses[getCellKey(verb.verb, tense.key, p.idx)] && !isHintActive(getCellKey(verb.verb, tense.key, p.idx)),
                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 !text-emerald-500 font-bold': isHintActive(getCellKey(verb.verb, tense.key, p.idx)),
                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold': !isHintActive(getCellKey(verb.verb, tense.key, p.idx)) && answerStatuses[getCellKey(verb.verb, tense.key, p.idx)] === 'correct',
                          'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 font-bold': !isHintActive(getCellKey(verb.verb, tense.key, p.idx)) && answerStatuses[getCellKey(verb.verb, tense.key, p.idx)] === 'incorrect'
                        }"
                      />
                    </div>

                    <!-- Standard Static Conjugation Mode (with Study Mode Blanking & Peeking) -->
                    <span
                      v-else
                      @click.stop="openGoogleExamples(((verb as any)[tense.key] || [])[p.idx])"
                      class="font-medium cursor-pointer"
                      :class="isCellHidden(tense.key, p.idx) ? (isVerbPeeking(verb.verb) ? (peekFading ? 'text-amber-500 dark:text-amber-400 italic font-mono select-none transition-opacity duration-300 opacity-0' : 'text-amber-500 dark:text-amber-400 italic font-mono select-none transition-opacity duration-300 opacity-100') : 'text-gray-400 dark:text-gray-500 select-none font-mono transition-opacity duration-300 opacity-100') : 'text-gray-800 dark:text-gray-200'"
                      v-html="highlightText(isCellHidden(tense.key, p.idx) ? (isVerbPeeking(verb.verb) ? (((verb as any)[tense.key] || [])[p.idx] || '—') : '---') : (((verb as any)[tense.key] || [])[p.idx] || '—'))"
                    >
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Retest Difficult Words Modal -->
    <div
      v-if="showRetestModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      @click.self="showRetestModal = false; confirmClearDifficult = false"
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
            <!-- Inline Clear All Confirmation -->
            <div v-if="activeDifficultWords.length > 0" class="flex items-center gap-2">
              <div v-if="!confirmClearDifficult">
                <button
                  type="button"
                  @click="confirmClearDifficult = true"
                  class="text-xs font-semibold text-gray-400 hover:text-red-700 dark:hover:text-red-500 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div v-else class="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-900/50">
                <span class="text-gray-700 dark:text-gray-300 font-medium">Are you sure?</span>
                <button
                  type="button"
                  @click="clearAllDifficultWords(); confirmClearDifficult = false"
                  class="font-bold text-red-800 dark:text-red-600 hover:underline cursor-pointer"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  @click="confirmClearDifficult = false"
                  class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              type="button"
              @click="showRetestModal = false; confirmClearDifficult = false"
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
            <!-- Word description: Verb name then pill with e.g. "preterite vosotros" or "gerund" -->
            <div class="space-y-0.5 min-w-[160px]">
              <div class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="capitalize">{{ item.verb }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                  {{ formatDifficultWordTag(item) }}
                </span>
              </div>
              <div class="text-xs text-rose-500 dark:text-rose-400 font-semibold">
                ({{ item.errorCount }} {{ item.errorCount === 1 ? 'error' : 'errors' }})
              </div>
            </div>

            <!-- Input & Validation Box -->
            <div class="flex items-center gap-2 min-w-[200px]">
              <input
                type="text"
                v-model="retestAnswers[item.id]"
                @input="handleRetestInput(item.id)"
                @keydown.enter="validateRetestItem(item)"
                @blur="validateRetestItem(item)"
                @focus="handleCellFocus"
                @click="handleCellClick($event, item.correctAnswer)"
                placeholder="Type answer..."
                class="px-3 py-1.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white w-36 transition-all text-gray-900 dark:text-white"
                :class="{
                  'bg-white dark:bg-[#182030] border-gray-300 dark:border-gray-600': !retestStatuses[item.id],
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
            @click="showRetestModal = false; confirmClearDifficult = false"
            class="px-4 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-300 dark:border-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes verb-zoom-highlight {
  0% {
    transform: scale(1);
    color: inherit;
  }
  15% {
    transform: scale(2);
    color: #facc15; /* bright yellow */
  }
  85% {
    transform: scale(2);
    color: #facc15;
  }
  100% {
    transform: scale(1);
    color: inherit;
  }
}

.animate-verb-zoom {
  display: inline-block;
  animation: verb-zoom-highlight 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  will-change: transform, color;
  z-index: 30;
  position: relative;
}

@keyframes hint-fade-during-zoom {
  0% {
    opacity: 1;
  }
  15% {
    opacity: 0;
  }
  85% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-hint-fade-during-zoom {
  animation: hint-fade-during-zoom 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes pulse-gentle {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  35% {
    transform: scale(1.06);
    filter: brightness(1.22);
  }
  70% {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

.animate-pulse-gentle {
  animation: pulse-gentle 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
