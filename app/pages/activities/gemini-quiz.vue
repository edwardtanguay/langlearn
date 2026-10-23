<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'LangLearn - Gemini Quiz Prompts',
  meta: [
    { name: 'description', content: 'Prompts to copy and paste into Gemini AI to generate custom language quizzes.' }
  ]
})

const { loggedIn, isAdmin, userRole } = useCurrentUser()

interface ChatbotPromptItem {
  id: string
  category: string
  language: string
  title: string
  prompt: string
  rank: number
  createdAt?: string
  updatedAt?: string
}

const prompts = ref<ChatbotPromptItem[]>([])
const isLoading = ref(true)
const copiedPromptId = ref<string | null>(null)
const activeCrudPromptId = ref<string | null>(null)

function toggleCrudToolbar(id: string, event: Event) {
  event.stopPropagation()
  if (activeCrudPromptId.value === id) {
    activeCrudPromptId.value = null
  } else {
    activeCrudPromptId.value = id
  }
}

function closeCrudToolbar() {
  activeCrudPromptId.value = null
}

// Language maps
const languageNames: Record<string, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  nl: 'Dutch',
  es: 'Spanish',
  it: 'Italian',
  pl: 'Polish',
  ru: 'Russian',
  is: 'Icelandic',
  da: 'Danish',
  el: 'Greek'
}

import { languageColors } from '~/utils/languageColors'

const TARGET_LANG_ORDER = ['fr', 'es', 'it', 'nl', 'de', 'en', 'pl', 'ru', 'is', 'da', 'el']

function sortLanguagesByTargetOrder(languages: string[]): string[] {
  return [...languages].sort((a, b) => {
    const idxA = TARGET_LANG_ORDER.indexOf(a)
    const idxB = TARGET_LANG_ORDER.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })
}

const memberTargetLanguages = ref<string[]>([])
const selectedLanguageFilter = ref<string>('fr')

const availableTargetLanguages = computed(() => {
  if (loggedIn.value && memberTargetLanguages.value.length > 0) {
    return sortLanguagesByTargetOrder(memberTargetLanguages.value.map(l => l.toLowerCase()))
  }
  const set = new Set<string>()
  for (const p of prompts.value) {
    if (p.language) set.add(p.language.toLowerCase())
  }
  return sortLanguagesByTargetOrder(Array.from(set))
})

// Modal State
const showModal = ref(false)
const modalMode = ref<'add' | 'edit' | 'copy'>('add')
const isSaving = ref(false)
const formPrompt = ref({
  id: '',
  language: 'fr',
  title: '',
  prompt: ''
})

// Delete confirmation modal state
const showDeleteConfirm = ref(false)
const promptToDelete = ref<ChatbotPromptItem | null>(null)
const isDeleting = ref(false)

async function loadData() {
  isLoading.value = true
  try {
    const [data, me] = await Promise.all([
      $fetch<ChatbotPromptItem[]>('/api/chatbot-prompts?category=geminiQuizPrompts'),
      loggedIn.value ? $fetch<{ role?: string; targetLanguages?: string[] }>('/api/user/me').catch((): { role?: string; targetLanguages?: string[] } => ({ role: 'member' })) : null
    ])
    prompts.value = data || []
    if (me?.targetLanguages && me.targetLanguages.length > 0) {
      memberTargetLanguages.value = me.targetLanguages
      const sorted = sortLanguagesByTargetOrder(me.targetLanguages.map((l: string) => l.toLowerCase()))
      if (!sorted.includes(selectedLanguageFilter.value)) {
        selectedLanguageFilter.value = sorted[0] || 'fr'
      }
    } else if (availableTargetLanguages.value.length > 0 && !availableTargetLanguages.value.includes(selectedLanguageFilter.value)) {
      selectedLanguageFilter.value = availableTargetLanguages.value[0] || 'fr'
    }
  } catch (err) {
    console.error('Failed to load chatbot prompts:', err)
  } finally {
    isLoading.value = false
  }
}

watch(selectedLanguageFilter, (val) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('langlearn_gemini_quiz_language', val)
  }
})

onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('langlearn_gemini_quiz_language')
    if (saved && saved !== 'all') {
      selectedLanguageFilter.value = saved
    }
  }
  loadData()
  window.addEventListener('click', closeCrudToolbar)
})

onUnmounted(() => {
  window.removeEventListener('click', closeCrudToolbar)
})

const currentLanguageCode = computed(() => selectedLanguageFilter.value.toLowerCase())

const currentLanguagePrompts = computed(() => {
  const code = currentLanguageCode.value
  return prompts.value
    .filter(p => p.language.toLowerCase() === code)
    .sort((a, b) => a.rank - b.rank)
})

