<script setup lang="ts">
import { ref, onMounted } from 'vue'

useHead({
  title: 'LangLearn - Learn à/de',
  meta: [
    { name: 'description', content: 'Master French prepositions à and de with flashcard phrases.' }
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

const isLoading = ref(true)
const aCards = ref<Flashcard[]>([])
const deCards = ref<Flashcard[]>([])
const revealedCardIds = ref<Record<string, boolean>>({})

async function loadData() {
  isLoading.value = true
  try {
    const [aRes, deRes] = await Promise.all([
      $fetch<Flashcard[]>('/api/flashcards?tag=à&limit=100'),
      $fetch<Flashcard[]>('/api/flashcards?tag=de&limit=100')
    ])

    aCards.value = aRes || []
    deCards.value = deRes || []
  } catch (err) {
    console.error('Failed to load learn à/de cards:', err)
  } finally {
    isLoading.value = false
  }
}

function toggleReveal(id: string) {
  revealedCardIds.value[id] = !revealedCardIds.value[id]
}

function renderHighlights(text: string): string {
  if (!text) return ''
  return text.replace(/\*(.*?)\*/g, '$1')
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-10">
    <div class="flex items-center gap-3">
      <NuxtLink to="/activities" class="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        ← Back to Activities
      </NuxtLink>
    </div>

    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Learn à / de</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
        Study flashcard phrases grouped by "à" and "de" prepositions. Click a card to toggle French translation, or click the diagonal arrow to edit the card.
      </p>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
      Loading à/de flashcards...
    </div>

    <div v-else class="space-y-10">
      <!-- Group 1: Phrases with à -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          <span class="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/30 text-sm font-bold">à</span>
          <span>Phrases with à</span>
          <span class="text-xs text-gray-400 font-normal">({{ aCards.length }} cards)</span>
        </h2>

        <div v-if="aCards.length === 0" class="text-sm text-gray-400 italic py-4">
          No flashcards currently tagged with "à".
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="card in aCards"
            :key="card.id"
            @click="toggleReveal(card.id)"
            class="p-4 rounded-xl bg-white dark:bg-[#182030] border border-gray-300 dark:border-gray-700/80 hover:border-blue-500/50 shadow-xs cursor-pointer transition-all space-y-2 relative group"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">English</span>
              <NuxtLink
                :to="'/flashcard/' + card.id + '?fromActivity=learn-a-de'"
                @click.stop
                class="text-gray-400 hover:text-blue-500 transition-colors p-1"
                title="Edit Flashcard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </NuxtLink>
            </div>

            <p class="text-sm font-bold text-gray-900 dark:text-white">
              {{ card.front }}
            </p>

            <Transition name="fade">
              <div v-if="revealedCardIds[card.id]" class="pt-2 border-t border-gray-100 dark:border-gray-800/80">
                <span class="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mb-0.5">French</span>
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-300" v-html="renderHighlights(card.back)"></p>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Group 2: Phrases with de -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          <span class="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-sm font-bold">de</span>
          <span>Phrases with de</span>
          <span class="text-xs text-gray-400 font-normal">({{ deCards.length }} cards)</span>
        </h2>

        <div v-if="deCards.length === 0" class="text-sm text-gray-400 italic py-4">
          No flashcards currently tagged with "de".
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="card in deCards"
            :key="card.id"
            @click="toggleReveal(card.id)"
            class="p-4 rounded-xl bg-white dark:bg-[#182030] border border-gray-300 dark:border-gray-700/80 hover:border-amber-500/50 shadow-xs cursor-pointer transition-all space-y-2 relative group"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">English</span>
              <NuxtLink
                :to="'/flashcard/' + card.id + '?fromActivity=learn-a-de'"
                @click.stop
                class="text-gray-400 hover:text-amber-500 transition-colors p-1"
                title="Edit Flashcard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </NuxtLink>
            </div>

            <p class="text-sm font-bold text-gray-900 dark:text-white">
              {{ card.front }}
            </p>

            <Transition name="fade">
              <div v-if="revealedCardIds[card.id]" class="pt-2 border-t border-gray-100 dark:border-gray-800/80">
                <span class="text-[10px] font-semibold text-amber-500 uppercase tracking-wider block mb-0.5">French</span>
                <p class="text-sm font-semibold text-amber-600 dark:text-amber-300" v-html="renderHighlights(card.back)"></p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
