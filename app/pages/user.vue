<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { SunIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - User Profile',
  meta: [
    { name: 'description', content: 'User profile details and language learning preferences on LangLearn.' }
  ]
})

const { isSunMode, toggleSunMode } = useSunMode()
const { loggedIn, isAdmin, userRole } = useCurrentUser()

const config = useRuntimeConfig()
const isBypass = computed(() => Boolean(config.public.bypassAuth))
const auth = useAuth()
const user = computed(() => isBypass.value ? { given_name: 'Edward', family_name: 'Tanguay', email: 'edwardtanguay@gmail.com', picture: null } : (auth?.user ?? null))

const siteTime = ref('')
let siteTimeInterval: ReturnType<typeof setInterval> | null = null

const updateSiteTime = () => {
  const now = new Date()
  siteTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const isSourceDropdownOpen = ref(false)
const sourceDropdownRef = ref<HTMLElement | null>(null)

const handleProfileClickOutside = (e: MouseEvent) => {
  if (sourceDropdownRef.value && !sourceDropdownRef.value.contains(e.target as Node)) {
    isSourceDropdownOpen.value = false
  }
}

onMounted(() => {
  if (!loggedIn.value) {
    navigateTo('/api/login', { external: true })
  }
  updateSiteTime()
  siteTimeInterval = setInterval(updateSiteTime, 1000)
  document.addEventListener('click', handleProfileClickOutside)
})

onUnmounted(() => {
  if (siteTimeInterval) clearInterval(siteTimeInterval)
  document.removeEventListener('click', handleProfileClickOutside)
})

const languageColors: Record<string, string> = {
  en: '#0ea5e9',
  fr: '#333388',
  es: '#e11d48',
  it: '#194d19',
  nl: '#ca8a04',
  pl: '#b8b8b8',
  de: '#78350f',
  ru: '#4b5563',
  is: '#0891b2',
  da: '#9333ea',
  el: '#ea580c'
}

// All supported languages in the system
const allSupportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'ru', label: 'Russian' },
  { code: 'is', label: 'Icelandic' },
  { code: 'da', label: 'Danish' },
  { code: 'el', label: 'Greek' }
]

// Source language dropdown options per spec
const sourceLanguageOptions = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'it', label: 'Italian' },
  { value: 'nl', label: 'Dutch' }
]

// Fetch user profile data
const { data: meData, refresh: refreshMe } = await useFetch<{
  dailyTakeGoal: number
  testingGroupSize: number
  sourceLanguage: string | null
  targetLanguages: string[]
  role: string
}>('/api/user/me')

const dailyTakeGoalInput = ref(meData.value?.dailyTakeGoal ?? 100)
const isSavingGoal = ref(false)
const goalSaveSuccess = ref(false)

const testingGroupSizeInput = ref(meData.value?.testingGroupSize ?? 10)
const isSavingGroupSize = ref(false)
const groupSizeSaveSuccess = ref(false)

const selectedSourceLanguage = ref(meData.value?.sourceLanguage || 'en')
const selectedTargetLanguages = ref<string[]>(
  Array.isArray(meData.value?.targetLanguages) && meData.value!.targetLanguages.length > 0
    ? meData.value!.targetLanguages
    : ['fr', 'de', 'es', 'it', 'nl', 'pl', 'ru', 'is', 'da', 'el'].filter(l => l !== (meData.value?.sourceLanguage || 'en'))
)
const isSavingLanguages = ref(false)
const languageSaveSuccess = ref(false)

watch(() => meData.value?.dailyTakeGoal, (newVal) => {
  if (newVal !== undefined) dailyTakeGoalInput.value = newVal
})

watch(() => meData.value?.testingGroupSize, (newVal) => {
  if (newVal !== undefined) testingGroupSizeInput.value = newVal
})

watch(() => meData.value?.sourceLanguage, (newVal) => {
  if (newVal) selectedSourceLanguage.value = newVal
})

watch(() => meData.value?.targetLanguages, (newVal) => {
  if (Array.isArray(newVal)) selectedTargetLanguages.value = newVal
})

// Target languages choices: all supported languages EXCEPT the currently selected source language
const availableTargetLanguages = computed(() => {
  return allSupportedLanguages.filter(lang => lang.code !== selectedSourceLanguage.value)
})

const handleSourceLanguageChange = async (newVal: string) => {
  selectedSourceLanguage.value = newVal
  isSourceDropdownOpen.value = false
  // Remove the new source language from target languages if present
  selectedTargetLanguages.value = selectedTargetLanguages.value.filter(code => code !== newVal)
  await persistLanguageSettings()
}

const toggleTargetLanguage = async (code: string) => {
  const current = new Set(selectedTargetLanguages.value)
  if (current.has(code)) {
    current.delete(code)
  } else {
    current.add(code)
  }
  selectedTargetLanguages.value = Array.from(current)
  await persistLanguageSettings()
}

