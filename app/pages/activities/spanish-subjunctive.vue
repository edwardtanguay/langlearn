<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon, ArrowsRightLeftIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
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
const showAllTable = ref(false)
const rotatedShowAllItems = computed(() => {
  if (items.value.length === 0) return []
  const idx = currentIndex.value % items.value.length
  return [...items.value.slice(idx), ...items.value.slice(0, idx)]
})

function openGoogleExamples(phrase: string) {
  if (!phrase || !import.meta.client) return
  const query = `give me three Spanish sentences using "${phrase}" with English translations`
  window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
}

function handleCardClick() {
  if (typeof window !== 'undefined' && window.getSelection()?.toString().trim()) {
    return
  }
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
      class="min-h-[280px] sm:min-h-[320px] rounded-2xl bg-[#182030] border-2 border-[#be185d]/60 hover:border-[#be185d] p-6 sm:p-10 shadow-lg flex flex-col justify-center items-center text-center cursor-pointer transition-all space-y-6"
    >
      <!-- Step 0: English -->
      <div v-if="revealStep === 0" class="space-y-3">
        <div class="text-[11px] font-mono uppercase tracking-widest text-gray-400">
          English
        </div>
        <div class="text-2xl sm:text-3xl font-black text-white leading-snug">
          {{ currentItem.english }}
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
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono uppercase tracking-wider text-gray-400">
              Indicative:
            </span>
            <button
              v-if="revealStep >= 2"
              type="button"
              @click.stop="openGoogleExamples(currentItem.indicative)"
              title="Look up 3 examples in Google Search"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-[10px] font-mono transition-colors cursor-pointer"
            >
              <MagnifyingGlassIcon class="w-3 h-3" />
              <span>3 examples</span>
            </button>
          </div>
          <div
            v-if="revealStep < 2"
            class="relative overflow-hidden rounded-lg bg-gray-900/50 px-3.5 py-2 select-none pointer-events-none"
          >
            <span class="block text-base sm:text-lg font-semibold text-gray-300 blur-[4px] opacity-55">
              algo interesante pasa cada día aquí
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-gray-800/35 via-gray-700/25 to-gray-800/35 backdrop-blur-[1px]"></div>
          </div>
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
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono uppercase tracking-wider text-[#f43f5e]">
              Subjunctive:
            </span>
            <button
              v-if="revealStep >= 3"
              type="button"
              @click.stop="openGoogleExamples(currentItem.subjunctive)"
              title="Look up 3 examples in Google Search"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#be185d]/30 hover:bg-[#be185d]/50 text-white border border-[#be185d]/60 text-[10px] font-mono transition-colors cursor-pointer"
            >
              <MagnifyingGlassIcon class="w-3 h-3" />
              <span>3 examples</span>
            </button>
          </div>
          <div
            v-if="revealStep < 3"
            class="relative overflow-hidden rounded-lg bg-[#be185d]/10 px-3.5 py-2 select-none pointer-events-none"
          >
            <span class="block text-base sm:text-lg font-bold text-rose-200 blur-[4px] opacity-55">
              espero que todo salga muy bien hoy
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-[#be185d]/15 via-gray-800/30 to-[#be185d]/15 backdrop-blur-[1px]"></div>
          </div>
          <div
            v-else
            class="text-base sm:text-lg font-bold text-white bg-[#be185d]/25 px-3.5 py-2 rounded-lg border border-[#be185d]/60"
          >
            {{ currentItem.subjunctive }}
          </div>
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

    <!-- Show All Link & Table -->
    <div class="pt-2 space-y-4">
      <div class="flex justify-center">
        <button
          type="button"
          @click="showAllTable = !showAllTable"
          class="text-sm font-semibold text-white/80 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
        >
          {{ showAllTable ? 'hide all' : 'show all' }}
        </button>
      </div>

      <div
        v-if="showAllTable"
        class="overflow-hidden rounded-2xl border border-gray-700/80 bg-[#182030] shadow-lg"
      >
        <!-- Desktop 3-column table -->
        <table class="hidden sm:table w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-700/80 bg-gray-900/50 text-[11px] font-mono uppercase tracking-wider text-gray-400">
              <th class="px-5 py-3">Spanish</th>
              <th class="px-5 py-3">English</th>
              <th class="px-5 py-3 text-right">Examples</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/80">
            <tr
              v-for="(item, idx) in rotatedShowAllItems"
              :key="item.spanish + idx"
              :class="idx === 0 ? 'bg-[#be185d]/20 border-l-4 border-l-[#be185d]' : ''"
            >
              <td class="px-5 py-3 text-sm sm:text-base font-bold text-white">
                {{ item.spanish }}
              </td>
              <td class="px-5 py-3 text-sm sm:text-base text-gray-300">
                {{ item.english }}
              </td>
              <td class="px-5 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  @click="openGoogleExamples(item.spanish)"
                  title="Look up 3 examples in Google Search"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-[10px] font-mono transition-colors cursor-pointer"
                >
                  <MagnifyingGlassIcon class="w-3 h-3" />
                  <span>3 examples</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile stacked layout -->
        <div class="sm:hidden divide-y divide-gray-800/80">
          <div
            v-for="(item, idx) in rotatedShowAllItems"
            :key="item.spanish + idx"
            class="px-4 py-3 space-y-1.5"
            :class="idx === 0 ? 'bg-[#be185d]/20 border-l-4 border-l-[#be185d]' : ''"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="text-sm font-bold text-white leading-snug">
                {{ item.spanish }}
              </div>
              <button
                type="button"
                @click="openGoogleExamples(item.spanish)"
                title="Look up 3 examples in Google Search"
                class="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-[10px] font-mono transition-colors cursor-pointer"
              >
                <MagnifyingGlassIcon class="w-3 h-3" />
                <span>3 examples</span>
              </button>
            </div>
            <div class="text-xs text-gray-300 leading-snug">
              {{ item.english }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
