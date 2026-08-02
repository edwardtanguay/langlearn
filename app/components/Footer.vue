<script setup lang="ts">
import { computed } from 'vue'

interface Version {
  id: string
  versionNumber: string
  status: string
  publishDate?: string | null
}

const { data: versionData } = useFetch<{ versions: Version[] }>('/api/versions/public')

const latestPublishedVersion = computed(() => {
  if (!versionData.value?.versions) return null
  const published = versionData.value.versions.filter(v => v.status === 'PUBLISHED')
  return published[0] || versionData.value.versions[0] || null
})

const isNewVersion = computed(() => {
  if (!latestPublishedVersion.value?.publishDate) return false
  const pubTime = new Date(latestPublishedVersion.value.publishDate).getTime()
  const now = Date.now()
  return (now - pubTime) <= 24 * 60 * 60 * 1000
})
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xs border-t border-gray-200 dark:border-gray-800 py-2.5 transition-colors duration-300">
    <div class="container-custom flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
      <span>See Edward's <a href="https://tanguay.info" target="_blank" class="hover:text-gray-900 dark:hover:text-white transition-colors">other projects</a>.</span>
      <span class="text-gray-300 dark:text-gray-700">•</span>
      <NuxtLink
        to="/about"
        class="font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white no-underline transition-colors flex items-center gap-1"
      >
        <span>v{{ latestPublishedVersion?.versionNumber || '0.3.0' }}</span>
        <span
          v-if="isNewVersion"
          class="bg-emerald-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-xs leading-none"
        >
          New!
        </span>
      </NuxtLink>
    </div>
  </footer>
</template>