<script setup lang="ts">
import { computed } from 'vue'

export interface BatchSlot {
  id: string
  slotIndex: number
  unsuccessfulCount: number
  status: 'untested' | 'testing' | 'learned' | 'parked' | 'deleted'
}

const props = defineProps<{
  slots: BatchSlot[]
  activeCardId?: string | null
  isBatchComplete?: boolean
}>()

const totalCount = computed(() => props.slots.length)
const testedCount = computed(() => props.slots.filter(s => s.status !== 'untested').length)
const learnedCount = computed(() => props.slots.filter(s => s.status === 'learned').length)

const percent = computed(() => {
  if (totalCount.value <= 0) return 0
  return Math.min(100, Math.round((learnedCount.value / totalCount.value) * 100))
})
</script>

<template>
  <div class="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-3 shadow-xs transition-all">
    <!-- Header Summary Row -->
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Batch</span>
        
        <!-- Tested Badge -->
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          Tested: {{ testedCount }} / {{ totalCount }}
        </span>

        <!-- Learned Badge -->
        <span
          class="text-xs font-semibold px-2 py-0.5 rounded-full transition-colors"
          :class="isBatchComplete 
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'"
        >
          Learned: {{ learnedCount }} / {{ totalCount }}
        </span>
      </div>

      <div class="text-xs font-bold text-gray-400 dark:text-gray-500 font-mono">
        {{ percent }}%
      </div>
    </div>

    <!-- Capsule Pills Row -->
    <div v-if="slots.length > 0" class="flex items-start gap-1 sm:gap-1.5 w-full">
      <div
        v-for="slot in slots"
        :key="slot.id"
        class="flex-1 min-w-0 flex flex-col items-center"
      >
        <!-- The Pill Capsule -->
        <div
          class="w-full h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 select-none cursor-default"
          :class="[
            slot.id === activeCardId && !isBatchComplete
              ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-md scale-105 z-10'
              : 'border',
            slot.status === 'learned'
              ? 'bg-emerald-500 dark:bg-emerald-600 text-white border-emerald-500 dark:border-emerald-600 shadow-xs'
              : slot.status === 'parked'
                ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 opacity-60'
                : slot.status === 'deleted'
                  ? 'bg-gray-200 dark:bg-gray-850 text-red-500 dark:text-red-400 border-red-200/50 dark:border-red-900/40 opacity-50'
                  : slot.unsuccessfulCount > 0
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/80 font-mono'
                    : 'bg-gray-50/80 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 border-dashed border-gray-300 dark:border-gray-700'
          ]"
          :title="`Card ${slot.slotIndex + 1}: ${
            slot.status === 'learned' 
              ? 'Learned' 
              : slot.status === 'parked' 
                ? 'Parked (disabled)' 
                : slot.status === 'deleted' 
                  ? 'Deleted' 
                  : slot.unsuccessfulCount > 0 
                    ? `Tested ${slot.unsuccessfulCount} time${slot.unsuccessfulCount > 1 ? 's' : ''} (take again)` 
                    : 'Not yet tested'
          }`"
        >
          <!-- Learned State: Bold checkmark -->
          <svg v-if="slot.status === 'learned'" class="w-4 h-4 text-white stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>

          <!-- Parked State -->
          <span v-else-if="slot.status === 'parked'" class="text-[11px] leading-none text-gray-400 dark:text-gray-500">⏸</span>

          <!-- Deleted State -->
          <span v-else-if="slot.status === 'deleted'" class="text-[11px] leading-none font-bold text-red-500 dark:text-red-400">✕</span>

          <!-- Unsuccessful fail count (warning orange) -->
          <span v-else-if="slot.unsuccessfulCount > 0" class="text-xs font-mono font-bold leading-none text-amber-700 dark:text-amber-400">
            {{ slot.unsuccessfulCount }}
          </span>

          <!-- Untested State: Subtle slot number -->
          <span v-else class="text-[10px] font-normal text-gray-400 dark:text-gray-500 leading-none">
            {{ slot.slotIndex + 1 }}
          </span>
        </div>

        <!-- Upward Arrow Pointer underneath active pill -->
        <div class="h-3.5 flex items-center justify-center mt-1">
          <svg
            v-if="slot.id === activeCardId && !isBatchComplete"
            class="w-3 h-3 text-indigo-600 dark:text-indigo-400 animate-pulse drop-shadow-xs"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
          </svg>
          <div v-else class="w-3 h-3 invisible" />
        </div>
      </div>
    </div>
  </div>
</template>
