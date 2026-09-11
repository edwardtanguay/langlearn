<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Pronunciation Practice',
  meta: [
    { name: 'description', content: 'Practice phrase pronunciation with interactive reveal and independent status tracking.' }
  ]
})

const route = useRoute()
const router = useRouter()

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
  pronunciation?: string | null
  status: string
  pronunciationStatus?: string
  pronunciationTimesTaken?: number
  rank: number
  createdAt?: string | Date | null
  tags?: { tag: Tag }[]
}

interface Metrics {
  learned: number
  taken: number
  new: number
  total: number
}

const languageColors: Record<string, string> = {
  fr: '#333388',
  es: '#be185d',
  it: '#194d19',
  nl: '#facc15',
  pl: '#b8b8b8',
  de: '#3d1e03',
  ru: '#3f3f46',
  is: '#06b6d4',
  da: '#7e22ce',
  el: '#ea580c'
}

const isLoading = ref(true)
const cards = ref<Flashcard[]>([])
const currentIndex = ref(0)
const isRevealed = ref(false)
const showSourceText = ref(false)
const isSubmittingAction = ref(false)
const metrics = ref<Metrics>({
  learned: 0,
  taken: 0,
  new: 0,
  total: 0
})

const currentCard = computed(() => {
  if (cards.value.length === 0) return null
  return cards.value[currentIndex.value] || null
})

function stripAsterisks(text: string): string {
  return text ? text.replace(/\*/g, '') : ''
}

function formatImportDate(dateStr?: string | Date | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((todayStart - dStart) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return 'imported today'
  }
  if (diffDays === 1) {
    return 'imported yesterday'
  }
  if (diffDays <= 7) {
    return `imported ${diffDays} days ago`
  }

  const isCurrentYear = d.getFullYear() === now.getFullYear()
  const dateFormatted = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(isCurrentYear ? {} : { year: 'numeric' })
  })
  return `imported ${dateFormatted}`
}

function cardStatusLabel(card: Flashcard | null): string {
  if (!card) return ''
  const st = card.status?.toLowerCase() || ''
  if (st === 'learned') return 'LEARNED'
  if (st === 'learning') return 'CURRENTLY TESTING'
  if (st === 'untested') return 'UNTESTED'
  if (st === 'parked') return 'PARKED'
  return st.toUpperCase()
}

