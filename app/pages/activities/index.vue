<script setup lang="ts">
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
    description: 'Interactive flashcards covering essential language basics across four languages.'
  },
  {
    title: 'Pronunciation Practice',
    path: '/activities/pronunciation-practice',
    description: 'Test your pronunciation recall with phonetics reveal, independent progress tracking, and audio pronunciation.'
  },
  {
    title: 'Gemini Quiz Prompts',
    path: '/activities/gemini-quiz',
    description: 'Prompts to copy and paste into Gemini\u00A0AI to generate custom quizzes for specific vocabulary, grammar patterns, and CEFR levels.'
  },
  {
    title: 'Drag/Drop Highlighted Words',
    path: '/activities/starred-texts',
    description: 'Practice fill-in-the-blank activities using your flashcards with starred text (*target phrase*). Drag & drop to test recall.'
  },
  {
    title: 'Learn à/de',
    path: '/activities/learn-a-de',
    description: 'Master prepositions by studying flashcards tagged with "à" and "de" with instant French reveal and quick flashcard editing.'
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
        class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#182030] border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:border-amber-500/70 dark:hover:border-amber-500/70 transition-all duration-200 group flex flex-col justify-start relative overflow-hidden"
      >
        <div class="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 group-hover:bg-amber-500 transition-colors"></div>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight mb-2.5">
            {{ act.title }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ act.description }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
