<script setup lang="ts">
interface Tag {
  id: string
  abbreviation: string
  description?: string
  _count?: {
    flashcards: number
  }
}

interface FlashcardTag {
  tag: Tag
}

export interface Flashcard {
  id: string
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  status: string
  rank: number
  memoryHook: string | null
  tags: FlashcardTag[]
}

defineProps<{
  searchResults: Flashcard[]
  isSearchPending: boolean
  languageColors: Record<string, string>
}>()

defineEmits<{
  (e: 'select-card', card: Flashcard): void
}>()

const stripFormatting = (text: string) => text ? text.replace(/[\*<>]/g, '') : ''
</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center text-center min-h-[1.5rem] mb-4">
      <transition name="fade-header" mode="out-in">
        <p v-if="isSearchPending" key="searching" class="flex items-center justify-center gap-2 text-base font-normal text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>searching...</span>
        </p>
        <p v-else key="results" class="text-base font-normal text-gray-500 dark:text-gray-400">
          {{ searchResults.length }} flashcard{{ searchResults.length === 1 ? '' : 's' }} found
        </p>
      </transition>
    </div>

    <div class="relative max-w-xl mx-auto w-full">
      <transition-group name="list" tag="div" class="grid gap-4 grid-cols-1">
        <div 
          v-for="card in searchResults" 
          :key="card.id" 
          @click="$emit('select-card', card)"
          class="border border-gray-150 dark:border-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-shadow text-white"
          :style="{
            backgroundColor: `color-mix(in srgb, ${languageColors[card.backLanguage] || '#4f46e5'} 25%, #111827)`
          }"
        >
          <div class="space-y-1 text-sm md:text-base">
            <div class="font-normal italic text-white/50">{{ stripFormatting(card.front) }}</div>
            <div class="font-medium text-white">{{ stripFormatting(card.back) }}</div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.fade-header-enter-active,
.fade-header-leave-active {
  transition: opacity 0.2s ease;
}
.fade-header-enter-from,
.fade-header-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
