<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowPathIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Drag/Drop Words',
  meta: [
    { name: 'description', content: 'Interactive drag-and-drop word practice activity.' }
  ]
})

interface Tag {
  id: string
  abbreviation: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  tags: { tag: Tag }[]
}

interface ActivityItem {
  id: string
  fullFront: string
  fullBack: string
  displayBack: string
  answerText: string
  currentPlacedAnswer: string | null
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

// Bright, readable pill styles for each language (ensures high contrast in dark and light modes)
const languagePillStyles: Record<string, { bg: string; color: string; border: string }> = {
  fr: { bg: 'bg-indigo-600 dark:bg-indigo-600', color: 'text-white dark:text-white', border: 'border-indigo-400' },
  es: { bg: 'bg-pink-700 dark:bg-pink-700', color: 'text-white dark:text-white', border: 'border-pink-400' },
  it: { bg: 'bg-emerald-700 dark:bg-emerald-700', color: 'text-white dark:text-white', border: 'border-emerald-400' },
  nl: { bg: 'bg-amber-600 dark:bg-amber-600', color: 'text-white dark:text-white', border: 'border-amber-400' },
  pl: { bg: 'bg-gray-600 dark:bg-gray-600', color: 'text-white dark:text-white', border: 'border-gray-400' },
  de: { bg: 'bg-amber-800 dark:bg-amber-800', color: 'text-white dark:text-white', border: 'border-amber-500' },
  ru: { bg: 'bg-zinc-700 dark:bg-zinc-700', color: 'text-white dark:text-white', border: 'border-zinc-400' },
  is: { bg: 'bg-cyan-600 dark:bg-cyan-600', color: 'text-white dark:text-white', border: 'border-cyan-300' },
  da: { bg: 'bg-purple-700 dark:bg-purple-700', color: 'text-white dark:text-white', border: 'border-purple-400' },
  el: { bg: 'bg-orange-600 dark:bg-orange-600', color: 'text-white dark:text-white', border: 'border-orange-400' }
}

const isLoading = ref(true)
const allStarredCards = ref<Flashcard[]>([])
const currentBatch = ref<ActivityItem[]>([])
const availablePool = ref<string[]>([])
const draggedAnswer = ref<string | null>(null)
const isFinished = ref(false)
const activeFrontCardId = ref<string | null>(null)
const currentLanguageCode = ref<string>('fr')

const isMobile = ref(false)

const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

const currentLanguageColor = computed(() => {
  return languageColors[currentLanguageCode.value] || '#d97706'
})

const currentPillStyle = computed(() => {
  return languagePillStyles[currentLanguageCode.value] || { bg: 'bg-indigo-600', color: 'text-white', border: 'border-indigo-400' }
})

function extractStarredText(text: string): { display: string; answer: string } | null {
  if (!text) return null
  const match = text.match(/\*(.*?)\*/)
  if (!match || !match[1] || !match[1].trim()) return null
  const answer = match[1].trim()
  const display = text.replace(/\*(.*?)\*/, '_______')
  return { display, answer }
}

function toggleShowFront(cardId: string) {
  if (activeFrontCardId.value === cardId) {
    activeFrontCardId.value = null
  } else {
    activeFrontCardId.value = cardId
  }
}

async function loadStarredCards() {
  isLoading.value = true
  try {
    const cards = await $fetch<Flashcard[]>('/api/flashcards/search?q=*')
    const validCards = cards.filter(c => extractStarredText(c.back) !== null)
    allStarredCards.value = validCards
    generateNewRound()
  } catch (err) {
    console.error('Failed to load starred cards:', err)
  } finally {
    isLoading.value = false
  }
}

function generateNewRound() {
  if (allStarredCards.value.length === 0) return
  isFinished.value = false
  activeFrontCardId.value = null

  // Group all valid cards by back language
  const cardsByLanguage: Record<string, Flashcard[]> = {}
  for (const card of allStarredCards.value) {
    const lang = (card.backLanguage || card.frontLanguage || 'fr').toLowerCase()
    if (!cardsByLanguage[lang]) cardsByLanguage[lang] = []
    cardsByLanguage[lang].push(card)
  }

  // Find all languages that have at least 1 card
  const availableLangs = Object.keys(cardsByLanguage).filter(l => cardsByLanguage[l].length > 0)
  if (availableLangs.length === 0) return

  // Pick a random language group
  const randomLang = availableLangs[Math.floor(Math.random() * availableLangs.length)]
  currentLanguageCode.value = randomLang
  const langCards = cardsByLanguage[randomLang]

  // Pick 6 cards on desktop, 4 cards on mobile
  const countToPick = isMobile.value ? 4 : 6
  const shuffled = [...langCards].sort(() => 0.5 - Math.random())
  const picked = shuffled.slice(0, countToPick)

  const items: ActivityItem[] = []
  const answers: string[] = []

  picked.forEach(card => {
    const parsed = extractStarredText(card.back)!
    items.push({
      id: card.id,
      fullFront: card.front,
      fullBack: card.back,
      displayBack: parsed.display,
      answerText: parsed.answer,
      currentPlacedAnswer: null
    })
    answers.push(parsed.answer)
  })

  currentBatch.value = items
  // Shuffle answers pool for drag & drop
  availablePool.value = answers.sort(() => 0.5 - Math.random())
}

function onDragStart(answer: string) {
  draggedAnswer.value = answer
}

function onDropOnItem(itemIndex: number) {
  if (!draggedAnswer.value) return
  const item = currentBatch.value[itemIndex]
  if (!item) return

  // If item already had an answer placed, return that old answer to the pool
  if (item.currentPlacedAnswer) {
    availablePool.value.push(item.currentPlacedAnswer)
  }

  // Place new answer
  item.currentPlacedAnswer = draggedAnswer.value

  // Remove placed answer from available pool
  const idx = availablePool.value.indexOf(draggedAnswer.value)
  if (idx !== -1) {
    availablePool.value.splice(idx, 1)
  }

  draggedAnswer.value = null
  checkCompletion()
}

function selectAnswerForFirstEmpty(answer: string) {
  const emptyItem = currentBatch.value.find(i => i.currentPlacedAnswer === null)
  if (!emptyItem) return
  
  emptyItem.currentPlacedAnswer = answer
  const idx = availablePool.value.indexOf(answer)
  if (idx !== -1) {
    availablePool.value.splice(idx, 1)
  }
  checkCompletion()
}

function removePlacedAnswer(itemIndex: number) {
  const item = currentBatch.value[itemIndex]
  if (!item || !item.currentPlacedAnswer) return
  
  availablePool.value.push(item.currentPlacedAnswer)
  item.currentPlacedAnswer = null
  isFinished.value = false
}

function checkCompletion() {
  const allFilled = currentBatch.value.every(i => i.currentPlacedAnswer !== null)
  if (!allFilled) {
    isFinished.value = false
    return
  }
  const allCorrect = currentBatch.value.every(i => i.currentPlacedAnswer === i.answerText)
  if (allCorrect) {
    isFinished.value = true
  }
}

onMounted(() => {
  checkScreenSize()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkScreenSize)
  }
  loadStarredCards()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
    <div class="flex items-center gap-3">
      <NuxtLink to="/activities" class="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        ← Back to Activities
      </NuxtLink>
    </div>

