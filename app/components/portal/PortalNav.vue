<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { label: '产品能力', to: '/portal' },
  { label: '定价', to: '/portal/pricing' },
  { label: '客户案例', to: '/portal#customers' },
  { label: '文档', to: '/portal#docs' }
]

const isActive = (path: string) => {
  if (path === '/portal') return route.path === '/portal'
  return route.path.startsWith(path)
}

const scrolled = ref(false)

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 10
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-50'"
  >
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/portal" class="flex items-center gap-2.5 group">
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
          label="进入控制台"
          icon="i-lucide-layout-dashboard"
          variant="ghost"
          color="primary"
          size="sm"
          to="/console"
        />
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
      </div>
    </div>
  </header>
</template>
