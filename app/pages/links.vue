<script setup lang="ts">
import { ref } from 'vue'
import { ArrowTopRightOnSquareIcon, LinkIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Links',
  meta: [
    { name: 'description', content: 'Explore curated language learning links and videos organized by language to improve comprehension.' }
  ]
})

interface LinkItem {
  id: string
  title: string
  url: string
}

interface LanguageCategory {
  id: string
  code: string
  title: string
  color: string
  links: LinkItem[]
}

const categories = ref<LanguageCategory[]>([
  {
    id: 'fr-links',
    code: 'FR',
    title: 'French',
    color: '#333388', // French dark blue
    links: [
      {
        id: 'fr-1',
        title: 'Entraînez votre oreille pour comprendre le français naturel',
        url: 'https://www.youtube.com/watch?v=LlEWRubU33k'
      },
      {
        id: 'fr-2',
        title: '50 min French pronunciation practice of liasons',
        url: 'https://www.youtube.com/watch?v=wglgzUdEs5I'
      },
      {
        id: 'fr-3',
        title: '30 minutes pronunciation video with Fanny',
        url: 'https://www.youtube.com/watch?v=Bmxdtrv4uQM'
      },
      {
        id: 'fr-4',
        title: 'Paris Podcast Videos',
        url: 'https://www.youtube.com/@ParisPodcast1'
      },
      {
        id: 'fr-5',
        title: 'Cozy French',
        url: 'https://www.youtube.com/@TheCozyFrench/videos'
      },
      {
        id: 'fr-6',
        title: 'La Psyché Français',
        url: 'https://www.youtube.com/@LaPsych%C3%A912/videos'
      }
    ]
  },
  {
    id: 'it-links',
    code: 'IT',
    title: 'Italian',
    color: '#194d19', // Italian green
    links: [
      {
        id: 'it-1',
        title: 'Italiano Facile Videos',
        url: 'https://www.youtube.com/@italianofacile-u5z'
      },
      {
        id: 'it-2',
        title: 'Italian Express Videos',
        url: 'https://www.youtube.com/@ibo-3117/videos'
      }
    ]
  },
  {
    id: 'es-links',
    code: 'ES',
    title: 'Spanish',
    color: '#e11d48', // Spanish vibrant red
    links: [
      {
        id: 'es-1',
        title: 'Spanish Talks Café Videos',
        url: 'https://www.youtube.com/@SpanishTalksCaf%C3%A9/videos'
      },
      {
        id: 'es-2',
        title: 'Easy Spanish Podcast Videos',
        url: 'https://www.youtube.com/@easyspanishpodcast3/videos'
      }
    ]
  }
])
</script>

<template>
  <div class="max-w-5xl mx-auto py-10 px-4 min-h-[600px] space-y-10">
    <!-- Hero Header -->
    <div class="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-2 text-center md:text-left">
        <h1 class="text-2xl md:text-3xl font-black tracking-tight">Links</h1>
        <p class="text-sm text-gray-300 max-w-xl leading-relaxed">
          Hand-picked native videos, tutorials, and websites organized by language to elevate your real-world comprehension.
        </p>
      </div>
    </div>

    <!-- Language Link Categories -->
    <div v-for="category in categories" :key="category.id" class="space-y-4">
      <!-- Category Header (Top Aligned) -->
      <div class="flex items-start gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
        <span
          class="px-2.5 py-0.5 rounded text-xs font-bold text-white shadow-sm uppercase tracking-wider flex items-center justify-center shrink-0"
          :style="{ backgroundColor: category.color }"
        >
          {{ category.code }}
        </span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none -mt-[3px]">
          {{ category.title }}
        </h2>
        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none mt-[3px]">
          ({{ category.links.length }} {{ category.links.length === 1 ? 'link' : 'links' }})
        </span>
      </div>

      <!-- Links List (Bullet Points) -->
      <ul class="list-disc pl-5 space-y-2.5 text-sm">
        <li
          v-for="link in category.links"
          :key="link.id"
          class="text-gray-800 dark:text-gray-200"
        >
          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
          >
            <span>{{ link.title }}</span>
            <ArrowTopRightOnSquareIcon class="w-4 h-4 shrink-0 text-gray-400" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
