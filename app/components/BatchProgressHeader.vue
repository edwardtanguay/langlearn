<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  learnedCount: number
  totalInBatch: number
  isBatchComplete?: boolean
}>()

const percent = computed(() => {
  if (!props.totalInBatch || props.totalInBatch <= 0) return 0
  return Math.min(100, Math.round((props.learnedCount / props.totalInBatch) * 100))
})
</script>

<template>
  <div class="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-3 shadow-xs transition-all">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Batch Progress</span>
        <span
          class="text-xs font-semibold px-2 py-0.5 rounded-full"
          :class="isBatchComplete ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'"
        >
          {{ learnedCount }} / {{ totalInBatch }} Learned
        </span>
      </div>
      <div class="text-xs font-medium text-gray-400 dark:text-gray-500">
        {{ percent }}%
      </div>
    </div>

    <!-- Individual dots for batch size up to 20 -->
    <div v-if="totalInBatch <= 20 && totalInBatch > 0" class="flex items-center gap-1.5 w-full">
      <div
        v-for="index in totalInBatch"
        :key="index"
        class="h-2 flex-1 rounded-full transition-all duration-300"
        :class="[
          index <= learnedCount
            ? 'bg-emerald-500 dark:bg-emerald-400 shadow-xs'
            : (index === learnedCount + 1 && !isBatchComplete)
              ? 'bg-indigo-400 dark:bg-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900/60'
              : 'bg-gray-200 dark:bg-gray-800'
        ]"
        :title="`Card ${index} ${index <= learnedCount ? '(Learned)' : ''}`"
      />
    </div>

    <!-- Progress bar fallback for large batch sizes -->
    <div v-else-if="totalInBatch > 0" class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
      <div
        class="bg-emerald-500 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
