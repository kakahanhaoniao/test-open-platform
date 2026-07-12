<script setup lang="ts">
import { activities, models, apps } from '~/data/mock'

useHead({
  title: '优惠活动 - 奇安信AI开放平台',
  meta: [
    { name: 'description', content: '奇安信AI开放平台优惠活动' }
  ]
})

const categories = ['全部', '限时折扣', '免费体验', '新客专享', '企业优惠'] as const
type Category = typeof categories[number]
const activeCategory = ref<Category>('全部')

const filteredActivities = computed(() => {
  if (activeCategory.value === '全部') return activities
  return activities.filter(a => a.category === activeCategory.value)
})

const hotActivities = computed(() => filteredActivities.value.filter(a => a.hot))
const otherActivities = computed(() => filteredActivities.value.filter(a => !a.hot))

// Hottest activity for countdown banner
const hottestActivity = computed(() => {
  const hot = activities.filter(a => a.hot)
  if (!hot.length) return null
  // Pick the one ending soonest
  return hot.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())[0]
})

// Countdown logic
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let timer: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  if (!hottestActivity.value) return
  const end = new Date(hottestActivity.value.endDate).getTime()
  const now = Date.now()
  const diff = end - now
  if (diff <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  countdown.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function isExpiringSoon(endDate: string) {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000
}

// Get capability name by id (from models or apps)
function getCapabilityName(id: string): string {
  const model = models.find(m => m.id === id)
  if (model) return model.name
  const app = apps.find(a => a.id === id)
  if (app) return app.name
  return id
}

function getCapabilityIcon(id: string): string {
  const model = models.find(m => m.id === id)
  if (model) return model.icon
  const app = apps.find(a => a.id === id)
  if (app) return app.icon
  return 'i-lucide-box'
}

function getCtaLabel(activity: typeof activities[0]): string {
  if (activity.category === '免费体验' || activity.category === '新客专享') return '领取优惠'
  return '购买套餐'
}
</script>

<template>
  <div>
    <!-- Header -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <h1 class="text-2xl font-bold text-gray-900">优惠活动</h1>
        <p class="text-sm text-gray-500 mt-1">精选优惠与活动，助力安全能力升级</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <!-- Countdown Banner for Hottest Activity -->
      <div v-if="hottestActivity" class="relative rounded-2xl overflow-hidden">
        <div
          class="relative p-8 flex items-center justify-between"
          :class="`bg-gradient-to-r ${hottestActivity.gradient}`"
        >
          <!-- Decorative -->
          <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div class="absolute -left-4 -bottom-4 w-28 h-28 rounded-full bg-white/5" />

          <div class="relative z-10 flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-xs font-bold bg-white/20 text-white animate-pulse">HOT</span>
              <span class="text-white/80 text-sm">{{ hottestActivity.discountText }}</span>
            </div>
            <h2 class="text-white font-bold text-2xl mb-1">{{ hottestActivity.title }}</h2>
            <p class="text-white/70 text-sm">{{ hottestActivity.subtitle }}</p>
          </div>

          <div class="relative z-10 flex items-center gap-6">
            <!-- Countdown -->
            <div class="flex items-center gap-2">
              <div class="text-center">
                <div class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-white font-bold text-xl">{{ String(countdown.days).padStart(2, '0') }}</span>
                </div>
                <span class="text-white/60 text-[10px] mt-1 block">天</span>
              </div>
              <span class="text-white/40 text-xl font-bold">:</span>
              <div class="text-center">
                <div class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-white font-bold text-xl">{{ String(countdown.hours).padStart(2, '0') }}</span>
                </div>
                <span class="text-white/60 text-[10px] mt-1 block">时</span>
              </div>
              <span class="text-white/40 text-xl font-bold">:</span>
              <div class="text-center">
                <div class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-white font-bold text-xl">{{ String(countdown.minutes).padStart(2, '0') }}</span>
                </div>
                <span class="text-white/60 text-[10px] mt-1 block">分</span>
              </div>
              <span class="text-white/40 text-xl font-bold">:</span>
              <div class="text-center">
                <div class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-white font-bold text-xl">{{ String(countdown.seconds).padStart(2, '0') }}</span>
                </div>
                <span class="text-white/60 text-[10px] mt-1 block">秒</span>
              </div>
            </div>

            <NuxtLink :to="`/promotions/${hottestActivity.id}`">
              <UButton
                label="查看详情"
                icon="i-lucide-arrow-right"
                color="neutral"
                size="lg"
                trailing
              />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex items-center gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeCategory === cat
            ? 'bg-primary-600 text-white shadow-sm'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Hot Activities - Large Cards -->
      <div v-if="hotActivities.length">
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">热门活动</h2>
        <div class="grid grid-cols-2 gap-5">
          <NuxtLink
            v-for="activity in hotActivities"
            :key="activity.id"
            :to="`/promotions/${activity.id}`"
            class="group relative rounded-2xl overflow-hidden"
          >
            <div
              class="relative p-8 min-h-[240px] flex flex-col justify-between"
              :class="`bg-gradient-to-br ${activity.gradient}`"
            >
              <!-- Decorative -->
              <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
              <div class="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />

              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <UIcon :name="activity.icon" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-lg">{{ activity.title }}</h3>
                    <p class="text-white/70 text-xs">{{ activity.subtitle }}</p>
                  </div>
                </div>
                <p class="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">
                  {{ activity.description }}
                </p>
                <!-- Related Capability Tags -->
                <div v-if="activity.relatedCapabilityIds?.length" class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="capId in activity.relatedCapabilityIds.slice(0, 3)"
                    :key="capId"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 text-white/90 text-[11px]"
                  >
                    <UIcon :name="getCapabilityIcon(capId)" class="w-3 h-3" />
                    {{ getCapabilityName(capId) }}
                  </span>
                </div>
              </div>

              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm font-bold">
                    {{ activity.discountText }}
                  </span>
                  <span class="text-white/60 text-xs">
                    {{ formatDate(activity.startDate) }} - {{ formatDate(activity.endDate) }}
                  </span>
                </div>
                <UButton
                  :label="getCtaLabel(activity)"
                  icon="i-lucide-arrow-right"
                  color="neutral"
                  size="sm"
                  trailing
                />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- All Activities - List Cards -->
      <div v-if="otherActivities.length || !hotActivities.length">
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          {{ hotActivities.length ? '更多活动' : '全部活动' }}
        </h2>
        <div class="space-y-4">
          <NuxtLink
            v-for="activity in (hotActivities.length ? otherActivities : filteredActivities)"
            :key="activity.id"
            :to="`/promotions/${activity.id}`"
            class="block bg-white rounded-xl border border-gray-100 p-6 card-hover hover:border-primary-200 transition-colors"
          >
            <div class="flex items-start gap-5">
              <!-- Icon -->
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                :class="`bg-gradient-to-br ${activity.gradient}`"
              >
                <UIcon :name="activity.icon" class="w-7 h-7 text-white" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-base font-bold text-gray-900">{{ activity.title }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
                    {{ activity.discountText }}
                  </span>
                  <span v-if="activity.hot" class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">HOT</span>
                  <span v-if="activity.new" class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-500 text-white">NEW</span>
                  <span v-if="isExpiringSoon(activity.endDate)" class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">即将结束</span>
                </div>
                <p class="text-sm text-gray-500 mb-1">{{ activity.subtitle }}</p>
                <p class="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{{ activity.description }}</p>

                <!-- Related Capability Tags -->
                <div v-if="activity.relatedCapabilityIds?.length" class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="capId in activity.relatedCapabilityIds"
                    :key="capId"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50/60 text-primary-700 text-[11px]"
                  >
                    <UIcon :name="getCapabilityIcon(capId)" class="w-3 h-3" />
                    {{ getCapabilityName(capId) }}
                  </span>
                </div>

                <!-- Benefits -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <div
                    v-for="benefit in activity.benefits.slice(0, 4)"
                    :key="benefit"
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50/50"
                  >
                    <UIcon name="i-lucide-check" class="w-3 h-3 text-primary-500" />
                    <span class="text-xs text-primary-700">{{ benefit }}</span>
                  </div>
                </div>

                <!-- Tags + Date + CTA -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5">
                      <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-gray-400" />
                      <span class="text-xs text-gray-500">{{ formatDate(activity.startDate) }} - {{ formatDate(activity.endDate) }}</span>
                    </div>
                    <div class="flex gap-1.5">
                      <span
                        v-for="tag in activity.tags"
                        :key="tag"
                        class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-500"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <UButton
                    :label="getCtaLabel(activity)"
                    icon="i-lucide-arrow-right"
                    color="primary"
                    variant="subtle"
                    size="sm"
                    trailing
                  />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredActivities.length" class="text-center py-16">
        <UIcon name="i-lucide-inbox" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-400 text-sm">暂无该分类的活动</p>
      </div>
    </div>
  </div>
</template>
