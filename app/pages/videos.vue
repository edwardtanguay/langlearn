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
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
          <VideoCameraIcon class="w-4 h-4" />
          <span>Language Learning Media</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-black tracking-tight">Videos</h1>
        <p class="text-sm text-gray-300 max-w-xl leading-relaxed">
          Hand-picked native videos, tutorials, and listening exercises organized by language to elevate your real-world comprehension.
        </p>
      </div>
    </div>

    <!-- Video Categories -->
    <div v-for="category in categories" :key="category.id" class="space-y-6">
      <!-- Category Header -->
      <div class="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
        <span
          class="px-2.5 py-1 rounded text-xs font-bold text-white shadow-sm uppercase tracking-wider"
          :style="{ backgroundColor: category.color }"
        >
          {{ category.code }}
        </span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          {{ category.title }}
        </h2>
        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
          ({{ category.videos.length }} {{ category.videos.length === 1 ? 'video' : 'videos' }})
        </span>
      </div>

      <!-- Video Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="video in category.videos"
          :key="video.id"
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 flex flex-col group"
        >
          <!-- Video Player or Thumbnail -->
          <div class="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            <template v-if="activeEmbedId === video.youtubeId">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`"
                title="YouTube video player"
                class="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </template>
            <template v-else>
              <img
                :src="`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`"
                :alt="video.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <button
                  @click="playVideo(video.youtubeId)"
                  class="w-14 h-14 rounded-full bg-white/90 dark:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer group-hover:bg-indigo-600 group-hover:text-white"
                  title="Play video"
                >
                  <PlayIcon class="w-7 h-7 translate-x-0.5" />
                </button>
              </div>
            </template>
          </div>

          <!-- Video Details -->
          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <h3 class="font-bold text-base text-gray-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <a :href="video.url" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-start gap-1.5">
                  <span>{{ video.title }}</span>
                  <ArrowTopRightOnSquareIcon class="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                </a>
              </h3>
              <p v-if="video.description" class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ video.description }}
              </p>
            </div>

            <!-- Footer Action Links -->
            <div class="pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs">
              <button
                @click="playVideo(video.youtubeId)"
                class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlayIcon class="w-3.5 h-3.5" />
                <span>{{ activeEmbedId === video.youtubeId ? 'Playing' : 'Watch Inline' }}</span>
              </button>
              <a
                :href="video.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 hover:underline"
              >
                <span>Open on YouTube</span>
                <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
