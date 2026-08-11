<script setup lang="ts">
useHead({
  title: 'LangLearn - Activities',
  meta: [
    { name: 'description', content: 'Explore interactive language learning activities.' }
  ]
})

const activities = [
  {
    title: 'Gemini Quiz',
    path: '/activities/gemini-quiz',
    description: 'Prompts to copy and paste into Gemini AI to generate custom quizzes for specific vocabulary, grammar patterns, and CEFR levels.',
    badge: 'Interactive Quiz',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
  },
  {
    title: 'Drag/Drop Words',
    path: '/activities/starred-texts',
    description: 'Practice fill-in-the-blank activities using your flashcards with starred text (*target phrase*). Drag & drop to test recall.',
    badge: 'Interactive',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
  },
  {
    title: 'Learn à/de',
    path: '/activities/learn-a-de',
    description: 'Master prepositions by studying flashcards tagged with "à" and "de" with instant French reveal and quick flashcard editing.',
    badge: 'Grammar',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30'
  }
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Activities</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Choose an activity to practice your language skills and reinforce key vocabulary.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="act in activities"
        :key="act.path"
        :to="act.path"
        class="block p-6 rounded-2xl bg-white dark:bg-[#182030] border border-gray-300 dark:border-gray-700/80 shadow-sm hover:shadow-md hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-200 group flex flex-col justify-between"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
            {{ act.title }}
          </h2>
          <div class="-mt-4 mb-6">
            <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider" :class="act.badgeColor">
              {{ act.badge }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ act.description }}
          </p>
        </div>

        <div class="mt-6 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
          <span>Start activity</span>
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
