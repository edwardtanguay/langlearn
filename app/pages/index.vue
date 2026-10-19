<script setup lang="ts">
import { SparklesIcon, LinkIcon, InformationCircleIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Welcome',
  meta: [
    { name: 'description', content: 'Welcome to LangLearn - An interactive platform to master languages with native context, curated links, and AI prompts.' }
  ]
})

const { loggedIn, isAdmin, fetchRole } = useCurrentUser()

// If authenticated, redirect immediately based on role
if (loggedIn.value) {
  const role = await fetchRole()
  if (role === 'admin') {
    navigateTo('/flashcard', { replace: true })
  } else {
    try {
      const headers = useRequestHeaders(['cookie'])
      const stats = await $fetch<{ totalCount?: number }>('/api/flashcards/stats', { headers })
      if ((stats?.totalCount ?? 0) > 0) {
        navigateTo('/flashcard', { replace: true })
      } else {
        navigateTo('/member', { replace: true })
      }
    } catch {
      navigateTo('/member', { replace: true })
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12">
    <!-- Hero Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-gray-900 to-black border border-indigo-900/40 p-8 sm:p-12 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-4 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
          Language Learning Platform
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Welcome to <span class="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">LangLearn</span>
        </h1>
        <p class="text-base sm:text-lg text-gray-300 leading-relaxed">
          An interactive platform designed to help you learn languages faster and with a personal approach. Explore native video materials, generate targeted AI quizzes, and practice real-world language patterns.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
        <a
          href="/api/login"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeftEndOnRectangleIcon class="w-5 h-5" />
          <span>Login with your Google Account</span>
        </a>
      </div>
    </div>

    <!-- Explanatory Site Guide with In-Text Links -->
    <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 shadow-xl space-y-6">
      <h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
        Explore LangLearn Pages
      </h2>
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
        LangLearn offers resources available directly to all visitors. Test your skills using our
        <NuxtLink to="/activities/gemini-quiz" class="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50 hover:decoration-indigo-400 transition-colors">
          Gemini Quiz Prompts
        </NuxtLink>
        activity to create dynamic conversational tests in any supported language. You can also explore our curated
        <NuxtLink to="/links" class="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50 hover:decoration-indigo-400 transition-colors">
          Links Directory
        </NuxtLink>
        for hand-picked native listening and grammar videos, or check out our release history and upcoming features on the
        <NuxtLink to="/about" class="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50 hover:decoration-indigo-400 transition-colors">
          About &amp; Roadmap
        </NuxtLink>
        page.
      </p>

      <!-- Feature Highlights Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <NuxtLink
          to="/activities/gemini-quiz"
          class="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-3 shadow-xs"
        >
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
              <SparklesIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
              Gemini Quiz Prompts
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Copy curated AI prompts tailored to your target language and level.
            </p>
          </div>
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Try activity &rarr;
          </span>
        </NuxtLink>

        <NuxtLink
          to="/links"
          class="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-3 shadow-xs"
        >
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
              <LinkIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
              Links &amp; Videos
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Curated videos and resources for high-immersion language learning.
            </p>
          </div>
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Browse links &rarr;
          </span>
        </NuxtLink>

        <NuxtLink
          to="/about"
          class="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-3 shadow-xs"
        >
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
              <InformationCircleIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
              About &amp; Roadmap
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Explore the design philosophy, release roadmap, and feature history.
            </p>
          </div>
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View roadmap &rarr;
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