const persistLanguageSettings = async () => {
  if (isSavingLanguages.value) return
  isSavingLanguages.value = true
  languageSaveSuccess.value = false

  try {
    await $fetch('/api/user/profile', {
      method: 'POST',
      body: {
        sourceLanguage: selectedSourceLanguage.value,
        targetLanguages: selectedTargetLanguages.value
      }
    })
    languageSaveSuccess.value = true
    setTimeout(() => { languageSaveSuccess.value = false }, 2000)
  } catch (err) {
    console.error('Failed to save language settings:', err)
  } finally {
    isSavingLanguages.value = false
  }
}

const handleSaveGoal = async () => {
  if (isSavingGoal.value) return
  const prevValue = meData.value?.dailyTakeGoal ?? 100
  const newValue = Math.max(1, Number(dailyTakeGoalInput.value) || 100)

  if (meData.value) meData.value.dailyTakeGoal = newValue
  isSavingGoal.value = true
  goalSaveSuccess.value = false

  try {
    await $fetch('/api/user/profile', {
      method: 'POST',
      body: { dailyTakeGoal: newValue }
    })
    goalSaveSuccess.value = true
    setTimeout(() => { goalSaveSuccess.value = false }, 2500)
  } catch (e) {
    if (meData.value) meData.value.dailyTakeGoal = prevValue
    dailyTakeGoalInput.value = prevValue
  } finally {
    isSavingGoal.value = false
  }
}

