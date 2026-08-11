<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'LangLearn - Gemini Quiz Prompts',
  meta: [
    { name: 'description', content: 'Prompts to copy into Gemini AI to generate custom language quizzes.' }
  ]
})

const copiedIndex = ref<number | null>(null)

const prompts = [
  {
    title: 'verb "to sit"',
    promptText: 'Create a quiz in French that tests the user on the word "to sit" in various conjugations and contexts.'
  },
  {
    title: 'tout, tous, toute, toutes',
    promptText: 'Create a French grammar quiz testing the distinctions and usage of tout, tous, toute, and toutes with practice sentences.'
  },
  {
    title: 'phrases that use à or de',
    promptText: 'Create a French quiz focusing on choosing between the prepositions "à" and "de" in common verb and adjective structures.'
  },
  {
    title: 'B1 topics',
    promptText: 'Create a French vocabulary and reading comprehension quiz tailored for B1 level learners covering everyday topics and intermediate grammar.'
  },
  {
    title: 'passé composé vs passé simple',
    promptText: 'Create a French grammar quiz contrasting passé composé and passé simple usage in contextual sentences.'
  }
]

async function copyPrompt(text: string, index: number) {
  try {
    await navigator.clipboard.writeText(text)
    copiedIndex.value = index
    setTimeout(() => {
      if (copiedIndex.value === index) {
        copiedIndex.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Failed to copy prompt to clipboard:', err)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <div class="flex items-center gap-3">
      <NuxtLink to="/activities" class="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        ← Back to Activities
      </NuxtLink>
    </div>

    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gemini Quiz Prompts</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
        Click any prompt button below to copy the prompt to your clipboard, then paste it directly into 
        <a href="https://gemini.google.com" target="_blank" rel="noopener" class="text-purple-600 dark:text-purple-400 underline hover:opacity-80">Gemini AI</a> 
        to generate an interactive quiz.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(p, idx) in prompts"
        :key="idx"
        class="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-4"
      >
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white mb-2">
            {{ p.title }}
          </h2>
          <p class="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-800/80 leading-relaxed">
            "{{ p.promptText }}"
          </p>
        </div>

        <button
          @click="copyPrompt(p.promptText, idx)"
          class="w-full py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          :class="copiedIndex === idx 
            ? 'bg-emerald-600 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'"
        >
          <template v-if="copiedIndex === idx">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>Copied to Clipboard!</span>
          </template>
          <template v-else>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 002 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            <span>Copy Prompt</span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
