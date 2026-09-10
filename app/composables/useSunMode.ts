import { watch, onMounted } from 'vue'

export const useSunMode = () => {
  const isSunMode = useState<boolean>('isSunMode', () => false)

  const applySunModeClass = (val: boolean) => {
    if (typeof document !== 'undefined') {
      if (val) {
        document.documentElement.classList.add('sun-mode')
      } else {
        document.documentElement.classList.remove('sun-mode')
      }
    }
  }

  onMounted(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('langlearn_sun_mode')
      if (saved === 'true') {
        isSunMode.value = true
        applySunModeClass(true)
      }
    }
  })

  watch(isSunMode, (newVal) => {
    applySunModeClass(newVal)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('langlearn_sun_mode', newVal ? 'true' : 'false')
    }
  })

  const toggleSunMode = () => {
    isSunMode.value = !isSunMode.value
  }

  return {
    isSunMode,
    toggleSunMode
  }
}