    <div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Drag/Drop Words</h1>
      <!-- Desktop instruction text only -->
      <p class="hidden md:block text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
        Drag and drop (or click) the correct starred answers into each blank space below to complete the phrases.
      </p>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
      Loading cards...
    </div>

    <div v-else-if="allStarredCards.length === 0" class="text-center py-12 text-gray-500">
      No flashcards with starred text (`*text*`) were found. Add asterisks around key words in your flashcards to unlock this activity!
    </div>

    <div v-else class="flex flex-col space-y-4 md:space-y-8">
      
      <!-- Word Pool Container (Shown FIRST on mobile, SECOND on desktop) -->
      <div 
        class="order-first md:order-last p-3 md:p-6 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-2 md:space-y-3"
      >
        <div class="flex flex-wrap gap-2 md:gap-2.5 min-h-[36px] md:min-h-[42px] items-center">
          <button
            v-for="(ans, poolIdx) in availablePool"
            :key="poolIdx"
            draggable="true"
            @dragstart="onDragStart(ans)"
            @click="selectAnswerForFirstEmpty(ans)"
            class="px-3 md:px-4 py-1.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all cursor-grab active:cursor-grabbing shadow-sm h-8 md:h-9 flex items-center justify-center border"
            :class="[currentPillStyle.bg, currentPillStyle.color, currentPillStyle.border]"
          >
            {{ ans }}
          </button>
          <p v-if="availablePool.length === 0 && !isFinished" class="text-xs text-gray-400 italic">
            All words placed! Check your answers.
          </p>
        </div>
      </div>

