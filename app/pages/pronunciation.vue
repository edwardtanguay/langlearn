<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { SpeakerWaveIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

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
const expandedCardIds = ref<Set<string>>(new Set())

function stripAsterisks(text: string): string {
  return text ? text.replace(/\*/g, '') : ''
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
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
    cards.value = shuffle(valid)
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

const toggleCard = (id: string) => {
  if (expandedCardIds.value.has(id)) {
    expandedCardIds.value.delete(id)
  } else {
    expandedCardIds.value.add(id)
  }
}

const handleFixCard = async (card: Flashcard, event: MouseEvent) => {
  event.stopPropagation()
  const originalCards = [...cards.value]
  // Optimistically remove card
  cards.value = cards.value.filter(c => c.id !== card.id)
  expandedCardIds.value.delete(card.id)

  try {
    const existingTags = card.tags ? card.tags.map(t => t.tag.abbreviation) : []
    if (!existingTags.includes('fix')) {
      existingTags.push('fix')
    }
    await $fetch(`/api/flashcards/${card.id}/tags`, {
      method: 'POST',
      body: { tags: existingTags }
    })
  } catch (err) {
    console.error('Failed to mark card with fix tag:', err)
    cards.value = originalCards
  }
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
          Simple toggle practice for cards with phonetic pronunciations.
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

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
      Loading pronunciation cards…
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredCards.length === 0" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
      No cards found with pronunciation.
    </div>

    <!-- Cards List -->
    <div v-else class="space-y-3">
      <div 
        v-for="card in filteredCards" 
        :key="card.id"
        @click="toggleCard(card.id)"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-150 shadow-xs select-none"
      >
        <!-- Line 1: Front text & language badge -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span 
              class="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider shrink-0"
              :style="{ backgroundColor: languageColors[card.frontLanguage] || '#4f46e5' }"
            >
              {{ card.frontLanguage }}
            </span>
            <span class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ card.front }}
            </span>
          </div>

          <div class="text-gray-400 shrink-0">
            <ChevronUpIcon v-if="expandedCardIds.has(card.id)" class="w-5 h-5" />
            <ChevronDownIcon v-else class="w-5 h-5" />
          </div>
        </div>

        <!-- Line 2: Pop-in Back Text, Pronunciation & Action Buttons -->
        <Transition name="fade-layout">
          <div 
            v-if="expandedCardIds.has(card.id)" 
            class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider shrink-0"
                  :style="{ backgroundColor: languageColors[card.backLanguage] || '#333388' }"
                >
                  {{ card.backLanguage }}
                </span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ stripAsterisks(card.back) }}
                </span>
              </div>

              <!-- Pronunciation -->
              <div 
                v-if="card.pronunciation" 
                class="text-xs text-indigo-600 dark:text-indigo-400 font-mono pl-0.5"
              >
                [{{ card.pronunciation }}]
              </div>
            </div>

            <!-- Action Buttons: Fix & Google Translate -->
            <div class="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <button 
                @click="handleFixCard(card, $event)"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
                title="Add fix tag and remove card from pronunciation practice list"
              >
                <span>Fix</span>
              </button>
              <button 
                @click="openTranslate(card, $event)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <SpeakerWaveIcon class="w-4 h-4 text-indigo-500" />
                <span>Google Translate</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
