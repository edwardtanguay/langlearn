<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  phrase?: string
}>(), {
  phrase: ''
})

const emit = defineEmits<{
  (e: 'action', actionTaken: string, newStatus?: string): void
  (e: 'update-phrase', newPhrase: string): void
}>()

const isHighlighting = ref(false)
const highlightContainerRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (isHighlighting.value && highlightContainerRef.value && !highlightContainerRef.value.contains(event.target as Node)) {
    isHighlighting.value = false
  }
}

watch(isHighlighting, (val) => {
  if (val) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Reset highlighting state when card phrase changes (e.g. navigation)
watch(() => props.phrase, (newVal, oldVal) => {
  // If base text stripped of asterisks changed, reset to default view
  const cleanNew = (newVal || '').replace(/\*/g, '').trim()
  const cleanOld = (oldVal || '').replace(/\*/g, '').trim()
  if (cleanNew !== cleanOld) {
    isHighlighting.value = false
  }
})

const wordsList = computed(() => {
  if (!props.phrase) return []
  return props.phrase.trim().split(/\s+/).filter(w => w.length > 0)
})

function isWordStarred(word: string): boolean {
  if (!word) return false
  return word.startsWith('*') && word.endsWith('*') && word.length >= 2
}

function toggleWordAt(index: number) {
  const words = [...wordsList.value]
  if (index < 0 || index >= words.length) return

  const current = words[index]!
  if (isWordStarred(current)) {
    // Unstar
    words[index] = current.replace(/^\*+|\*+$/g, '')
  } else {
    // Star
    const clean = current.replace(/^\*+|\*+$/g, '')
    words[index] = `*${clean}*`
  }

  const updatedPhrase = words.join(' ')
  emit('update-phrase', updatedPhrase)
}
</script>

<template>
  <div class="space-y-2">
    <!-- Top row: Learned & Keep Testing in their own dark cell -->
    <div class="bg-gray-50 dark:bg-gray-950 p-2 sm:p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/60 flex gap-2">
      <button @click="$emit('action', 'MARKED_AS_LEARNED', 'LEARNED')"
        class="flex-1 py-2 sm:py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition-all cursor-pointer">
        Learned
      </button>
      <button @click="$emit('action', 'MARKED_AS_KEEP_TESTING')"
        class="flex-1 py-2 sm:py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl transition-all cursor-pointer">
        Keep Testing
      </button>
    </div>

    <!-- Second row: Park, Delete, Highlight words in their own separate dark cell -->
    <div class="bg-gray-50 dark:bg-gray-950 p-2 sm:p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/60">
      <!-- Normal second row: Park, Delete, Highlight words -->
      <div v-if="!isHighlighting" class="flex justify-center items-center gap-2 flex-wrap">
        <button @click="$emit('action', 'MARKED_AS_PARKED', 'PARKED')"
          class="px-5 sm:px-6 py-1.5 sm:py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-xl transition-all cursor-pointer">
          Park
        </button>
        <button @click="$emit('action', 'MARKED_AS_DELETED', 'DELETED')"
          class="px-5 sm:px-6 py-1.5 sm:py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-xl transition-all cursor-pointer">
          Delete
        </button>
        <button @click="isHighlighting = true"
          class="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200/50 dark:bg-gray-900 dark:hover:bg-gray-800/60 text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-gray-750 text-[10px] font-bold rounded-xl transition-all shadow-xs cursor-pointer">
          Highlight words
        </button>
      </div>

      <!-- Highlight words replacement row: 1, 2, 3... [back icon] -->
      <div ref="highlightContainerRef" v-else class="flex justify-center items-center gap-1.5 flex-wrap py-0.5">
        <button
          v-for="(word, idx) in wordsList"
          :key="idx"
          type="button"
          @click="toggleWordAt(idx)"
          class="min-w-[28px] h-7 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-xs"
          :class="isWordStarred(word)
            ? 'bg-white dark:bg-white text-gray-950 dark:text-gray-950 border-gray-400 dark:border-white shadow-md ring-2 ring-gray-900/10 font-black'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >
          {{ idx + 1 }}
        </button>
        <button
          type="button"
          @click="isHighlighting = false"
          class="h-7 w-7 flex items-center justify-center rounded-lg border-0 bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-800/80 transition-all cursor-pointer"
          title="Done / Go back"
        >
          <!-- Return / Go back icon -->
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
