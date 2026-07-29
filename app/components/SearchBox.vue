<script setup lang="ts">
defineProps<{
  modelValue: string
  stats?: {
    readyCount: number
    waitingCount: number
    totalCount?: number
    todayReviewedCount?: number
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
        class="w-full pl-10 pr-12 sm:pr-28 py-2.5 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl text-gray-950 dark:text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-0 shadow-md"
      />
      <div class="absolute left-3.5 top-3.5 text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <button 
        v-if="modelValue.length > 0"
        @click="$emit('update:modelValue', ''); $emit('search')"
        class="absolute right-[1px] top-[1px] bottom-[1px] px-4 flex items-center justify-center border-l border-gray-150 dark:border-gray-800 bg-gray-100/70 hover:bg-gray-200/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/60 text-gray-500/80 hover:text-gray-500 dark:text-gray-500/85 dark:hover:text-gray-400 transition-all cursor-pointer rounded-r-[15px]"
        aria-label="Clear search"
      >
        <!-- Mobile: Only X -->
        <span class="sm:hidden flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </span>
        <!-- Desktop: CLEAR -->
        <span class="hidden sm:flex items-center text-lg font-semibold tracking-widest -translate-y-[1.5px]" style="font-variant: all-small-caps;">
          Clear
        </span>
      </button>
    </div>

    <!-- Centered Info Text -->
    <div v-if="stats" class="mt-3.5 text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
      🎯 {{ stats.todayReviewedCount ?? 0 }} {{ (stats.todayReviewedCount === 1 ? 'card' : 'cards') }} reviewed today <span class="text-gray-300 dark:text-gray-600 px-1.5">|</span> 📁 {{ (stats.totalCount ?? 0).toLocaleString() }} {{ (stats.totalCount === 1 ? 'card' : 'cards') }} total
    </div>
  </div>
</template>
