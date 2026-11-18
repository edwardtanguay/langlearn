<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import rawSubjunctiveItems from '../../../data-parsed/subjunctive-items.json'

interface SubjunctiveItem {
  english: string
  spanish: string
  indicative: string
  subjunctive: string
}

interface StoredSubjunctiveState {
  counts: Record<string, number>
  inProgressKey: string | null
}

const STORAGE_KEY = 'langlearn-spanish-subjunctive-v1'

useHead({
  title: 'LangLearn - Spanish Subjunctive',
  meta: [
    { name: 'description', content: 'Practice Spanish subjunctive trigger phrases with progressive reveal.' }
  ]
})

const baseItems = rawSubjunctiveItems as SubjunctiveItem[]
const testedCounts = ref<Record<string, number>>({})
const inProgressKey = ref<string | null>(null)
const isStatsLoading = ref(true)
let statsLoadingTimer: ReturnType<typeof setTimeout> | null = null

const history = ref<SubjunctiveItem[]>([])
const historyIndex = ref(0)
// 0 = English, 1 = +Spanish, 2 = +Indicative, 3 = +Subjunctive
const revealStep = ref<0 | 1 | 2 | 3>(0)
const hasRecordedCurrentPresentation = ref(false)

const currentItem = computed(() => history.value[historyIndex.value] || null)
const canGoPrev = computed(() => historyIndex.value > 0)
const showAllTable = ref(false)

function getItemKey(item: SubjunctiveItem): string {
  return `${item.spanish}::${item.english}`
}

function getTestedCount(item: SubjunctiveItem): number {
  return testedCounts.value[getItemKey(item)] ?? 0
}

const testedUniqueCount = computed(() =>
  baseItems.filter(item => getTestedCount(item) > 0).length
)

const orderedShowAllItems = computed(() => {
  if (!currentItem.value) return baseItems
  const activeKey = getItemKey(currentItem.value)
  const rest = baseItems.filter(item => getItemKey(item) !== activeKey)
  return [currentItem.value, ...rest]
})

function saveState() {
  if (!import.meta.client) return
  try {
    const payload: StoredSubjunctiveState = {
      counts: testedCounts.value,
      inProgressKey: inProgressKey.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage quota or private mode errors
  }
}

function loadState(): StoredSubjunctiveState {
  if (!import.meta.client) return { counts: {}, inProgressKey: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { counts: {}, inProgressKey: null }
    const parsed = JSON.parse(raw) as Partial<StoredSubjunctiveState>
    const counts: Record<string, number> = {}
    if (parsed.counts && typeof parsed.counts === 'object') {
      for (const [k, v] of Object.entries(parsed.counts)) {
        if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
          counts[k] = Math.floor(v)
        }
      }
    }
    const resumeKey = typeof parsed.inProgressKey === 'string' ? parsed.inProgressKey : null
    return { counts, inProgressKey: resumeKey }
  } catch {
    return { counts: {}, inProgressKey: null }
  }
}

function pickLeastTestedItem(excludeKey?: string): SubjunctiveItem | null {
  if (baseItems.length === 0) return null
  let minCount = Infinity
  for (const item of baseItems) {
    const c = getTestedCount(item)
    if (c < minCount) minCount = c
  }
  let candidates = baseItems.filter(item => getTestedCount(item) === minCount)
  if (excludeKey && candidates.length > 1) {
    candidates = candidates.filter(item => getItemKey(item) !== excludeKey)
  }
  const idx = Math.floor(Math.random() * candidates.length)
  return candidates[idx] ?? null
}

onMounted(() => {
  const loaded = loadState()
  testedCounts.value = loaded.counts
  inProgressKey.value = loaded.inProgressKey

  let initialItem: SubjunctiveItem | null = null
  if (loaded.inProgressKey) {
    initialItem = baseItems.find(item => getItemKey(item) === loaded.inProgressKey) ?? null
  }
  if (!initialItem) {
    initialItem = pickLeastTestedItem()
  }
  if (initialItem) {
    history.value = [initialItem]
    historyIndex.value = 0
  }

  statsLoadingTimer = setTimeout(() => {
    isStatsLoading.value = false
  }, 250)
})

