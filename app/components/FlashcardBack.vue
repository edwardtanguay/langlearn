<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Tag {
  id: string
  abbreviation: string
  description?: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  status: string
  rank: number
  memoryHook: string | null
  tags: { tag: Tag }[]
}

const props = defineProps<{
  currentCard: Flashcard
  languageNames: Record<string, string>
  languageColors: Record<string, string>
  isFlipped: boolean
  isEditing: boolean
  isSavingEdit: boolean
}>()

const editFront = defineModel<string>('editFront', { required: true })
const editBack = defineModel<string>('editBack', { required: true })
const editPronunciation = defineModel<string>('editPronunciation', { required: true })
const editMemoryHook = defineModel<string>('editMemoryHook', { required: true })

defineEmits<{
  (e: 'open-audio'): void
  (e: 'start-edit'): void
  (e: 'save-edit'): void
  (e: 'cancel-edit'): void
}>()

const showPronunciation = ref(false)
const frontTextarea = ref<HTMLTextAreaElement | null>(null)
const backTextarea = ref<HTMLTextAreaElement | null>(null)

const adjustHeight = (el: HTMLTextAreaElement) => {
  el.style.height = '34px'
  if (el.scrollHeight > 34) {
    el.style.height = `${Math.min(el.scrollHeight, 52)}px`
  }
}

const handleInput = (e: Event) => {
  adjustHeight(e.target as HTMLTextAreaElement)
}

watch(() => props.isEditing, async (newVal) => {
  if (newVal) {
    await nextTick()
    if (frontTextarea.value) adjustHeight(frontTextarea.value)
    if (backTextarea.value) adjustHeight(backTextarea.value)
  }
})

watch(frontTextarea, (el) => {
  if (el && props.isEditing) {
    adjustHeight(el)
    el.focus()
  }
})

watch(() => props.currentCard.id, () => {
  showPronunciation.value = false
})

const getTextClass = (text: string) => {
  const len = text ? text.length : 0
  if (len < 30) {
    return 'text-2xl sm:text-3xl text-center leading-tight max-w-md'
  } else if (len < 60) {
    return 'text-xl sm:text-3xl text-center leading-tight max-w-md'
  } else if (len < 100) {
    return 'text-lg sm:text-2xl text-center leading-tight max-w-md'
  } else {
    return 'text-base sm:text-xl line-clamp-3 text-center leading-tight max-w-md'
  }
}
</script>

<template>
  <div 
    class="absolute inset-0 rounded-3xl text-white overflow-hidden backface-hidden border border-white/10 dark:border-white/5 shadow-xl preserve-3d"
    :style="{
      backgroundColor: `color-mix(in srgb, ${languageColors[currentCard.backLanguage] || '#4f46e5'} 25%, #111827)`
    }"
  >
    <!-- Content ↔ Edit form crossfade -->
    <Transition name="content-fade" mode="out-in">
      <!-- Normal display -->
      <div v-if="!isEditing" key="display" class="absolute inset-0">
        <!-- Word (Centered in padded area) -->
        <div class="h-full w-full flex flex-col items-center justify-center px-6 relative z-0 -translate-y-[15px]">
          <p :class="getTextClass(currentCard.back)">
            {{ currentCard.back }}
          </p>
          <!-- Pronunciation display below the word -->
          <p v-if="currentCard.pronunciation && isFlipped && !isEditing" 
             class="text-xs sm:text-sm text-white/40 text-center max-w-md mt-4 pt-1"
             style="font-family: 'Courier New', Courier, monospace">
            <span class="text-white/20 mr-1.5">[</span>{{ currentCard.pronunciation }}<span class="text-white/20 ml-1.5">]</span>
          </p>
        </div>

        <!-- Google Translate / Audio (Bottom Left) -->
        <button
          @click.stop="$emit('open-audio')"
          class="absolute bottom-3 left-4 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 backface-hidden"
          title="Écouter sur Google Translate"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a8 8 0 010 11.314M5 10v4a2 2 0 002 2h3l5 5V3l-5 5H7a2 2 0 00-2 2z" />
          </svg>
          <span>google translate</span>
        </button>

        <!-- Edit Card (Bottom Right) -->
        <button
          @click.stop="$emit('start-edit')"
          class="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 backface-hidden"
          title="Edit card"
        >
          <span>edit</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </button>
      </div>

      <!-- Edit form -->
      <div v-else key="edit" class="absolute inset-0 p-4 flex flex-col justify-between" @click.stop>
        <div class="flex-1 flex flex-col justify-center">
          <div class="flex flex-col gap-2 w-full">
            <textarea
              ref="frontTextarea"
              v-model="editFront"
              @input="handleInput"
              @keydown.enter.exact.prevent="$emit('save-edit')"
              rows="1"
              placeholder="Front"
              class="text-sm bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 w-full resize-none h-[34px] max-h-[52px] overflow-y-auto"
            />
            <textarea
              ref="backTextarea"
              v-model="editBack"
              @input="handleInput"
              @keydown.enter.exact.prevent="$emit('save-edit')"
              rows="1"
              placeholder="Back"
              class="text-sm bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 w-full resize-none h-[34px] max-h-[52px] overflow-y-auto"
            />
            <input
              v-model="editPronunciation"
              placeholder="Pronunciation (optional)"
              @keydown.enter="$emit('save-edit')"
              class="text-sm bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 w-full"
            />
            <input
              v-model="editMemoryHook"
              placeholder="Memory Link (optional)"
              @keydown.enter="$emit('save-edit')"
              class="text-sm bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 w-full"
            />
          </div>
        </div>
        <div class="flex gap-2 mt-2">
          <button
            @click.stop="$emit('cancel-edit')"
            class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            @click.stop="$emit('save-edit')"
            :disabled="isSavingEdit"
            class="flex-1 py-1.5 bg-white hover:bg-white/90 disabled:opacity-50 text-neutral-900 text-xs font-bold rounded-lg transition-all"
          >
            {{ isSavingEdit ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>
