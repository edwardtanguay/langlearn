<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Tag {
  id: string
  abbreviation: string
}
interface FlashcardTag { tag: Tag }
interface Flashcard { tags: FlashcardTag[] }

const props = defineProps<{
  allTags: Tag[]
  currentCard: Flashcard
  savingFields: Record<string, boolean>
}>()

const isAddingTag = defineModel<boolean>('isAddingTag', { required: true })
const newTagValue = defineModel<string>('newTagValue', { required: true })

const emit = defineEmits<{
  (e: 'toggle-tag', tagAbbreviation: string): void
  (e: 'submit-new-tag'): void
}>()

function hasTag(abbreviation: string) {
  return props.currentCard.tags.some(t => t.tag.abbreviation === abbreviation)
}

const newTagInputEl = ref<HTMLInputElement | null>(null)

watch(isAddingTag, async (val) => {
  if (val) {
    await nextTick()
    newTagInputEl.value?.focus()
  }
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl border border-gray-100 dark:border-gray-800/60">
    <div class="flex flex-wrap gap-2 items-center justify-center">
      <button
        v-for="tag in allTags"
        :key="tag.id"
        @click.stop="$emit('toggle-tag', tag.abbreviation)"
        :class="[
          'text-[10px] px-2 py-1 rounded-lg border font-bold transition-all duration-150 uppercase tracking-wide',
          hasTag(tag.abbreviation)
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
            : 'bg-transparent text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100'
        ]"
      >{{ tag.abbreviation }}</button>

      <!-- + tag button / input -->
      <button v-if="!isAddingTag" @click.stop="isAddingTag = true"
        class="text-[10px] px-2 py-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 transition-all font-bold uppercase tracking-wide">
        +tag
      </button>
      <input v-else
        ref="newTagInputEl"
        v-model="newTagValue"
        @keydown.enter.stop.prevent="$emit('submit-new-tag')"
        @blur="$emit('submit-new-tag')"
        @keydown.escape.stop.prevent="isAddingTag = false; newTagValue = ''"
        placeholder="tag name…"
        class="text-[10px] px-2 py-1 w-20 rounded-lg border border-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-400 font-bold uppercase"
      />
      <div v-if="savingFields['tags']" class="animate-spin rounded-full h-3 w-3 border-2 border-indigo-500 border-t-transparent"></div>
    </div>
  </div>
</template>
