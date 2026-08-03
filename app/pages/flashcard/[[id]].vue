<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

useHead({
  title: 'LangLearn - Flashcards Practice',
  meta: [
    { name: 'description', content: 'Practice and test your language flashcards with high-precision ranking.' }
  ]
})

const route = useRoute()
const router = useRouter()

const config = useRuntimeConfig()
const isBypass = config.public.bypassAuth

const auth = !isBypass ? useAuth() : null
const loggedIn = computed(() => isBypass ? true : (auth?.loggedIn ?? false))
const user = computed(() => isBypass ? { given_name: 'Local', family_name: 'Developer', email: 'local.developer@example.com', picture: null } : (auth?.user ?? null))

interface Tag {
  id: string
  abbreviation: string
  description?: string
  _count?: {
    flashcards: number
  }
}

interface FlashcardTag {
  tag: Tag
}

interface Flashcard {
  id: string
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  status: string
  rank: number
  memoryHook: string | null
  tags: FlashcardTag[]
}

// State
const activeFilterTag = ref<string | null>(null)
const searchQuery = ref('')
const isSearching = ref(false)
const testQueue = ref<Flashcard[]>([])
const nextPrefetchedCards = ref<Flashcard[]>([])
const searchResults = ref<Flashcard[]>([])
const allTags = ref<Tag[]>([])
const isLoadingQueue = ref(true)
const isSearchPending = ref(false)
const isInitialLoading = useState('isInitialLoading', () => true)

const languageNames: Record<string, string> = {
  fr: 'FRENCH',
  de: 'GERMAN',
  es: 'SPANISH',
  it: 'ITALIAN',
  nl: 'DUTCH',
  pl: 'POLISH',
  ru: 'RUSSIAN',
  is: 'ICELANDIC',
  da: 'DANISH',
  el: 'GREEK'
}

const languageColors: Record<string, string> = {
  fr: '#333388',
  es: '#be185d',
  it: '#194d19',
  nl: '#d97706',
  pl: '#b8b8b8',
  de: '#7e4402',
  ru: '#3f3f46',
  is: '#06b6d4',
  da: '#7e22ce',
  el: '#ea580c'
}

const currentQueueIndex = ref(0)
const isFlipped = ref(false)
const sliderValue = ref(2.5)
const cardAnimState = ref<'idle' | 'exiting' | 'entering'>('idle')
const isEditing = ref(false)
const editFront = ref('')
const editBack = ref('')
const editPronunciation = ref('')
const editMemoryHook = ref('')
const isSavingEdit = ref(false)
const isAddingTag = ref(false)
const newTagValue = ref('')
let rankDebounceTimer: ReturnType<typeof setTimeout> | null = null
let tagsDebounceTimer: ReturnType<typeof setTimeout> | null = null
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let headerDebounceTimer: ReturnType<typeof setTimeout> | null = null
let currentSearchId = 0

const savingFields = ref<Record<string, boolean>>({})

// Fetch all available tags
async function fetchTags() {
  try {
    allTags.value = await $fetch<Tag[]>('/api/tags')
  } catch (err) {
    console.error('Failed to load tags:', err)
  }
}

// Fetch active test queue
async function fetchTestQueue() {
  isLoadingQueue.value = true
  const minDelay = new Promise(resolve => setTimeout(resolve, 600))
  try {
    const cardIdFromRoute = route.params.id as string | undefined

    const queueUrl = activeFilterTag.value 
      ? `/api/flashcards?tag=${encodeURIComponent(activeFilterTag.value)}&limit=10${cardIdFromRoute ? `&excludeId=${cardIdFromRoute}` : ''}`
      : `/api/flashcards?limit=10${cardIdFromRoute ? `&excludeId=${cardIdFromRoute}` : ''}`

    if (cardIdFromRoute) {
      try {
        const [specificCard, restQueue] = await Promise.all([
          $fetch<Flashcard>(`/api/flashcards/${cardIdFromRoute}`),
          $fetch<Flashcard[]>(queueUrl),
          minDelay
        ])
        if (specificCard && specificCard.id) {
          const otherCards = (restQueue || []).filter(c => c.id !== specificCard.id)
          testQueue.value = [specificCard, ...otherCards]
          currentQueueIndex.value = 0
          isFlipped.value = false
          sliderValue.value = specificCard.rank
          return
        }
      } catch (e) {
        console.error('Failed to load specific card from permalink ID:', e)
      }
    }

    const [results] = await Promise.all([
      $fetch<Flashcard[]>(queueUrl),
      minDelay
    ])
    testQueue.value = results
    currentQueueIndex.value = 0
    isFlipped.value = false
    if (testQueue.value[0]) sliderValue.value = testQueue.value[0].rank
  } catch (err) {
    console.error('Failed to load active flashcards:', err)
  } finally {
    isLoadingQueue.value = false
  }
}

