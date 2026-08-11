<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'LangLearn - Gemini Quiz Prompts',
  meta: [
    { name: 'description', content: 'Prompts to copy and paste into Gemini AI to generate custom language quizzes.' }
  ]
})

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
const isAdmin = ref(false)
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

const languageColors: Record<string, string> = {
  fr: '#333388',
  es: '#be185d',
  it: '#194d19',
  nl: '#d97706',
  pl: '#b8b8b8',
  de: '#7e4402',
  ru: '#3f3f46',
  is: '#06b6d4',
  da: '#7e22ce',
  el: '#ea580c'
}

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
      $fetch<{ role: string }>('/api/user/me').catch(() => ({ role: 'member' }))
    ])
    prompts.value = data || []
    isAdmin.value = me?.role === 'admin'
  } catch (err) {
    console.error('Failed to load chatbot prompts:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
  window.addEventListener('click', closeCrudToolbar)
})

onUnmounted(() => {
  window.removeEventListener('click', closeCrudToolbar)
})

// Grouped prompts by language
const groupedPrompts = computed(() => {
  const groups: Record<string, ChatbotPromptItem[]> = {}
  
  for (const p of prompts.value) {
    const lang = p.language.toLowerCase()
    if (!groups[lang]) {
      groups[lang] = []
    }
    groups[lang].push(p)
  }

  // Sort items within each group by rank ascending
  for (const lang in groups) {
    groups[lang]?.sort((a, b) => a.rank - b.rank)
  }

  return Object.keys(groups)
    .map(lang => ({
      code: lang,
      name: languageNames[lang] || lang.toUpperCase(),
      color: languageColors[lang] || '#333388',
      items: groups[lang] ?? []
    }))
    .sort((a, b) => b.items.length - a.items.length)
})

