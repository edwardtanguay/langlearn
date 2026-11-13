<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { SunIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { languageColors } from '~/utils/languageColors'

useHead({
  title: 'LangLearn - User Profile',
  meta: [
    { name: 'description', content: 'User profile details and language learning preferences on LangLearn.' }
  ]
})

const route = useRoute()
const router = useRouter()
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
  const pad = (n: number) => String(n).padStart(2, '0')
  siteTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
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

// Source language dropdown options: all 11 supported languages
const sourceLanguageOptions = allSupportedLanguages.map(l => ({ value: l.code, label: l.label }))

// Fetch user profile data
const { data: meData, refresh: refreshMe } = await useFetch<{
  dailyTakeGoal: number
  testingGroupSize: number
  sourceLanguage: string | null
  showSourceLanguageMaterials: boolean
  isCommunity: boolean
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
const showSourceLanguageMaterials = ref(Boolean(meData.value?.showSourceLanguageMaterials))
const isSavingShowSource = ref(false)
const isCommunity = ref(Boolean(meData.value?.isCommunity))
const isSavingCommunity = ref(false)

watch(() => meData.value?.isCommunity, (newVal) => {
  if (newVal !== undefined) isCommunity.value = Boolean(newVal)
})

const toggleCommunityMode = async () => {
  const prev = isCommunity.value
  const next = !prev
  isCommunity.value = next
  isSavingCommunity.value = true
  try {
    await $fetch('/api/user/profile', {
      method: 'POST',
      body: { isCommunity: next }
    })
  } catch (err) {
    console.error('Failed to update community mode:', err)
    isCommunity.value = prev
  } finally {
    isSavingCommunity.value = false
  }
}

interface DailyActivityData {
  date: string
  daysAgo: number
  totalFlashcards: number
  totalPoints: number
  byLanguage: Record<string, number>
  byAction: Record<string, number>
  logs: Array<{
    id: string
    points: number
    reason: string
    language: string | null
    actionTaken: string | null
    createdAt: string
  }>
}

const dailyDaysAgo = ref(0)
const dailyActivity = ref<DailyActivityData | null>(null)
const isDailyLoading = ref(true)

const dailyLabel = computed(() => {
  if (dailyDaysAgo.value === 0) return 'Today'
  if (dailyDaysAgo.value === 1) return 'Yesterday'
  return `${dailyDaysAgo.value} days ago`
})

const fetchDailyActivity = async (daysAgo: number) => {
  isDailyLoading.value = true
  try {
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''
    const data = await $fetch<DailyActivityData>('/api/user/daily-activity', {
      query: { daysAgo, ...(tz ? { tz } : {}) },
      headers: tz ? { 'x-client-timezone': tz } : undefined
    })
    dailyActivity.value = data
  } catch (err) {
    console.error('Failed to fetch daily activity:', err)
  } finally {
    isDailyLoading.value = false
  }
}

const changeDailyDaysAgo = (delta: number) => {
  const next = Math.max(0, dailyDaysAgo.value + delta)
  if (next === dailyDaysAgo.value) return
  dailyDaysAgo.value = next
  fetchDailyActivity(next)
}

onMounted(() => {
  if (loggedIn.value) {
    fetchDailyActivity(0)
  }
})
const selectedSourceLanguageLabel = computed(() => allSupportedLanguages.find(o => o.code === selectedSourceLanguage.value)?.label || selectedSourceLanguage.value)
const selectedTargetLanguages = ref<string[]>(
  Array.isArray(meData.value?.targetLanguages) && meData.value!.targetLanguages.length > 0
    ? meData.value!.targetLanguages
    : ['de']
)
const isSavingLanguages = ref(false)
const languageSaveSuccess = ref(false)

const isFirstSignInNotice = computed(() => {
  return route.query.firstSignIn === 'true' || !meData.value?.sourceLanguage || (Array.isArray(meData.value?.targetLanguages) && meData.value!.targetLanguages.length === 0)
})

watch(() => meData.value?.dailyTakeGoal, (newVal) => {
  if (newVal !== undefined) dailyTakeGoalInput.value = newVal
})

watch(() => meData.value?.testingGroupSize, (newVal) => {
  if (newVal !== undefined) testingGroupSizeInput.value = newVal
})

watch(() => meData.value?.sourceLanguage, (newVal) => {
  if (newVal) selectedSourceLanguage.value = newVal
})

watch(() => meData.value?.showSourceLanguageMaterials, (newVal) => {
  if (newVal !== undefined) showSourceLanguageMaterials.value = Boolean(newVal)
})

watch(() => meData.value?.targetLanguages, (newVal) => {
  if (Array.isArray(newVal) && newVal.length > 0) {
    selectedTargetLanguages.value = newVal
  }
})

// Target languages choices: all supported languages EXCEPT the currently selected source language
const availableTargetLanguages = computed(() => {
  return allSupportedLanguages.filter(lang => lang.code !== selectedSourceLanguage.value)
})

const handleSourceLanguageChange = async (newVal: string) => {
  const prevSource = selectedSourceLanguage.value
  const prevShowSource = showSourceLanguageMaterials.value
  const prevTargets = [...selectedTargetLanguages.value]
  if (newVal !== prevSource) {
    showSourceLanguageMaterials.value = false
  }
  selectedSourceLanguage.value = newVal
  isSourceDropdownOpen.value = false
  // Remove the new source language from target languages if present
  let updatedTargets = selectedTargetLanguages.value.filter(code => code !== newVal)
  // Ensure at least one target language remains
  if (updatedTargets.length === 0) {
    const fallback = allSupportedLanguages.find(l => l.code !== newVal)?.code
    if (fallback) updatedTargets = [fallback]
  }
  selectedTargetLanguages.value = updatedTargets
  const saved = await persistLanguageSettings()
  if (!saved) {
    selectedSourceLanguage.value = prevSource
    showSourceLanguageMaterials.value = prevShowSource
    selectedTargetLanguages.value = prevTargets
  }
}

const toggleShowSourceLanguageMaterials = async () => {
  if (isSavingShowSource.value || isSavingLanguages.value) return
  const prevVal = showSourceLanguageMaterials.value
  const nextVal = !prevVal
  showSourceLanguageMaterials.value = nextVal
  isSavingShowSource.value = true
  try {
    await $fetch('/api/user/profile', {
      method: 'POST',
      body: { showSourceLanguageMaterials: nextVal }
    })
    if (meData.value) {
      meData.value.showSourceLanguageMaterials = nextVal
    }
  } catch (err) {
    console.error('Failed to save showSourceLanguageMaterials:', err)
    showSourceLanguageMaterials.value = prevVal
  } finally {
    isSavingShowSource.value = false
  }
}

const toggleTargetLanguage = async (code: string) => {
  const current = new Set(selectedTargetLanguages.value)
  if (current.has(code)) {
    // Do not allow unselecting all target languages!
    if (current.size <= 1) {
      return
    }
    current.delete(code)
  } else {
    current.add(code)
  }
  selectedTargetLanguages.value = Array.from(current)
  await persistLanguageSettings()
}

const persistLanguageSettings = async (): Promise<boolean> => {
  if (isSavingLanguages.value) return false
  isSavingLanguages.value = true
  languageSaveSuccess.value = false

  // Validate at least one target language
  if (selectedTargetLanguages.value.length === 0) {
    const fallback = allSupportedLanguages.find(l => l.code !== selectedSourceLanguage.value)?.code || 'de'
    selectedTargetLanguages.value = [fallback]
  }

  try {
    await $fetch('/api/user/profile', {
      method: 'POST',
      body: {
        sourceLanguage: selectedSourceLanguage.value,
        showSourceLanguageMaterials: showSourceLanguageMaterials.value,
        targetLanguages: selectedTargetLanguages.value
      }
    })
    languageSaveSuccess.value = true
    if (meData.value) {
      meData.value.sourceLanguage = selectedSourceLanguage.value
      meData.value.showSourceLanguageMaterials = showSourceLanguageMaterials.value
      meData.value.targetLanguages = [...selectedTargetLanguages.value]
    }
    setTimeout(() => { languageSaveSuccess.value = false }, 2000)
    return true
  } catch (err) {
    console.error('Failed to save language settings:', err)
    return false
  } finally {
    isSavingLanguages.value = false
  }
}

let goalDebounceTimer: any = null
const onGoalInput = () => {
  if (goalDebounceTimer) clearTimeout(goalDebounceTimer)
  goalDebounceTimer = setTimeout(() => {
    handleSaveGoal()
  }, 400)
}

let groupSizeDebounceTimer: any = null
const onGroupSizeInput = () => {
  if (groupSizeDebounceTimer) clearTimeout(groupSizeDebounceTimer)
  groupSizeDebounceTimer = setTimeout(() => {
    handleSaveGroupSize()
  }, 400)
}

const stepGoal = (delta: number) => {
  const current = Number(dailyTakeGoalInput.value) || 100
  const updated = Math.max(1, current + delta)
  dailyTakeGoalInput.value = updated
  if (goalDebounceTimer) clearTimeout(goalDebounceTimer)
  handleSaveGoal()
}

const stepGroupSize = (delta: number) => {
  const current = Number(testingGroupSizeInput.value) || 10
  const updated = Math.max(1, Math.min(50, current + delta))
  testingGroupSizeInput.value = updated
  if (groupSizeDebounceTimer) clearTimeout(groupSizeDebounceTimer)
  handleSaveGroupSize()
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
    setTimeout(() => { goalSaveSuccess.value = false }, 2000)
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
    setTimeout(() => { groupSizeSaveSuccess.value = false }, 2000)
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
        <!-- First sign-in banner if required -->
        <div v-if="isFirstSignInNotice" class="p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl text-amber-800 dark:text-amber-300 text-xs text-center space-y-1">
          <p class="font-bold text-sm">Welcome! Choose your languages to get started</p>
          <p>Please select your native source language and at least one target language before exploring the app.</p>
        </div>

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
                    :style="{ backgroundColor: languageColors[selectedSourceLanguage] || languageColors.en || '#9333ea' }"
                  ></span>
                  <span class="font-semibold text-gray-900 dark:text-gray-100">
                    {{ allSupportedLanguages.find(o => o.code === selectedSourceLanguage)?.label || selectedSourceLanguage }}
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
                  class="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors cursor-pointer text-sm"
                  :class="selectedSourceLanguage === opt.value ? 'bg-gray-100 dark:bg-gray-700/80 font-bold' : 'font-medium text-gray-800 dark:text-gray-200'"
                >
                  <div class="flex items-center gap-2.5">
                    <span
                      class="w-3 h-3 rounded-full shrink-0"
                      :style="{ backgroundColor: languageColors[opt.value] || languageColors.en || '#9333ea' }"
                    ></span>
                    <span class="text-gray-900 dark:text-gray-100">
                      {{ opt.label }}
                    </span>
                  </div>
                  <span
                    v-if="selectedSourceLanguage === opt.value"
                    class="text-xs font-mono font-bold text-gray-700 dark:text-gray-300"
                  >
                    ✓
                  </span>
                </button>
              </div>
            </div>
              <!-- Source Language Learning Materials Checkbox -->
              <label class="flex items-center gap-2.5 pt-1 cursor-pointer select-none text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                <input
                  type="checkbox"
                  :checked="showSourceLanguageMaterials"
                  :disabled="isSavingShowSource || isSavingLanguages"
                  @change="toggleShowSourceLanguageMaterials"
                  class="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4 disabled:opacity-50"
                />
                <span>show {{ selectedSourceLanguageLabel }} language learning materials</span>
                <span v-if="isSavingShowSource" class="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0"></span>
              </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Source language is your <strong class="text-gray-700 dark:text-gray-200 font-bold">native language</strong>. Currently, the site UI is always in English regardless of the source language. 
            </p>
          </div>

          <!-- Target Languages Checkboxes -->
          <div class="space-y-2.5 pt-2">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white">
                Target Languages
              </label>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Target languages are the <strong class="text-gray-700 dark:text-gray-200 font-bold">languages you want to learn</strong>. Currently, target languages filter the Links page, Activities menu, Language Basics, and Gemini Quiz Prompts activity.
            </p>

            <div class="grid grid-cols-2 gap-2.5 pt-1">
              <label
                v-for="targetLang in availableTargetLanguages"
                :key="targetLang.code"
                class="flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all text-xs font-medium hover:brightness-105"
                :style="{
                  borderColor: `color-mix(in srgb, ${languageColors[targetLang.code] || '#6366f1'} 50%, transparent)`,
                  backgroundColor: selectedTargetLanguages.includes(targetLang.code)
                    ? `color-mix(in srgb, ${languageColors[targetLang.code] || '#6366f1'} 12%, transparent)`
                    : 'transparent',
                  boxShadow: selectedTargetLanguages.includes(targetLang.code)
                    ? '0 0 8px rgba(255, 255, 255, 0.16), 0 1px 3px rgba(0, 0, 0, 0.3)'
                    : undefined
                }"
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
                  :style="{ color: languageColors[targetLang.code] || undefined }"
                  class="font-bold"
                >
                  {{ targetLang.label }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Admin Only Settings (Daily Take Goal & Testing Group Size) -->
        <template v-if="isAdmin">
          <!-- Daily Goal Setting -->
          <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white">
                Daily Take Goal
              </label>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="stepGoal(-10)"
                :disabled="isSavingGoal || dailyTakeGoalInput <= 1"
                class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-40"
                title="Decrease by 10"
              >
                <ChevronLeftIcon class="w-4 h-4 stroke-[2.5]" />
              </button>
              <input
                type="number"
                v-model.number="dailyTakeGoalInput"
                @input="onGoalInput"
                min="1"
                max="10000"
                class="w-20 text-center font-mono px-2 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                @click="stepGoal(10)"
                :disabled="isSavingGoal"
                class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-40"
                title="Increase by 10"
              >
                <ChevronRightIcon class="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <!-- Testing Group Size Setting -->
          <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white">
                Testing Group Size
              </label>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Choose how many flashcards you test in a single batch. LangLearn will cycle through this group until you mark all of them as learned, before loading the next batch.
            </p>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="stepGroupSize(-1)"
                :disabled="isSavingGroupSize || testingGroupSizeInput <= 1"
                class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-40"
                title="Decrease by 1"
              >
                <ChevronLeftIcon class="w-4 h-4 stroke-[2.5]" />
              </button>
              <input
                type="number"
                v-model.number="testingGroupSizeInput"
                @input="onGroupSizeInput"
                min="1"
                max="50"
                class="w-20 text-center font-mono px-2 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                @click="stepGroupSize(1)"
                :disabled="isSavingGroupSize || testingGroupSizeInput >= 50"
                class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-40"
                title="Increase by 1"
              >
                <ChevronRightIcon class="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </template>

        <!-- Community Mode Switch -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">Visibility Mode</span>
              <span v-if="isSavingCommunity" class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
            </div>
            <button
              type="button"
              @click="toggleCommunityMode"
              :disabled="isSavingCommunity"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
              :class="isCommunity
                ? 'bg-emerald-600/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'"
            >
              <span>{{ isCommunity ? 'Community' : 'Private' }}</span>
              <span
                class="w-8 h-4 rounded-full relative transition-colors inline-block"
                :class="isCommunity ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'"
              >
                <span
                  class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"
                  :class="isCommunity ? 'left-4.5' : 'left-0.5'"
                ></span>
              </span>
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            When switched to Community, your first name will be shown on the leader board which is public, and other community users will be able to import your flashcards, and you will be able to import other community users' flashcards.
          </p>
        </div>

        <!-- Daily Activity Section -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Daily Activity</h2>
              <p v-if="dailyActivity" class="text-xs text-gray-500 dark:text-gray-400">
                {{ dailyLabel }} ({{ dailyActivity.date }})
              </p>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                @click="changeDailyDaysAgo(1)"
                class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Previous day"
              >
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <button
                type="button"
                @click="changeDailyDaysAgo(-1)"
                :disabled="dailyDaysAgo <= 0"
                class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Next day"
              >
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="isDailyLoading" class="py-6 flex justify-center">
            <div class="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else-if="dailyActivity" class="space-y-3">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div class="text-[11px] text-gray-500 dark:text-gray-400">Flashcards</div>
                <div class="text-lg font-black font-mono text-gray-900 dark:text-white">{{ dailyActivity.totalFlashcards }}</div>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div class="text-[11px] text-gray-500 dark:text-gray-400">Points</div>
                <div class="text-lg font-black font-mono text-gray-900 dark:text-white">+{{ dailyActivity.totalPoints }}</div>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div class="text-[11px] text-gray-500 dark:text-gray-400">Learned</div>
                <div class="text-lg font-black font-mono text-gray-900 dark:text-white">{{ dailyActivity.byAction.MARKED_AS_LEARNED || 0 }}</div>
              </div>
              <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div class="text-[11px] text-gray-500 dark:text-gray-400">Keep Testing</div>
                <div class="text-lg font-black font-mono text-gray-900 dark:text-white">{{ dailyActivity.byAction.MARKED_AS_KEEP_TESTING || 0 }}</div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span>Parked: <strong class="text-gray-900 dark:text-white font-mono">{{ dailyActivity.byAction.MARKED_AS_PARKED || 0 }}</strong></span>
              <span>Deleted: <strong class="text-gray-900 dark:text-white font-mono">{{ dailyActivity.byAction.MARKED_AS_DELETED || 0 }}</strong></span>
              <template v-for="(count, lang) in dailyActivity.byLanguage" :key="lang">
                <span class="inline-flex items-center gap-1.5 font-semibold" :style="{ color: languageColors[lang] || undefined }">
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: languageColors[lang] || '#9ca3af' }"></span>
                  {{ lang.toUpperCase() }}: {{ count }}
                </span>
              </template>
            </div>
          </div>
        </div>

        <!-- Admin Developer Section -->
        <div v-if="isAdmin" class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Developer</h2>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/batches"
              class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white transition-colors"
            >
              Batches
            </NuxtLink>
            <NuxtLink
              to="/dev"
              class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white transition-colors"
            >
              Dev
            </NuxtLink>
          </div>
        </div>

        <!-- Immediate Save Notice -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-5 text-center">
          <p class="text-xs text-gray-400 dark:text-gray-500 italic">
            all changes on this page are saved immediately
          </p>
        </div>
      </div>

      <template #fallback>
        <div class="py-24 flex flex-col items-center justify-center space-y-3">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
