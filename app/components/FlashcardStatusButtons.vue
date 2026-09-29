<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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
  <div class="bg-gray-50 dark:bg-gray-950 p-2 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 space-y-1.5 sm:space-y-2">
    <!-- Top row: Learned & Keep Testing -->
    <div class="flex gap-2">
      <button @click="$emit('action', 'MARKED_AS_LEARNED', 'LEARNED')"
        class="flex-1 py-2 sm:py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition-all cursor-pointer">
        Learned
      </button>
      <button @click="$emit('action', 'MARKED_AS_KEEP_TESTING')"
        class="flex-1 py-2 sm:py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl transition-all cursor-pointer">
        Keep Testing
      </button>
    </div>

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
        class="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-[10px] font-bold rounded-xl transition-all shadow-xs cursor-pointer">
        Highlight words
      </button>
    </div>

    <!-- Highlight words replacement row: 1, 2, 3... ok -->
    <div v-else class="flex justify-center items-center gap-1.5 flex-wrap py-0.5">
      <button
        v-for="(word, idx) in wordsList"
        :key="idx"
        type="button"
        @click="toggleWordAt(idx)"
        class="min-w-[28px] h-7 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-xs"
        :class="isWordStarred(word)
          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-300 ring-1 ring-amber-400'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
      >
        {{ idx + 1 }}
      </button>
      <button
        type="button"
        @click="isHighlighting = false"
        class="h-7 px-3 text-xs font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer uppercase shadow-xs"
      >
        ok
      </button>
    </div>
  </div>
</template>
