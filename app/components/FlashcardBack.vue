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

const emit = defineEmits<{
  (e: 'open-audio'): void
  (e: 'start-edit'): void
  (e: 'save-edit'): void
  (e: 'cancel-edit'): void
  (e: 'open-examples', word: string): void
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

const stripFormatting = (text: string) => text ? text.replace(/[\*<>]/g, '') : ''
const stripAsterisks = stripFormatting

const renderBackTextWithHighlights = (text: string) => {
  if (!text) return ''
  // 1. Process <verb> tag before HTML escaping
  let result = text.replace(/<([^>]+)>/g, '___VERB_START___$1___VERB_END___')
  // 2. Escape HTML characters
  result = result
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  // 3. Render <verb> as solid underline with amber background tint
  result = result.replace(/___VERB_START___(.*?)___VERB_END___/g, '<span class="border-b-2 border-amber-400 bg-amber-500/20 px-1 rounded-sm">$1</span>')
  // 4. Render *text* with dashed underline and clickable example word
  result = result.replace(/\*(.*?)\*/g, '<span data-example-word="$1" class="border-b border-dashed border-white/70 bg-white/10 px-1 rounded-sm cursor-pointer hover:bg-amber-400/20 hover:border-amber-300 transition-colors" title="View 3 examples with \'$1\'">$1</span>')
  return result
}

function handleTextClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const exampleEl = target.closest('[data-example-word]') as HTMLElement | null
  if (exampleEl) {
    event.stopPropagation()
    const word = exampleEl.getAttribute('data-example-word')
    if (word) {
      emit('open-examples', word)
    }
  }
}

const getTextClass = (text: string) => {
  const clean = stripFormatting(text)
  const len = clean ? clean.length : 0
  if (len < 30) {
    return 'text-2xl sm:text-3xl text-center leading-tight max-w-md select-text'
  } else if (len < 60) {
    return 'text-xl sm:text-3xl text-center leading-tight max-w-md select-text'
  } else if (len < 100) {
    return 'text-lg sm:text-2xl text-center leading-tight max-w-md select-text'
  } else {
    return 'text-base sm:text-xl line-clamp-3 text-center leading-tight max-w-md select-text'
  }
}
</script>

<template>
  <div 
    class="absolute inset-0 rounded-3xl text-white overflow-hidden backface-hidden border-4 shadow-xl preserve-3d"
    :style="{
      borderColor: languageColors[currentCard.backLanguage] || '#333388',
      backgroundColor: `color-mix(in srgb, ${languageColors[currentCard.backLanguage] || '#4f46e5'} 25%, #111827)`
    }"
  >
    <!-- Content ↔ Edit form crossfade -->
    <Transition name="content-fade" mode="out-in">
      <!-- Normal display -->
      <div v-if="!isEditing" key="display" class="absolute inset-0">
        <!-- Word (Centered in padded area) -->
        <div class="h-full w-full flex flex-col items-center justify-center px-6 relative z-0 -translate-y-[15px]">
          <p 
            :class="getTextClass(stripAsterisks(currentCard.back))"
            v-html="renderBackTextWithHighlights(currentCard.back)"
            @click="handleTextClick"
          ></p>
          <!-- Pronunciation display below the word -->
          <div v-if="currentCard.pronunciation && isFlipped && !isEditing" class="mt-4 pt-1 flex items-center justify-center">
            <div 
              class="text-sm sm:text-base md:text-lg tracking-wide"
              style="font-family: 'Courier New', Courier, monospace"
            >
              <span class="text-yellow-300/40 font-normal">[ </span><span class="text-yellow-300 font-bold">{{ currentCard.pronunciation }}</span><span class="text-yellow-300/40 font-normal"> ]</span>
            </div>
          </div>
        </div>

        <!-- Edit Card (Bottom Left) -->
        <button
          @click.stop="$emit('start-edit')"
          class="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 backface-hidden"
          title="Edit card"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          <span>edit</span>
        </button>

        <!-- Audio Button (Bottom Right) -->
        <button
          @click.stop="$emit('open-audio')"
          class="absolute bottom-3 right-4 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 backface-hidden"
          title="Audio on Google Translate"
        >
          <span>Audio</span>
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <rect x="7.5" y="7.5" width="13" height="13" rx="2.5" fill="#ffffff" />
            <path d="M12.5 13.5h4.5m-2.25-1.5v4" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
            <rect x="3.5" y="3.5" width="13" height="13" rx="2.5" fill="#1a73e8" />
            <path d="M12.5 9.5H9.5V11H11.2C10.9 11.9 10.2 12.5 9.5 12.5C8.4 12.5 7.5 11.6 7.5 10.5C7.5 9.4 8.4 8.5 9.5 8.5C10 8.5 10.5 8.7 10.8 9L11.8 8C11.2 7.4 10.4 7 9.5 7C7.6 7 6 8.6 6 10.5C6 12.4 7.6 14 9.5 14C11.4 14 12.7 12.6 12.7 10.6C12.7 10.2 12.6 9.8 12.5 9.5Z" fill="#ffffff" />
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

@keyframes pulsateKeyframe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.04); }
}
.animate-pulsate {
  animation: pulsateKeyframe 1.8s infinite ease-in-out;
}

@keyframes pronounceAwareKeyframe {
  0% { transform: scale(0.92); opacity: 0; filter: brightness(1.7); }
  50% { transform: scale(1.05); filter: brightness(1.4); }
  100% { transform: scale(1); opacity: 1; filter: brightness(1); }
}
.animate-pronounce-aware {
  animation: pronounceAwareKeyframe 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
