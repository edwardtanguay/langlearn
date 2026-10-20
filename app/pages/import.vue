<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { languageColors } from '~/utils/languageColors'

useHead({
  title: 'LangLearn - Import Flashcards',
  meta: [
    { name: 'description', content: 'Import your flashcards from Google Translate or CSV text.' }
  ]
})

const config = useRuntimeConfig()
const isBypass = config.public.bypassAuth
const auth = !isBypass ? useAuth() : null
const loggedIn = computed(() => isBypass ? true : (auth?.loggedIn ?? false))

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFileName = ref<string | null>(null)
const inputText = ref('')

const isAnalyzing = ref(false)
const isConfirming = ref(false)
const importError = ref<string | null>(null)

const isMobile = ref(false)

interface PreviewCardItem {
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  memoryHook?: string | null
  rank?: number | null
  tags?: string[]
  reason?: string
}

interface PreviewData {
  preview: boolean
  totalParsed: number
  willNotImport: PreviewCardItem[]
  willImport: PreviewCardItem[]
}

const previewResult = ref<PreviewData | null>(null)
const importSuccessStats = ref<{
  count: number
  languages: Record<string, number>
} | null>(null)

const languageTextColors: Record<string, string> = { ...languageColors }

function getCardLanguageColor(card: PreviewCardItem): string {
  const code = (card.backLanguage || card.frontLanguage || 'fr').toLowerCase()
  return languageColors[code] || '#2563eb'
}

function getCardLanguageTextColor(card: PreviewCardItem): string {
  const code = (card.backLanguage || card.frontLanguage || 'fr').toLowerCase()
  return languageTextColors[code] || getCardLanguageColor(card)
}

const languageBreakdown = computed(() => {
  if (!previewResult.value?.willImport) return {}
  const breakdown: Record<string, number> = {}
  for (const card of previewResult.value.willImport) {
    const lang = (card.backLanguage || card.frontLanguage || 'fr').toLowerCase()
    breakdown[lang] = (breakdown[lang] || 0) + 1
  }
  return breakdown
})

const checkMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

const userSourceLanguage = ref<string | null>(null)
const isLoadingProfile = ref(true)

const fetchUserProfile = async () => {
  if (!loggedIn.value) {
    isLoadingProfile.value = false
    return
  }
  try {
    const data = await $fetch<{ sourceLanguage: string | null }>('/api/user/me')
    userSourceLanguage.value = data?.sourceLanguage || null
  } catch (err) {
    console.error('Failed to fetch user profile', err)
  } finally {
    isLoadingProfile.value = false
  }
}

