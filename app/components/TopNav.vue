<script setup lang="ts">
import { currentUser } from '~/data/mock'

const route = useRoute()

const navLinks = [
  { label: '能力市场', to: '/marketplace' },
  { label: '优惠活动', to: '/promotions' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// Close dropdown on outside click
function onDocumentClick(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

// Determine if user is authenticated (using mock data for demo)
const isAuthenticated = computed(() => !!currentUser.name)

const userMenuItems = computed(() => {
  const items = [
    { label: '个人工作台', icon: 'i-lucide-code-2', to: '/console' },
  ]
  if (currentUser.isEnterprise) {
    items.push({ label: '企业工作台', icon: 'i-lucide-building-2', to: '/enterprise' })
  }
  items.push(
    { label: '运营后台', icon: 'i-lucide-settings', to: '/admin' },
  )
  return items
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-sm">
          <UIcon name="i-lucide-shield-check" class="w-4.5 h-4.5 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-900 leading-tight tracking-tight">奇安信</span>
          <span class="text-[10px] text-primary-500 font-medium leading-tight">AI 开放平台</span>
        </div>
      </NuxtLink>

      <!-- Center Nav Links -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          to="/"
          class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          :class="isActive('/')
            ? 'text-primary-700 bg-primary-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          首页
          <span
            v-if="isActive('/')"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-600 rounded-full"
          />
        </NuxtLink>
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
        <!-- Search -->
        <UButton
          icon="i-lucide-search"
          variant="ghost"
          color="neutral"
          size="sm"
          class="text-gray-500"
          to="/marketplace"
        />

        <!-- Unauthenticated: Login / Register -->
        <template v-if="!isAuthenticated">
          <div class="w-px h-5 bg-gray-200 mx-1" />
          <UButton
            label="登录"
            variant="ghost"
            color="neutral"
            size="sm"
            class="text-gray-600"
            to="/portal/login"
          />
          <UButton
            label="免费注册"
            icon="i-lucide-rocket"
            color="primary"
            size="sm"
            to="/portal/register"
          />
        </template>

        <!-- Authenticated: Console + User Menu -->
        <template v-else>
          <div class="w-px h-5 bg-gray-200 mx-1" />

          <!-- Console Button -->
          <UButton
            :label="currentUser.isEnterprise ? '企业工作台' : '用户控制台'"
            :icon="currentUser.isEnterprise ? 'i-lucide-building-2' : 'i-lucide-code-2'"
            variant="subtle"
            color="primary"
            size="sm"
            :to="currentUser.isEnterprise ? '/enterprise' : '/console'"
          />

          <!-- User Avatar Dropdown -->
          <div ref="userMenuRef" class="relative">
            <button
              class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-200 transition-all"
              @click="userMenuOpen = !userMenuOpen"
            >
              <UIcon name="i-lucide-user" class="w-4 h-4 text-white" />
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
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
              >
                <!-- User info header -->
                <div class="px-4 py-3 border-b border-gray-50">
                  <p class="text-sm font-semibold text-gray-900">{{ currentUser.name }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
                </div>

                <!-- Menu items -->
                <div class="py-1">
                  <NuxtLink
                    v-for="item in userMenuItems"
                    :key="item.label"
                    :to="item.to"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    <UIcon :name="item.icon" class="w-4 h-4 text-gray-400" />
                    {{ item.label }}
                  </NuxtLink>
                </div>

                <!-- Divider + Logout -->
                <div class="border-t border-gray-50 pt-1">
                  <button
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    <UIcon name="i-lucide-log-out" class="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>
