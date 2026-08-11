<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowPathIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Starred Texts Activity',
  meta: [
    { name: 'description', content: 'Interactive drag-and-drop starred text flashcard activity.' }
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

const isLoading = ref(true)
const allStarredCards = ref<Flashcard[]>([])
const currentBatch = ref<ActivityItem[]>([])
const availablePool = ref<string[]>([])
const draggedAnswer = ref<string | null>(null)
const isFinished = ref(false)
const activeFrontCardId = ref<string | null>(null)

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
  const langCards = cardsByLanguage[randomLang]

  // Pick 4 random cards from this language (or all if < 4)
  const shuffled = [...langCards].sort(() => 0.5 - Math.random())
  const picked = shuffled.slice(0, 4)

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
  loadStarredCards()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <div class="flex items-center gap-3">
      <NuxtLink to="/activities" class="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        ← Back to Activities
      </NuxtLink>
    </div>

    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Starred Texts Activity</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
        Drag and drop (or click) the correct starred answers into each blank space below to complete the 4 phrases.
      </p>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
      Loading starred text cards...
    </div>

    <div v-else-if="allStarredCards.length === 0" class="text-center py-12 text-gray-500">
      No flashcards with starred text (`*text*`) were found. Add asterisks around key words in your flashcards to unlock this activity!
    </div>

    <div v-else class="space-y-8">
      <!-- 4 Phrases Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(item, idx) in currentBatch"
          :key="item.id"
          @dragover.prevent
          @drop="onDropOnItem(idx)"
          class="p-5 rounded-2xl bg-white dark:bg-[#182030] border transition-all duration-200 shadow-sm space-y-3 min-h-[110px] flex flex-col justify-between"
          :class="[
            item.currentPlacedAnswer 
              ? (item.currentPlacedAnswer === item.answerText ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-amber-500/60 bg-amber-500/5') 
              : 'border-gray-300 dark:border-gray-700/80'
          ]"
        >
          <!-- Card Header with Toggle Icon & Edit Permalink Icon -->
          <div class="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Phrase {{ idx + 1 }}
            </span>
            <div class="flex items-center gap-2">
              <!-- Toggle front text icon button -->
              <button
                @click="toggleShowFront(item.id)"
                title="Toggle show Front text"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                :class="{ 'text-amber-500 dark:text-amber-400': activeFrontCardId === item.id }"
              >
                <ArrowPathIcon class="w-4 h-4" />
              </button>

              <!-- Edit card permalink icon button -->
              <NuxtLink
                :to="`/flashcard/${item.id}?fromActivity=true`"
                title="Edit flashcard permalink"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>

          <!-- Card Content Body (Toggled Front vs Back Fill-in-the-blank) -->
          <div class="flex-1 flex items-center">
            <!-- Front text mode -->
            <div v-if="activeFrontCardId === item.id" class="text-base font-semibold text-amber-600 dark:text-amber-400 leading-relaxed italic">
              {{ item.fullFront }}
            </div>

            <!-- Back text fill-in-the-blank mode -->
            <div v-else class="text-base font-medium text-gray-900 dark:text-white flex flex-wrap items-center gap-1.5 leading-relaxed">
              <span>{{ item.displayBack.split('_______')[0] }}</span>

              <!-- Drop target slot / placed answer pill -->
              <button
                v-if="item.currentPlacedAnswer"
                @click="removePlacedAnswer(idx)"
                class="px-2.5 py-0.5 rounded-lg text-xs font-bold transition-transform cursor-pointer flex items-center gap-1 shadow-xs h-7"
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
                class="inline-block min-w-[70px] h-7 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-950/60"
              ></div>

              <span>{{ item.displayBack.split('_______')[1] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Pool of Starred Answers -->
      <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-3">
        <div class="flex flex-wrap gap-2.5 min-h-[42px] items-center">
          <button
            v-for="(ans, poolIdx) in availablePool"
            :key="poolIdx"
            draggable="true"
            @dragstart="onDragStart(ans)"
            @click="selectAnswerForFirstEmpty(ans)"
            class="px-3.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-sm font-semibold transition-all cursor-grab active:cursor-grabbing shadow-xs h-7 flex items-center justify-center"
          >
            {{ ans }}
          </button>
          <p v-if="availablePool.length === 0 && !isFinished" class="text-xs text-gray-400 italic">
            All words placed! Check your answers above.
          </p>
        </div>
      </div>

      <!-- Success & Next Button Banner -->
      <div v-if="isFinished" class="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 shadow-md">
        <div class="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Excellent! All starred words placed correctly.</span>
        </div>

        <button
          @click="generateNewRound"
          class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          NEXT Activity Round →
        </button>
      </div>
    </div>
  </div>
</template>
