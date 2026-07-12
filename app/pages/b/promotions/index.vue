<script setup lang="ts">
import { activities } from '~/data/mock'

useHead({
  title: '优惠活动 - 奇安信AI开放平台',
  meta: [
    { name: 'description', content: '奇安信AI开放平台优惠活动' }
  ]
})

const hotActivities = computed(() => activities.filter(a => a.hot))
const otherActivities = computed(() => activities.filter(a => !a.hot))

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function isExpiringSoon(endDate: string) {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000 // 30 days
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <BTopNav />

    <!-- Header -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <h1 class="text-2xl font-bold text-gray-900">优惠活动</h1>
        <p class="text-sm text-gray-500 mt-1">精选优惠与活动，助力安全能力升级</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <!-- Hot Activities - Large Cards -->
      <div v-if="hotActivities.length">
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">热门活动</h2>
        <div class="grid grid-cols-2 gap-5">
          <div
            v-for="activity in hotActivities"
            :key="activity.id"
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
                  :label="activity.ctaText"
                  icon="i-lucide-arrow-right"
                  color="neutral"
                  size="sm"
                  trailing
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Activities - List Cards -->
      <div>
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">全部活动</h2>
        <div class="space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="bg-white rounded-xl border border-gray-100 p-6 card-hover"
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
                <p class="text-sm text-gray-500 mb-3">{{ activity.subtitle }}</p>
                <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ activity.description }}</p>

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
                    :label="activity.ctaText"
                    icon="i-lucide-arrow-right"
                    color="primary"
                    variant="subtle"
                    size="sm"
                    trailing
                  />
                </div>
              </div>
            </div>

            <!-- Rules (expandable) -->
            <div class="mt-4 pt-4 border-t border-gray-50">
              <p class="text-xs text-gray-400 mb-2">活动规则：</p>
              <ul class="space-y-1">
                <li
                  v-for="rule in activity.rules"
                  :key="rule"
                  class="text-xs text-gray-400 flex items-start gap-1.5"
                >
                  <span class="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  {{ rule }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