const currentLanguageColor = computed(() => languageColors[currentLanguageCode.value] || '#6366f1')
const currentLanguageName = computed(() => languageNames[currentLanguageCode.value] || currentLanguageCode.value.toUpperCase())

// Action: Copy text to clipboard & open Gemini AI in new tab
async function handleCopyAndPaste(text: string) {
  if (typeof window !== 'undefined') {
    const selection = window.getSelection()?.toString().trim()
    if (selection && selection.length > 0) {
      return
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    window.open('https://gemini.google.com', '_blank')
  } catch (err) {
    console.error('Failed to copy prompt to clipboard:', err)
  }
}

// Modal Handlers
function openAddModal(defaultLang = 'fr') {
  modalMode.value = 'add'
  formPrompt.value = {
    id: '',
    language: defaultLang,
    title: '',
    prompt: ''
  }
  showModal.value = true
}

function openEditModal(p: ChatbotPromptItem) {
  modalMode.value = 'edit'
  formPrompt.value = {
    id: p.id,
    language: p.language,
    title: p.title,
    prompt: p.prompt
  }
  showModal.value = true
}

function openCopyModal(p: ChatbotPromptItem) {
  modalMode.value = 'copy'
  formPrompt.value = {
    id: '',
    language: p.language,
    title: `${p.title} (Copy)`,
    prompt: p.prompt
  }
  showModal.value = true
}

function closeModal() {
  if (isSaving.value) return
  showModal.value = false
}

// Form Submission with Optimistic Updates
async function savePrompt() {
  if (!formPrompt.value.title.trim() || !formPrompt.value.prompt.trim()) return

  isSaving.value = true
  const previousPrompts = [...prompts.value]

  if (modalMode.value === 'edit') {
    // Optimistic Edit
    const index = prompts.value.findIndex(p => p.id === formPrompt.value.id)
    const existing = prompts.value[index]
    if (index !== -1 && existing) {
      prompts.value[index] = {
        ...existing,
        title: formPrompt.value.title.trim(),
        prompt: formPrompt.value.prompt.trim(),
        language: formPrompt.value.language.toLowerCase().trim()
      }
    }
  } else {
    // Optimistic Add / Copy
    const tempId = `temp-${Date.now()}`
    const tempPrompt: ChatbotPromptItem = {
      id: tempId,
      category: 'geminiQuizPrompts',
      language: formPrompt.value.language.toLowerCase().trim(),
      title: formPrompt.value.title.trim(),
      prompt: formPrompt.value.prompt.trim(),
      rank: 999
    }
    prompts.value.push(tempPrompt)
  }

  showModal.value = false

  try {
    if (modalMode.value === 'edit') {
      const updated = await $fetch<ChatbotPromptItem>(`/api/chatbot-prompts/${formPrompt.value.id}`, {
        method: 'PUT',
        body: {
          title: formPrompt.value.title,
          prompt: formPrompt.value.prompt,
          language: formPrompt.value.language
        }
      })
      const idx = prompts.value.findIndex(p => p.id === updated.id)
      if (idx !== -1) {
        prompts.value[idx] = updated
      }
    } else {
      const created = await $fetch<ChatbotPromptItem>('/api/chatbot-prompts', {
        method: 'POST',
        body: {
          title: formPrompt.value.title,
          prompt: formPrompt.value.prompt,
          language: formPrompt.value.language,
          category: 'geminiQuizPrompts'
        }
      })
      // Replace temp with created prompt
      const tempIdx = prompts.value.findIndex(p => p.id.startsWith('temp-'))
      if (tempIdx !== -1) {
        prompts.value[tempIdx] = created
      } else {
        prompts.value.push(created)
      }
    }
  } catch (err) {
    console.error('Failed to save prompt:', err)
    // Revert optimistic update
    prompts.value = previousPrompts
    alert('Failed to save prompt. Changes reverted.')
  } finally {
    isSaving.value = false
  }
}

// Delete Prompt with Confirmation
function confirmDelete(p: ChatbotPromptItem) {
  promptToDelete.value = p
  showDeleteConfirm.value = true
}

async function deletePrompt() {
  if (!promptToDelete.value) return
  const targetId = promptToDelete.value.id
  isDeleting.value = true

  const previousPrompts = [...prompts.value]
  // Optimistic Delete
  prompts.value = prompts.value.filter(p => p.id !== targetId)
  showDeleteConfirm.value = false

  try {
    await $fetch(`/api/chatbot-prompts/${targetId}`, { method: 'DELETE' })
  } catch (err) {
    console.error('Failed to delete prompt:', err)
    prompts.value = previousPrompts
    alert('Failed to delete prompt. Action reverted.')
  } finally {
    isDeleting.value = false
    promptToDelete.value = null
  }
}

// Rank Reordering (Move Up / Move Down)
async function movePrompt(items: ChatbotPromptItem[], index: number, direction: 'up' | 'down') {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= items.length) return

  const item1 = items[index]
  const item2 = items[targetIndex]
  if (!item1 || !item2) return

  const previousPrompts = JSON.parse(JSON.stringify(prompts.value))

  // Optimistically swap ranks in local state
  const tempRank = item1.rank
  item1.rank = item2.rank
  item2.rank = tempRank

  try {
    await $fetch('/api/chatbot-prompts/reorder', {
      method: 'POST',
      body: {
        firstId: item1.id,
        secondId: item2.id
      }
    })
  } catch (err) {
    console.error('Failed to swap prompt ranks:', err)
    prompts.value = previousPrompts
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-6 space-y-5 sm:space-y-6">
    <!-- Top Navigation & Header -->
    <div class="flex items-center justify-between">
      <NuxtLink to="/activities" class="text-sm font-semibold !text-gray-300 dark:!text-gray-300 hover:!text-gray-900 dark:hover:!text-white opacity-50 hover:opacity-100 transition-all">
        ← Back to Activities
      </NuxtLink>
    </div>

    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gemini Quiz Prompts</h1>
      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
        Click card, Gemini opens, paste text, take quiz
      </p>
    </div>

    <!-- Target Language Filter Buttons -->
    <LanguageFilterMenu
      v-if="availableTargetLanguages.length > 1"
      v-model="selectedLanguageFilter"
      :languages="availableTargetLanguages"
      :language-titles="languageNames"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="py-16 flex flex-col items-center justify-center space-y-3">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">Loading quiz prompts...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="currentLanguagePrompts.length === 0" class="py-12 text-center space-y-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
      <p class="text-gray-700 dark:text-gray-300 font-medium">No quiz prompts available for {{ currentLanguageName }}.</p>
      <div v-if="isAdmin">
        <button
          type="button"
          @click="openAddModal(currentLanguageCode)"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
        >
          <UIcon name="lucide:plus" class="w-4 h-4" />
          <span>Add Prompt</span>
        </button>
      </div>
    </div>

    <!-- Prompts List (Single-column stacked list matching Links UX) -->
    <ul v-else class="space-y-2 text-sm">
      <li
        v-for="(p, idx) in currentLanguagePrompts"
        :key="p.id"
        @click="activeCrudPromptId === p.id ? (activeCrudPromptId = null) : handleCopyAndPaste(p.prompt)"
        class="p-2.5 sm:p-3 rounded-xl border shadow-xs flex items-start justify-between gap-2.5 group transition-all duration-150 cursor-pointer select-none hover:brightness-110 active:scale-[0.99]"
        :style="{
          backgroundColor: `color-mix(in srgb, ${currentLanguageColor} 14%, #111827)`,
          borderColor: `color-mix(in srgb, ${currentLanguageColor} 30%, #374151)`
        }"
      >
        <div class="space-y-1.5 min-w-0 flex-1">
          <!-- Active Admin CRUD Tools on Mobile (centered overlay on card, dismissable by tapping black area or card) -->
          <div
            v-if="isAdmin && activeCrudPromptId === p.id"
            @click.stop="activeCrudPromptId = null"
            class="sm:hidden crud-toolbar flex items-center justify-center gap-2 bg-black/95 px-3 py-1.5 rounded-xl text-xs shadow-md border border-gray-700 w-full cursor-pointer"
          >
            <template v-if="currentLanguagePrompts.length > 1">
              <!-- Reorder Up -->
              <button
                @click.stop="movePrompt(currentLanguagePrompts, idx, 'up')"
                :disabled="idx === 0"
                title="Move Up"
                class="p-1 text-white/80 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
              >
                <UIcon name="lucide:arrow-up" class="w-4 h-4 stroke-[2.5]" />
              </button>

              <!-- Reorder Down -->
              <button
                @click.stop="movePrompt(currentLanguagePrompts, idx, 'down')"
                :disabled="idx === currentLanguagePrompts.length - 1"
                title="Move Down"
                class="p-1 text-white/80 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
              >
                <UIcon name="lucide:arrow-down" class="w-4 h-4 stroke-[2.5]" />
              </button>
            </template>

            <span v-if="currentLanguagePrompts.length > 1" class="h-3 w-px bg-white/20 mx-1 self-center"></span>

            <!-- Edit -->
            <button
              @click.stop="openEditModal(p)"
              title="Edit Prompt"
              class="p-1 text-amber-300 hover:text-amber-200 cursor-pointer transition-colors"
            >
              <UIcon name="lucide:pencil" class="w-4 h-4" />
            </button>

            <!-- Duplicate / Copy -->
            <button
              @click.stop="openCopyModal(p)"
              title="Duplicate Prompt"
              class="p-1 text-blue-300 hover:text-blue-200 cursor-pointer transition-colors"
            >
              <UIcon name="lucide:copy" class="w-4 h-4" />
            </button>

            <!-- Delete -->
            <button
              @click.stop="confirmDelete(p)"
              title="Delete Prompt"
              class="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
            >
              <UIcon name="lucide:trash-2" class="w-4 h-4" />
            </button>
          </div>

          <!-- Normal Title line + Desktop Admin Tools -->
          <div
            v-else
            class="flex items-center justify-between gap-2 w-full"
          >
            <div
              class="font-bold text-base leading-snug flex items-center gap-2 min-w-0"
              :style="{ color: currentLanguageColor }"
            >
              <span class="truncate">{{ p.title.trim() }}</span>
            </div>

            <!-- Desktop Admin CRUD Tools (always visible on desktop, no ellipsis) -->
            <div
              v-if="isAdmin"
              class="hidden sm:flex items-center gap-1 shrink-0"
              @click.stop
            >
              <template v-if="currentLanguagePrompts.length > 1">
                <button
                  @click.stop="movePrompt(currentLanguagePrompts, idx, 'up')"
                  :disabled="idx === 0"
                  title="Move Up"
                  class="p-1 text-white/70 hover:text-white disabled:opacity-20 cursor-pointer transition-colors rounded hover:bg-white/10"
                >
                  <UIcon name="lucide:arrow-up" class="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  @click.stop="movePrompt(currentLanguagePrompts, idx, 'down')"
                  :disabled="idx === currentLanguagePrompts.length - 1"
                  title="Move Down"
                  class="p-1 text-white/70 hover:text-white disabled:opacity-20 cursor-pointer transition-colors rounded hover:bg-white/10"
                >
                  <UIcon name="lucide:arrow-down" class="w-4 h-4 stroke-[2.5]" />
                </button>
                <span class="h-3 w-px bg-white/20 mx-0.5 self-center"></span>
              </template>
              <button
                @click.stop="openEditModal(p)"
                title="Edit Prompt"
                class="p-1 text-amber-300 hover:text-amber-200 cursor-pointer transition-colors rounded hover:bg-white/10"
              >
                <UIcon name="lucide:pencil" class="w-4 h-4" />
              </button>
              <button
                @click.stop="openCopyModal(p)"
                title="Duplicate Prompt"
                class="p-1 text-blue-300 hover:text-blue-200 cursor-pointer transition-colors rounded hover:bg-white/10"
              >
                <UIcon name="lucide:copy" class="w-4 h-4" />
              </button>
              <button
                @click.stop="confirmDelete(p)"
                title="Delete Prompt"
                class="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded hover:bg-white/10"
              >
                <UIcon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>

            <!-- Ellipsis icon on far right for admin to toggle manage bar on mobile only -->
            <button
              v-if="isAdmin"
              type="button"
              @click.stop="toggleCrudToolbar(p.id, $event)"
              title="Manage prompt"
              class="sm:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <UIcon name="lucide:more-horizontal" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Admin Add/Edit/Copy Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 space-y-5 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white capitalize">
            {{ modalMode === 'edit' ? 'Edit Prompt' : modalMode === 'copy' ? 'Copy Prompt (Create New)' : 'Add New Prompt' }}
          </h3>
          <button @click="closeModal" :disabled="isSaving" class="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold">
            ✕
          </button>
        </div>

        <form @submit.prevent="savePrompt" @keydown.ctrl.enter="savePrompt" @keydown.meta.enter="savePrompt" class="space-y-4">
          <!-- Language Selector -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Language
            </label>
            <select
              v-model="formPrompt.language"
              :disabled="isSaving"
              class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option v-for="(name, code) in languageNames" :key="code" :value="code">
                {{ name }} ({{ code }})
              </option>
            </select>
          </div>

          <!-- Title Field -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              v-model="formPrompt.title"
              :disabled="isSaving"
              required
              placeholder="e.g. verb &quot;to sit&quot;"
              class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-800 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <!-- Prompt Text Field -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Prompt Text
            </label>
            <textarea
              v-model="formPrompt.prompt"
              :disabled="isSaving"
              required
              rows="4"
              placeholder="Create a quiz in French..."
              class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-800 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <!-- Form Buttons -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              :disabled="isSaving"
              class="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <svg v-if="isSaving" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              <span>{{ isSaving ? 'Saving...' : 'Save Prompt' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Delete Prompt Confirmation
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the prompt <strong class="text-gray-900 dark:text-white">"{{ promptToDelete?.title }}"</strong>? This action cannot be undone.
        </p>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            @click="showDeleteConfirm = false"
            :disabled="isDeleting"
            class="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="deletePrompt"
            :disabled="isDeleting"
            class="px-4 py-2 rounded-lg text-xs font-bold bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <svg v-if="isDeleting" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span>{{ isDeleting ? 'Deleting...' : 'Confirm Delete' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
