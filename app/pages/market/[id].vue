<script setup lang="ts">
import { getActivityById } from '~/data/mock'

const route = useRoute()
const activity = computed(() => getActivityById(route.params.id as string))

const now = ref(new Date())
onMounted(() => {
  const timer = setInterval(() => { now.value = new Date() }, 1000)
  onUnmounted(() => clearInterval(timer))
})

const daysLeft = computed(() => {
  if (!activity.value) return 0
  const end = new Date(activity.value.endDate)
  const diff = end.getTime() - now.value.getTime()
  return diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const isExpired = computed(() => {
  if (!activity.value) return false
  return new Date(activity.value.endDate) < now.value
})

useHead({
  title: computed(() => activity.value ? `${activity.value.title} - 奇安信AI开放平台` : '活动详情 - 奇安信AI开放平台')
})
</script>

<template>
  <div v-if="activity" class="p-6 md:p-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <NuxtLink to="/market" class="hover:text-primary-600 transition-colors">活动市场</NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
      <span class="text-gray-700">{{ activity.title }}</span>
    </div>

    <!-- Hero banner -->
    <div
      class="rounded-2xl overflow-hidden relative mb-8"
      :class="`bg-gradient-to-br ${activity.gradient}`"
    >
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;" />

      <div class="relative z-10 p-8 md:p-12">
        <div class="flex flex-col md:flex-row items-start gap-8">
          <div class="flex-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 mb-4">
              <span v-if="activity.hot" class="w-2 h-2 rounded-full bg-red-400 badge-pulse" />
              <span class="text-white/80 text-xs font-medium">{{ activity.hot ? '热门活动' : '活动进行中' }}</span>
            </div>

            <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">{{ activity.title }}</h1>
            <p class="text-white/70 text-lg mb-2">{{ activity.subtitle }}</p>
            <p class="text-white/50 text-sm max-w-2xl">{{ activity.description }}</p>
          </div>

          <!-- Discount badge -->
          <div class="shrink-0">
            <div class="w-36 h-36 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <div class="text-center">
                <p class="text-5xl font-bold text-white">{{ activity.discount }}</p>
                <p class="text-white/60 text-sm mt-2">{{ activity.discountText }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Countdown -->
        <div class="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="w-5 h-5 text-white/60" />
            <span class="text-white/60 text-sm">
              {{ isExpired ? '活动已结束' : `距活动结束还有 ${daysLeft} 天` }}
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm text-white/40">
            <span>{{ activity.startDate }} 至 {{ activity.endDate }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Activity benefits -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">活动权益</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="benefit in activity.benefits"
              :key="benefit"
              class="flex items-center gap-3 p-3 rounded-lg bg-primary-50/50"
            >
              <div class="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-gift" class="w-4 h-4 text-primary-600" />
              </div>
              <span class="text-sm text-gray-700">{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Activity rules -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">活动规则</h2>
          <ol class="space-y-3">
            <li
              v-for="(rule, i) in activity.rules"
              :key="i"
              class="flex items-start gap-3 text-sm text-gray-600"
            >
              <span class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-medium text-gray-500">{{ i + 1 }}</span>
              {{ rule }}
            </li>
          </ol>
        </div>

        <!-- Tags -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">活动标签</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in activity.tags"
              :key="tag"
              class="px-3 py-1.5 rounded-lg text-sm bg-gray-50 text-gray-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Sidebar: CTA -->
      <div class="space-y-6">
        <!-- CTA card -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 sticky top-8">
          <div class="text-center mb-6">
            <p class="text-4xl font-bold gradient-text mb-1">{{ activity.discount }}</p>
            <p class="text-sm text-gray-400">{{ activity.discountText }}</p>
          </div>

          <UButton
            block
            size="xl"
            color="primary"
            :disabled="isExpired"
            class="mb-3"
          >
            {{ isExpired ? '活动已结束' : activity.ctaText }}
          </UButton>

          <p class="text-center text-xs text-gray-400">
            活动截止：{{ activity.endDate }}
          </p>

          <div class="mt-6 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-lucide-users" class="w-4 h-4" />
              <span>已有 2,847 人参与</span>
            </div>
          </div>
        </div>

        <!-- Share card -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-3">分享活动</h3>
          <div class="flex gap-2">
            <button class="flex-1 py-2 rounded-lg bg-green-50 text-green-600 text-sm hover:bg-green-100 transition-colors">
              微信
            </button>
            <button class="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-colors">
              钉钉
            </button>
            <button class="flex-1 py-2 rounded-lg bg-gray-50 text-gray-600 text-sm hover:bg-gray-100 transition-colors">
              复制链接
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 state -->
  <div v-else class="flex flex-col items-center justify-center py-20">
    <UIcon name="i-lucide-search-x" class="w-16 h-16 text-gray-300 mb-4" />
    <p class="text-gray-400 text-lg mb-2">活动未找到</p>
    <NuxtLink to="/market">
      <UButton variant="soft" color="primary">返回活动市场</UButton>
    </NuxtLink>
  </div>
</template>
