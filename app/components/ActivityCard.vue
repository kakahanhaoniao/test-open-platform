<script setup lang="ts">
import type { Activity } from '~/data/mock'

const props = defineProps<{
  activity: Activity
}>()

const now = ref(new Date())

// Update time every second
onMounted(() => {
  const timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
  onUnmounted(() => clearInterval(timer))
})

const daysLeft = computed(() => {
  const end = new Date(props.activity.endDate)
  const diff = end.getTime() - now.value.getTime()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const hoursLeft = computed(() => {
  const end = new Date(props.activity.endDate)
  const diff = end.getTime() - now.value.getTime()
  if (diff <= 0) return 0
  return Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
})

const minutesLeft = computed(() => {
  const end = new Date(props.activity.endDate)
  const diff = end.getTime() - now.value.getTime()
  if (diff <= 0) return 0
  return Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
})
</script>

<template>
  <NuxtLink :to="`/market/${activity.id}`" class="block card-hover">
    <div
      class="rounded-xl overflow-hidden relative"
      :class="`bg-gradient-to-br ${activity.gradient}`"
    >
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;" />

      <div class="relative z-10 p-6">
        <!-- Top row: icon + badges -->
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <UIcon :name="activity.icon" class="w-6 h-6 text-white" />
          </div>
          <div class="flex items-center gap-1.5">
            <span
              v-if="activity.hot"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/20 text-white font-medium backdrop-blur-sm"
            >
              <UIcon name="i-lucide-flame" class="w-3 h-3 mr-0.5" />
              热门
            </span>
            <span
              v-if="activity.new"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white font-medium backdrop-blur-sm"
            >
              NEW
            </span>
          </div>
        </div>

        <!-- Discount badge -->
        <div class="mb-4">
          <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
            <span class="text-2xl font-bold text-white">{{ activity.discount }}</span>
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-white mb-1">{{ activity.title }}</h3>
        <p class="text-white/70 text-sm mb-4">{{ activity.subtitle }}</p>

        <!-- Countdown -->
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-clock" class="w-4 h-4 text-white/60" />
          <div class="flex items-center gap-1">
            <span class="inline-flex items-center justify-center w-8 h-7 rounded bg-white/15 text-white text-sm font-mono font-bold">
              {{ String(daysLeft).padStart(2, '0') }}
            </span>
            <span class="text-white/50 text-xs">天</span>
            <span class="inline-flex items-center justify-center w-8 h-7 rounded bg-white/15 text-white text-sm font-mono font-bold">
              {{ String(hoursLeft).padStart(2, '0') }}
            </span>
            <span class="text-white/50 text-xs">时</span>
            <span class="inline-flex items-center justify-center w-8 h-7 rounded bg-white/15 text-white text-sm font-mono font-bold">
              {{ String(minutesLeft).padStart(2, '0') }}
            </span>
            <span class="text-white/50 text-xs">分</span>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
            {{ activity.ctaText }}
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