// Silently fetch next cards to replace the queue without showing loaders
async function fetchNextCardsSilently() {
  try {
    const url = activeFilterTag.value 
      ? `/api/flashcards?tag=${encodeURIComponent(activeFilterTag.value)}&limit=10`
      : '/api/flashcards?limit=10'
    const results = await $fetch<Flashcard[]>(url)
    testQueue.value = results
    currentQueueIndex.value = 0
    isFlipped.value = false
    if (testQueue.value[0]) sliderValue.value = testQueue.value[0].rank
  } catch (err) {
    console.error('Failed to silently fetch next cards:', err)
  }
}

// Prefetch next cards when the current card is flipped
async function prefetchNextCards() {
  if (!currentCard.value) return
  try {
    const url = activeFilterTag.value 
      ? `/api/flashcards?tag=${encodeURIComponent(activeFilterTag.value)}&limit=10&excludeId=${currentCard.value.id}`
      : `/api/flashcards?limit=10&excludeId=${currentCard.value.id}`
    nextPrefetchedCards.value = await $fetch<Flashcard[]>(url)
  } catch (err) {
    console.error('Failed to prefetch next cards:', err)
  }
}

watch(isFlipped, (newVal) => {
  if (newVal) {
    prefetchNextCards()
  }
})

// Run search
function handleSearch() {
  const query = searchQuery.value.trim();
  
  if (!query) {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
    if (headerDebounceTimer) clearTimeout(headerDebounceTimer)
    isSearching.value = false
    isSearchPending.value = false
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  isSearchPending.value = true
  
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  if (headerDebounceTimer) clearTimeout(headerDebounceTimer)
  
  const reqId = ++currentSearchId;
  let inactivityPassed = false;
  let apiFinished = false;

  const checkHeaderReady = () => {
    if (inactivityPassed && apiFinished && reqId === currentSearchId) {
      isSearchPending.value = false;
    }
  };
  
  searchDebounceTimer = setTimeout(async () => {
    try {
      const results = await $fetch<Flashcard[]>(`/api/flashcards/search?q=${encodeURIComponent(query)}`)
      if (reqId === currentSearchId) {
        searchResults.value = results.sort((a, b) => b.rank - a.rank)
      }
    } catch (err) {
      if (reqId === currentSearchId) {
        console.error('Failed to search cards:', err)
      }
    } finally {
      if (reqId === currentSearchId) {
        apiFinished = true;
        checkHeaderReady();
      }
    }
  }, 300) 

  headerDebounceTimer = setTimeout(() => {
    if (reqId === currentSearchId) {
      inactivityPassed = true;
      checkHeaderReady();
    }
  }, 2000)
}

// Active card computed properties
const currentCard = computed<Flashcard | null>(() => {
  if (isSearching.value) {
    return null
  }
  if (testQueue.value.length === 0 || currentQueueIndex.value >= testQueue.value.length) {
    return null
  }
  return testQueue.value[currentQueueIndex.value] ?? null
})

// Dynamically update route URL permalink seamlessly without page blinking
watch(currentCard, (card) => {
  if (card && card.id) {
    const routeId = useRoute().params.id as string | undefined
    // Only overwrite browser location if the route didn't explicitly request a different specific card permalink
    if (!routeId && typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', `/flashcard/${card.id}`)
    }
  }
}, { immediate: true })

// Remove Tag
function removeTag(tagAbbrev: string) {
  if (!currentCard.value) return
  currentCard.value.tags = currentCard.value.tags.filter(t => t.tag.abbreviation !== tagAbbrev)
  debouncedSaveTags()
}

function hasTag(abbreviation: string) {
  if (!currentCard.value) return false
  return currentCard.value.tags.some(t => t.tag.abbreviation === abbreviation)
}

function toggleTag(tagAbbreviation: string) {
  if (!currentCard.value) return
  const currentTags = currentCard.value.tags.map(t => t.tag.abbreviation)
  
  if (currentTags.includes(tagAbbreviation)) {
    currentCard.value.tags = currentCard.value.tags.filter(t => t.tag.abbreviation !== tagAbbreviation)
  } else {
    currentCard.value.tags = [
      ...currentCard.value.tags,
      { tag: { abbreviation: tagAbbreviation, name: tagAbbreviation, color: '#ccc' } } as any
    ]
  }
  
  debouncedSaveTags()
}

function stripAsterisks(text: string): string {
  return text ? text.replace(/\*/g, '') : ''
}

function getHighlightedText(text: string): string {
  if (!text) return ''
  const match = text.match(/\*(.*?)\*/)
  if (match && match[1] && match[1].trim()) {
    return match[1].trim()
  }
  return stripAsterisks(text).trim()
}

function openAudio() {
  if (!currentCard.value) return
  const cleanBack = stripAsterisks(currentCard.value.back)
  const url = `https://translate.google.com/?sl=${currentCard.value.backLanguage}&tl=${currentCard.value.frontLanguage}&text=${encodeURIComponent(cleanBack)}&op=translate`
  window.open(url, '_blank')
}

const exampleTargetText = computed(() => {
  if (!currentCard.value?.back) return ''
  return getHighlightedText(currentCard.value.back)
})

const backWordCount = computed(() => {
  if (!exampleTargetText.value) return 0
  return exampleTargetText.value.split(/\s+/).filter(Boolean).length
})

const showExampleSentencesButton = computed(() => {
  return backWordCount.value >= 1 && backWordCount.value <= 4
})

const isFrenchCardWithVous = computed(() => {
  if (!currentCard.value) return false
  const lang = (currentCard.value.backLanguage || currentCard.value.frontLanguage || '').toLowerCase()
  const back = currentCard.value.back || ''
  return lang === 'fr' && /\bvous\b/i.test(back)
})

function openExampleSentences() {
  if (!currentCard.value) return
  const targetText = exampleTargetText.value
  const langCode = currentCard.value.backLanguage || currentCard.value.frontLanguage || 'fr'
  const langName = languageNames[langCode] ? languageNames[langCode].toLowerCase() : 'french'
  const query = `create 3 ${langName} examples with "${targetText}"`
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
  window.open(url, '_blank')
}

function openVousToTuSearch() {
  if (!currentCard.value) return
  const cleanBack = stripAsterisks(currentCard.value.back)
  const query = `convert "vous" to "tu" for the following French phrase: "${cleanBack}"`
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
  window.open(url, '_blank')
}

// Debounced rank save — silent, no activity log
function debouncedSaveRank() {
  if (rankDebounceTimer) clearTimeout(rankDebounceTimer)
  rankDebounceTimer = setTimeout(async () => {
    if (!currentCard.value) return
    const originalRank = currentCard.value.rank
    const newRank = parseFloat(sliderValue.value.toFixed(5))
    currentCard.value.rank = newRank
    try {
      await $fetch(`/api/flashcards/${currentCard.value.id}/rank`, {
        method: 'PATCH',
        body: { rank: newRank }
      })
    } catch (err) {
      console.error('Failed to save rank:', err)
      if (currentCard.value) {
        currentCard.value.rank = originalRank
        sliderValue.value = originalRank
      }
    }
  }, 700)
}

// Card action — logs activity, optionally changes status, then slides card out
function markAction(actionTaken: string, newStatus?: string) {
  if (!currentCard.value) return
  const cardId = currentCard.value.id

  if (cardStats.value) {
    if (cardStats.value.readyCount > 0) {
      cardStats.value.readyCount--
    }
    cardStats.value.waitingCount++
    if (cardStats.value.todayReviewedCount !== undefined) {
      cardStats.value.todayReviewedCount++
    }
  }

  cardAnimState.value = 'exiting'
  
  const transitionToNext = async () => {
    if (nextPrefetchedCards.value.length > 0) {
      testQueue.value = nextPrefetchedCards.value
      currentQueueIndex.value = 0
      isFlipped.value = false
      if (testQueue.value[0]) sliderValue.value = testQueue.value[0].rank
      nextPrefetchedCards.value = []
    } else {
      await fetchNextCardsSilently()
    }
    cardAnimState.value = 'entering'
    setTimeout(() => { cardAnimState.value = 'idle' }, 380)
  }

  transitionToNext()
  
  $fetch(`/api/flashcards/${cardId}/action`, {
    method: 'POST',
    body: { actionTaken, ...(newStatus ? { status: newStatus } : {}) }
  }).then(() => {
    fetchCardStats()
  }).catch((err) => {
    console.error('Failed to record action:', err)
    alert("Erreur: L'enregistrement a échoué. Veuillez réessayer.")
  })
}

function nextCard() {
  isFlipped.value = false
  isEditing.value = false
  isAddingTag.value = false
  newTagValue.value = ''
  currentQueueIndex.value++
  if (currentCard.value) {
    sliderValue.value = currentCard.value.rank
  }
}

// Inline edit form
function startEdit() {
  if (!currentCard.value) return
  editFront.value = currentCard.value.front
  editBack.value = currentCard.value.back
  editPronunciation.value = currentCard.value.pronunciation || ''
  editMemoryHook.value = currentCard.value.memoryHook || ''
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  if (!currentCard.value || isSavingEdit.value) return
  
  const originalFront = currentCard.value.front
  const originalBack = currentCard.value.back
  const originalPronunciation = currentCard.value.pronunciation
  const originalMemoryHook = currentCard.value.memoryHook
  
  const newFront = editFront.value.trim()
  const newBack = editBack.value.trim()
  const newPron = editPronunciation.value.trim() || null
  const newMemoryHook = editMemoryHook.value.trim() || null

  currentCard.value.front = newFront
  currentCard.value.back = newBack
  currentCard.value.pronunciation = newPron
  currentCard.value.memoryHook = newMemoryHook
  isEditing.value = false

  try {
    await $fetch(`/api/flashcards/${currentCard.value.id}`, {
      method: 'PUT',
      body: {
        front: newFront,
        back: newBack,
        pronunciation: newPron,
        memoryHook: newMemoryHook
      }
    })
  } catch (err) {
    console.error('Failed to save edit:', err)
    if (currentCard.value) {
      currentCard.value.front = originalFront
      currentCard.value.back = originalBack
      currentCard.value.pronunciation = originalPronunciation
      currentCard.value.memoryHook = originalMemoryHook
      isEditing.value = true
    }
  }
}

function submitNewTag() {
  const val = newTagValue.value.trim().toLowerCase()
  isAddingTag.value = false
  newTagValue.value = ''
  if (!val || !currentCard.value) return

  const currentTags = currentCard.value.tags.map(t => t.tag.abbreviation)
  
  if (!currentTags.includes(val)) {
    currentCard.value.tags = [
      ...currentCard.value.tags,
      { tag: { abbreviation: val, name: val, color: '#ccc' } } as any
    ]
    
    if (!allTags.value.some(t => t.abbreviation === val)) {
      allTags.value = [...allTags.value, { id: 'temp-' + Date.now(), abbreviation: val }]
    }

    debouncedSaveTags()
  }
}

let tagRequestId = 0

function debouncedSaveTags() {
  if (tagsDebounceTimer) clearTimeout(tagsDebounceTimer)
  
  tagsDebounceTimer = setTimeout(async () => {
    const card = currentCard.value
    if (!card) return
    
    const currentTags = card.tags.map(t => t.tag.abbreviation)
    const cardId = card.id
    
    const reqId = ++tagRequestId
    
    try {
      const response: any = await $fetch(`/api/flashcards/${cardId}/tags`, {
        method: 'POST',
        body: { tags: currentTags }
      })
      
      if (reqId === tagRequestId) {
        if (response && response.tags && currentCard.value?.id === cardId) {
          currentCard.value.tags = response.tags
        }
        fetchTags()
      }
    } catch (err) {
      console.error('Failed to save tags:', err)
    }
  }, 500)
}

function setFilter(tag: string | null) {
  activeFilterTag.value = tag
  fetchTestQueue()
}

function handleTagClick(tagAbbreviation: string) {
  if (activeFilterTag.value === tagAbbreviation) {
    setFilter(null)
  } else {
    setFilter(tagAbbreviation)
  }
}

async function handleSelectCard(card: Flashcard) {
  try {
    const copyResult = await $fetch<Flashcard>(`/api/flashcards/${card.id}/copy`, {
      method: 'POST'
    })
    
    testQueue.value = [copyResult, ...testQueue.value.filter(c => c.id !== copyResult.id)]
    currentQueueIndex.value = 0
    isFlipped.value = false
    sliderValue.value = copyResult.rank
    
    isSearching.value = false
    isSearchPending.value = false
  } catch (err) {
    console.error('Failed to copy/select flashcard:', err)
  }
}

function handleGlobalKeyDown(event: KeyboardEvent) {
  if (isSearching.value || !currentCard.value) return

  const activeEl = document.activeElement
  const isFocusedOnInput = activeEl && (
    ['input', 'textarea', 'select'].includes(activeEl.tagName.toLowerCase()) ||
    activeEl.hasAttribute('contenteditable')
  )

  if (isFocusedOnInput) return

  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    if (isFlipped.value && !isEditing.value) {
      event.preventDefault()
      startEdit()
    }
    return
  }

  if (event.key === 'Enter' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
    if (!isEditing.value) {
      event.preventDefault()
      isFlipped.value = !isFlipped.value
    } else {
      event.preventDefault()
      saveEdit()
    }
  }
}