      <!-- Phrases Cards Grid (Shown SECOND on mobile, FIRST on desktop) -->
      <div class="order-last md:order-first grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div
          v-for="(item, idx) in currentBatch"
          :key="item.id"
          @dragover.prevent
          @drop="onDropOnItem(idx)"
          class="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white dark:bg-[#182030] border transition-all duration-200 shadow-sm flex flex-col justify-between"
          :class="[
            item.currentPlacedAnswer 
              ? (item.currentPlacedAnswer === item.answerText ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-amber-500/60 bg-amber-500/5') 
              : 'border-gray-300 dark:border-gray-700/80'
          ]"
          :style="{
            borderColor: item.currentPlacedAnswer ? undefined : `color-mix(in srgb, ${currentLanguageColor} 50%, #4b5563)`
          }"
        >
          <!-- Desktop Header with Phrase label & icons -->
          <div class="hidden md:flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-2 mb-3">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Phrase {{ idx + 1 }}
            </span>
            <div class="flex items-center gap-2">
              <button
                @click="toggleShowFront(item.id)"
                title="Toggle show Front text"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                :class="{ 'text-amber-500 dark:text-amber-400': activeFrontCardId === item.id }"
              >
                <ArrowPathIcon class="w-4 h-4" />
              </button>
              <NuxtLink
                :to="`/flashcard/${item.id}?fromActivity=true`"
                title="Edit flashcard permalink"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>

          <!-- Card Content Body (Mobile compact inline layout vs Desktop card body) -->
          <div class="flex-1 flex items-center justify-between gap-2">
            
            <!-- Toggled Front text mode -->
            <div v-if="activeFrontCardId === item.id" class="text-sm md:text-base font-semibold leading-relaxed italic" :style="{ color: currentLanguageColor }">
              {{ item.fullFront }}
            </div>

            <!-- Back text fill-in-the-blank mode -->
            <div v-else class="text-sm md:text-base font-medium text-gray-900 dark:text-white flex flex-wrap items-center gap-1 md:gap-1.5 leading-relaxed flex-1">
              <span>{{ item.displayBack.split('_______')[0] }}</span>

              <!-- Drop target slot / placed answer pill -->
              <button
                v-if="item.currentPlacedAnswer"
                @click="removePlacedAnswer(idx)"
                class="px-2 py-0.5 rounded-lg text-xs font-bold transition-transform cursor-pointer flex items-center gap-1 shadow-xs h-6 md:h-7"
                :class="item.currentPlacedAnswer === item.answerText 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-red-600 text-white hover:bg-red-700'"
                title="Click to remove"
              >
                <span>{{ item.currentPlacedAnswer }}</span>
                <span class="text-[10px] opacity-75">✕</span>
              </button>

              <div
                v-else
                class="inline-block min-w-[56px] md:min-w-[70px] h-6 md:h-7 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-950/60"
                :style="{ borderColor: `color-mix(in srgb, ${currentLanguageColor} 40%, transparent)` }"
              ></div>

              <span>{{ item.displayBack.split('_______')[1] }}</span>
            </div>

            <!-- Mobile inline action buttons right after phrase -->
            <div class="flex md:hidden items-center gap-1 shrink-0 ml-1">
              <button
                @click="toggleShowFront(item.id)"
                title="Toggle show Front text"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                :class="{ 'text-amber-500 dark:text-amber-400': activeFrontCardId === item.id }"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
              </button>
              <NuxtLink
                :to="`/flashcard/${item.id}?fromActivity=true`"
                title="Edit flashcard permalink"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <PencilSquareIcon class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Success & Next Button Banner (Mobile: Centered Next Group button only) -->
      <div v-if="isFinished" class="py-3 md:p-6 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 md:space-y-4 shadow-md flex flex-col items-center justify-center">
        <div class="hidden md:flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Excellent! All words placed correctly.</span>
        </div>

        <button
          @click="generateNewRound"
          class="px-6 py-2 rounded-xl text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          :style="{ backgroundColor: currentLanguageColor }"
        >
          Next Group →
        </button>
      </div>
    </div>
  </div>
</template>
