<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { SpeakerWaveIcon, ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Pronunciation Practice',
  meta: [
    { name: 'description', content: 'Practice phrase pronunciation with interactive reveal and independent status tracking.' }
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
  pronunciation?: string | null
  status: string
  pronunciationStatus?: string
  pronunciationTimesTaken?: number
  rank: number
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

const loadData = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<{ metrics: Metrics; cards: Flashcard[] }>('/api/activities/pronunciation')
    if (data) {
      metrics.value = data.metrics
      cards.value = data.cards || []
      currentIndex.value = 0
      isRevealed.value = false
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
  isRevealed.value = true
}

const openTranslateAudio = (card: Flashcard, event: MouseEvent) => {
  event.stopPropagation()
  const cleanBack = stripAsterisks(card.back)
  const url = `https://translate.google.com/?sl=${card.backLanguage || 'auto'}&tl=${card.frontLanguage || 'en'}&text=${encodeURIComponent(cleanBack)}&op=translate`
  window.open(url, '_blank')
}

const handleAction = async (action: 'LEARNED' | 'KEEP_TAKING') => {
  if (!currentCard.value || isSubmittingAction.value) return
  isSubmittingAction.value = true

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

  try {
    await $fetch('/api/activities/pronunciation-action', {
      method: 'POST',
      body: { cardId, action }
    })

    // Advance to next card
    if (action === 'LEARNED') {
      // Remove learned card from active practice list
      cards.value.splice(currentIndex.value, 1)
      if (currentIndex.value >= cards.value.length) {
        currentIndex.value = 0
      }
    } else {
      // Rotate card to the back
      const [card] = cards.value.splice(currentIndex.value, 1)
      if (card) {
        card.pronunciationTimesTaken = (card.pronunciationTimesTaken ?? 0) + 1
        card.pronunciationStatus = 'LEARNING'
        cards.value.push(card)
      }
      if (currentIndex.value >= cards.value.length) {
        currentIndex.value = 0
      }
    }

    isRevealed.value = false
  } catch (err) {
    console.error('Failed to submit pronunciation action:', err)
  } finally {
    isSubmittingAction.value = false
  }
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

    <!-- Header Summary Metrics: Learned, Taken, New -->
    <div class="grid grid-cols-3 gap-3">
      <!-- Learned Metric -->
      <div class="bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-3.5 text-center shadow-xs">
        <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
          Learned
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-300">
          {{ metrics.learned }}
        </div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">
          pronunciations mastered
        </div>
      </div>

      <!-- Taken Metric -->
      <div class="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-3.5 text-center shadow-xs">
        <div class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
          Taken
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-indigo-700 dark:text-indigo-300">
          {{ metrics.taken }}
        </div>
        <div class="text-[10px] text-gray-400 dark:text-gray-500">
          practiced >= 1 time
        </div>
      </div>

      <!-- New Metric -->
      <div class="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5 text-center shadow-xs">
        <div class="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
          New
        </div>
        <div class="text-2xl sm:text-3xl font-black font-mono text-amber-700 dark:text-amber-300">
          {{ metrics.new }}
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
          @click="loadData"
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
        class="relative min-h-[260px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center transition-all duration-300 border-4 shadow-xl select-none"
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

          <!-- Subtle status indication of this pronunciation -->
          <span class="text-[11px] font-mono tracking-wider uppercase text-white/50">
            {{ currentCard.pronunciationStatus === 'LEARNED' ? 'Learned' : (currentCard.pronunciationTimesTaken ?? 0) > 0 ? 'Testing' : 'New' }}
          </span>
        </div>

        <!-- Target Phrase (French / Target Language) -->
        <div class="my-auto py-4 space-y-2">
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {{ stripAsterisks(currentCard.back) }}
          </h2>
          <p class="text-xs sm:text-sm text-white/60 font-medium">
            {{ currentCard.front }}
          </p>
        </div>

        <!-- Reveal / Pronunciation Area -->
        <div class="w-full">
          <Transition name="fade-reveal" mode="out-in">
            <!-- Unrevealed Button -->
            <button
              v-if="!isRevealed"
              key="button"
              @click="revealPronunciation"
              class="w-full max-w-xs mx-auto py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <SpeakerWaveIcon class="w-4 h-4 text-emerald-400" />
              <span>Reveal Pronunciation</span>
            </button>

            <!-- Revealed Pronunciation and Audio Button -->
            <div
              v-else
              key="revealed"
              class="w-full max-w-md mx-auto p-3 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-xs flex items-center justify-between gap-3 animate-pronounce-reveal"
            >
              <div class="flex-1 text-left pl-2">
                <span class="text-sm sm:text-base font-bold font-mono text-white tracking-wider text-emerald-300 drop-shadow-md">
                  [{{ currentCard.pronunciation }}]
                </span>
              </div>

              <!-- Audio Link to Google Translate -->
              <button
                @click="openTranslateAudio(currentCard, $event)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/20 transition-all cursor-pointer shrink-0"
                title="Listen audio on Google Translate"
              >
                <SpeakerWaveIcon class="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Action Buttons [learned] and [keep taking] (Visible after reveal) -->
      <Transition name="fade-actions">
        <div v-if="isRevealed" class="grid grid-cols-2 gap-3 pt-1">
          <!-- Keep Taking Button -->
          <button
            @click="handleAction('KEEP_TAKING')"
            :disabled="isSubmittingAction"
            class="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ArrowPathIcon class="w-4 h-4" />
            <span>Keep Taking</span>
          </button>

          <!-- Learned Button -->
          <button
            @click="handleAction('LEARNED')"
            :disabled="isSubmittingAction"
            class="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircleIcon class="w-4 h-4" />
            <span>Learned</span>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@keyframes pronounceRevealKeyframe {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  60% {
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-pronounce-reveal {
  animation: pronounceRevealKeyframe 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.fade-reveal-enter-active,
.fade-reveal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-reveal-enter-from,
.fade-reveal-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.fade-actions-enter-active,
.fade-actions-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.fade-actions-enter-from,
.fade-actions-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
