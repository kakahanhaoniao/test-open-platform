<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: '数据看板', icon: 'i-lucide-layout-dashboard', to: '/admin' },
  { label: '企业客户', icon: 'i-lucide-building-2', to: '/admin/enterprises' },
  { label: '模型管理', icon: 'i-lucide-brain', to: '/admin/models' },
  { label: '应用管理', icon: 'i-lucide-layout-grid', to: '/admin/apps' },
  { label: '活动管理', icon: 'i-lucide-flame', to: '/admin/activities' },
  { label: '订单管理', icon: 'i-lucide-receipt', to: '/admin/orders' },
  { label: '模板配置', icon: 'i-lucide-palette', to: '/admin/templates' }
]

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full z-50 flex flex-col w-60 transition-all duration-300 ease-in-out"
    style="background: #0C0A1A;"
  >
    <!-- Logo area -->
    <div class="flex items-center h-16 px-4 border-b border-white/10">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-shield" class="text-white w-5 h-5" />
        </div>
        <span class="text-white font-bold text-base whitespace-nowrap">奇安信AI <span class="text-primary-400 font-normal text-sm">· 运营后台</span></span>
      </div>
    </div>

    <!-- Back to Market link -->
    <div class="px-3 pt-4 pb-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 text-sm"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        <span>返回前台</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-2 space-y-1 overflow-y-auto">
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
          <p class="text-white text-sm truncate">运营管理员</p>
          <p class="text-white/40 text-xs truncate">admin@qianxin.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>
