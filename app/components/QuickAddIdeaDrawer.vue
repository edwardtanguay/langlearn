<template>
  <div class="relative">
    <!-- Lightbulb Trigger Button -->
    <button
      @click="toggleDrawer"
      class="p-2 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 focus:outline-none"
      title="Submit a feature idea or bug fix"
      aria-label="Submit feedback or feature request"
    >
      <LightBulbIcon class="w-5 h-5" />
      <span class="text-xs font-semibold hidden sm:inline text-amber-600 dark:text-amber-400">Have an idea?</span>
    </button>

    <!-- Top Drawer Overlay Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-x-0 top-16 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl p-4 md:p-6"
      >
        <div class="max-w-3xl mx-auto relative">
          <!-- Close Button -->
          <div class="flex justify-end mb-2">
            <button
              @click="isOpen = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <fieldset :disabled="isSubmitting || feedbackMsg !== ''" class="contents space-y-3">
            <form @submit.prevent="submitIdea">
              <!-- Connected Pills Selection Control -->
              <div class="inline-flex rounded-t-md overflow-hidden border-t border-l border-r border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                <button
                  type="button"
                  @click="form.type = 'BUGFIX'"
                  :disabled="isSubmitting || feedbackMsg !== ''"
                  :class="form.type === 'BUGFIX' ? 'bg-white dark:bg-gray-900 text-[#ea580c] font-bold border-b-2 border-[#ea580c]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                  class="px-4 py-1.5 transition-colors focus:outline-none disabled:opacity-50"
                >
                  Bug fix
                </button>
                <button
                  type="button"
                  @click="form.type = 'FEATURE'"
                  :disabled="isSubmitting || feedbackMsg !== ''"
                  :class="form.type === 'FEATURE' ? 'bg-white dark:bg-gray-900 text-[#16a34a] font-bold border-b-2 border-[#16a34a]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                  class="px-4 py-1.5 transition-colors focus:outline-none disabled:opacity-50"
                >
                  Feature
                </button>
              </div>

              <!-- Body Input -->
              <div>
                <textarea
                  ref="textareaRef"
                  v-model="form.body"
                  rows="3"
                  required
                  :disabled="isSubmitting || feedbackMsg !== ''"
                  :placeholder="form.type === 'BUGFIX' ? 'Describe a bug here...' : 'Describe a feature request here...'"
                  @keydown.ctrl.enter.prevent="submitIdea"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700/80 rounded-b-md rounded-tr-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 block disabled:opacity-50 transition-all"
                ></textarea>
              </div>

              <!-- Rank Slider (Red to Green, defaults to 2.5) -->
              <div class="mt-3 space-y-1">
                <div class="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-gray-400 px-0.5">
                  <span>Priority</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.0001"
                  v-model.number="form.rank"
                  :disabled="isSubmitting || feedbackMsg !== ''"
                  class="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-50 transition-all"
                  style="background: linear-gradient(to right, #ef4444 0%, #eab308 50%, #16a34a 100%);"
                />
              </div>

              <div class="flex justify-between items-center pt-3">
                <span v-if="feedbackMsg" :class="feedbackError ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'" class="text-xs font-semibold animate-pulse">
                  {{ feedbackMsg }}
                </span>
                <span v-else></span>

                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="isOpen = false"
                    :disabled="isSubmitting"
                    class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="isSubmitting || !form.body.trim() || feedbackMsg !== ''"
                    class="px-4 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-md shadow-sm disabled:opacity-50 transition-colors flex items-center space-x-1"
                  >
                    <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                    <span>{{ isSubmitting ? 'Submitting...' : 'Submit Idea' }}</span>
                  </button>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { LightBulbIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

// Global shared modal states for mutual exclusion
const isOpen = useState('isIdeaBoxOpen', () => false)
const isStatsOpen = useState('isStatsOpen', () => false)

const isSubmitting = ref(false)
const feedbackMsg = ref('')
const feedbackError = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const form = ref({
  type: 'BUGFIX',
  body: '',
  rank: 2.5
})

// Auto-close on route change
watch(() => route.path, () => {
  isOpen.value = false
})

// Focus input box on drawer open & handle mutual exclusion with stats modal
watch(isOpen, (newVal) => {
  if (newVal) {
    isStatsOpen.value = false // Mutual exclusion: close stats modal
    feedbackMsg.value = ''
    nextTick(() => {
      textareaRef.value?.focus()
    })
  }
})

const toggleDrawer = () => {
  isOpen.value = !isOpen.value
}

const submitIdea = async () => {
  if (!form.value.body.trim() || isSubmitting.value) return

  isSubmitting.value = true
  feedbackMsg.value = ''
  feedbackError.value = false

  try {
    const formattedRank = Math.max(0, Math.min(5, parseFloat(form.value.rank.toFixed(4))))
    const res = await $fetch<{ success: boolean; item: any }>('/api/version-items/quick-add', {
      method: 'POST',
      body: {
        type: form.value.type,
        body: form.value.body,
        rank: formattedRank
      }
    })

    const nuxtApp = useNuxtApp()
    nuxtApp.callHook('idea-added' as any, res.item)

    feedbackMsg.value = form.value.type === 'BUGFIX' 
      ? 'Thanks for the bug report!' 
      : 'Thanks for the feature request!'

    form.value.body = ''
    form.value.rank = 2.5

    setTimeout(() => {
      isOpen.value = false
      feedbackMsg.value = ''
    }, 2000)
  } catch (err: any) {
    feedbackError.value = true
    feedbackMsg.value = err.data?.statusMessage || 'Failed to submit idea.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
