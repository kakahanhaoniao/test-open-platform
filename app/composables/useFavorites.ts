import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'ai-platform-favorites'

// Shared state across all component instances
const favorites = ref<string[]>([])
let initialized = false

export function useFavorites() {
  // Load from localStorage on first use (client only)
  onMounted(() => {
    if (process.client && !initialized) {
      initialized = true
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          favorites.value = JSON.parse(stored)
        } catch {
          favorites.value = []
        }
      }
    }
  })

  function save() {
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    }
  }

  function toggleFavorite(id: string) {
    const idx = favorites.value.indexOf(id)
    if (idx >= 0) favorites.value.splice(idx, 1)
    else favorites.value.push(id)
    save()
  }

  function isFavorite(id: string) {
    return favorites.value.includes(id)
  }

  return { favorites, toggleFavorite, isFavorite }
}
