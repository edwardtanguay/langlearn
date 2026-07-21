<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

useHead({
  title: 'LangLearn - Developer Console',
  meta: [
    { name: 'description', content: 'Developer console for inspecting flashcard status, rank, and scheduling.' }
  ]
})

interface DevFlashcard {
  id: string
  status: string
  rank: number
  front: string
  frontLanguage: string
  back: string
  backLanguage: string
  pronunciation: string | null
  memoryHook: string | null
  tags: string[]
  lastTested: string | null
  nextTest: string | null
  minutesToTestAgain: number
}

const config = useRuntimeConfig()
const router = useRouter()
const showDevPage = config.public.showDevPage
const auth = useAuth()
const loggedIn = computed(() => auth?.loggedIn ?? false)

// Redirect if not enabled or not logged in
onMounted(() => {
  if (!showDevPage || !loggedIn.value) {
    navigateTo('/')
  }
})

const flashcards = ref<DevFlashcard[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const now = ref(Date.now())
let intervalId: any = null

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

async function loadData() {
  try {
    isLoading.value = true
    flashcards.value = await $fetch<DevFlashcard[]>('/api/dev/flashcards')
  } catch (err) {
    console.error('Failed to load dev cards:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (showDevPage) {
    loadData()
    intervalId = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

function formatDateTime(isoString: string | null) {
  if (!isoString) return 'Never'
  const date = new Date(isoString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function getTimeRemaining(nextTestIso: string | null, status: string, cardId: string) {
  if (status === 'LEARNED' || status === 'PARKED' || status === 'DELETED') {
    return { text: 'finished', colorClass: 'text-red-500', bgClass: '' }
  }
  
  let isDue = false;
  let type = '';
  
  if (!nextTestIso) {
    isDue = true;
    type = 'new';
  } else {
    const target = new Date(nextTestIso).getTime()
    const diffMs = target - now.value
    
    if (diffMs <= 0) {
      isDue = true;
      type = 'retest';
    } else {
      const totalSecs = Math.floor(diffMs / 1000)
      const mins = Math.floor(totalSecs / 60)
      const secs = totalSecs % 60
      return { text: `${mins}m ${secs}s`, colorClass: 'text-yellow-400', bgClass: '' }
    }
  }
  
  if (cardId === firstDueCardId.value) {
    return { text: `${type} (current)`, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-900 px-1 py-0.5 rounded' }
  } else if (cardId === secondDueCardId.value) {
    return { text: `${type} (next)`, colorClass: 'text-emerald-400', bgClass: '' }
  } else {
    return { text: type, colorClass: 'text-yellow-400', bgClass: '' }
  }
}

const filteredAndSortedCards = computed(() => {
  let cards = [...flashcards.value]
  
  // Apply search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    cards = cards.filter(c => 
      c.front.toLowerCase().includes(q) || 
      c.back.toLowerCase().includes(q) || 
      c.status.toLowerCase().includes(q)
    )
  }
  
  // Sort: LEARNING first, then rank descending, then ID ascending
  return cards.sort((a, b) => {
    const aIsLearning = a.status === 'LEARNING' ? 1 : 0
    const bIsLearning = b.status === 'LEARNING' ? 1 : 0
    if (aIsLearning !== bIsLearning) {
      return bIsLearning - aIsLearning
    }

    if (b.rank !== a.rank) {
      return b.rank - a.rank
    }
    return a.id.localeCompare(b.id)
  })
})

const firstDueCardId = computed(() => {
  const dueCard = filteredAndSortedCards.value.find(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return true
    const target = new Date(c.nextTest).getTime()
    return target <= now.value
  })
  return dueCard ? dueCard.id : null
})

const secondDueCardId = computed(() => {
  const dueCards = filteredAndSortedCards.value.filter(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return true
    const target = new Date(c.nextTest).getTime()
    return target <= now.value
  })
  return dueCards.length > 1 ? dueCards[1]?.id ?? null : null
})
const readyToTestCount = computed(() => {
  return flashcards.value.filter(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return true
    return new Date(c.nextTest).getTime() <= now.value
  }).length
})

const waitingCount = computed(() => {
  return flashcards.value.filter(c => {
    if (c.status !== 'LEARNING') return false
    if (!c.nextTest) return false
    return new Date(c.nextTest).getTime() > now.value
  }).length
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Desktop-only Check wrapper -->
    <div class="block md:hidden text-center py-12 px-6 bg-gray-900 border border-gray-800 rounded-xl shadow-xl">
      <div class="text-4xl mb-4">🖥️</div>
      <h1 class="text-xl font-bold text-white mb-2">Desktop View Required</h1>
      <p class="text-gray-400 text-sm max-w-md mx-auto">
        The Developer testing dashboard is only available on desktop-sized viewports. Please resize your browser or use a desktop device.
      </p>
    </div>

    <div class="hidden md:block">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-start gap-2.5">
          <span class="w-3 h-3 rounded-full bg-orange-500 animate-pulse mt-2 flex-shrink-0"></span>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight leading-none">
              State of flashcards
            </h1>
            <p 
              class="text-xs text-gray-400 mt-1.5 font-mono transition-opacity duration-500 ease-out min-h-[1rem]"
              :class="isLoading ? 'opacity-0' : 'opacity-100'"
            >
              {{ readyToTestCount }} to test -- {{ waitingCount }} waiting
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Filter by front, back, or status..."
            class="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gray-700 w-64 font-mono"
          />
          <button 
            @click="loadData" 
            class="bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs py-1.5 px-3 rounded font-mono transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20 font-mono text-xs text-gray-400">
        Loading dev console data...
      </div>

      <!-- Table View (Minimal height single-row layout) -->
      <div v-else class="bg-gray-950/80 border border-gray-800/60 rounded-lg overflow-hidden shadow-2xl backdrop-blur">
        <div class="max-h-[70vh] overflow-y-auto">
          <table class="w-full text-left border-collapse table-fixed text-[11px] font-mono leading-tight">
            <thead>
              <tr class="border-b border-gray-800 bg-gray-900/60 text-gray-400 font-bold sticky top-0 z-10 whitespace-nowrap">
                <th class="py-1.5 px-2 w-[18%] text-left truncate">CARD</th>
                <th class="py-1.5 px-2 w-[8%] text-left truncate">STATUS</th>
                <th class="py-1.5 px-2 w-[8%] text-right truncate">RANK</th>
                <th class="py-1.5 px-2 w-[13%] text-left truncate">LAST TESTED</th>
                <th class="py-1.5 px-2 w-[15%] text-center truncate">TESTING STATUS</th>
                <th class="py-1.5 px-2 w-[10%] text-left truncate">PRON.</th>
                <th class="py-1.5 px-2 w-[10%] text-left truncate">HOOK</th>
                <th class="py-1.5 px-2 w-[10%] text-left truncate">TAGS</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(card, index) in filteredAndSortedCards" 
                :key="card.id"
                class="border-b border-gray-900/40 hover:bg-gray-900/60 transition-colors"
              >
                <!-- CARD (Label + Front) -->
                <td class="py-1.5 px-2 truncate" :title="card.front + '\n' + card.back">
                  <span 
                    class="px-1 py-[1px] rounded text-[9px] font-bold mr-1.5"
                    :style="{ backgroundColor: languageColors[card.backLanguage] || '#4b5563', color: '#ffffff' }"
                  >
                    {{ card.backLanguage.toUpperCase() }}
                  </span>
                  <span class="text-white">{{ card.front }}</span>
                </td>
                
                <!-- STATUS -->
                <td class="py-1.5 px-2 truncate">
                  <span 
                    class="px-1 py-[1px] rounded text-[9px] font-bold"
                    :class="{
                      'bg-gray-800 text-gray-400 border border-gray-700': card.status === 'LEARNED' || card.status === 'PARKED' || card.status === 'DELETED',
                      'bg-amber-950/40 text-amber-400 border border-amber-800/40': card.status === 'LEARNING'
                    }"
                  >
                    {{ card.status }}
                  </span>
                </td>
                
                <!-- RANK -->
                <td class="py-1.5 px-2 text-right text-gray-300 font-bold truncate">
                  {{ card.rank.toFixed(5) }}
                </td>

                <!-- LAST TESTED -->
                <td class="py-1.5 px-2 text-gray-400 truncate">
                  {{ formatDateTime(card.lastTested) }}
                </td>

                <!-- TESTING STATUS -->
                <td class="py-1.5 px-2 text-center truncate">
                  <span 
                    class="font-bold inline-block"
                    :class="[getTimeRemaining(card.nextTest, card.status, card.id).colorClass, getTimeRemaining(card.nextTest, card.status, card.id).bgClass]"
                  >
                    {{ getTimeRemaining(card.nextTest, card.status, card.id).text }}
                  </span>
                </td>

                <!-- PRONUNCIATION -->
                <td class="py-1.5 px-2 text-gray-400 truncate" :title="card.pronunciation || ''">
                  {{ card.pronunciation || '-' }}
                </td>

                <!-- MEMORY HOOK -->
                <td class="py-1.5 px-2 text-gray-400 truncate" :title="card.memoryHook || ''">
                  {{ card.memoryHook || '-' }}
                </td>

                <!-- TAGS -->
                <td class="py-1.5 px-2">
                  <div class="flex flex-wrap gap-1" style="max-height: 1.5em; overflow: hidden;" :title="card.tags.join(', ')">
                    <span 
                      v-for="tag in card.tags" 
                      :key="tag"
                      class="px-1 py-[1px] rounded bg-gray-800 text-gray-300 text-[9px]"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="!card.tags || card.tags.length === 0" class="text-gray-500">-</span>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="filteredAndSortedCards.length === 0">
                <td colspan="9" class="p-8 text-center text-gray-500">
                  No flashcards found matching filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="p-3 bg-gray-900/40 border-t border-gray-900 text-[10px] text-gray-500 flex justify-between">
          <span>Total cards listed: {{ filteredAndSortedCards.length }}</span>
          <span>Sorting order: Rank descending, then ID ascending</span>
        </div>
      </div>
    </div>
  </div>
</template>
