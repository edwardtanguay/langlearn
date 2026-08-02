<script setup lang="ts">
import { computed } from 'vue'

interface Version {
  id: string
  versionNumber: string
  status: string
  publishDate?: string | null
}

const { data: versionData } = useFetch<{ versions: Version[] }>('/api/versions/public')

const targetVersion = computed(() => {
  if (!versionData.value?.versions || versionData.value.versions.length === 0) return null
  const published = versionData.value.versions.filter(v => v.status === 'PUBLISHED')
  return published[0] || versionData.value.versions[0] || null
})

const versionText = computed(() => {
  const num = targetVersion.value?.versionNumber || '0.3.0'
  return num.startsWith('v') ? num : `v${num}`
})

const isNewVersion = computed(() => {
  if (!targetVersion.value?.publishDate) return true
  const pubTime = new Date(targetVersion.value.publishDate).getTime()
  const now = Date.now()
  return (now - pubTime) <= 24 * 60 * 60 * 1000
})
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800 py-2 transition-colors duration-300">
    <div class="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
      <span>See Edward's <a href="https://tanguay.info" target="_blank" rel="noopener noreferrer" class="hover:text-gray-900 dark:hover:text-white transition-colors underline">other projects</a>.</span>
      <span class="text-gray-300 dark:text-gray-700">•</span>
      <NuxtLink
        to="/about"
        class="font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors flex items-center gap-1.5"
      >
        <span>{{ versionText }}</span>
        <span
          v-if="isNewVersion"
          class="bg-emerald-600 text-white text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded shadow-xs leading-none flex items-center gap-1"
        >
          <span>New!</span>
        </span>
      </NuxtLink>
    </div>
  </footer>
</template>