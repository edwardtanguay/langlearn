import { ref, onMounted, onUnmounted } from 'vue'

const STORAGE_LAST_ACTIVE_KEY = 'langlearn_last_active_time'
const STORAGE_INACTIVITY_MSG_KEY = 'langlearn_inactivity_message'
const INACTIVITY_LIMIT_MS = 24 * 60 * 60 * 1000 // 24 hours

export const useInactivityCheck = () => {
  const inactivityMessage = useState<string>('inactivityMessage', () => '')

  const recordActivity = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, Date.now().toString())
    } catch (e) {
      // ignore localStorage errors (e.g. private mode quota)
    }
  }

  const checkInactivity = () => {
    if (typeof window === 'undefined') return

    // Pick up any stored inactivity message from before logout
    try {
      const savedMsg = localStorage.getItem(STORAGE_INACTIVITY_MSG_KEY)
      if (savedMsg) {
        inactivityMessage.value = savedMsg
        localStorage.removeItem(STORAGE_INACTIVITY_MSG_KEY)
      }

      const lastActiveStr = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY)
      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10)
        const now = Date.now()
        if (!isNaN(lastActive) && now - lastActive > INACTIVITY_LIMIT_MS) {
          const msg = "app hasn't been used in 24 hours, please log in again"
          localStorage.setItem(STORAGE_INACTIVITY_MSG_KEY, msg)
          localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY)
          inactivityMessage.value = msg

          // Perform logout redirect
          window.location.href = '/api/logout'
          return true
        }
      }
    } catch (e) {
      console.error('Inactivity check error:', e)
    }

    recordActivity()
    return false
  }

  const dismissMessage = () => {
    inactivityMessage.value = ''
    try {
      localStorage.removeItem(STORAGE_INACTIVITY_MSG_KEY)
    } catch (e) {}
  }

  return {
    inactivityMessage,
    checkInactivity,
    recordActivity,
    dismissMessage
  }
}
