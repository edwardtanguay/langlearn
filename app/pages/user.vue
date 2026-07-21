<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - User Profile',
  meta: [
    { name: 'description', content: 'User profile details on LangLearn, the 10-language learning platform.' }
  ]
})

const auth = useAuth()
const loggedIn = computed(() => auth?.loggedIn ?? false)
const user = computed(() => auth?.user ?? null)

// If not logged in, redirect to home page
onMounted(() => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

const handleLogout = () => {
  navigateTo('/api/logout', { external: true })
}
</script>

<template>
  <div class="max-w-md mx-auto py-8 sm:py-16 px-0 sm:px-4 space-y-6">
    <ClientOnly>
      <div v-if="loggedIn && user" class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-8 space-y-6 text-center">
        <div class="flex flex-col items-center space-y-4">
          <!-- Avatar -->
          <div class="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-inner">
            <img v-if="user.picture" :src="user.picture" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ user.given_name?.[0] || 'U' }}</span>
          </div>
          
          <!-- Name & Email -->
          <div>
            <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">
              {{ user.given_name }} {{ user.family_name }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ user.email || 'No email provided' }}
            </p>
          </div>
        </div>

        <!-- Details list -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-6 text-left space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Authentication Method</span>
            <span class="font-medium text-gray-900 dark:text-white">Kinde Auth</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-4 flex flex-col gap-3">
          <button
            @click="handleLogout"
            class="w-full px-6 py-3 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 dark:text-gray-200 font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            <span>Logout</span>
          </button>
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
