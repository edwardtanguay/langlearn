<script setup lang="ts">
import { TrophyIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Leader Board',
  meta: [
    { name: 'description', content: 'Community leader board of global scores on LangLearn.' }
  ]
})

interface LeaderboardEntry {
  rank: number
  id: string
  firstName: string
  points: number
}

const { loggedIn } = useCurrentUser()

const { data, pending } = await useFetch<{
  isCommunity: boolean
  currentUserId: string
  entries: LeaderboardEntry[]
}>('/api/leaderboard', {
  immediate: loggedIn.value
})
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <TrophyIcon class="w-7 h-7 text-amber-500 dark:text-yellow-400" />
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Leader Board
        </h1>
      </div>
      <NuxtLink
        to="/profile"
        class="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        Profile Settings
      </NuxtLink>
    </div>

    <div v-if="pending" class="py-16 flex justify-center">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div
      v-else-if="data && !data.isCommunity"
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center space-y-4 shadow-sm"
    >
      <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
        <LockClosedIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
      </div>
      <h2 class="text-lg font-bold text-gray-900 dark:text-white">
        Private Mode Active
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        The Leader Board is only visible in Community mode. Switch to Community mode on your profile page to view the Leader Board and share your score.
      </p>
      <div>
        <NuxtLink
          to="/profile"
          class="inline-flex items-center px-4 py-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Go to Profile
        </NuxtLink>
      </div>
    </div>

    <div
      v-else-if="data"
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
    >
      <div v-if="data.entries.length === 0" class="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No community members yet.
      </div>
      <ul v-else class="divide-y divide-gray-100 dark:divide-gray-800">
        <li
          v-for="entry in data.entries"
          :key="entry.id"
          class="flex items-center justify-between px-5 py-4 transition-colors"
          :class="entry.id === data.currentUserId ? 'bg-amber-50/70 dark:bg-yellow-500/10' : ''"
        >
          <div class="flex items-center gap-4">
            <span
              class="w-8 text-center font-mono font-black text-base"
              :class="{
                'text-amber-500 dark:text-yellow-400': entry.rank === 1,
                'text-gray-400 dark:text-gray-300': entry.rank === 2,
                'text-amber-700 dark:text-amber-500': entry.rank === 3,
                'text-gray-500 dark:text-gray-500': entry.rank > 3
              }"
            >
              #{{ entry.rank }}
            </span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ entry.firstName }}
              <span v-if="entry.id === data.currentUserId" class="ml-1.5 text-xs font-normal text-gray-500 dark:text-gray-400">(you)</span>
            </span>
          </div>
          <span class="font-mono font-black text-lg text-gray-900 dark:text-white">
            {{ String(Math.max(0, entry.points)).padStart(5, '0') }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

