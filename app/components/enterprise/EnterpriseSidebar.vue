<script setup lang="ts">
import { currentUser, organization } from '~/data/mock'

const route = useRoute()

const navGroups = [
  {
    label: '核心管理',
    items: [
      { label: '企业概览', icon: 'i-lucide-building-2', to: '/enterprise' },
      { label: '成员管理', icon: 'i-lucide-users', to: '/enterprise/members' },
      { label: '调用监控', icon: 'i-lucide-activity', to: '/enterprise/monitor' },
      { label: '日志审计', icon: 'i-lucide-scroll-text', to: '/enterprise/logs' }
    ]
  },
  {
    label: '资源与账务',
    items: [
      { label: '企业充能包', icon: 'i-lucide-coins', to: '/enterprise/packs' },
      { label: '企业账单', icon: 'i-lucide-receipt', to: '/enterprise/billing' },
      { label: '企业设置', icon: 'i-lucide-settings', to: '/enterprise/settings' }
    ]
  }
]

function isActive(to: string) {
  if (to === '/enterprise') return route.path === '/enterprise'
  return route.path.startsWith(to)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full z-[60] flex flex-col w-60 bg-white border-r border-gray-100"
  >
    <!-- Enterprise identity block (top, prominent) -->
    <div class="px-4 pt-4 pb-3 border-b border-gray-100">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-building-2" class="text-primary-600 w-5 h-5" />
        </div>
        <div class="overflow-hidden">
          <p class="text-gray-900 font-bold text-sm whitespace-nowrap">{{ organization.name }}</p>
          <p class="text-gray-400 text-xs whitespace-nowrap">{{ currentUser.role === 'admin' ? '管理员' : currentUser.role }} · {{ organization.memberCount }}名成员</p>
        </div>
      </div>
      <NuxtLink
        to="/console"
        class="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-medium transition-colors duration-200"
      >
        <span>个人空间</span>
        <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>

    <!-- Back to marketplace link -->
    <div class="px-4 pt-3 pb-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-xs transition-colors duration-200"
      >
        <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5" />
        <span>返回市场</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-2 px-2 space-y-5 overflow-y-auto">
      <div v-for="group in navGroups" :key="group.label">
        <!-- Group header -->
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
          {{ group.label }}
        </p>
        <div class="space-y-0.5">
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative"
            :class="[
              isActive(item.to)
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <!-- Active indicator -->
            <div
              v-if="isActive(item.to)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary-600 rounded-r-full"
            />
            <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
            <span class="text-sm whitespace-nowrap">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Bottom: logout -->
    <div class="p-3 border-t border-gray-100">
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
      >
        <UIcon name="i-lucide-log-out" class="w-5 h-5 shrink-0" />
        <span class="text-sm">退出登录</span>
      </button>
    </div>
  </aside>
</template>