const handleSaveGroupSize = async () => {
  if (isSavingGroupSize.value) return
  const prevValue = meData.value?.testingGroupSize ?? 10
  const newValue = Math.max(1, Math.min(50, Number(testingGroupSizeInput.value) || 10))

  if (meData.value) meData.value.testingGroupSize = newValue
  isSavingGroupSize.value = true
  groupSizeSaveSuccess.value = false

  try {
    await $fetch('/api/user/profile', {
      method: 'POST',
      body: { testingGroupSize: newValue }
    })
    groupSizeSaveSuccess.value = true
    setTimeout(() => { groupSizeSaveSuccess.value = false }, 2500)
  } catch (e) {
    if (meData.value) meData.value.testingGroupSize = prevValue
    testingGroupSizeInput.value = prevValue
  } finally {
    isSavingGroupSize.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto py-8 sm:py-16 px-4 space-y-6">
    <ClientOnly>
      <div v-if="loggedIn && user" class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-6">
        <!-- User Info Header -->
        <div class="flex flex-col items-center space-y-4 text-center">
          <div class="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-inner">
            <img v-if="user.picture" :src="user.picture" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ user.given_name?.[0] || 'U' }}</span>
          </div>

          <div>
            <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">
              {{ user.given_name }} {{ user.family_name }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ user.email || 'No email provided' }}
            </p>
            <p v-if="siteTime" class="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-1.5 flex items-center justify-center gap-1.5 font-medium">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Site time: {{ siteTime }}</span>
            </p>
          </div>
        </div>

        <!-- Sun Mode Setting Section (Visible for both members and admins) -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <SunIcon class="w-5 h-5 text-amber-500 shrink-0" />
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                Sun Mode
              </span>
            </div>
            <!-- Toggle Switch -->
            <button
              type="button"
              @click="toggleSunMode"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
              :class="isSunMode ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'"
              role="switch"
              :aria-checked="isSunMode"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                :class="isSunMode ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Sun mode is designed for when you use LangLearn outside in bright sunlight. It keeps your dark background while making all text and symbols much brighter and bolder so everything remains easier to read under the sun.
          </p>
        </div>

        <!-- Language Learning Preferences Section (Source & Target Languages) -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-5">
          <!-- Source Language Dropdown -->
          <div class="space-y-2" ref="sourceDropdownRef">
            <label class="block text-sm font-semibold text-gray-900 dark:text-white">
              Source Language
            </label>
            <div class="relative w-64 max-w-full">
              <button
                type="button"
                @click="isSourceDropdownOpen = !isSourceDropdownOpen"
                class="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium text-sm flex items-center justify-between shadow-xs hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2.5">
                  <span
                    class="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    :style="{ backgroundColor: languageColors[selectedSourceLanguage] || '#0ea5e9' }"
                  ></span>
                  <span
                    class="font-semibold"
                    :style="{ color: languageColors[selectedSourceLanguage] || undefined }"
                  >
                    {{ sourceLanguageOptions.find(o => o.value === selectedSourceLanguage)?.label || selectedSourceLanguage }}
                  </span>
                </div>
                <ChevronDownIcon
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isSourceDropdownOpen }"
                />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="isSourceDropdownOpen"
                class="absolute left-0 right-0 mt-1.5 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto"
              >
                <button
                  v-for="opt in sourceLanguageOptions"
                  :key="opt.value"
                  type="button"
                  @click="handleSourceLanguageChange(opt.value)"
                  class="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer text-sm"
                  :class="selectedSourceLanguage === opt.value ? 'bg-gray-50 dark:bg-gray-750/70 font-bold' : 'font-medium'"
                >
                  <div class="flex items-center gap-2.5">
                    <span
                      class="w-3 h-3 rounded-full shrink-0"
                      :style="{ backgroundColor: languageColors[opt.value] || '#0ea5e9' }"
                    ></span>
                    <span :style="{ color: languageColors[opt.value] || undefined }">
                      {{ opt.label }}
                    </span>
                  </div>
                  <span
                    v-if="selectedSourceLanguage === opt.value"
                    class="text-xs font-mono font-bold"
                    :style="{ color: languageColors[opt.value] || '#0ea5e9' }"
                  >
                    ✓
                  </span>
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Source language is your <strong class="text-gray-700 dark:text-gray-200 font-bold">native language</strong>. Currently, the site UI is always in English regardless of the source language. The source language will be more relevant when the import function is made available to members.
            </p>
          </div>

          <!-- Target Languages Checkboxes -->
          <div class="space-y-2.5 pt-2">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white">
                Target Languages
              </label>
              <span v-if="languageSaveSuccess" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Saved!</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Target languages are the <strong class="text-gray-700 dark:text-gray-200 font-bold">languages you want to learn</strong>. Currently, target languages filter the Links page and Gemini Quiz Prompts activity.
            </p>

            <div class="grid grid-cols-2 gap-2.5 pt-1">
              <label
                v-for="targetLang in availableTargetLanguages"
                :key="targetLang.code"
                class="flex items-center gap-2.5 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors text-xs font-medium text-gray-800 dark:text-gray-200"
                :style="selectedTargetLanguages.includes(targetLang.code) ? {
                  borderColor: `color-mix(in srgb, ${languageColors[targetLang.code] || '#6366f1'} 50%, transparent)`,
                  backgroundColor: `color-mix(in srgb, ${languageColors[targetLang.code] || '#6366f1'} 12%, transparent)`
                } : undefined"
              >
                <input
                  type="checkbox"
                  :checked="selectedTargetLanguages.includes(targetLang.code)"
                  @change="toggleTargetLanguage(targetLang.code)"
                  class="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                />
                <span
                  class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  :style="{ backgroundColor: languageColors[targetLang.code] || '#6366f1' }"
                ></span>
                <span
                  :style="{
                    color: selectedTargetLanguages.includes(targetLang.code)
                      ? (languageColors[targetLang.code] || undefined)
                      : undefined
                  }"
                  :class="{ 'font-bold': selectedTargetLanguages.includes(targetLang.code) }"
                >
                  {{ targetLang.label }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Admin Only Settings (Daily Take Goal & Testing Group Size) -->
        <template v-if="isAdmin">
          <!-- Daily Goal Setting Form -->
          <form @submit.prevent="handleSaveGoal" class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
            <label class="block text-sm font-semibold text-gray-900 dark:text-white">
              Daily Take Goal
            </label>
            <div class="flex items-center gap-2">
              <input
                type="number"
                v-model.number="dailyTakeGoalInput"
                :disabled="isSavingGoal"
                min="1"
                max="10000"
                class="w-1/4 min-w-[70px] text-right font-mono px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                type="submit"
                :disabled="isSavingGoal"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl text-sm transition-all disabled:opacity-50 flex items-center shrink-0 gap-1.5 cursor-pointer"
              >
                <span v-if="isSavingGoal" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isSavingGoal ? 'Saving...' : 'Save' }}</span>
              </button>
            </div>
            <p v-if="goalSaveSuccess" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Goal saved!</p>
          </form>

          <!-- Testing Group Size Setting Form -->
          <form @submit.prevent="handleSaveGroupSize" class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white">
                Testing Group Size
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Choose how many flashcards you test in a single batch. LangLearn will cycle through this group until you mark all of them as learned, before loading the next batch.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="number"
                v-model.number="testingGroupSizeInput"
                :disabled="isSavingGroupSize"
                min="1"
                max="50"
                class="w-1/4 min-w-[70px] text-right font-mono px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                type="submit"
                :disabled="isSavingGroupSize"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl text-sm transition-all disabled:opacity-50 flex items-center shrink-0 gap-1.5 cursor-pointer"
              >
                <span v-if="isSavingGroupSize" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isSavingGroupSize ? 'Saving...' : 'Save' }}</span>
              </button>
            </div>
            <p v-if="groupSizeSaveSuccess" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Testing group size saved!</p>
          </form>
        </template>
      </div>

      <template #fallback>
        <div class="py-24 flex flex-col items-center justify-center space-y-3">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
