<script setup>
const route = useRoute()
const { collapsed } = useSidebar()

// Route-based layout detection:
// /portal/*  → full-width layout (no sidebar, pages handle their own nav)
// /admin/*   → admin handles its own layout
// /dev/*     → dev handles its own layout
// /b/*       → legacy B variant (full-width, pages handle their own nav)
// Everything else (root /, /marketplace, /promotions) → Market layout with TopNav
const isFullWidthRoute = computed(() => {
  const path = route.path
  return path.startsWith('/portal') ||
         path.startsWith('/admin') ||
         path.startsWith('/dev') ||
         path.startsWith('/b')
})

const isMarketRoute = computed(() => {
  const path = route.path
  // Root pages that use Market layout (TopNav, full-width)
  if (path === '/' || path === '') return true
  if (path.startsWith('/marketplace')) return true
  if (path.startsWith('/promotions')) return true
  return false
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'zh-CN'
  }
})

const title = '奇安信AI开放平台'
const description = '以AI之力，守护数字世界安全。奇安信AI开放平台提供安全大模型、威胁检测、漏洞分析等AI安全能力，助力企业构建智能安全防护体系。'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <!-- Full-width routes: portal, admin, dev, legacy /b -->
    <template v-if="isFullWidthRoute">
      <NuxtPage />
    </template>

    <!-- Market routes: root /, /marketplace, /promotions — TopNav layout -->
    <template v-else-if="isMarketRoute">
      <TopNav />
      <main class="min-h-screen bg-[#FAFAFA]">
        <NuxtPage />
      </main>
    </template>

    <!-- Variant A: Sidebar layout (fallback for /models, /apps, /market, etc.) -->
    <template v-else>
      <!-- Signal pulse line at very top -->
      <SignalPulse />

      <!-- Sidebar -->
      <PlatformSidebar />

      <!-- Main content area -->
      <div
        class="min-h-screen bg-[#FAFAFA] transition-all duration-300"
        :class="collapsed ? 'ml-16' : 'ml-60'"
      >
        <NuxtPage />
      </div>
    </template>
  </UApp>
</template>
