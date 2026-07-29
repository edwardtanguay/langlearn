<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowRightOnRectangleIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - User Profile',
  meta: [
    { name: 'description', content: 'User profile details and settings on LangLearn.' }
  ]
})

const auth = useAuth()
const loggedIn = computed(() => auth?.loggedIn ?? false)
const user = computed(() => auth?.user ?? null)

// Redirect if not logged in
onMounted(() => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

// Fetch user's flashcards count
const { data: flashcards, refresh: refreshFlashcards } = useFetch('/api/flashcards', {
  query: { all: 'true' }
})

const flashcardCount = computed(() => flashcards.value ? flashcards.value.length : 0)

// Confirmation modal state
const showConfirmModal = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const openConfirmModal = () => {
  deleteError.value = null
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  if (!isDeleting.value) {
    showConfirmModal.value = false
  }
}

const handleDeleteAllFlashcards = async () => {
  isDeleting.value = true
  deleteError.value = null

  try {
    const res = await $fetch<{ success: boolean; count: number; message: string }>('/api/flashcards/delete-all', {
      method: 'POST'
    })

    showConfirmModal.value = false
    await refreshFlashcards()
    
    // Redirect to home page after success
    navigateTo('/')
  } catch (err: any) {
    console.error('Failed to delete flashcards:', err)
    deleteError.value = err.data?.statusMessage || err.message || 'Failed to delete flashcards. Please try again.'
  } finally {
    isDeleting.value = false
  }
}

const handleLogout = () => {
  navigateTo('/api/logout', { external: true })
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
          </div>
        </div>

        <!-- Account Stats & Details -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
          <div class="flex justify-between items-center text-sm py-1">
            <span class="text-gray-500 dark:text-gray-400">Total Flashcards</span>
            <span class="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {{ flashcardCount }}
            </span>
          </div>

          <div class="flex justify-between items-center text-sm py-1">
            <span class="text-gray-500 dark:text-gray-400">Authentication Method</span>
            <span class="font-medium text-gray-900 dark:text-white">Kinde Auth</span>
          </div>
        </div>

        <!-- Danger Zone & Actions -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="w-full px-6 py-3 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 dark:text-gray-200 font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            <span>Logout</span>
          </button>

          <!-- Centered Dark Red Text Link for Delete All Flashcards -->
          <div class="pt-2 text-center">
            <button
              @click="openConfirmModal"
              class="text-xs text-red-800 dark:text-red-900 hover:text-red-600 dark:hover:text-red-400 hover:underline transition-colors font-medium cursor-pointer"
            >
              Delete all flashcards
            </button>
          </div>
        </div>
      </div>

      <template #fallback>
        <div class="py-24 flex flex-col items-center justify-center space-y-3">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </template>
    </ClientOnly>

    <!-- Confirmation Modal Dialog -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 dark:border-red-900/40 space-y-5 text-left">
          
          <div class="flex items-start gap-4">
            <div class="p-3 bg-red-100 dark:bg-red-950/60 rounded-full text-red-600 dark:text-red-400 shrink-0">
              <ExclamationTriangleIcon class="w-7 h-7" />
            </div>
            <div class="space-y-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Are you sure?</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                This action will permanently delete all <strong class="text-red-600 dark:text-red-400">{{ flashcardCount }}</strong> flashcards in your collection.
              </p>
              <p class="text-xs text-red-500 font-medium">This cannot be undone.</p>
            </div>
          </div>

          <div v-if="deleteError" class="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg">
            {{ deleteError }}
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              @click="closeConfirmModal"
              :disabled="isDeleting"
              class="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteAllFlashcards"
              :disabled="isDeleting"
              class="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="isDeleting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isDeleting ? 'Deleting...' : 'Yes, delete all flashcards' }}</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>
