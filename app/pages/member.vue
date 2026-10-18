<script setup lang="ts">
import { computed } from 'vue'
import { SparklesIcon, LinkIcon, InformationCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Member Area',
  meta: [
    { name: 'description', content: 'LangLearn member area with available activities and resources.' }
  ]
})

const config = useRuntimeConfig()
const isBypass = computed(() => Boolean(config.public.bypassAuth))
const auth = useAuth()
const user = computed(() => isBypass.value ? { given_name: 'Member' } : (auth?.user ?? null))
</script>

<template>
  <div class="max-w-4xl mx-auto py-10 px-4 space-y-8 min-h-[600px]">
    <!-- Welcome Header -->
    <div class="space-y-2">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Welcome{{ user?.given_name ? `, ${user.given_name}` : '' }}!
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
        Welcome to LangLearn. Below are your currently available language activities and resources.
      </p>
    </div>

    <!-- Announcement Note Banner -->
    <div class="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 shadow-xs flex items-start gap-4">
      <div class="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0 mt-0.5">
        <ClockIcon class="w-6 h-6" />
      </div>
      <div class="space-y-1.5">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          Notice for Members
        </h2>
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Currently, features for members are limited to our curated interactive activities and study links. New features and expanded learning tools will begin to be added starting in <strong>mid-October 2026</strong>.
        </p>
      </div>
    </div>

    <!-- Available Member Activities & Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
      <!-- Gemini Activity Card -->
      <NuxtLink
        to="/activities/gemini-quiz"
        class="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
      >
        <div class="space-y-3">
          <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
            <SparklesIcon class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            Gemini Quiz Prompts
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Generate custom AI-powered interactive quizzes to test and strengthen your French vocabulary and grammar.
          </p>
        </div>
        <div class="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
          <span>Open activity →</span>
        </div>
      </NuxtLink>

      <!-- Useful Links Card -->
      <NuxtLink
        to="/links"
        class="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
      >
        <div class="space-y-3">
          <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
            <LinkIcon class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            Language Learning Links
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Curated list of high-impact videos, tutorials, and websites categorized by language to improve comprehension.
          </p>
        </div>
        <div class="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
          <span>Explore links →</span>
        </div>
      </NuxtLink>

      <!-- About Page Card -->
      <NuxtLink
        to="/about"
        class="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 md:col-span-2"
      >
        <div class="space-y-2">
          <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
            <InformationCircleIcon class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            About LangLearn
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Read about the methodology, release versions, and roadmap behind the LangLearn platform.
          </p>
        </div>
        <div class="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
          <span>Read more →</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