// Action: Copy text to clipboard & open Gemini AI in new tab
async function handleCopyAndPaste(text: string, promptId: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedPromptId.value = promptId
    setTimeout(() => {
      if (copiedPromptId.value === promptId) {
        copiedPromptId.value = null
      }
    }, 2000)
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
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <!-- Top Navigation & Header -->
    <div class="flex items-center justify-between">
      <NuxtLink to="/activities" class="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        ← Back to Activities
      </NuxtLink>
    </div>

    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gemini Quiz Prompts</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
        Click any prompt's <strong class="text-white font-semibold">Copy and Paste</strong> button below to copy the prompt to your clipboard and automatically open <span class="whitespace-nowrap font-medium text-white">Gemini&nbsp;AI</span> in a new tab where you can paste it to generate an interactive quiz.
      </p>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-6">
      <div v-for="i in 2" :key="i" class="animate-pulse space-y-4">
        <div class="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="j in 2" :key="j" class="h-40 bg-gray-100 dark:bg-gray-900 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Grouped Prompts by Language -->
    <div v-else class="space-y-10">
      <div v-for="group in groupedPrompts" :key="group.code" class="space-y-4">
        <!-- Language Group Header: Word with thick full-width underline directly under text with ZERO space -->
        <div class="border-b-2 w-full border-t-0 pt-0 pb-0 flex flex-col items-start" :style="{ borderColor: group.color }">
          <div class="text-2xl text-gray-900 dark:text-white tracking-tight p-0 mb-2 leading-none inline-block translate-y-[2px]">
            {{ group.name }}
          </div>
        </div>

        <!-- Prompts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(p, idx) in group.items"
            :key="p.id"
            class="group relative p-4 rounded-xl border shadow-xs flex flex-col justify-between space-y-4 transition-all duration-200"
            :style="{
              borderColor: group.color + '66',
              backgroundColor: group.color + '1a'
            }"
          >
            <div class="space-y-3 flex-1 flex flex-col">
              <!-- Prompt Card Header Container -->
              <div class="relative min-h-[36px] flex items-center">
                <!-- Card Title extending 100% width with pill background (Click to reveal CRUD bar if admin) -->
                <h3
                  @click="isAdmin ? toggleCrudToolbar(p.id, $event) : null"
                  class="w-full text-center text-base font-black tracking-wide text-white py-2 px-5 rounded-full shadow-xs truncate select-none"
                  :class="{ 'cursor-pointer hover:brightness-110': isAdmin }"
                  :style="{
                    backgroundColor: group.color,
                    textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.9)'
                  }"
                >
                  {{ p.title }}
                </h3>

                <!-- Desktop Admin CRUD Tools (Displayed on title click; click bar area closes it; solid black bg, no border) -->
                <div
                  v-if="isAdmin && activeCrudPromptId === p.id"
                  @click="toggleCrudToolbar(p.id, $event)"
                  class="absolute inset-0 flex items-center justify-center gap-1 bg-black px-3 py-1 rounded-full text-xs shadow-md transition-all duration-200 z-10 cursor-pointer"
                >
                  <!-- Add New Prompt in this language -->
                  <button
                    @click.stop="openAddModal(group.code)"
                    title="Add Prompt"
                    class="p-1 text-white/80 hover:text-white cursor-pointer transition-colors"
                  >
                    <UIcon name="lucide:plus" class="w-4 h-4" />
                  </button>

                  <template v-if="group.items.length > 1">
                    <span class="h-3 w-px bg-white/15 mx-1 self-center -translate-y-[1px]"></span>

                    <!-- Reorder Up -->
                    <button
                      @click.stop="movePrompt(group.items, idx, 'up')"
                      :disabled="idx === 0"
                      title="Move Up"
                      class="p-1 text-white/80 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                    >
                      <UIcon name="lucide:arrow-up" class="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <!-- Reorder Down -->
                    <button
                      @click.stop="movePrompt(group.items, idx, 'down')"
                      :disabled="idx === group.items.length - 1"
                      title="Move Down"
                      class="p-1 text-white/80 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                    >
                      <UIcon name="lucide:arrow-down" class="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </template>

                  <span class="h-3 w-px bg-white/15 mx-1 self-center -translate-y-[1px]"></span>

                  <!-- Edit -->
                  <button
                    @click.stop="openEditModal(p)"
                    title="Edit Prompt"
                    class="p-1 text-amber-300 hover:text-amber-200 cursor-pointer transition-colors"
                  >
                    <UIcon name="lucide:pencil" class="w-4 h-4" />
                  </button>

                  <!-- Copy -->
                  <button
                    @click.stop="openCopyModal(p)"
                    title="Duplicate Prompt"
                    class="p-1 text-blue-300 hover:text-blue-200 cursor-pointer transition-colors"
                  >
                    <UIcon name="lucide:copy" class="w-4 h-4" />
                  </button>

                  <!-- Delete (Dark red link, hard to click, requests confirmation) -->
                  <button
                    @click.stop="confirmDelete(p)"
                    title="Delete Prompt"
                    class="p-1 text-red-900/80 hover:text-red-700 cursor-pointer transition-colors text-xs font-semibold underline decoration-red-950"
                  >
                    <UIcon name="lucide:trash-2" class="w-4 h-4 text-red-900" />
                  </button>
                </div>
              </div>

              <!-- Black prompt area extended down to fill space -->
              <p class="text-xs text-gray-700 dark:text-gray-300 font-mono bg-white/70 dark:bg-gray-950/80 p-3 rounded-lg border border-gray-200/60 dark:border-gray-800/80 leading-relaxed flex-1 flex items-start">
                {{ p.prompt }}
              </p>
            </div>

            <!-- Action Button: Copy and Paste (White text, lighter version of language color background) -->
            <button
              @click="handleCopyAndPaste(p.prompt, p.id)"
              class="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border-2 hover:opacity-90 active:scale-[0.99]"
              :style="{
                borderColor: copiedPromptId === p.id ? '#059669' : group.color,
                backgroundColor: copiedPromptId === p.id ? '#0596691a' : (group.color + '26')
              }"
            >
              <template v-if="copiedPromptId === p.id">
                <UIcon name="lucide:check" class="w-4 h-4" />
                <span>Copied! Opening Gemini&nbsp;AI...</span>
              </template>
              <template v-else>
                <UIcon name="lucide:copy-check" class="w-4 h-4" />
                <span>Copy and Paste</span>
                <UIcon name="lucide:arrow-up-right" class="w-4 h-4 stroke-[2.5]" />
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

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

        <form @submit.prevent="savePrompt" class="space-y-4">
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
