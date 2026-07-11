<script setup lang="ts">
import { currentUser, organization } from '~/data/mock'

const route = useRoute()

const userDropdownOpen = ref(false)
const userDropdownRef = ref<HTMLElement | null>(null)

function onDocumentClick(e: MouseEvent) {
  if (userDropdownRef.value && !userDropdownRef.value.contains(e.target as Node)) {
    userDropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

const navGroups = [
  {
    label: '核心功能',
    items: [
      { label: '使用看板', icon: 'i-lucide-layout-dashboard', to: '/console' },
      { label: 'API Key', icon: 'i-lucide-key', to: '/console/keys' },
      { label: '调用统计', icon: 'i-lucide-bar-chart-3', to: '/console/stats' },
      { label: '充能包', icon: 'i-lucide-coins', to: '/console/packs' }
    ]
  },
  {
    label: '账户管理',
    items: [
      { label: '账单中心', icon: 'i-lucide-receipt', to: '/console/billing' },
      { label: '企业空间', icon: 'i-lucide-building-2', to: '/console/workspace', enterpriseOnly: true },
      { label: '个人设置', icon: 'i-lucide-settings', to: '/console/settings' }
    ]
  },
  {
    label: '开发资源',
    items: [
      { label: 'API文档', icon: 'i-lucide-book-open', to: '/console/docs' },
      { label: '应用集成', icon: 'i-lucide-puzzle', to: '/console/integrations' }
    ]
  }
]

function isActive(to: string) {
  if (to === '/console') return route.path === '/console'
  return route.path.startsWith(to)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full z-[60] flex flex-col w-60 bg-white border-r border-gray-100"
  >
    <!-- Back to marketplace link -->
    <div class="px-4 pt-4 pb-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-xs transition-colors duration-200"
      >
        <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5" />
        <span>返回市场</span>
      </NuxtLink>
    </div>

    <!-- Logo area -->
    <div class="flex items-center h-14 px-4 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-terminal" class="text-white w-5 h-5" />
        </div>
        <div class="overflow-hidden">
          <p class="text-gray-900 font-bold text-sm whitespace-nowrap">奇安信AI</p>
          <p class="text-primary-600 text-[10px] whitespace-nowrap">用户控制台</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 px-2 space-y-5 overflow-y-auto">
      <div v-for="group in navGroups" :key="group.label">
        <!-- Group header -->
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
          {{ group.label }}
        </p>
        <div class="space-y-0.5">
          <NuxtLink
            v-for="item in group.items"
            v-show="!item.enterpriseOnly || currentUser.isEnterprise"
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

    <!-- User area -->
    <div class="p-3 border-t border-gray-100">
      <div ref="userDropdownRef" class="relative">
        <button
          class="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          @click="userDropdownOpen = !userDropdownOpen"
        >
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-user" class="text-primary-600 w-4 h-4" />
          </div>
          <div class="overflow-hidden text-left flex-1">
            <p class="text-gray-900 text-sm truncate">{{ currentUser.name }}</p>
            <p v-if="currentUser.isEnterprise" class="text-gray-400 text-xs truncate">{{ organization.name }}</p>
          </div>
          <UIcon
            name="i-lucide-chevron-down"
            class="w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200"
            :class="userDropdownOpen ? 'rotate-180' : ''"
          />
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-1"
        >
          <div
            v-if="userDropdownOpen"
            class="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
          >
            <NuxtLink
              to="/console/settings"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="userDropdownOpen = false"
            >
              <UIcon name="i-lucide-settings" class="w-4 h-4 text-gray-400" />
              个人设置
            </NuxtLink>
            <NuxtLink
              to="/admin"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="userDropdownOpen = false"
            >
              <UIcon name="i-lucide-layout-dashboard" class="w-4 h-4 text-gray-400" />
              运营后台
            </NuxtLink>
            <div class="border-t border-gray-50 pt-1">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                @click="userDropdownOpen = false"
              >
                <UIcon name="i-lucide-log-out" class="w-4 h-4" />
                退出登录
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>