interface CardStats {
  readyCount: number
  waitingCount: number
  totalCount?: number
  todayReviewedCount?: number
  todayCorrectCount?: number
  todayImportedCount?: number
}

const cardStats = useState<CardStats | null>('flashcardStats', () => null)

async function fetchCardStats() {
  try {
    const headers = useRequestHeaders(['cookie'])
    cardStats.value = await $fetch<CardStats>('/api/flashcards/stats', { headers })
  } catch (err: any) {
    if (err?.statusCode !== 401 && err?.status !== 401 && err?.response?.status !== 401) {
      console.error('Failed to load card stats:', err)
    }
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchTestQueue()
  }
})

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeyDown)
  if (loggedIn.value) {
    try {
      await Promise.all([
        fetchTags(),
        fetchTestQueue(),
        fetchCardStats()
      ])
    } catch (err) {
      console.error('Failed to initialize page data:', err)
    } finally {
      isInitialLoading.value = false
    }
  } else {
    isInitialLoading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>

<template>
  <div 
    class="max-w-4xl mx-auto px-4 pt-0 pb-8 space-y-12 transition-all duration-300"
  >
    <ClientOnly>
      <!-- Logged In: Flashcards View -->
      <div 
        v-if="loggedIn"
      >
        
        <!-- Center-aligned Search Box -->
        <SearchBox v-model="searchQuery" :stats="cardStats" @search="handleSearch" />

        <!-- Active Practice Area -->
        <div v-if="!isSearching" class="mt-4 flex flex-col items-center w-full min-h-[340px] justify-start pt-0">
          
          <div class="w-full max-w-lg space-y-4">
            
            <button 
              v-if="searchQuery && !isLoadingQueue && !isInitialLoading && currentCard" 
              @click="isSearching = true" 
              class="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 hover:underline mb-1 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to search results
            </button>

            <!-- Relative card wrapper of fixed height that crossfades loading state and card -->
            <div class="relative w-full h-[256px]">
              <Transition name="fade-layout">
                
                <!-- Card Placeholder / Language Loader -->
                <div v-if="isLoadingQueue || isInitialLoading" key="loading" class="absolute inset-0 z-20 flex items-center justify-center placeholder-card bg-gray-50/20 dark:bg-gray-950/10 rounded-3xl border border-transparent">
                  <div class="flex items-center justify-center">
                    <svg class="w-14 h-14 text-gray-400 dark:text-gray-600" viewBox="0 0 48 48" fill="none">
                      <path d="M14 30C14 30 11 33 8 33C8 30 7 28 7 27C4.5 25 3 21.8 3 18C3 10.8 10.6 5 20 5C29.4 5 37 10.8 37 18C37 25.2 29.4 31 20 31C17.9 31 15.9 30.7 14 30Z" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animate-bubble-left" />
                      <path d="M34 33C32.1 33.7 30.1 34 28 34C18.6 34 11 28.2 11 21C11 20.7 11 20.3 11.1 20M41 21C43.5 23 45 26.2 45 30C45 33.8 43.5 37 41 39C41 40 40 42 37 45C37 42 34 39 34 39C32.1 39.7 30.1 40 28 40C22.4 40 17.5 38.3 14.7 35.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animate-bubble-right" />
                      <text x="16" y="21" font-size="10" font-family="system-ui, -apple-system, sans-serif" fill="currentColor" class="animate-text-a font-semibold">A</text>
                      <text x="27" y="32" font-size="10" font-family="system-ui, -apple-system, sans-serif" fill="currentColor" class="animate-text-b font-semibold">文</text>
                    </svg>
                  </div>
                </div>

                <!-- Active Flashcard Frame -->
                <div v-else-if="!isLoadingQueue && currentCard" key="card" class="absolute inset-0 z-10 card-perspective">
                  <div :class="[cardAnimState === 'exiting' ? 'card-exit' : cardAnimState === 'entering' ? 'card-enter' : '']" class="h-full w-full preserve-3d">

                    <!-- Flashcard -->
                    <div
                      @click="!isEditing && (isFlipped = !isFlipped)"
                      class="relative h-full w-full select-none preserve-3d card-flip-transition"
                      :style="{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
                      :class="[isEditing ? 'cursor-default' : 'cursor-pointer']"
                    >
                      <!-- Front Side -->
                      <FlashcardFront 
                        :class="[isFlipped ? 'pointer-events-none' : '']"
                        :style="{ transform: 'translateZ(1px)' }"
                        :current-card="currentCard" 
                        :language-names="languageNames" 
                        :language-colors="languageColors" 
                        :is-flipped="isFlipped"
                        :is-editing="isEditing"
                      />

                      <!-- Back Side -->
                      <FlashcardBack 
                        :class="[!isFlipped ? 'pointer-events-none' : '']"
                        :style="{ transform: 'rotateY(180deg) translateZ(1px)' }"
                        :current-card="currentCard" 
                        :language-names="languageNames" 
                        :language-colors="languageColors" 
                        :is-flipped="isFlipped"
                        :is-editing="isEditing" 
                        :is-saving-edit="isSavingEdit" 
                        v-model:editFront="editFront" 
                        v-model:editBack="editBack" 
                        v-model:editPronunciation="editPronunciation" 
                        v-model:editMemoryHook="editMemoryHook" 
                        @open-audio="openAudio" 
                        @start-edit="startEdit" 
                        @cancel-edit="cancelEdit" 
                        @save-edit="saveEdit" 
                      />
                    </div>

                  </div>
                </div>

                <!-- Practice Session Completed -->
                <div v-else-if="!isLoadingQueue" key="empty" class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-gray-50/10 dark:bg-gray-950/5 rounded-3xl border border-gray-200/50 dark:border-gray-850/40 space-y-2">
                  <span class="text-base font-medium text-gray-600 dark:text-gray-400">no cards to test</span>
                  <div>
                    <NuxtLink to="/import" class="text-sm underline text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                      import cards
                    </NuxtLink>
                  </div>
                </div>

              </Transition>
            </div>

            <!-- Single compact panel — visible when card is flipped and not editing -->
            <Transition name="fade-layout">
              <div v-if="!isLoadingQueue && currentCard && isFlipped && !isEditing" class="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 space-y-3">

                <!-- Rank Slider Section -->
                <FlashcardRankSlider v-model="sliderValue" @save-rank="debouncedSaveRank" />

                <!-- Status buttons Section -->
                <FlashcardStatusButtons @action="markAction" />

                <!-- Action Buttons Box (3 examples with & convert vous to tu) -->
                <div v-if="showExampleSentencesButton || isFrenchCardWithVous" class="bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/60 flex flex-wrap gap-2 items-center justify-center">
                  <button
                    v-if="showExampleSentencesButton"
                    @click.stop="openExampleSentences"
                    class="text-xs px-3 py-1.5 rounded-lg border border-amber-500/40 dark:border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>3 examples with "{{ exampleTargetText }}"</span>
                    <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </button>

                  <button
                    v-if="isFrenchCardWithVous"
                    @click.stop="openVousToTuSearch"
                    class="text-xs px-3 py-1.5 rounded-lg border border-amber-500/40 dark:border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Search Google on converting vous to tu for this phrase"
                  >
                    <span>convert vous to tu</span>
                    <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </button>
                </div>

                <!-- Tags Section -->
                <FlashcardTags 
                  :all-tags="allTags" 
                  :current-card="currentCard" 
                  :saving-fields="savingFields" 
                  v-model:is-adding-tag="isAddingTag" 
                  v-model:new-tag-value="newTagValue" 
                  @toggle-tag="toggleTag" 
                  @submit-new-tag="submitNewTag" 
                />

              </div>
            </Transition>

          </div>
        </div>

        <!-- Search Results View -->
        <SearchResults 
          v-else 
          class="mt-4"
          :search-results="searchResults" 
          :is-search-pending="isSearchPending" 
          :language-colors="languageColors"
          @select-card="handleSelectCard" 
        />

      </div>

      <!-- Logged Out: Welcome & Landing View -->
      <WelcomeScreen v-else />

    </ClientOnly>
  </div>
</template>

<style scoped>
.card-perspective {
  perspective: 1200px;
}
.card-flip-transition {
  transition: transform 0.18s cubic-bezier(0.2, 0.85, 0.4, 1.15);
}
.preserve-3d {
  transform-style: preserve-3d;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

@keyframes slideExitLeft {
  from { transform: translateX(0);     opacity: 1; }
  to   { transform: translateX(-110%); opacity: 0; }
}
@keyframes slideEnterRight {
  from { transform: translateX(110%);  opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.card-exit  { animation: slideExitLeft  0.28s ease-in  forwards; }
.card-enter { animation: slideEnterRight 0.36s ease-out forwards; }

.content-fade-enter-active,
.content-fade-leave-active { transition: opacity 0.18s ease; }
.content-fade-enter-from,
.content-fade-leave-to     { opacity: 0; }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.99) translateY(2px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.placeholder-card {}
.dark .placeholder-card {}

@keyframes pulse-bubble-left {
  0%, 100% { opacity: 0.25; transform: scale(0.97); }
  50% { opacity: 0.85; transform: scale(1.03); }
}
@keyframes pulse-bubble-right {
  0%, 100% { opacity: 0.85; transform: scale(1.03); }
  50% { opacity: 0.25; transform: scale(0.97); }
}
.animate-bubble-left, .animate-text-a {
  animation: pulse-bubble-left 2.2s infinite ease-in-out;
  transform-origin: 20px 18px;
}
.animate-bubble-right, .animate-text-b {
  animation: pulse-bubble-right 2.2s infinite ease-in-out;
  transform-origin: 28px 30px;
}
.loader-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.fade-layout-enter-active {
  transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-layout-leave-active {
  transition: opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-layout-enter-from {
  opacity: 0;
}
.fade-layout-leave-to {
  opacity: 0;
}
</style>
