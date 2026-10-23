export const useInactivityCheck = () => {
  const inactivityMessage = useState<string>('inactivityMessage', () => '')

  const recordActivity = () => {}

  const checkInactivity = () => {
    if (typeof window === 'undefined') return false
    try {
      localStorage.removeItem('langlearn_inactivity_message')
      localStorage.removeItem('langlearn_last_active_time')
    } catch (e) {}
    inactivityMessage.value = ''
    return false
  }

  const dismissMessage = () => {
    inactivityMessage.value = ''
  }

  return {
    inactivityMessage,
    checkInactivity,
    recordActivity,
    dismissMessage
  }
}
