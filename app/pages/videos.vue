<script setup lang="ts">
import { ref } from 'vue'
import { VideoCameraIcon, ArrowTopRightOnSquareIcon, PlayIcon } from '@heroicons/vue/24/outline'

useHead({
  title: 'LangLearn - Videos',
  meta: [
    { name: 'description', content: 'Explore curated French videos to train your ear and improve comprehension of natural French.' }
  ]
})

interface VideoItem {
  id: string
  title: string
  url: string
  youtubeId: string
  description?: string
}

interface VideoCategory {
  id: string
  code: string
  title: string
  color: string // Language color reference per AGENTS.md rule
  videos: VideoItem[]
}

const categories = ref<VideoCategory[]>([
  {
    id: 'fr-videos',
    code: 'FR',
    title: 'Vidéos en français',
    color: '#333388', // French dark blue color
    videos: [
      {
        id: '1',
        title: 'Entraînez votre oreille pour comprendre le français naturel',
        url: 'https://www.youtube.com/watch?v=LlEWRubU33k',
        youtubeId: 'LlEWRubU33k',
        description: 'Immerse yourself in authentic French spoken at natural speed with clear guidance and tips to sharpen your listening comprehension.'
      }
    ]
  }
])

const activeEmbedId = ref<string | null>(null)

function playVideo(youtubeId: string) {
  activeEmbedId.value = youtubeId
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-10 px-4 min-h-[600px] space-y-10">
    <!-- Hero Header -->
    <div class="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-2 text-center md:text-left">
        <h1 class="text-2xl md:text-3xl font-black tracking-tight">Videos</h1>
        <p class="text-sm text-gray-300 max-w-xl leading-relaxed">
          Hand-picked native videos, tutorials, and listening exercises organized by language to elevate your real-world comprehension.
        </p>
      </div>
    </div>

    <!-- Video Categories -->
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
          ({{ category.videos.length }} {{ category.videos.length === 1 ? 'video' : 'videos' }})
        </span>
      </div>

      <!-- Video List (Bullet Points) -->
      <ul class="list-disc pl-5 space-y-2 text-sm">
        <li
          v-for="video in category.videos"
          :key="video.id"
          class="text-gray-800 dark:text-gray-200"
        >
          <a
            :href="video.url"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
          >
            <span>{{ video.title }}</span>
            <ArrowTopRightOnSquareIcon class="w-4 h-4 shrink-0 text-gray-400" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
