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
  nl: '#facc15',
  pl: '#b8b8b8',
  de: '#3d1e03',
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

// Toggle Level 1: If level 2 or 3 are visible (> 0), collapse to 0; otherwise expand to show level 2 (1)
const toggleLevel1 = (id: string) => {
  const current = toggleStateMap.value[id] ?? 0
  const next = current > 0 ? 0 : 1
  toggleStateMap.value = {
    ...toggleStateMap.value,
    [id]: next
  }
}

// Toggle Level 2: If level 3 is visible (=== 2), collapse back to level 2 (1); otherwise reveal level 3 (2)
const toggleLevel2 = (id: string) => {
  const current = toggleStateMap.value[id] ?? 0
  const next = current === 2 ? 1 : 2
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

const openVousToTuSearchForCard = (card: Flashcard) => {
  const cleanBack = stripAsterisks(card.back)
  const query = `convert "vous" to "tu" for the following French phrase: "${cleanBack}"`
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
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
    <div class="bg-[#111827] dark:bg-[#0d1117] border border-gray-300 dark:border-gray-800 rounded-2xl p-4 space-y-2">
      <h2 class="text-[11px] text-gray-500 dark:text-gray-400 opacity-50 [font-variant:small-caps] tracking-widest font-semibold">Helpful Resources</h2>
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
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-150 shadow-xs select-none space-y-2"
      >
        <!-- Level 1 (Front/English): Clicking here shows/hides levels 2 & 3 -->
        <div 
          @click="toggleLevel1(card.id)"
          class="flex items-start justify-between gap-3 cursor-pointer"
        >
          <!-- Show BACK language initials (e.g. FR) on card front badge -->
          <span 
            class="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider shrink-0 mt-0.5"
            :style="{ backgroundColor: languageColors[card.backLanguage] || '#333388' }"
          >
            {{ card.backLanguage?.toUpperCase() || 'FR' }}
          </span>

          <!-- Card Front / Title text with wrapping -->
          <span class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-1 break-words">
            {{ card.front }}
          </span>

          <!-- Permalink Icon at far right -->
          <NuxtLink
            :to="`/flashcard/${card.id}`"
            @click.stop
            class="text-gray-400 hover:text-indigo-500 transition-colors shrink-0 self-start p-0.5"
            title="Click to view and edit card permalink"
          >
            <ArrowTopRightOnSquareIcon class="w-5 h-5" />
          </NuxtLink>
        </div>

        <!-- Level 2: Target Language Text. Clicking here shows/hides level 3 -->
        <div 
          v-if="getCardToggleState(card.id) >= 1" 
          @click="toggleLevel2(card.id)"
          class="pt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/80 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer flex flex-col gap-2"
        >
          <div>
            {{ stripAsterisks(card.back) }}
          </div>

          <!-- Convert vous to tu Button on Level 2 if French card contains "vous" in back text -->
          <div v-if="card.backLanguage === 'fr' && /\bvous\b/i.test(card.back)" class="pt-1">
            <button
              @click.stop="openVousToTuSearchForCard(card)"
              class="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
              title="Search Google on converting vous to tu for this phrase"
            >
              <span>convert vous to tu</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Level 3: Pronunciation & Audio button. NON-TOGGLING (click.stop) -->
        <div 
          v-if="getCardToggleState(card.id) === 2 && card.pronunciation" 
          @click.stop
          class="px-3 py-2 bg-indigo-50/90 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 font-mono font-semibold tracking-wide flex items-center justify-between cursor-default"
        >
          <div>
            <span class="text-indigo-400 mr-1.5">[</span>{{ card.pronunciation }}<span class="text-indigo-400 ml-1.5">]</span>
          </div>

          <!-- Audio Button on Level 3 -->
          <button 
            @click="openTranslate(card, $event)"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer shrink-0"
          >
            <SpeakerWaveIcon class="w-3.5 h-3.5 text-indigo-500" />
            <span>Audio</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
