<script setup lang="ts">
import { activities } from '~/data/mock'

useHead({ title: '活动市场 - 奇安信AI开放平台' })
</script>

<template>
  <div class="p-6 md:p-8">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">活动市场</h1>
      <p class="text-gray-500">限时优惠、精彩活动与开发者大赛，尽在活动市场</p>
    </div>

    <!-- Featured activity (first one, large) -->
    <div v-if="activities.length > 0" class="mb-8">
      <NuxtLink :to="`/market/${activities[0].id}`" class="block card-hover">
        <div
          class="rounded-2xl overflow-hidden relative"
          :class="`bg-gradient-to-br ${activities[0].gradient}`"
        >
          <!-- Background pattern -->
          <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;" />

          <div class="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div class="flex-1">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 mb-4">
                <span class="w-2 h-2 rounded-full bg-accent-400 badge-pulse" />
                <span class="text-white/80 text-xs font-medium">限时活动</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">{{ activities[0].title }}</h2>
              <p class="text-white/70 text-lg mb-6">{{ activities[0].subtitle }}</p>
              <p class="text-white/50 text-sm mb-6 max-w-lg">{{ activities[0].description }}</p>
              <div class="flex items-center gap-4">
                <UButton
                  size="xl"
                  class="bg-white text-primary-700 hover:bg-white/90 font-semibold"
                  trailing-icon="i-lucide-arrow-right"
                >
                  {{ activities[0].ctaText }}
                </UButton>
                <div class="flex items-center gap-2 text-white/60 text-sm">
                  <UIcon name="i-lucide-clock" class="w-4 h-4" />
                  <span>截止日期：{{ activities[0].endDate }}</span>
                </div>
              </div>
            </div>
            <div class="shrink-0">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <div class="text-center">
                  <p class="text-4xl md:text-5xl font-bold text-white">{{ activities[0].discount }}</p>
                  <p class="text-white/60 text-sm mt-1">{{ activities[0].discountText }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Activity grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <ActivityCard
        v-for="activity in activities.slice(1)"
        :key="activity.id"
        :activity="activity"
      />
    </div>
  </div>
</template>
