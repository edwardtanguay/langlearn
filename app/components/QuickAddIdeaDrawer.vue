<template>
  <div class="relative">
    <!-- Lightbulb Trigger Button -->
    <button
      @click="toggleDrawer"
      class="p-2 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 focus:outline-none"
      title="Submit a feature idea or bug fix"
      aria-label="Submit feedback or feature request"
    >
      <LightBulbIcon class="w-5 h-5 animate-pulse" />
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

          <form @submit.prevent="submitIdea">
            <!-- Connected Pills Selection Control (Connected to textarea below) -->
            <div class="inline-flex rounded-t-md overflow-hidden border-t border-l border-r border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-medium">
              <button
                type="button"
                @click="form.type = 'BUGFIX'"
                :class="form.type === 'BUGFIX' ? 'bg-white dark:bg-gray-900 text-orange-500 dark:text-orange-400 font-bold border-b-2 border-orange-500 dark:border-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="px-4 py-1.5 transition-colors focus:outline-none"
              >
                Bug fix
              </button>
              <button
                type="button"
                @click="form.type = 'FEATURE'"
                :class="form.type === 'FEATURE' ? 'bg-white dark:bg-gray-900 text-orange-500 dark:text-orange-400 font-bold border-b-2 border-orange-500 dark:border-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="px-4 py-1.5 transition-colors focus:outline-none"
              >
                Feature
              </button>
            </div>

            <!-- Body Input (Connected directly to pills above) -->
            <div>
              <textarea
                v-model="form.body"
                rows="3"
                required
                placeholder="Type your feature request or bug fix here..."
                @keydown.ctrl.enter.prevent="submitIdea"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-b-md rounded-tr-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block"
              ></textarea>
            </div>

            <div class="flex justify-between items-center pt-3">
              <span v-if="feedbackMsg" :class="feedbackError ? 'text-rose-600' : 'text-emerald-600'" class="text-xs font-medium">
                {{ feedbackMsg }}
              </span>
              <span v-else></span>

              <div class="flex space-x-2">
                <button
                  type="button"
                  @click="isOpen = false"
                  class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting || !form.body.trim()"
                  class="px-4 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-sm disabled:opacity-50 transition-colors flex items-center space-x-1"
                >
                  <span v-if="isSubmitting">Submitting...</span>
                  <span v-else>Submit Idea</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LightBulbIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)
const isSubmitting = ref(false)
const feedbackMsg = ref('')
const feedbackError = ref(false)

const form = ref({
  type: 'BUGFIX',
  body: ''
})

const toggleDrawer = () => {
  isOpen.value = !isOpen.value
  feedbackMsg.value = ''
}

const submitIdea = async () => {
  if (!form.value.body.trim()) return

  isSubmitting.value = true
  feedbackMsg.value = ''
  feedbackError.value = false

  try {
    await $fetch('/api/version-items/quick-add', {
      method: 'POST',
      body: {
        type: form.value.type,
        body: form.value.body
      }
    })

    feedbackMsg.value = 'Idea submitted successfully!'
    form.value.body = ''
    setTimeout(() => {
      isOpen.value = false
      feedbackMsg.value = ''
    }, 1500)
  } catch (err: any) {
    feedbackError.value = true
    feedbackMsg.value = err.data?.statusMessage || 'Failed to submit idea.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
