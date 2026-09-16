<script setup lang="ts">
import {
  BookOpenIcon,
  SpeakerWaveIcon,
  SparklesIcon,
  CursorArrowRaysIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Activities',
  meta: [
    { name: 'description', content: 'Explore interactive language learning activities.' }
  ]
})

const activities = [
  {
    title: 'Language Basics',
    path: '/activities/language-basics',
    description: 'Interactive flashcards covering essential language basics across four languages.',
    icon: BookOpenIcon,
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40'
  },
  {
    title: 'Pronunciation Practice',
    path: '/activities/pronunciation-practice',
    description: 'Test your pronunciation recall with phonetics reveal, independent progress tracking, and audio pronunciation.',
    icon: SpeakerWaveIcon,
    badgeColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40'
  },
  {
    title: 'Gemini Quiz Prompts',
    path: '/activities/gemini-quiz',
    description: 'Prompts to copy and paste into Gemini\u00A0AI to generate custom quizzes for specific vocabulary, grammar patterns, and CEFR levels.',
    icon: SparklesIcon,
    badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/40'
  },
  {
    title: 'Drag/Drop Highlighted Words',
    path: '/activities/starred-texts',
    description: 'Practice fill-in-the-blank activities using your flashcards with starred text (*target phrase*). Drag & drop to test recall.',
    icon: CursorArrowRaysIcon,
    badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40'
  },
  {
    title: 'Learn à/de',
    path: '/activities/learn-a-de',
    description: 'Master prepositions by studying flashcards tagged with "à" and "de" with instant French reveal and quick flashcard editing.',
    icon: TagIcon,
    badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40'
  }
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Activities</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Choose an activity to practice your language skills and reinforce key vocabulary.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
      <NuxtLink
        v-for="act in activities"
        :key="act.path"
        :to="act.path"
        class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#182030] border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:border-amber-500/70 dark:hover:border-amber-500/70 transition-all duration-200 group flex flex-col justify-start relative"
      >
        <div class="flex items-start gap-3.5 mb-2.5">
          <div
            class="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-105"
            :class="act.badgeColor"
          >
            <component :is="act.icon" class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight pt-1">
              {{ act.title }}
            </h2>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-[46px]">
          {{ act.description }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
