<script setup lang="ts">
const { collapsed } = useSidebar()
const route = useRoute()

const navItems = [
  { label: '首页', icon: 'i-lucide-home', to: '/' },
  { label: '模型中心', icon: 'i-lucide-brain', to: '/models' },
  { label: '应用中心', icon: 'i-lucide-layout-grid', to: '/apps' },
  { label: '活动市场', icon: 'i-lucide-flame', to: '/market' },
  { label: '定价', icon: 'i-lucide-tag', to: '/pricing' },
  { label: '个人中心', icon: 'i-lucide-user', to: '/profile' }
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out"
    :class="collapsed ? 'w-16' : 'w-60'"
    style="background: #0C0A1A;"
  >
    <!-- Logo area -->
    <div class="flex items-center h-16 px-4 border-b border-white/10">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-shield" class="text-white w-5 h-5" />
        </div>
        <transition name="fade">
          <span v-if="!collapsed" class="text-white font-bold text-lg whitespace-nowrap">奇安信AI</span>
        </transition>
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
        <transition name="fade">
          <span v-if="!collapsed" class="text-sm whitespace-nowrap">{{ item.label }}</span>
        </transition>
      </NuxtLink>
    </nav>

    <!-- Collapse toggle -->
    <div class="p-3 border-t border-white/10">
      <button
        class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
        @click="collapsed = !collapsed"
      >
        <UIcon
          :name="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
          class="w-4 h-4"
        />
        <transition name="fade">
          <span v-if="!collapsed" class="text-xs">收起菜单</span>
        </transition>
      </button>
    </div>

    <!-- User area -->
    <div class="p-3 border-t border-white/10">
      <div class="flex items-center gap-3 px-2">
        <div class="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-user" class="text-primary-300 w-4 h-4" />
        </div>
        <transition name="fade">
          <div v-if="!collapsed" class="overflow-hidden">
            <p class="text-white text-sm truncate">管理员</p>
            <p class="text-white/40 text-xs truncate">admin@qianxin.com</p>
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
