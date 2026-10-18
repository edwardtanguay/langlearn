<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  modelValue: string
  stats?: {
    readyCount: number
    waitingCount: number
    totalCount?: number
    todayReviewedCount?: number
    todayImportedCount?: number
  } | null
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-[50px]">
    <div class="relative w-full max-w-lg">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value); $emit('search')"
        type="text" 
        placeholder="Search all flashcards..." 
        class="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl text-gray-950 dark:text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-0 shadow-md"
      />
      <div class="absolute left-3.5 top-3.5 text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <button 
        v-if="modelValue.length > 0"
        type="button"
        @click="$emit('update:modelValue', ''); $emit('search')"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer rounded-full"
        aria-label="Clear search"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
