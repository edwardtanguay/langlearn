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
    <div class="flex items-center justify-center gap-2.5 text-xs text-gray-600 dark:text-gray-400">
      <!-- 1. LangLearn + Version Link (no-underline) + Green New! Flag -->
      <div class="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-gray-200">
        <span class="font-extrabold text-gray-900 dark:text-white">LangLearn</span>
        <NuxtLink
          to="/about"
          class="font-mono text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors flex items-center gap-1"
        >
          <span>{{ versionText }}</span>
        </NuxtLink>
        <span
          v-if="isNewVersion"
          class="bg-emerald-600 text-white text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded shadow-xs leading-none"
        >
          New!
        </span>
      </div>

      <!-- 2. Cool, subtle icon in the middle -->
      <div class="flex items-center justify-center px-0.5 text-amber-500/80 dark:text-amber-400/80">
        <svg class="w-3.5 h-3.5 transform transition-transform hover:scale-125 duration-300 opacity-80 hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <!-- 3. See Edward's other projects -->
      <div class="flex items-center gap-1.5">
        <span>See Edward's <a href="https://tanguay.info" target="_blank" rel="noopener noreferrer" class="hover:text-gray-900 dark:hover:text-white transition-colors underline">other projects</a>.</span>
      </div>
    </div>
  </footer>
</template>