const loadData = async (isReview = false) => {
  isLoading.value = true
  try {
    const data = await $fetch<{ metrics: Metrics; cards: Flashcard[] }>(`/api/activities/pronunciation${isReview ? '?review=true' : ''}`)
    if (data) {
      metrics.value = data.metrics
      cards.value = data.cards || []
      currentIndex.value = 0
      isRevealed.value = false
      showSourceText.value = false

      const targetCardId = (route.query.cardId as string) || null
      if (targetCardId) {
        const foundIdx = cards.value.findIndex(c => c.id === targetCardId)
        if (foundIdx !== -1) {
          const [targetCard] = cards.value.splice(foundIdx, 1)
          if (targetCard) {
            cards.value.unshift(targetCard)
          }
        }
        router.replace({ query: { ...route.query, cardId: undefined } })
      }
      currentIndex.value = 0
    }
  } catch (err) {
    console.error('Failed to load pronunciation practice data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const revealPronunciation = () => {
  if (showSourceText.value) return
  isRevealed.value = true
}

const openTranslateAudio = (card: Flashcard, event: MouseEvent) => {
  event.stopPropagation()
  const cleanBack = stripAsterisks(card.back)
  const url = `https://translate.google.com/?sl=${card.backLanguage || 'auto'}&tl=${card.frontLanguage || 'en'}&text=${encodeURIComponent(cleanBack)}&op=translate`
  window.open(url, '_blank')
}

const handleAction = (action: 'LEARNED' | 'KEEP_TAKING') => {
  if (!currentCard.value) return

  const cardId = currentCard.value.id
  const wasUntested = (currentCard.value.pronunciationTimesTaken ?? 0) === 0
  const wasLearned = currentCard.value.pronunciationStatus === 'LEARNED'

  // Optimistic metrics update
  if (action === 'LEARNED') {
    if (!wasLearned) metrics.value.learned++
  } else {
    if (wasLearned) metrics.value.learned = Math.max(0, metrics.value.learned - 1)
  }

  if (wasUntested) {
    metrics.value.taken++
    metrics.value.new = Math.max(0, metrics.value.new - 1)
  }

  // Advance immediately
  if (action === 'LEARNED') {
    // Remove learned card from active practice list
    cards.value.splice(currentIndex.value, 1)
    currentIndex.value = 0
  } else {
    // Rotate card to the back
    const [card] = cards.value.splice(currentIndex.value, 1)
    if (card) {
      card.pronunciationTimesTaken = (card.pronunciationTimesTaken ?? 0) + 1
      card.pronunciationStatus = 'LEARNING'
      cards.value.push(card)
    }
    currentIndex.value = 0
  }

  isRevealed.value = false
  showSourceText.value = false

  // Persist to server in background
  $fetch('/api/activities/pronunciation-action', {
    method: 'POST',
    body: { cardId, action }
  }).catch((err) => {
    console.error('Failed to submit pronunciation action:', err)
  })
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8 space-y-6">
    <!-- Back to Activities Link -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/activities"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        <span>Back to activities</span>
      </NuxtLink>

      <span class="text-xs font-mono text-gray-400 dark:text-gray-500">
        Pronunciation Practice
      </span>
    </div>

    <!-- Header Summary Metrics: Learned, Testing, New -->
    <div class="grid grid-cols-3 gap-3">
      <!-- Learned Metric -->
      <div class="bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-3.5 text-center shadow-xs">
        <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
          Learned
        </div>
        <div
          class="text-2xl sm:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-300 transition-all duration-300"
          :class="isLoading ? 'blur-[4px] opacity-40 select-none' : 'blur-none opacity-100'"
        >
          {{ isLoading ? '88' : metrics.learned }}
        </div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">
          pronunciations mastered
        </div>
      </div>

      <!-- Testing Metric -->
      <div class="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-3.5 text-center shadow-xs">
        <div class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
          Testing
        </div>
        <div
          class="text-2xl sm:text-3xl font-black font-mono text-indigo-700 dark:text-indigo-300 transition-all duration-300"
          :class="isLoading ? 'blur-[4px] opacity-40 select-none' : 'blur-none opacity-100'"
        >
          {{ isLoading ? '88' : metrics.taken }}
        </div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">
          tested at least once
        </div>
      </div>

      <!-- New Metric -->
      <div class="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5 text-center shadow-xs">
        <div class="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
          New
        </div>
        <div
          class="text-2xl sm:text-3xl font-black font-mono text-amber-700 dark:text-amber-300 transition-all duration-300"
          :class="isLoading ? 'blur-[4px] opacity-40 select-none' : 'blur-none opacity-100'"
        >
          {{ isLoading ? '88' : metrics.new }}
        </div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">
          still need to be taken
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-24 flex flex-col items-center justify-center space-y-3">
      <div class="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs text-gray-400 font-mono">Loading pronunciation practice…</p>
    </div>

    <!-- Completed / Empty State -->
    <div
      v-else-if="cards.length === 0"
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center shadow-lg space-y-4"
    >
      <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl shadow-inner">
        🎉
      </div>
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">All Pronunciations Practiced!</h2>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          You've completed your current pronunciation cards. You can refresh to review them again or import more cards.
        </p>
      </div>
      <div class="pt-2">
        <button
          @click="loadData(true)"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowPathIcon class="w-4 h-4" />
          <span>Practice Again</span>
        </button>
      </div>
    </div>

    <!-- Active Practice Card -->
    <div v-else-if="currentCard" class="space-y-4">
      <div
        class="relative min-h-[260px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center transition-colors duration-300 border-4 shadow-xl select-none"
        :style="{
          borderColor: languageColors[currentCard.backLanguage] || '#333388',
          backgroundColor: `color-mix(in srgb, ${languageColors[currentCard.backLanguage] || '#4f46e5'} 25%, #111827)`
        }"
      >
        <!-- Language Badge (Top Left) -->
        <div class="w-full flex items-center justify-between">
          <span
            class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs"
            :style="{ backgroundColor: languageColors[currentCard.backLanguage] || '#333388' }"
          >
            {{ currentCard.backLanguage?.toUpperCase() || 'FR' }}
          </span>

          <!-- Status indication of this pronunciation -->
          <span 
            class="text-[11px] font-mono tracking-wider uppercase font-bold"
            :class="currentCard.pronunciationStatus === 'LEARNED' ? 'text-emerald-400' : (currentCard.pronunciationTimesTaken ?? 0) > 0 ? 'text-sky-400' : 'text-amber-300'"
          >
            {{ currentCard.pronunciationStatus === 'LEARNED' ? 'Learned' : (currentCard.pronunciationTimesTaken ?? 0) > 0 ? 'Testing' : 'New' }}
          </span>
        </div>

        <!-- Target Phrase (Click to toggle French/English) -->
        <div class="my-auto py-3 min-h-[64px] flex items-center justify-center">
          <div
            @click="showSourceText = !showSourceText"
            class="tracking-tight leading-tight cursor-pointer select-none"
            :class="showSourceText ? 'text-sm font-semibold text-gray-400 italic' : 'text-xl font-semibold text-white'"
            :title="showSourceText ? 'Click to show target phrase' : 'Click to show translation'"
          >
            {{ showSourceText ? stripAsterisks(currentCard.front) : stripAsterisks(currentCard.back) }}
          </div>
        </div>

        <!-- Reveal / Pronunciation Area (Positioned halfway between phrase and bottom of card) -->
        <div class="w-full mb-7 h-12 flex items-center justify-center">
          <!-- Unrevealed Button -->
          <button
            v-if="!isRevealed"
            :disabled="showSourceText"
            @click="revealPronunciation"
            class="w-full max-w-xs mx-auto h-11 px-4 rounded-xl border font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center"
            :class="showSourceText 
              ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/10 text-white/40 select-none' 
              : 'bg-white/10 hover:bg-white/20 active:bg-white/25 border-white/20 text-white cursor-pointer'"
            :title="showSourceText ? 'Switch back to target language to reveal pronunciation' : 'Reveal Pronunciation'"
          >
            <span>Reveal Pronunciation</span>
          </button>

          <!-- Revealed Pronunciation -->
          <div
            v-else
            class="w-full max-w-md mx-auto h-11 px-4 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-xs flex items-center justify-center"
          >
            <div 
              class="tracking-wide"
              :class="(currentCard.pronunciation?.length ?? 0) > 20 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'"
              style="font-family: 'Courier New', Courier, monospace"
            >
              <template v-if="(currentCard.pronunciation?.length ?? 0) > 20">
                <span class="text-yellow-300 font-bold">{{ currentCard.pronunciation }}</span>
              </template>
              <template v-else>
                <span class="text-yellow-300/40 font-normal">[ </span><span class="text-yellow-300 font-bold">{{ currentCard.pronunciation }}</span><span class="text-yellow-300/40 font-normal"> ]</span>
              </template>
            </div>
          </div>
        </div>

        <!-- Edit Flashcard (Lower Left, visible after reveal) -->
        <NuxtLink
          v-if="isRevealed"
          :to="`/flashcard/${currentCard.id}?from=pronunciation`"
          class="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg text-white hover:text-white/80 hover:bg-white/10"
          title="Edit flashcard"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          <span>edit flashcard</span>
        </NuxtLink>

        <!-- Audio Button (Lower Right, visible after reveal) -->
        <button
          v-if="isRevealed"
          @click="openTranslateAudio(currentCard, $event)"
          class="absolute bottom-3 right-4 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          title="Audio on Google Translate"
        >
          <span>Audio</span>
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <rect x="7.5" y="7.5" width="13" height="13" rx="2.5" fill="#ffffff" />
            <path d="M12.5 13.5h4.5m-2.25-1.5v4" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
            <rect x="3.5" y="3.5" width="13" height="13" rx="2.5" fill="#1a73e8" />
            <path d="M12.5 9.5H9.5V11H11.2C10.9 11.9 10.2 12.5 9.5 12.5C8.4 12.5 7.5 11.6 7.5 10.5C7.5 9.4 8.4 8.5 9.5 8.5C10 8.5 10.5 8.7 10.8 9L11.8 8C11.2 7.4 10.4 7 9.5 7C7.6 7 6 8.6 6 10.5C6 12.4 7.6 14 9.5 14C11.4 14 12.7 12.6 12.7 10.6C12.7 10.2 12.6 9.8 12.5 9.5Z" fill="#ffffff" />
          </svg>
        </button>
      </div>

      <!-- Nuanced info outside bottom of card: import date (left) and status (right) -->
      <div class="w-full flex items-center justify-between px-3 -mt-2 text-[11px] text-gray-400/80 dark:text-gray-500 font-medium select-none">
        <span class="tracking-wider uppercase">{{ formatImportDate(currentCard.createdAt) }}</span>
        <span class="tracking-wider uppercase">{{ cardStatusLabel(currentCard) }}</span>
      </div>

      <!-- Action Buttons [Learned] and [Keep Testing] (Visible immediately upon reveal) -->
      <div v-if="isRevealed" class="grid grid-cols-2 gap-3 pt-1">
        <!-- Learned Button (Left, Green) -->
        <button
          @click="handleAction('LEARNED')"
          class="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center cursor-pointer"
        >
          <span>Learned</span>
        </button>

        <!-- Keep Testing Button (Right, Blue) -->
        <button
          @click="handleAction('KEEP_TAKING')"
          class="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center cursor-pointer"
        >
          <span>Keep Testing</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