onUnmounted(() => {
  if (statsLoadingTimer) {
    clearTimeout(statsLoadingTimer)
  }
})

function openGoogleExamples(phrase: string) {
  if (!phrase || !import.meta.client) return
  const query = `create three Spanish example sentences using "${phrase}", each of the sentences with an English translation`
  window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
}

function handleCardClick() {
  if (!currentItem.value) return
  if (typeof window !== 'undefined' && window.getSelection()?.toString().trim()) {
    return
  }
  if (revealStep.value < 3) {
    const nextStep = (revealStep.value + 1) as 0 | 1 | 2 | 3
    revealStep.value = nextStep
    const key = getItemKey(currentItem.value)
    if (nextStep === 1 || nextStep === 2) {
      inProgressKey.value = key
      saveState()
    } else if (nextStep === 3) {
      if (!hasRecordedCurrentPresentation.value) {
        testedCounts.value = {
          ...testedCounts.value,
          [key]: (testedCounts.value[key] ?? 0) + 1
        }
        hasRecordedCurrentPresentation.value = true
      }
      inProgressKey.value = null
      saveState()
    }
  } else {
    revealStep.value = 0
  }
}

function resetPresentationState() {
  revealStep.value = 0
  hasRecordedCurrentPresentation.value = false
  if (inProgressKey.value !== null) {
    inProgressKey.value = null
    saveState()
  }
}

function nextItem() {
  if (baseItems.length === 0) return
  resetPresentationState()
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    return
  }
  const excludeKey = currentItem.value ? getItemKey(currentItem.value) : undefined
  const next = pickLeastTestedItem(excludeKey)
  if (next) {
    history.value.push(next)
    historyIndex.value = history.value.length - 1
  }
}

function prevItem() {
  if (!canGoPrev.value) return
  resetPresentationState()
  historyIndex.value--
}

