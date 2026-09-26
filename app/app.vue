<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const isInitialLoading = useState('isInitialLoading', () => true)
const { inactivityMessage, checkInactivity, recordActivity, dismissMessage } = useInactivityCheck()

let throttledTimer: ReturnType<typeof setTimeout> | null = null
const onUserActivity = () => {
  if (throttledTimer) return
  throttledTimer = setTimeout(() => {
    throttledTimer = null
    recordActivity()
  }, 10000)
}

const onVisibilityChange = () => {
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
    checkInactivity()
  }
}

onMounted(() => {
  checkInactivity()
  window.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('focus', checkInactivity)
  window.addEventListener('pointerdown', onUserActivity, { passive: true })
  window.addEventListener('keydown', onUserActivity, { passive: true })
  window.addEventListener('touchstart', onUserActivity, { passive: true })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('focus', checkInactivity)
    window.removeEventListener('pointerdown', onUserActivity)
    window.removeEventListener('keydown', onUserActivity)
    window.removeEventListener('touchstart', onUserActivity)
  }
})
</script>

<template>
  <UApp>
    <!-- 24h Inactivity Stale State Alert Banner -->
    <div
      v-if="inactivityMessage"
      class="bg-amber-600 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 z-50 sticky top-0 shadow-md"
    >
      <svg class="w-5 h-5 shrink-0 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ inactivityMessage }}</span>
      <button
        @click="dismissMessage"
        class="ml-2 text-white hover:text-amber-100 font-bold px-2 py-0.5 rounded cursor-pointer"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
/* Global styles can go here if needed */
</style>