<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { label: '首页', to: '/b' },
  { label: '能力市场', to: '/b/marketplace' },
  { label: '优惠活动', to: '/b/promotions' },
  { label: '定价', to: '/b/marketplace' },
]

const isActive = (path: string) => {
  if (path === '/b') return route.path === '/b'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/b" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-sm">
          <UIcon name="i-lucide-shield-check" class="w-4.5 h-4.5 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-900 leading-tight tracking-tight">奇安信</span>
          <span class="text-[10px] text-primary-500 font-medium leading-tight">AI 开放平台</span>
        </div>
      </NuxtLink>

      <!-- Nav Links -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          :class="isActive(link.to)
            ? 'text-primary-700 bg-primary-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          {{ link.label }}
          <span
            v-if="isActive(link.to)"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-600 rounded-full"
          />
        </NuxtLink>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <UButton
          icon="i-lucide-search"
          variant="ghost"
          color="neutral"
          size="sm"
          class="text-gray-500"
          to="/b/marketplace"
        />
        <UButton
          icon="i-lucide-bell"
          variant="ghost"
          color="neutral"
          size="sm"
          class="text-gray-500"
        />
        <div class="w-px h-5 bg-gray-200 mx-1" />
        <UButton
          label="控制台"
          icon="i-lucide-layout-dashboard"
          variant="subtle"
          color="primary"
          size="sm"
        />
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center cursor-pointer">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  </header>
</template>
