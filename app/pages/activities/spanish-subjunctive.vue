<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon, ArrowsRightLeftIcon } from '@heroicons/vue/24/outline'
import rawSubjunctiveItems from '../../../data-parsed/subjunctive-items.json'

interface SubjunctiveItem {
  english: string
  spanish: string
  indicative: string
  subjunctive: string
}

useHead({
  title: 'LangLearn - Spanish Subjunctive',
  meta: [
    { name: 'description', content: 'Practice Spanish subjunctive trigger phrases with progressive reveal.' }
  ]
})

const baseItems = rawSubjunctiveItems as SubjunctiveItem[]
const isShuffled = ref(false)
const items = ref<SubjunctiveItem[]>([...baseItems])
const currentIndex = ref(0)
// 0 = English, 1 = Spanish + covered Indicative, 2 = Spanish + Indicative + covered Subjunctive, 3 = all revealed
const revealStep = ref<0 | 1 | 2 | 3>(0)

const currentItem = computed(() => items.value[currentIndex.value] || null)

function handleCardClick() {
  if (revealStep.value < 3) {
    revealStep.value = (revealStep.value + 1) as 0 | 1 | 2 | 3
  } else {
    revealStep.value = 0
  }
}

function nextItem() {
  if (items.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % items.value.length
  revealStep.value = 0
}

function prevItem() {
  if (items.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + items.value.length) % items.value.length
  revealStep.value = 0
}

function toggleShuffle() {
  isShuffled.value = !isShuffled.value
  if (isShuffled.value) {
    const copy = [...baseItems]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
    }
    items.value = copy
  } else {
    items.value = [...baseItems]
  }
  currentIndex.value = 0
  revealStep.value = 0
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
    <!-- Top Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/activities"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          <span>Activities</span>
        </NuxtLink>
        <span class="text-gray-500">/</span>
        <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">
          Spanish Subjunctive
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="toggleShuffle"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer select-none"
          :class="isShuffled
            ? 'bg-[#be185d] text-white border-[#be185d]'
            : 'bg-gray-800/70 text-gray-200 border-gray-700 hover:bg-gray-700'"
        >
          <ArrowsRightLeftIcon class="w-3.5 h-3.5" />
          <span>{{ isShuffled ? 'Shuffled' : 'In Order' }}</span>
        </button>

        <span class="text-xs font-mono font-bold text-gray-300 bg-gray-800/80 px-2.5 py-1.5 rounded-lg border border-gray-700">
          {{ items.length > 0 ? currentIndex + 1 : 0 }} / {{ items.length }}
        </span>
      </div>
    </div>

    <!-- Main Interactive Card -->
    <div
      v-if="currentItem"
      @click="handleCardClick"
      class="min-h-[280px] sm:min-h-[320px] rounded-2xl bg-[#182030] border-2 border-[#be185d]/60 hover:border-[#be185d] p-6 sm:p-10 shadow-lg flex flex-col justify-center items-center text-center cursor-pointer select-none transition-all space-y-6"
    >
      <!-- Step 0: English -->
      <div v-if="revealStep === 0" class="space-y-3">
        <div class="text-[11px] font-mono uppercase tracking-widest text-gray-400">
          English
        </div>
        <div class="text-2xl sm:text-3xl font-black text-white leading-snug">
          {{ currentItem.english }}
        </div>
        <div class="text-xs text-gray-400 pt-2">
          Click to reveal Spanish
        </div>
      </div>

      <!-- Steps 1..3: Spanish + Indicative + Subjunctive -->
      <div v-else class="w-full max-w-xl space-y-5">
        <div class="space-y-1">
          <div class="text-[11px] font-mono uppercase tracking-widest text-[#f43f5e]">
            Spanish
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white leading-snug">
            {{ currentItem.spanish }}
          </div>
        </div>

        <!-- Indicative row (shown from step 1+) -->
        <div class="pt-4 border-t border-gray-700/80 text-left space-y-1.5">
          <div class="text-xs font-mono uppercase tracking-wider text-gray-400">
            Indicative:
          </div>
          <div
            v-if="revealStep < 2"
            class="h-7 w-full rounded-lg bg-gray-600/80 border border-gray-500/60 animate-pulse"
          ></div>
          <div
            v-else
            class="text-base sm:text-lg font-semibold text-gray-100 bg-gray-800/80 px-3.5 py-2 rounded-lg border border-gray-700"
          >
            {{ currentItem.indicative }}
          </div>
        </div>

        <!-- Subjunctive row (shown from step 2+) -->
        <div
          v-if="revealStep >= 2"
          class="pt-2 text-left space-y-1.5"
        >
          <div class="text-xs font-mono uppercase tracking-wider text-[#f43f5e]">
            Subjunctive:
          </div>
          <div
            v-if="revealStep < 3"
            class="h-7 w-full rounded-lg bg-gray-600/80 border border-gray-500/60 animate-pulse"
          ></div>
          <div
            v-else
            class="text-base sm:text-lg font-bold text-white bg-[#be185d]/25 px-3.5 py-2 rounded-lg border border-[#be185d]/60"
          >
            {{ currentItem.subjunctive }}
          </div>
        </div>

        <div class="text-xs text-gray-400 pt-2">
          <span v-if="revealStep === 1">Click to reveal Indicative</span>
          <span v-else-if="revealStep === 2">Click to reveal Subjunctive</span>
          <span v-else>Click anywhere to return to English</span>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between gap-4">
      <button
        type="button"
        @click="prevItem"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all cursor-pointer select-none"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        <span>Previous</span>
      </button>

      <button
        type="button"
        @click="nextItem"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#be185d] hover:bg-[#9d174d] text-white transition-all cursor-pointer select-none"
      >
        <span>Next</span>
        <ArrowRightIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
