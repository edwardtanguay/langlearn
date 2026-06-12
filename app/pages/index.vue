<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'LangLearn',
  meta: [
    { name: 'description', content: 'LangLearn is a web application used to learn 10 languages.' }
  ]
})

const config = useRuntimeConfig()
const isBypass = config.public.bypassAuth

const auth = !isBypass ? useAuth() : null
const loggedIn = computed(() => isBypass ? true : (auth?.loggedIn ?? false))
const user = computed(() => isBypass ? { given_name: 'Local', family_name: 'Developer', email: 'local.developer@example.com', picture: null } : (auth?.user ?? null))

const handleLogout = () => {
  if (isBypass) {
    alert("Auth bypass mode is enabled. In production, this will log you out via Kinde.")
  } else {
    navigateTo('/api/logout', { external: true })
  }
}

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

// Fetch tasks from our new GET API endpoint (only when logged in)
const { data: tasks, refresh, status } = await useFetch<Task[]>('/api/tasks', {
  immediate: loggedIn.value
})
const newTaskTitle = ref('')
const isAdding = ref(false)
const deletingId = ref<string | null>(null)

async function handleAddTask() {
  if (!newTaskTitle.value.trim() || isAdding.value) return
  isAdding.value = true
  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: { title: newTaskTitle.value.trim() }
    })
    newTaskTitle.value = ''
    await refresh()
  } catch (error) {
    console.error('Failed to add task:', error)
  } finally {
    isAdding.value = false
  }
}

async function handleDeleteTask(id: string) {
  if (deletingId.value) return
  deletingId.value = id
  try {
    await $fetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error) {
    console.error('Failed to delete task:', error)
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 sm:py-16 px-0 sm:px-4 space-y-6">
    <ClientOnly>
      <!-- Logged In: Task Manager View -->
      <div v-if="loggedIn" class="space-y-8">
        <!-- Header Section -->
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            LangLearn
          </h1>
          <p class="text-lg text-gray-500 dark:text-gray-400">
            An interactive site used to learn 10 languages.
          </p>
        </div>

        <!-- Card Container -->
        <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-8 space-y-6">
          <!-- Add Task Form -->
          <form @submit.prevent="handleAddTask" class="flex gap-2">
            <input
              v-model="newTaskTitle"
              type="text"
              required
              placeholder="Add a new task..."
              class="flex-1 min-w-0 px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-950 dark:text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              :disabled="isAdding"
            />
            <button
              type="submit"
              :disabled="isAdding || !newTaskTitle.trim()"
              class="px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all flex items-center gap-2 shrink-0"
            >
              <span v-if="isAdding" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Add
            </button>
          </form>

          <!-- Loading state -->
          <div v-if="status === 'pending' && (!tasks || tasks.length === 0)" class="py-12 flex flex-col items-center justify-center space-y-3">
            <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-gray-500">Retrieving tasks...</p>
          </div>

          <!-- Task List -->
          <div v-else-if="tasks && tasks.length > 0" :class="{ 'opacity-60 pointer-events-none': status === 'pending' }" class="divide-y divide-gray-100 dark:divide-gray-800 max-h-[400px] overflow-y-auto pr-1 transition-opacity duration-200">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="py-4 flex items-center justify-between group animate-fade-in"
            >
              <div class="flex items-center space-x-3">
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span class="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {{ task.title }}
                </span>
              </div>
              
              <button
                @click="handleDeleteTask(task.id)"
                :disabled="deletingId === task.id"
                class="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                aria-label="Delete task"
              >
                <svg v-if="deletingId === task.id" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="status !== 'pending'" class="text-center py-12 space-y-2">
            <p class="text-gray-400 dark:text-gray-500 font-medium">No tasks found</p>
            <p class="text-sm text-gray-400">Add some above to verify your database integration!</p>
          </div>
        </div>
      </div>

      <!-- Logged Out: Welcome & Landing View -->
      <div v-else class="space-y-8 text-center py-12">
        <!-- Header Section -->
        <div class="space-y-2">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            LangLearn
          </h1>
          <p class="text-lg text-gray-500 dark:text-gray-400">
            An interactive site used to learn 10 languages.
          </p>
        </div>

        <!-- Welcome Card -->
        <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-12 space-y-6">
          <div class="space-y-2">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome, friend!</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Please log in with your account to view and manage your personal tasks. You can also explore public sections of the application below.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <a
              href="/api/login"
              class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 !text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Login with Google
            </a>
            <NuxtLink
              to="/about"
              class="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
            >
              About LangLearn
            </NuxtLink>
          </div>
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

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>