function selectFromList(item: SubjunctiveItem) {
  resetPresentationState()
  if (!currentItem.value || getItemKey(currentItem.value) !== getItemKey(item)) {
    history.value = [...history.value.slice(0, historyIndex.value + 1), item]
    historyIndex.value = history.value.length - 1
  }
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
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
        <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <h1 class="text-xl sm:text-2xl font-black text-[#be185d] dark:text-[#f43f5e] tracking-tight">
            Spanish Subjunctive
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span
          class="text-xs font-mono font-bold text-gray-300 bg-gray-800/80 px-2.5 py-1.5 rounded-lg border border-gray-700 transition-all duration-300"
          :class="isStatsLoading ? 'blur-[4px] opacity-40 select-none' : ''"
        >
          {{ isStatsLoading ? `-- / ${baseItems.length} tested` : `${testedUniqueCount} / ${baseItems.length} tested` }}
        </span>
      </div>
    </div>

    <!-- Main Interactive Card -->
    <div
      v-if="currentItem"
      @click="handleCardClick"
      class="relative min-h-[280px] sm:min-h-[320px] rounded-2xl bg-[#182030] border-2 border-[#be185d]/60 hover:border-[#be185d] p-6 sm:p-10 shadow-lg flex flex-col justify-center items-center text-center cursor-pointer transition-all"
    >
      <div
        class="absolute bottom-3 right-4 text-[11px] font-mono text-gray-400/50 transition-all duration-300 pointer-events-none select-none"
        :class="isStatsLoading ? 'blur-[4px] opacity-40' : ''"
      >
        {{ isStatsLoading ? 'tested --×' : `tested ${getTestedCount(currentItem)}×` }}
      </div>

      <div class="w-full max-w-xl space-y-5">
        <!-- 1. English (always visible) -->
        <div class="space-y-1">
          <div class="text-[11px] font-mono uppercase tracking-widest text-gray-400">
            English
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white leading-snug">
            {{ currentItem.english }}
          </div>
        </div>

        <!-- 2. Spanish (revealed at step 1+) -->
        <div
          class="pt-4 border-t border-gray-700/80 space-y-1 transition-opacity duration-200"
          :class="revealStep >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'"
          :aria-hidden="revealStep < 1"
        >
          <div class="text-[11px] font-mono uppercase tracking-widest text-[#f43f5e]">
            Spanish
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white leading-snug">
            {{ currentItem.spanish }}
          </div>
        </div>

        <!-- 3. Indicative (revealed at step 2+) -->
        <div
          class="pt-4 border-t border-gray-700/80 text-left space-y-1.5 transition-opacity duration-200"
          :class="revealStep >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'"
          :aria-hidden="revealStep < 2"
        >
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
          <div class="text-base sm:text-lg font-semibold text-gray-100 bg-gray-800/80 px-3.5 py-2 rounded-lg border border-gray-700">
            {{ currentItem.indicative }}
          </div>
        </div>

        <!-- 4. Subjunctive (revealed at step 3) -->
        <div
          class="pt-2 text-left space-y-1.5 transition-opacity duration-200"
          :class="revealStep >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'"
          :aria-hidden="revealStep < 3"
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
          <div class="text-base sm:text-lg font-bold text-white bg-[#be185d]/25 px-3.5 py-2 rounded-lg border border-[#be185d]/60">
            {{ currentItem.subjunctive }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="min-h-[280px] sm:min-h-[320px] rounded-2xl bg-[#182030] border-2 border-[#be185d]/30 p-6 sm:p-10 shadow-lg"
    />

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between gap-4">
      <button
        type="button"
        @click="prevItem"
        :disabled="!canGoPrev"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-800 text-white border border-gray-700 transition-all select-none"
        :class="canGoPrev ? 'hover:bg-gray-700 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
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
        <!-- Desktop table -->
        <table class="hidden sm:table w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-700/80 bg-gray-900/50 text-[11px] font-mono uppercase tracking-wider text-gray-400">
              <th class="px-5 py-3">Spanish</th>
              <th class="px-5 py-3">English</th>
              <th class="px-5 py-3 text-right">Tested</th>
              <th class="px-5 py-3 text-right">Examples</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/80">
            <tr
              v-for="(item, idx) in orderedShowAllItems"
              :key="getItemKey(item)"
              @click="selectFromList(item)"
              class="cursor-pointer transition-colors"
              :class="idx === 0 ? 'bg-[#be185d]/20 border-l-4 border-l-[#be185d]' : 'hover:bg-gray-800/60'"
            >
              <td class="px-5 py-3 text-sm sm:text-base font-bold text-white">
                {{ item.spanish }}
              </td>
              <td class="px-5 py-3 text-sm sm:text-base text-gray-300">
                {{ item.english }}
              </td>
              <td class="px-5 py-3 text-right whitespace-nowrap">
                <span
                  class="text-xs font-mono text-gray-400/70 transition-all duration-300"
                  :class="isStatsLoading ? 'blur-[4px] opacity-40 select-none' : ''"
                >
                  {{ isStatsLoading ? '--×' : `${getTestedCount(item)}×` }}
                </span>
              </td>
              <td class="px-5 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  @click.stop="openGoogleExamples(item.spanish)"
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
            v-for="(item, idx) in orderedShowAllItems"
            :key="getItemKey(item)"
            @click="selectFromList(item)"
            class="px-4 py-3 space-y-1.5 cursor-pointer transition-colors"
            :class="idx === 0 ? 'bg-[#be185d]/20 border-l-4 border-l-[#be185d]' : 'hover:bg-gray-800/60'"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="text-sm font-bold text-white leading-snug">
                {{ item.spanish }}
              </div>
              <div class="shrink-0 flex items-center gap-2">
                <span
                  class="text-[11px] font-mono text-gray-400/70 transition-all duration-300"
                  :class="isStatsLoading ? 'blur-[4px] opacity-40 select-none' : ''"
                >
                  {{ isStatsLoading ? '--×' : `${getTestedCount(item)}×` }}
                </span>
                <button
                  type="button"
                  @click.stop="openGoogleExamples(item.spanish)"
                  title="Look up 3 examples in Google Search"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-[10px] font-mono transition-colors cursor-pointer"
                >
                  <MagnifyingGlassIcon class="w-3 h-3" />
                  <span>3 examples</span>
                </button>
              </div>
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
