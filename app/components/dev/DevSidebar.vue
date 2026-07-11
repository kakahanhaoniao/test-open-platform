<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: '概览', icon: 'i-lucide-layout-dashboard', to: '/dev' },
  { label: 'API Key管理', icon: 'i-lucide-key', to: '/dev/keys' },
  { label: '调用统计', icon: 'i-lucide-bar-chart-3', to: '/dev/stats' },
  { label: '充能包', icon: 'i-lucide-coins', to: '/dev/packs' },
  { label: 'API文档', icon: 'i-lucide-book-open', to: '/dev/docs' },
  { label: '应用集成', icon: 'i-lucide-puzzle', to: '/dev/integrations' }
]

function isActive(to: string) {
  if (to === '/dev') return route.path === '/dev'
  return route.path.startsWith(to)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full z-[60] flex flex-col w-60"
    style="background: #0C0A1A;"
  >
    <!-- Back to marketplace link -->
    <div class="px-4 pt-4 pb-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-white/40 hover:text-white/80 text-xs transition-colors duration-200"
      >
        <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5" />
        <span>返回市场</span>
      </NuxtLink>
    </div>

    <!-- Logo area -->
    <div class="flex items-center h-14 px-4 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-terminal" class="text-white w-5 h-5" />
        </div>
        <div class="overflow-hidden">
          <p class="text-white font-bold text-sm whitespace-nowrap">奇安信AI</p>
          <p class="text-primary-400 text-[10px] whitespace-nowrap">开发者控制台</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative"
        :class="[
          isActive(item.to)
            ? 'bg-primary-600/20 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        ]"
      >
        <!-- Active indicator -->
        <div
          v-if="isActive(item.to)"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
        />
        <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
        <span class="text-sm whitespace-nowrap">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User area -->
    <div class="p-3 border-t border-white/10">
      <div class="flex items-center gap-3 px-2">
        <div class="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-user" class="text-primary-300 w-4 h-4" />
        </div>
        <div class="overflow-hidden">
          <p class="text-white text-sm truncate">开发者</p>
          <p class="text-white/40 text-xs truncate">dev@qianxin.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>
