<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PencilSquareIcon, SparklesIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Drag/Drop Highlighted Words',
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

// Bright, readable pill styles for each language
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
const isWordsRevealed = ref(false)

const isMobile = ref(false)

// Touch drag state
const touchActiveWord = ref<string | null>(null)
const touchGhostPos = ref<{ x: number; y: number } | null>(null)
const dragOverCardIdx = ref<number | null>(null)

function onDragEnterCard(e: DragEvent, idx: number) {
  e.preventDefault()
  dragOverCardIdx.value = idx
}

function onDragLeaveCard(e: DragEvent, idx: number) {
  const currentTarget = e.currentTarget as HTMLElement
  const relatedTarget = e.relatedTarget as HTMLElement | null
  if (!currentTarget || !relatedTarget || !currentTarget.contains(relatedTarget)) {
    if (dragOverCardIdx.value === idx) {
      dragOverCardIdx.value = null
    }
  }
}

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

function handleCardClick(event: MouseEvent, cardId: string) {
  const target = event.target as HTMLElement
  if (target.closest('button, a, input, select, textarea, .drop-target')) {
    return
  }
  toggleShowFront(cardId)
}

function openThreeExamples(word: string) {
  const langNameMap: Record<string, string> = {
    fr: 'french',
    es: 'spanish',
    de: 'german',
    it: 'italian',
    nl: 'dutch',
    pl: 'polish',
    ru: 'russian',
    is: 'icelandic',
    da: 'danish',
    el: 'greek'
  }
  const langName = langNameMap[currentLanguageCode.value] || currentLanguageCode.value
  const query = `create 3 examples in ${langName} with "${word}"`
  window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
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
  dragOverCardIdx.value = null
  draggedAnswer.value = null
  isWordsRevealed.value = !isMobile.value // Auto reveal on desktop, require toggle on mobile

  // Group all valid cards by back language
  const cardsByLanguage: Record<string, Flashcard[]> = {}
  for (const card of allStarredCards.value) {
    const lang = (card.backLanguage || card.frontLanguage || 'fr').toLowerCase()
    if (!cardsByLanguage[lang]) cardsByLanguage[lang] = []
    cardsByLanguage[lang].push(card)
  }

  // Find all languages that have at least 1 card
  const availableLangs = Object.keys(cardsByLanguage).filter(l => (cardsByLanguage[l]?.length ?? 0) > 0)
  if (availableLangs.length === 0) return

  // Pick a random language group
  const randomLang = availableLangs[Math.floor(Math.random() * availableLangs.length)]
  if (!randomLang) return
  currentLanguageCode.value = randomLang
  const langCards = cardsByLanguage[randomLang] ?? []

  // Shuffle and pick up to 6 cards ensuring unique answer words
  const shuffled = [...langCards].sort(() => 0.5 - Math.random())
  const picked: Flashcard[] = []
  const usedAnswers = new Set<string>()

  for (const card of shuffled) {
    const parsed = extractStarredText(card.back)
    if (parsed) {
      const normalizedAns = parsed.answer.trim().toLowerCase()
      if (!usedAnswers.has(normalizedAns)) {
        usedAnswers.add(normalizedAns)
        picked.push(card)
        if (picked.length === 6) break
      }
    }
  }

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

function onDragEnd() {
  draggedAnswer.value = null
  dragOverCardIdx.value = null
}

function onDropOnItem(itemIndex: number) {
  dragOverCardIdx.value = null
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

// Touch drag-and-drop handlers for mobile devices
function onTouchStart(e: TouchEvent, answer: string) {
  const touch = e.touches[0]
  if (!touch) return
  touchActiveWord.value = answer
  touchGhostPos.value = { x: touch.clientX, y: touch.clientY }
}

function onTouchMove(e: TouchEvent) {
  if (!touchActiveWord.value) return
  const touch = e.touches[0]
  if (!touch) return
  if (e.cancelable) e.preventDefault()
  touchGhostPos.value = { x: touch.clientX, y: touch.clientY }

  const targetElement = document.elementFromPoint(touch.clientX, touch.clientY)
  const dropCard = targetElement?.closest('[data-drop-idx]') as HTMLElement | null
  if (dropCard) {
    const idxAttr = dropCard.getAttribute('data-drop-idx')
    if (idxAttr !== null) {
      dragOverCardIdx.value = parseInt(idxAttr, 10)
      return
    }
  }
  dragOverCardIdx.value = null
}

function onTouchEnd() {
  dragOverCardIdx.value = null
  if (!touchActiveWord.value || !touchGhostPos.value) {
    touchActiveWord.value = null
    touchGhostPos.value = null
    return
  }

  const { x, y } = touchGhostPos.value
  const targetElement = document.elementFromPoint(x, y)
  const dropCard = targetElement?.closest('[data-drop-idx]') as HTMLElement | null

  if (dropCard) {
    const idxAttr = dropCard.getAttribute('data-drop-idx')
    if (idxAttr !== null) {
      const idx = parseInt(idxAttr, 10)
      draggedAnswer.value = touchActiveWord.value
      onDropOnItem(idx)
    }
  }

  touchActiveWord.value = null
  touchGhostPos.value = null
}

function onTouchCancel() {
  dragOverCardIdx.value = null
  touchActiveWord.value = null
  touchGhostPos.value = null
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
      <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Drag/Drop Highlighted Words</h1>
      <!-- Desktop instruction text only -->
      <p class="hidden md:block text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
        Drag and drop the correct starred answers into each blank space below to complete the phrases.
      </p>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
      Loading cards...
    </div>

    <div v-else-if="allStarredCards.length === 0" class="text-center py-12 text-gray-500">
      No flashcards with starred text (`*text*`) were found. Add asterisks around key words in your flashcards to unlock this activity!
    </div>

    <div v-else class="flex flex-col space-y-4 md:space-y-8">
      
      <!-- Phrases Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div
          v-for="(item, idx) in currentBatch"
          :key="item.id"
          :data-drop-idx="idx"
          @dragover.prevent
          @dragenter="onDragEnterCard($event, idx)"
          @dragleave="onDragLeaveCard($event, idx)"
          @drop="onDropOnItem(idx)"
          @click="handleCardClick($event, item.id)"
          class="p-3 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-200 shadow-sm flex flex-col justify-between cursor-pointer select-none"
          :class="[
            activeFrontCardId === item.id 
              ? 'bg-slate-100 dark:bg-[#26334d]' 
              : 'bg-white dark:bg-[#182030]'
          ]"
          :style="{
            backgroundColor: activeFrontCardId === item.id 
              ? undefined 
              : (dragOverCardIdx === idx ? `color-mix(in srgb, ${currentLanguageColor} 20%, transparent)` : undefined),
            borderColor: dragOverCardIdx === idx 
              ? currentLanguageColor 
              : (item.currentPlacedAnswer 
                  ? (item.currentPlacedAnswer === item.answerText ? currentLanguageColor : `color-mix(in srgb, ${currentLanguageColor} 40%, transparent)`)
                  : `color-mix(in srgb, ${currentLanguageColor} 40%, #4b5563)`)
          }"
        >
          <!-- Desktop-only Header with Phrase label & action icons -->
          <div class="hidden md:flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-2 mb-3">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Phrase {{ idx + 1 }}
            </span>
            <div class="flex items-center gap-2">
              <!-- 3 examples icon button (Shown ONLY when correctly dropped) -->
              <button
                v-if="item.currentPlacedAnswer === item.answerText"
                @click.stop="openThreeExamples(item.answerText)"
                title="Get 3 examples of this word"
                class="p-1 rounded text-gray-400 hover:opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer animate-pop-spin"
              >
                <SparklesIcon class="w-4 h-4 text-emerald-400" />
              </button>
              <!-- Edit permalink -->
              <NuxtLink
                :to="`/flashcard/${item.id}?fromActivity=true`"
                @click.stop
                title="Edit flashcard permalink"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>

          <!-- Card Content Body (Compact single-line horizontal alignment on mobile) -->
          <div class="flex-1 flex items-center justify-between gap-2">
            
            <!-- Toggled Front text mode -->
            <div v-if="activeFrontCardId === item.id" class="text-sm md:text-base font-semibold text-gray-900 dark:text-white leading-relaxed italic py-0.5">
              {{ item.fullFront }}
            </div>

            <!-- Back text fill-in-the-blank mode -->
            <div v-else class="text-sm md:text-base font-medium text-gray-900 dark:text-white leading-relaxed flex-1">
              <span>{{ item.displayBack.split('_______')[0] }}</span>

              <!-- Drop target slot / placed answer pill -->
              <button
                v-if="item.currentPlacedAnswer"
                @click.stop="removePlacedAnswer(idx)"
                class="drop-target inline-flex items-center gap-1 px-1 py-0.5 mx-0.5 rounded text-sm md:text-base font-semibold transition-transform cursor-pointer border align-baseline leading-normal shadow-xs"
                :style="{
                  backgroundColor: item.currentPlacedAnswer === item.answerText 
                    ? currentLanguageColor 
                    : '#9ca3af',
                  color: item.currentPlacedAnswer === item.answerText 
                    ? '#ffffff' 
                    : '#000000',
                  borderColor: item.currentPlacedAnswer === item.answerText 
                    ? currentLanguageColor 
                    : '#6b7280',
                  borderStyle: item.currentPlacedAnswer === item.answerText ? 'solid' : 'dashed'
                }"
                title="Click to remove"
              >
                <span>{{ item.currentPlacedAnswer }}</span>
              </button>

              <div
                v-else
                class="drop-target inline-block min-w-[50px] h-[1.3em] mx-0.5 border-2 border-dashed rounded bg-gray-100/80 dark:bg-gray-950/80 transition-colors shadow-inner align-middle"
                :style="{ borderColor: currentLanguageColor }"
              ></div>

              <span>{{ item.displayBack.split('_______')[1] }}</span>
            </div>

            <!-- Mobile inline action icons horizontally aligned on the right -->
            <div class="flex md:hidden items-center gap-1 shrink-0 ml-1">
              <!-- 3 examples icon button (Shown ONLY when correctly dropped) -->
              <button
                v-if="item.currentPlacedAnswer === item.answerText"
                @click.stop="openThreeExamples(item.answerText)"
                title="Get 3 examples of this word"
                class="p-1 rounded text-gray-400 hover:opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer animate-pop-spin"
              >
                <SparklesIcon class="w-4 h-4 text-emerald-400" />
              </button>
              <!-- Edit permalink -->
              <NuxtLink
                :to="`/flashcard/${item.id}?fromActivity=true`"
                @click.stop
                title="Edit flashcard permalink"
                class="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Word Pool Container (Shown at the BOTTOM when not finished) -->
      <div 
        v-if="!isFinished"
        class="p-3 md:p-6 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-2 md:space-y-3"
      >
        <!-- Mobile Reveal Toggle Button (if words not yet revealed on mobile) -->
        <button
          v-if="!isWordsRevealed"
          @click="isWordsRevealed = true"
          class="w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20"
          :style="{ backgroundColor: currentLanguageColor }"
        >
          <span>Click to reveal the words to drag</span>
        </button>

        <!-- Revealed Word Pool -->
        <div v-else class="flex flex-wrap gap-2 md:gap-2.5 min-h-[36px] md:min-h-[42px] items-center justify-center">
          <button
            v-for="(ans, poolIdx) in availablePool"
            :key="poolIdx"
            draggable="true"
            @dragstart="onDragStart(ans)"
            @dragend="onDragEnd"
            @touchstart="onTouchStart($event, ans)"
            @touchmove="onTouchMove($event)"
            @touchend="onTouchEnd"
            @touchcancel="onTouchCancel"
            class="px-1 py-0.5 rounded text-sm md:text-base font-semibold transition-all cursor-grab active:cursor-grabbing shadow-xs flex items-center justify-center border select-none touch-none"
            :style="{
              backgroundColor: currentLanguageColor,
              color: '#ffffff',
              borderColor: currentLanguageColor
            }"
          >
            {{ ans }}
          </button>
        </div>
      </div>

      <!-- Floating Touch Ghost Pill for Mobile Dragging -->
      <div
        v-if="touchActiveWord && touchGhostPos"
        class="fixed z-50 pointer-events-none px-1 py-0.5 rounded text-sm md:text-base font-semibold shadow-xl border transform -translate-x-1/2 -translate-y-1/2"
        :style="{
          left: `${touchGhostPos.x}px`,
          top: `${touchGhostPos.y}px`,
          backgroundColor: currentLanguageColor,
          color: '#ffffff',
          borderColor: currentLanguageColor
        }"
      >
        {{ touchActiveWord }}
      </div>

      <!-- Centered Next Group Button (Shown when round is finished) -->
      <div v-if="isFinished" class="flex justify-center pt-2">
        <button
          @click="generateNewRound"
          class="px-8 py-2.5 rounded-xl text-white font-bold text-sm md:text-base shadow-lg transition-transform hover:scale-105 cursor-pointer"
          :style="{ backgroundColor: currentLanguageColor }"
        >
          Next Group →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes popSpin {
  0% {
    transform: scale(0.2) rotate(-360deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.35) rotate(25deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-pop-spin {
  animation: popSpin 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
