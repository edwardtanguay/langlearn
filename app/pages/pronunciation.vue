<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { SpeakerWaveIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Pronunciation Practice',
  meta: [
    { name: 'description', content: 'Practice pronunciation with audio links for flashcards.' }
  ]
})

const config = useRuntimeConfig()
const isBypass = config.public.bypassAuth
const auth = !isBypass ? useAuth() : null
const loggedIn = computed(() => isBypass ? true : (auth?.loggedIn ?? false))

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
  updatedAt?: string
  createdAt?: string
  tags?: { tag: Tag }[]
}

const languageNames: Record<string, string> = {
  fr: 'FRENCH',
  es: 'SPANISH',
  it: 'ITALIAN',
  nl: 'DUTCH',
  pl: 'POLISH',
  de: 'GERMAN',
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

const cards = ref<Flashcard[]>([])
const isLoading = ref(true)
const searchQuery = ref('')

// Three-way toggle state dictionary: 0 = English (front), 1 = Target Language (back), 2 = Pronunciation
const toggleStateMap = ref<Record<string, number>>({})

function stripAsterisks(text: string): string {
  return text ? text.replace(/\*/g, '') : ''
}

const fetchCardsWithPronunciation = async () => {
  if (!loggedIn.value) return
  isLoading.value = true
  try {
    const data = await $fetch<Flashcard[]>('/api/flashcards?all=true')
    const valid = (data || []).filter(c => 
      c.pronunciation && 
      c.pronunciation.trim().length > 0 &&
      !c.tags?.some(t => t.tag.abbreviation === 'fix')
    )
    // Order "last touched first" (updatedAt desc)
    cards.value = valid.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return timeB - timeA
    })
  } catch (err) {
    console.error('Failed to load cards for pronunciation:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCardsWithPronunciation()
})

const filteredCards = computed(() => {
  if (!searchQuery.value.trim()) return cards.value
  const q = searchQuery.value.toLowerCase().trim()
  return cards.value.filter(c => 
    c.front.toLowerCase().includes(q) ||
    stripAsterisks(c.back).toLowerCase().includes(q) ||
    (c.pronunciation && c.pronunciation.toLowerCase().includes(q))
  )
})

// Cycle interaction: (0: English) -> (1: Target Language) -> (2: Pronunciation) -> (0: English)
const cycleToggleState = (id: string) => {
  const current = toggleStateMap.value[id] ?? 0
  const next = (current + 1) % 3
  toggleStateMap.value = {
    ...toggleStateMap.value,
    [id]: next
  }
}

const getCardToggleState = (id: string): number => {
  return toggleStateMap.value[id] ?? 0
}

const openTestCard = (card: Flashcard, event: MouseEvent) => {
  event.stopPropagation()
  navigateTo(`/flashcard/${card.id}`)
}

const openTranslate = (card: Flashcard, event: MouseEvent) => {
  event.stopPropagation()
  const cleanBack = stripAsterisks(card.back)
  const url = `https://translate.google.com/?sl=${card.backLanguage || 'auto'}&tl=${card.frontLanguage || 'en'}&text=${encodeURIComponent(cleanBack)}&op=translate`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
          <SpeakerWaveIcon class="w-7 h-7 text-indigo-500" />
          <span>Pronunciation</span>
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          3-way toggle practice for cards with phonetic pronunciations.
        </p>
      </div>

      <!-- Search input -->
      <div class="relative w-full md:w-72">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Filter pronunciation cards…" 
          class="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <MagnifyingGlassIcon class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
      </div>
    </div>

    <!-- Helpful Resources Section -->
    <div class="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-2">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Helpful Resources</h2>
      <ul class="list-disc list-inside text-sm space-y-1">
        <li class="flex items-center gap-2 flex-wrap text-gray-800 dark:text-gray-200">
          <span 
            class="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider bg-[#333388]"
          >
            FR
          </span>
          <a 
            href="https://www.youtube.com/watch?v=Bmxdtrv4uQM" 
            target="_blank" 
            rel="noopener noreferrer"
            class="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
          >
            conseils pour améliorer la prononciation du français
          </a>
          <span class="text-xs text-gray-500 dark:text-gray-400"> — 30 minutes avec des conseils sur les liaisons, etc.</span>
        </li>
      </ul>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
      Loading pronunciation cards…
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredCards.length === 0" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
      No cards found with pronunciation.
    </div>

    <!-- Cards List with Three-Way Toggle -->
    <div v-else class="space-y-3">
      <div 
        v-for="card in filteredCards" 
        :key="card.id"
        @click="cycleToggleState(card.id)"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-150 shadow-xs select-none space-y-2"
      >
        <!-- Line 1: Target language badge (e.g. FR instead of EN) & Card Front text / Permalink Link -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <!-- Show BACK language initials (e.g. FR) on card front badge -->
            <span 
              class="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider shrink-0"
              :style="{ backgroundColor: languageColors[card.backLanguage] || '#333388' }"
            >
              {{ card.backLanguage?.toUpperCase() || 'FR' }}
            </span>
            <!-- Card Front / Title Link -->
            <NuxtLink
              :to="`/flashcard/${card.id}`"
              @click.stop
              class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate flex items-center gap-1.5 transition-colors"
              title="Click to view and edit card permalink"
            >
              <span>{{ card.front }}</span>
              <ArrowTopRightOnSquareIcon class="w-4 h-4 text-gray-400 hover:text-indigo-500 inline-block shrink-0" />
            </NuxtLink>
          </div>

          <!-- Step Indicator -->
          <div class="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 shrink-0 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <span v-if="getCardToggleState(card.id) === 0">1. English</span>
            <span v-else-if="getCardToggleState(card.id) === 1">2. Target Text</span>
            <span v-else>3. Pronunciation</span>
          </div>
        </div>

        <!-- 3-Way Toggle State 1: Show Target Language Text -->
        <Transition name="fade-layout">
          <div 
            v-if="getCardToggleState(card.id) >= 1" 
            class="pt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/80 flex items-center justify-between text-sm"
          >
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ stripAsterisks(card.back) }}
            </span>

            <div class="flex items-center gap-2 shrink-0">
              <button 
                @click="openTranslate(card, $event)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <SpeakerWaveIcon class="w-3.5 h-3.5 text-indigo-500" />
                <span>Audio</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- 3-Way Toggle State 2: Show Pronunciation Text -->
        <Transition name="fade-layout">
          <div 
            v-if="getCardToggleState(card.id) === 2 && card.pronunciation" 
            class="px-3 py-2 bg-indigo-50/90 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 font-mono font-semibold animate-pulse tracking-wide"
          >
            <span class="text-indigo-400 mr-1.5">[</span>{{ card.pronunciation }}<span class="text-indigo-400 ml-1.5">]</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-layout-enter-active,
.fade-layout-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-layout-enter-from,
.fade-layout-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