const runPreview = async (textToPreview: string) => {
  const text = textToPreview.trim()
  if (!text || isAnalyzing.value) return
  if (!userSourceLanguage.value) {
    importError.value = 'Please set your source language in your profile before importing flashcards.'
    return
  }
  isAnalyzing.value = true
  importError.value = null
  importSuccessStats.value = null

  try {
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''
    const res = await $fetch<PreviewData>('/api/import/mobile', {
      method: 'POST',
      headers: tz ? { 'x-client-timezone': tz } : {},
      body: { mobileImportText: text, preview: true, tz }
    })
    previewResult.value = res
  } catch (err: any) {
    console.error('Failed import preview:', err)
    importError.value = err.data?.statusMessage || err.message || 'Failed to parse import text.'
  } finally {
    isAnalyzing.value = false
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (!file) return

  uploadedFileName.value = file.name
  importError.value = null

  const reader = new FileReader()
  reader.onload = async (e) => {
    const content = e.target?.result as string
    if (!content) return
    inputText.value = content
    await runPreview(content)
  }
  reader.readAsText(file)
}

const handleConfirmImport = async () => {
  const text = inputText.value.trim()
  if (!text || isConfirming.value) return
  if (!userSourceLanguage.value) {
    importError.value = 'Please set your source language in your profile before importing flashcards.'
    return
  }
  isConfirming.value = true
  importError.value = null

  try {
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''
    const currentBreakdown = { ...languageBreakdown.value }
    const totalCount = previewResult.value?.willImport.length || 0

    await $fetch('/api/import/mobile', {
      method: 'POST',
      headers: tz ? { 'x-client-timezone': tz } : {},
      body: { mobileImportText: text, tz }
    })
    importSuccessStats.value = {
      count: totalCount,
      languages: currentBreakdown
    }
    inputText.value = ''
    uploadedFileName.value = null
    previewResult.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (err: any) {
    console.error('Failed import confirmation:', err)
    importError.value = err.data?.statusMessage || err.message || 'Failed to submit import.'
  } finally {
    isConfirming.value = false
  }
}

const cancelPreview = () => {
  previewResult.value = null
  importError.value = null
  if (!isMobile.value) {
    inputText.value = ''
    uploadedFileName.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const resetToInitial = () => {
  previewResult.value = null
  importSuccessStats.value = null
  inputText.value = ''
  uploadedFileName.value = null
  importError.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

onMounted(() => {
  fetchUserProfile()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-0 pb-8 space-y-12 transition-all duration-300">
    <ClientOnly>
      <div v-if="loggedIn" class="mt-8 flex flex-col items-center w-full min-h-[340px] justify-start pt-2">
        <!-- Source Language Missing Notice Banner -->
        <div v-if="!isLoadingProfile && !userSourceLanguage" class="w-full max-w-4xl p-5 mb-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl shadow-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="font-bold text-sm">Source Language Required</h3>
            <p class="text-xs">
              Please set your native / source language in your profile before importing flashcards. This allows the importer to determine which side of the card should be in your native language.
            </p>
          </div>
          <NuxtLink
            to="/user"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            Configure Profile &rarr;
          </NuxtLink>
        </div>

        <!-- Main Unified Container (Used for both Desktop and Mobile) -->
        <div class="w-full" :class="isMobile ? 'max-w-lg' : 'max-w-4xl'">
          
          <!-- STATE 3: Success Screen (Shared across Mobile and Desktop) -->
          <div v-if="importSuccessStats" class="space-y-6">
            <div class="p-6 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl shadow-sm text-center space-y-4">
              <div class="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h1 class="text-xl font-black text-gray-900 dark:text-white">Import Successful!</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ importSuccessStats.count }} {{ importSuccessStats.count === 1 ? 'flashcard was' : 'flashcards were' }} successfully added to your deck.
                </p>
              </div>

              <!-- Stats by language -->
              <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap justify-center gap-2">
                <span
                  v-for="(count, lang) in importSuccessStats.languages"
                  :key="lang"
                  class="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-xs"
                  :style="{ backgroundColor: languageColors[lang] || '#6366f1' }"
                >
                  {{ (lang || 'unknown').toUpperCase() }}: {{ count }} {{ count === 1 ? 'card' : 'cards' }}
                </span>
              </div>

              <!-- Google Translate reminder box -->
              <div class="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-left space-y-2">
                <p class="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
                  Be sure to delete the cards you just imported from your saved list on Google Translate so you don't import them again later.
                </p>
                <div class="pt-1">
                  <a
                    href="https://translate.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-300 underline hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                  >
                    <span>Delete cards at Google Translate</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  @click="resetToInitial"
                  class="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Import More Cards
                </button>
                <NuxtLink
                  to="/flashcard"
                  class="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Continue to Flashcards &rarr;</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- STATE 1: Initial Input Screen (Mobile: Textarea, Desktop: CSV File Upload) -->
          <div v-else-if="!previewResult" class="space-y-6">
            <!-- Mobile Form -->
            <div v-if="isMobile" class="space-y-4">
              <div class="space-y-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mobile Import</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Paste text below to import into your account.</p>
              </div>

              <div class="space-y-4">
                <textarea
                  v-model="inputText"
                  rows="10"
                  placeholder="Paste text here..."
                  class="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                ></textarea>

                <button
                  @click="runPreview(inputText)"
                  :disabled="!inputText.trim() || isAnalyzing"
                  class="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span v-if="isAnalyzing" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ isAnalyzing ? 'Analyzing cards...' : 'Import' }}</span>
                </button>

                <div v-if="importError" class="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl">
                  {{ importError }}
                </div>
              </div>
            </div>

            <!-- Desktop Form -->
            <div v-else class="space-y-6">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Import Flashcards from Google Translate</h1>
                </div>
              </div>

              <ul class="list-disc list-inside space-y-1.5 text-gray-600 dark:text-gray-400">
                <li>Go to <a href="https://translate.google.com" target="_blank" rel="noopener noreferrer" class="underline text-gray-900 dark:text-white hover:opacity-80">Google Translate</a></li>
                <li>click on the "Saved" star icon</li>
                <li>click the Google Sheets icon</li>
                <li>click "Import the data"</li>
                <li>click File, Download, Comma-separated values (.csv)</li>
                <li>click below on "Import CSV file"</li>
                <li>find and double-click on the file you just imported</li>
              </ul>

              <!-- File Upload -->
              <div class="flex items-center gap-4">
                <input 
                  type="file" 
                  accept=".csv" 
                  ref="fileInput"
                  @change="handleFileChange"
                  class="hidden"
                >
                <button 
                  type="button"
                  @click="fileInput?.click()"
                  :disabled="isAnalyzing"
                  class="px-5 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800 focus:outline-none cursor-pointer flex items-center gap-2"
                >
                  <span v-if="isAnalyzing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ isAnalyzing ? 'Reading & Analyzing...' : 'Import CSV file' }}</span>
                </button>
              </div>

              <div v-if="importError" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200 dark:border-red-900" role="alert">
                <span class="font-medium">Notice:</span> {{ importError }}
              </div>
            </div>
          </div>

          <!-- STATE 2: Preview Screen (Shared across Mobile and Desktop) -->
          <div v-else class="space-y-6">
            <div class="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
              <div>
                <h1 class="text-xl font-extrabold text-gray-900 dark:text-white">Import Preview</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ previewResult.totalParsed }} {{ previewResult.totalParsed === 1 ? 'card' : 'cards' }} found
                  <span v-if="uploadedFileName" class="ml-1 text-gray-400">({{ uploadedFileName }})</span>
                </p>
              </div>
              <button
                @click="cancelPreview"
                type="button"
                class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {{ isMobile ? 'Edit Text' : 'Choose Another File' }}
              </button>
            </div>

            <div v-if="importError" class="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl">
              {{ importError }}
            </div>

            <!-- (1) Cards that WILL NOT be imported -->
            <div v-if="previewResult.willNotImport.length > 0" class="space-y-3">
              <div class="pt-1 pb-0.5">
                <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {{ previewResult.willNotImport.length }} {{ previewResult.willNotImport.length === 1 ? 'card' : 'cards' }} will not be imported
                </h2>
              </div>

              <div class="space-y-2.5">
                <div
                  v-for="(card, idx) in previewResult.willNotImport"
                  :key="idx"
                  class="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl space-y-2 text-xs shadow-xs"
                >
                  <!-- Reason banner -->
                  <div class="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-semibold">
                    <span class="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-[11px] font-bold">
                      Reason
                    </span>
                    <span>{{ card.reason }}</span>
                  </div>

                  <!-- Details grid -->
                  <div class="space-y-1 text-gray-700 dark:text-gray-300">
                    <div v-if="card.frontLanguage || card.backLanguage" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Language:</span>
                      <span class="font-semibold uppercase">{{ card.frontLanguage || '—' }} → {{ card.backLanguage || '—' }}</span>
                    </div>

                    <div v-if="card.front" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Front:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ card.front }}</span>
                    </div>

                    <div v-if="card.back" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Back:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ card.back }}</span>
                    </div>

                    <div v-if="card.pronunciation" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Pronunciation:</span>
                      <span class="font-mono text-yellow-600 dark:text-yellow-400 font-medium">[{{ card.pronunciation }}]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- (2) Cards that WILL be imported -->
            <div v-if="previewResult.willImport.length > 0" class="space-y-3">
              <div class="pt-1 pb-0.5">
                <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {{ previewResult.willImport.length }} {{ previewResult.willImport.length === 1 ? 'card' : 'cards' }} ready to import
                </h2>
              </div>

              <div class="space-y-2.5">
                <div
                  v-for="(card, idx) in previewResult.willImport"
                  :key="idx"
                  class="p-3.5 bg-white dark:bg-gray-900 border rounded-2xl space-y-2 text-xs shadow-xs transition-all"
                  :style="{ borderColor: `color-mix(in srgb, ${getCardLanguageColor(card)} 35%, transparent)` }"
                >
                  <!-- Language & Ready Tag Header -->
                  <div class="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-800">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
                      :style="{
                        backgroundColor: `color-mix(in srgb, ${getCardLanguageColor(card)} 18%, transparent)`,
                        color: getCardLanguageTextColor(card)
                      }"
                    >
                      ✓ Ready to import ({{ (card.backLanguage || card.frontLanguage || 'FR').toUpperCase() }})
                    </span>
                  </div>

                  <!-- Details grid -->
                  <div class="space-y-1.5 text-gray-700 dark:text-gray-300">
                    <div v-if="card.frontLanguage || card.backLanguage" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Language:</span>
                      <span class="font-semibold uppercase">{{ card.frontLanguage || '—' }} → {{ card.backLanguage || '—' }}</span>
                    </div>

                    <div v-if="card.front" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Front:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ card.front }}</span>
                    </div>

                    <div v-if="card.back" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Back:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ card.back }}</span>
                    </div>

                    <div v-if="card.pronunciation" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Pronunciation:</span>
                      <span class="font-mono text-yellow-600 dark:text-yellow-400 font-medium">[{{ card.pronunciation }}]</span>
                    </div>

                    <!-- Rank as a number inside a filled horizontal bar -->
                    <div v-if="card.rank !== undefined && card.rank !== null" class="flex gap-2 items-center">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Rank:</span>
                      <div class="flex-1 max-w-[200px] bg-gray-200 dark:bg-gray-800 rounded-full h-5 relative overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center">
                        <div
                          class="h-full rounded-full transition-all duration-300"
                          :style="{
                            width: `${Math.min(100, Math.max(14, ((card.rank || 0) / 5) * 100))}%`,
                            backgroundColor: getCardLanguageColor(card)
                          }"
                        ></div>
                        <span class="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white drop-shadow-sm font-mono">
                          {{ card.rank }}
                        </span>
                      </div>
                    </div>

                    <div v-if="card.tags && card.tags.length > 0" class="flex gap-2 items-center">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Tags:</span>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="t in card.tags" :key="t" class="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px] font-mono font-bold">
                          #{{ t }}
                        </span>
                      </div>
                    </div>

                    <div v-if="card.memoryHook" class="flex gap-2">
                      <span class="font-bold text-gray-500 dark:text-gray-400 w-24 shrink-0">Memory Hook:</span>
                      <span class="italic text-gray-600 dark:text-gray-400">{{ card.memoryHook }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Overall Report Summary Box at the Bottom -->
            <div class="p-4 bg-black dark:bg-black border border-gray-800 rounded-2xl shadow-xs space-y-2 text-xs text-gray-200">
              <div class="font-bold text-gray-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>Overall Import Report</span>
              </div>
              <div class="flex items-center justify-between text-gray-300">
                <span>Total cards found:</span>
                <span class="font-bold font-mono">{{ previewResult.totalParsed }}</span>
              </div>
              <div class="flex items-center justify-between text-gray-300">
                <span>Ready to import:</span>
                <span class="font-bold font-mono text-emerald-400">{{ previewResult.willImport.length }}</span>
              </div>
              <div class="flex items-center justify-between text-gray-300">
                <span>Skipped:</span>
                <span class="font-bold font-mono text-rose-400">{{ previewResult.willNotImport.length }}</span>
              </div>
              <div v-if="Object.keys(languageBreakdown).length > 0" class="pt-2 border-t border-gray-800 flex flex-wrap items-center gap-1.5">
                <span class="text-gray-400 text-[11px] font-semibold">Languages:</span>
                <span
                  v-for="(count, lang) in languageBreakdown"
                  :key="lang"
                  class="px-2 py-0.5 rounded-md text-[11px] font-bold text-white shadow-xs"
                  :style="{ backgroundColor: languageColors[lang] || '#6366f1' }"
                >
                  {{ (lang || 'unknown').toUpperCase() }}: {{ count }}
                </span>
              </div>
            </div>

            <!-- Confirm Action Buttons -->
            <div class="pt-2">
              <button
                v-if="previewResult.willImport.length > 0"
                @click="handleConfirmImport"
                :disabled="isConfirming"
                class="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span v-if="isConfirming" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Confirm Import ({{ previewResult.willImport.length }} {{ previewResult.willImport.length === 1 ? 'card' : 'cards' }})</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      <div v-else class="mt-8 flex flex-col items-center justify-center text-center p-6 bg-gray-50/10 dark:bg-gray-950/5 rounded-3xl border border-gray-200/50 dark:border-gray-850/40">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Authentication Required</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">You must be logged in to import flashcards.</p>
      </div>
    </ClientOnly>
  </div>
</template>
