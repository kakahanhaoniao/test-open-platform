diff --git a/app/components/modules/ModuleAdvantages.vue b/app/components/modules/ModuleAdvantages.vue
new file mode 100644
index 0000000..1ad316d
--- /dev/null
+++ b/app/components/modules/ModuleAdvantages.vue
@@ -0,0 +1,83 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '优势对比')
+
+const defaultItems = [
+  { advantage: '智能AI驱动，自动化分析处理', traditional: '人工操作，效率低下' },
+  { advantage: '实时响应，毫秒级延迟', traditional: '响应延迟，错失最佳时机' },
+  { advantage: '持续学习，模型不断进化', traditional: '规则固化，无法适应新威胁' },
+  { advantage: '云端部署，开箱即用', traditional: '本地部署，运维成本高' }
+]
+
+const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
+      <!-- Our advantages -->
+      <div class="space-y-4">
+        <div class="flex items-center gap-2 mb-4">
+          <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
+            <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-600" />
+          </div>
+          <span class="font-semibold text-green-700">我们的优势</span>
+        </div>
+        <div
+          v-for="(item, i) in items"
+          :key="'adv-' + i"
+          class="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-100"
+        >
+          <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
+          <span class="text-sm text-green-800">{{ item.advantage }}</span>
+        </div>
+      </div>
+
+      <!-- Traditional approach -->
+      <div class="space-y-4">
+        <div class="flex items-center gap-2 mb-4">
+          <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
+            <UIcon name="i-lucide-x" class="w-3.5 h-3.5 text-gray-400" />
+          </div>
+          <span class="font-semibold text-gray-500">传统方式</span>
+        </div>
+        <div
+          v-for="(item, i) in items"
+          :key="'trad-' + i"
+          class="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
+        >
+          <UIcon name="i-lucide-x-circle" class="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
+          <span class="text-sm text-gray-500">{{ item.traditional }}</span>
+        </div>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleBanner.vue b/app/components/modules/ModuleBanner.vue
new file mode 100644
index 0000000..14f0a62
--- /dev/null
+++ b/app/components/modules/ModuleBanner.vue
@@ -0,0 +1,78 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || props.capability?.name || '')
+const subtitle = computed(() => props.module.props?.subtitle || props.capability?.description || '')
+const gradient = computed(() => props.module.props?.gradient || 'from-primary-600 to-primary-400')
+const backgroundImage = computed(() => props.module.props?.backgroundImage || '')
+const badge = computed(() => props.module.props?.badge || '')
+const ctaText = computed(() => props.module.props?.ctaText || '立即体验')
+const ctaLink = computed(() => props.module.props?.ctaLink || '#')
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <div
+      class="relative overflow-hidden rounded-2xl min-h-[200px] flex items-center"
+      :class="backgroundImage ? '' : `bg-gradient-to-r ${gradient}`"
+    >
+      <img
+        v-if="backgroundImage"
+        :src="backgroundImage"
+        :alt="title"
+        class="absolute inset-0 w-full h-full object-cover"
+      >
+      <div class="absolute inset-0 bg-black/30" />
+
+      <div class="relative z-10 px-8 py-12 md:px-12 md:py-16 w-full">
+        <span
+          v-if="badge"
+          class="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-4"
+        >
+          {{ badge }}
+        </span>
+
+        <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">
+          {{ title }}
+        </h2>
+
+        <p class="text-white/80 text-lg max-w-2xl mb-6">
+          {{ subtitle }}
+        </p>
+
+        <UButton
+          v-if="ctaText"
+          :to="ctaLink"
+          size="lg"
+          class="bg-white text-primary-700 hover:bg-white/90 font-semibold"
+          trailing-icon="i-lucide-arrow-right"
+        >
+          {{ ctaText }}
+        </UButton>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleCards.vue b/app/components/modules/ModuleCards.vue
new file mode 100644
index 0000000..2e41a3a
--- /dev/null
+++ b/app/components/modules/ModuleCards.vue
@@ -0,0 +1,79 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '相关资源')
+const columns = computed(() => props.module.props?.columns || 3)
+
+const defaultItems = [
+  { image: '', title: 'API文档', description: '详细的接口调用说明与示例', link: '#' },
+  { image: '', title: '快速入门', description: '5分钟快速接入指南', link: '#' },
+  { image: '', title: '最佳实践', description: '行业应用案例与解决方案', link: '#' }
+]
+
+const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)
+
+const gridCols = computed(() => {
+  switch (columns.value) {
+    case 2: return 'grid-cols-1 md:grid-cols-2'
+    case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
+    default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
+  }
+})
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <div :class="['grid gap-6', gridCols]">
+      <NuxtLink
+        v-for="(item, i) in items"
+        :key="i"
+        :to="item.link || '#'"
+        class="rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-shadow group"
+      >
+        <div v-if="item.image" class="w-full h-40 overflow-hidden">
+          <img
+            :src="item.image"
+            :alt="item.title"
+            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
+          >
+        </div>
+        <div v-else class="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
+          <UIcon name="i-lucide-file-text" class="w-8 h-8 text-gray-300" />
+        </div>
+        <div class="p-4">
+          <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
+            {{ item.title }}
+          </h3>
+          <p class="text-sm text-gray-500 line-clamp-2">{{ item.description }}</p>
+        </div>
+      </NuxtLink>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleCarousel.vue b/app/components/modules/ModuleCarousel.vue
new file mode 100644
index 0000000..c8a0958
--- /dev/null
+++ b/app/components/modules/ModuleCarousel.vue
@@ -0,0 +1,130 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '')
+const autoplay = computed(() => props.module.props?.autoplay || false)
+
+const defaultItems = [
+  { image: '', title: '安全运营中心', description: 'AI驱动的智能安全运营', link: '#' },
+  { image: '', title: '威胁检测分析', description: '深度威胁识别与响应', link: '#' },
+  { image: '', title: '合规审计报告', description: '自动化合规检查与报告', link: '#' }
+]
+
+const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)
+
+const scrollContainer = ref<HTMLElement | null>(null)
+const currentIndex = ref(0)
+
+function scrollTo(index: number) {
+  if (!scrollContainer.value) return
+  const clamped = Math.max(0, Math.min(index, items.value.length - 1))
+  currentIndex.value = clamped
+  const child = scrollContainer.value.children[clamped] as HTMLElement
+  if (child) {
+    child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
+  }
+}
+
+function prev() {
+  scrollTo(currentIndex.value - 1)
+}
+
+function next() {
+  scrollTo(currentIndex.value + 1)
+}
+
+let autoplayTimer: ReturnType<typeof setInterval> | null = null
+
+onMounted(() => {
+  if (autoplay.value && items.value.length > 1) {
+    autoplayTimer = setInterval(() => {
+      const nextIndex = (currentIndex.value + 1) % items.value.length
+      scrollTo(nextIndex)
+    }, 4000)
+  }
+})
+
+onUnmounted(() => {
+  if (autoplayTimer) {
+    clearInterval(autoplayTimer)
+  }
+})
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <div class="flex items-center justify-between mb-6">
+      <h2 v-if="title" class="text-2xl md:text-3xl font-bold text-gray-900">
+        {{ title }}
+      </h2>
+      <div class="flex gap-2">
+        <UButton
+          variant="outline"
+          size="sm"
+          icon="i-lucide-chevron-left"
+          :disabled="currentIndex === 0"
+          @click="prev"
+        />
+        <UButton
+          variant="outline"
+          size="sm"
+          icon="i-lucide-chevron-right"
+          :disabled="currentIndex === items.length - 1"
+          @click="next"
+        />
+      </div>
+    </div>
+
+    <div
+      ref="scrollContainer"
+      class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
+    >
+      <NuxtLink
+        v-for="(item, i) in items"
+        :key="i"
+        :to="item.link || '#'"
+        class="min-w-[320px] snap-start shrink-0 rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-shadow group"
+      >
+        <div v-if="item.image" class="w-full h-48 overflow-hidden">
+          <img
+            :src="item.image"
+            :alt="item.title"
+            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
+          >
+        </div>
+        <div v-else class="w-full h-48 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
+          <UIcon name="i-lucide-image" class="w-10 h-10 text-primary-300" />
+        </div>
+        <div class="p-5">
+          <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
+            {{ item.title }}
+          </h3>
+          <p class="text-sm text-gray-500">{{ item.description }}</p>
+        </div>
+      </NuxtLink>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleFeatures.vue b/app/components/modules/ModuleFeatures.vue
new file mode 100644
index 0000000..293ae71
--- /dev/null
+++ b/app/components/modules/ModuleFeatures.vue
@@ -0,0 +1,91 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '核心特性')
+const layout = computed(() => props.module.props?.layout || 'grid')
+
+const defaultIcons = [
+  'i-lucide-shield-check',
+  'i-lucide-zap',
+  'i-lucide-brain',
+  'i-lucide-lock',
+  'i-lucide-bar-chart-3',
+  'i-lucide-globe'
+]
+
+const items = computed(() => {
+  if (props.module.props?.items?.length) {
+    return props.module.props.items
+  }
+  // Generate from capability data
+  const features = props.capability?.features || props.capability?.tags || []
+  return features.slice(0, 6).map((f: string, i: number) => ({
+    icon: defaultIcons[i % defaultIcons.length],
+    title: f,
+    description: ''
+  }))
+})
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <!-- Grid layout: 3 columns -->
+    <div v-if="layout === 'grid'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
+      <div
+        v-for="(item, i) in items"
+        :key="i"
+        class="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow"
+      >
+        <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
+          <UIcon :name="item.icon || 'i-lucide-star'" class="w-5 h-5 text-primary-600" />
+        </div>
+        <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
+        <p v-if="item.description" class="text-sm text-gray-500">{{ item.description }}</p>
+      </div>
+    </div>
+
+    <!-- List layout: vertical -->
+    <div v-else class="space-y-4">
+      <div
+        v-for="(item, i) in items"
+        :key="i"
+        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white"
+      >
+        <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
+          <UIcon :name="item.icon || 'i-lucide-star'" class="w-4 h-4 text-primary-600" />
+        </div>
+        <div>
+          <h3 class="font-semibold text-gray-900 mb-1">{{ item.title }}</h3>
+          <p v-if="item.description" class="text-sm text-gray-500">{{ item.description }}</p>
+        </div>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleHero.vue b/app/components/modules/ModuleHero.vue
new file mode 100644
index 0000000..d807116
--- /dev/null
+++ b/app/components/modules/ModuleHero.vue
@@ -0,0 +1,75 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+import MarkdownIt from 'markdown-it'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const md = new MarkdownIt()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || props.capability?.name || '')
+const description = computed(() => props.module.props?.description || '')
+const buttons = computed(() => props.module.props?.buttons || [])
+const bgStyle = computed(() => props.module.props?.bgStyle || 'light')
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <div
+      class="text-center max-w-3xl mx-auto px-4"
+      :class="{
+        'text-white': bgStyle === 'dark',
+        'text-gray-900': bgStyle !== 'dark'
+      }"
+    >
+      <h2 class="text-3xl md:text-4xl font-bold mb-4">
+        {{ title }}
+      </h2>
+
+      <div
+        v-if="description"
+        class="text-lg mb-8 prose max-w-none mx-auto"
+        :class="bgStyle === 'dark' ? 'text-white/70 prose-invert' : 'text-gray-600'"
+        v-html="md.render(description)"
+      />
+
+      <div v-if="buttons.length" class="flex flex-wrap justify-center gap-4">
+        <UButton
+          v-for="(btn, i) in buttons"
+          :key="i"
+          :to="btn.link || '#'"
+          :variant="btn.style === 'outline' ? 'outline' : 'solid'"
+          size="lg"
+          :class="{
+            'bg-primary-600 hover:bg-primary-700 text-white': btn.style !== 'outline',
+            'border-primary-300 text-primary-600 hover:bg-primary-50': btn.style === 'outline' && bgStyle !== 'dark',
+            'border-white/30 text-white hover:bg-white/10': btn.style === 'outline' && bgStyle === 'dark'
+          }"
+          trailing-icon="i-lucide-arrow-right"
+        >
+          {{ btn.text }}
+        </UButton>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleIntegration.vue b/app/components/modules/ModuleIntegration.vue
new file mode 100644
index 0000000..bf115f6
--- /dev/null
+++ b/app/components/modules/ModuleIntegration.vue
@@ -0,0 +1,117 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '接入指南')
+const useDefault = computed(() => props.module.props?.useDefault === true)
+
+// Default 3-step integration
+const defaultSteps = computed(() => [
+  {
+    icon: 'i-lucide-key',
+    title: '创建API Key',
+    description: '在控制台创建API密钥，获取访问凭证',
+    link: '/console/keys/create',
+    code: ''
+  },
+  {
+    icon: 'i-lucide-terminal',
+    title: '安装SDK',
+    description: '通过npm安装奇安信AI SDK',
+    link: '',
+    code: 'npm install @qax/ai-sdk'
+  },
+  {
+    icon: 'i-lucide-code-2',
+    title: '调用API',
+    description: '使用SDK调用AI安全能力接口',
+    link: '',
+    code: `import { QaxAI } from '@qax/ai-sdk'\n\nconst client = new QaxAI({ apiKey: 'your-api-key' })\nconst result = await client.chat({\n  model: '${props.capability?.id || 'model-id'}',\n  messages: [{ role: 'user', content: '你好' }]\n})`
+  }
+])
+
+const steps = computed(() => {
+  if (useDefault.value) {
+    return defaultSteps.value
+  }
+  return props.module.props?.steps || []
+})
+
+function copyCode(code: string) {
+  navigator.clipboard.writeText(code)
+}
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
+      <div
+        v-for="(step, i) in steps"
+        :key="i"
+        class="relative p-6 rounded-xl border border-gray-100 bg-white"
+      >
+        <!-- Step number -->
+        <div class="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
+          {{ i + 1 }}
+        </div>
+
+        <div class="flex items-center gap-3 mb-4 mt-1">
+          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
+            <UIcon :name="step.icon || 'i-lucide-circle-dot'" class="w-5 h-5 text-primary-600" />
+          </div>
+          <h3 class="font-semibold text-gray-900">{{ step.title }}</h3>
+        </div>
+
+        <p class="text-sm text-gray-500 mb-4">{{ step.description }}</p>
+
+        <!-- Code block -->
+        <div v-if="step.code" class="relative">
+          <pre class="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto"><code>{{ step.code }}</code></pre>
+          <button
+            class="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
+            title="复制代码"
+            @click="copyCode(step.code)"
+          >
+            <UIcon name="i-lucide-copy" class="w-3.5 h-3.5 text-gray-400" />
+          </button>
+        </div>
+
+        <!-- Link -->
+        <NuxtLink
+          v-if="step.link"
+          :to="step.link"
+          class="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium mt-3"
+        >
+          {{ step.title }}
+          <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
+        </NuxtLink>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleIntro.vue b/app/components/modules/ModuleIntro.vue
new file mode 100644
index 0000000..76a4b5e
--- /dev/null
+++ b/app/components/modules/ModuleIntro.vue
@@ -0,0 +1,96 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+import MarkdownIt from 'markdown-it'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const md = new MarkdownIt()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '产品介绍')
+const body = computed(() => props.module.props?.body || props.capability?.description || '')
+const layout = computed(() => props.module.props?.layout || 'center')
+const image = computed(() => props.module.props?.image || '')
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
+      {{ title }}
+    </h2>
+
+    <!-- Center layout -->
+    <div v-if="layout === 'center'" class="max-w-3xl mx-auto">
+      <div
+        class="prose prose-gray max-w-none mb-6"
+        v-html="md.render(body)"
+      />
+      <img
+        v-if="image"
+        :src="image"
+        :alt="title"
+        class="w-full rounded-xl shadow-sm mt-6"
+      >
+    </div>
+
+    <!-- Left-right layout: text left + image right -->
+    <div v-else-if="layout === 'left-right'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
+      <div>
+        <div
+          class="prose prose-gray max-w-none"
+          v-html="md.render(body)"
+        />
+      </div>
+      <div v-if="image">
+        <img
+          :src="image"
+          :alt="title"
+          class="w-full rounded-xl shadow-sm"
+        >
+      </div>
+      <div v-else class="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
+        <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300" />
+      </div>
+    </div>
+
+    <!-- Right-left layout: image left + text right -->
+    <div v-else-if="layout === 'right-left'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
+      <div v-if="image" class="order-2 md:order-1">
+        <img
+          :src="image"
+          :alt="title"
+          class="w-full rounded-xl shadow-sm"
+        />
+      </div>
+      <div v-else class="order-2 md:order-1 flex items-center justify-center h-64 bg-gray-100 rounded-xl">
+        <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300" />
+      </div>
+      <div class="order-1 md:order-2">
+        <div
+          class="prose prose-gray max-w-none"
+          v-html="md.render(body)"
+        />
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModulePricing.vue b/app/components/modules/ModulePricing.vue
new file mode 100644
index 0000000..8d9c375
--- /dev/null
+++ b/app/components/modules/ModulePricing.vue
@@ -0,0 +1,164 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+import { models, apps, chargingPacks, modelPlans, appPlans, getPlansForCapability } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '定价方案')
+const useDefault = computed(() => props.module.props?.useDefault === true)
+
+// Default pricing from capability data
+const capabilityPricing = computed(() => {
+  if (props.capabilityType === 'model') {
+    return props.capability?.pricing || null
+  }
+  return null
+})
+
+const plansData = computed(() => {
+  if (useDefault.value) {
+    return getPlansForCapability(props.capability?.id || '')
+  }
+  return { packs: [], modelPlans: [], appPlans: [] }
+})
+
+// Custom plans from module props
+const customPlans = computed(() => props.module.props?.plans || [])
+
+// All plans to display
+const displayPlans = computed(() => {
+  if (!useDefault.value) {
+    return customPlans.value
+  }
+  const result: any[] = []
+  // Add token packs
+  result.push(...plansData.value.packs)
+  // Add model/app specific plans
+  result.push(...plansData.value.modelPlans)
+  result.push(...plansData.value.appPlans)
+  return result
+})
+
+function formatPrice(price: number): string {
+  if (price >= 10000) {
+    return `¥${(price / 10000).toFixed(0)}万`
+  }
+  return `¥${price.toLocaleString()}`
+}
+
+function getBillingLabel(cycle: string): string {
+  switch (cycle) {
+    case 'one-time': return '一次性'
+    case 'monthly': return '/月'
+    case 'annual': return '/年'
+    default: return ''
+  }
+}
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <!-- Per-token pricing for models -->
+    <div v-if="useDefault && capabilityPricing" class="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-100">
+      <h3 class="font-semibold text-primary-800 mb-3">按量计费</h3>
+      <div class="flex flex-wrap gap-6">
+        <div class="flex items-center gap-2">
+          <UIcon name="i-lucide-arrow-down-circle" class="w-5 h-5 text-primary-600" />
+          <span class="text-sm text-primary-700">输入：</span>
+          <span class="font-semibold text-primary-900">{{ capabilityPricing.input }}</span>
+        </div>
+        <div class="flex items-center gap-2">
+          <UIcon name="i-lucide-arrow-up-circle" class="w-5 h-5 text-primary-600" />
+          <span class="text-sm text-primary-700">输出：</span>
+          <span class="font-semibold text-primary-900">{{ capabilityPricing.output }}</span>
+        </div>
+      </div>
+    </div>
+
+    <!-- Plans grid -->
+    <div v-if="displayPlans.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
+      <div
+        v-for="(plan, i) in displayPlans"
+        :key="plan.id || i"
+        class="relative p-6 rounded-xl border bg-white"
+        :class="plan.popular ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-100'"
+      >
+        <!-- Popular badge -->
+        <span
+          v-if="plan.popular"
+          class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary-600 text-white text-xs font-medium"
+        >
+          推荐
+        </span>
+
+        <div class="flex items-center gap-3 mb-4">
+          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
+            <UIcon :name="plan.icon || 'i-lucide-tag'" class="w-5 h-5 text-primary-600" />
+          </div>
+          <div>
+            <h3 class="font-semibold text-gray-900">{{ plan.name }}</h3>
+            <p class="text-xs text-gray-500">{{ plan.description }}</p>
+          </div>
+        </div>
+
+        <div class="mb-4">
+          <span class="text-2xl font-bold text-gray-900">{{ formatPrice(plan.price) }}</span>
+          <span class="text-sm text-gray-500">{{ getBillingLabel(plan.billingCycle) }}</span>
+          <span v-if="plan.originalPrice" class="ml-2 text-sm text-gray-400 line-through">
+            {{ formatPrice(plan.originalPrice) }}
+          </span>
+        </div>
+
+        <ul class="space-y-2 mb-6">
+          <li
+            v-for="(feature, fi) in plan.features"
+            :key="fi"
+            class="flex items-center gap-2 text-sm text-gray-600"
+          >
+            <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 shrink-0" />
+            {{ feature }}
+          </li>
+        </ul>
+
+        <UButton
+          :variant="plan.popular ? 'solid' : 'outline'"
+          block
+          class="font-medium"
+        >
+          {{ plan.popular ? '立即购买' : '选择方案' }}
+        </UButton>
+      </div>
+    </div>
+
+    <!-- Empty state -->
+    <div v-else class="text-center py-12 text-gray-400">
+      <UIcon name="i-lucide-tag" class="w-10 h-10 mx-auto mb-3 opacity-50" />
+      <p>暂无定价方案</p>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleRelated.vue b/app/components/modules/ModuleRelated.vue
new file mode 100644
index 0000000..825bdff
--- /dev/null
+++ b/app/components/modules/ModuleRelated.vue
@@ -0,0 +1,123 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+import { models, apps } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '相关能力')
+const maxCount = computed(() => props.module.props?.maxCount || 4)
+
+const relatedCapabilities = computed(() => {
+  const ids = props.module.props?.ids
+
+  if (ids?.length) {
+    // Look up by IDs
+    const result: any[] = []
+    for (const id of ids) {
+      const model = models.find(m => m.id === id)
+      if (model) {
+        result.push({ ...model, _type: 'model' })
+      }
+      const app = apps.find(a => a.id === id)
+      if (app) {
+        result.push({ ...app, _type: 'app' })
+      }
+    }
+    return result.slice(0, maxCount.value)
+  }
+
+  // Auto-match by tags
+  const currentTags = props.capability?.tags || []
+  if (!currentTags.length) {
+    // Fallback: return first few from opposite list or same list
+    if (props.capabilityType === 'model') {
+      return apps.slice(0, maxCount.value).map(a => ({ ...a, _type: 'app' }))
+    }
+    return models.slice(0, maxCount.value).map(m => ({ ...m, _type: 'model' }))
+  }
+
+  const scored: { item: any; score: number; type: 'model' | 'app' }[] = []
+
+  for (const model of models) {
+    if (model.id === props.capability?.id) continue
+    const overlap = model.tags.filter((t: string) => currentTags.includes(t)).length
+    if (overlap > 0) {
+      scored.push({ item: model, score: overlap, type: 'model' })
+    }
+  }
+
+  for (const app of apps) {
+    if (app.id === props.capability?.id) continue
+    const overlap = app.tags.filter((t: string) => currentTags.includes(t)).length
+    if (overlap > 0) {
+      scored.push({ item: app, score: overlap, type: 'app' })
+    }
+  }
+
+  scored.sort((a, b) => b.score - a.score)
+  return scored.slice(0, maxCount.value).map(s => ({ ...s.item, _type: s.type }))
+})
+
+function getLink(cap: any): string {
+  return cap._type === 'model' ? `/models/${cap.id}` : `/apps/${cap.id}`
+}
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <div v-if="relatedCapabilities.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
+      <NuxtLink
+        v-for="(cap, i) in relatedCapabilities"
+        :key="i"
+        :to="getLink(cap)"
+        class="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow group"
+      >
+        <div class="flex items-center gap-3 mb-2">
+          <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
+            <UIcon :name="cap.icon || 'i-lucide-box'" class="w-4.5 h-4.5 text-primary-600" />
+          </div>
+          <div class="min-w-0">
+            <h3 class="font-medium text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors">
+              {{ cap.name }}
+            </h3>
+            <span class="text-xs text-gray-400">
+              {{ cap._type === 'model' ? '模型' : '应用' }}
+            </span>
+          </div>
+        </div>
+        <p class="text-xs text-gray-500 line-clamp-2">{{ cap.description }}</p>
+      </NuxtLink>
+    </div>
+
+    <!-- Empty state -->
+    <div v-else class="text-center py-12 text-gray-400">
+      <UIcon name="i-lucide-box" class="w-10 h-10 mx-auto mb-3 opacity-50" />
+      <p>暂无相关能力</p>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleRenderer.vue b/app/components/modules/ModuleRenderer.vue
new file mode 100644
index 0000000..f420bec
--- /dev/null
+++ b/app/components/modules/ModuleRenderer.vue
@@ -0,0 +1,37 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const componentMap: Record<string, string> = {
+  banner: 'ModulesModuleBanner',
+  hero: 'ModulesModuleHero',
+  intro: 'ModulesModuleIntro',
+  features: 'ModulesModuleFeatures',
+  advantages: 'ModulesModuleAdvantages',
+  scenarios: 'ModulesModuleScenarios',
+  tabs: 'ModulesModuleTabs',
+  carousel: 'ModulesModuleCarousel',
+  cards: 'ModulesModuleCards',
+  steps: 'ModulesModuleSteps',
+  pricing: 'ModulesModulePricing',
+  integration: 'ModulesModuleIntegration',
+  related: 'ModulesModuleRelated'
+}
+
+const componentName = computed(() => componentMap[props.module.type] || '')
+</script>
+
+<template>
+  <component
+    :is="componentName"
+    v-if="componentName && module.visible !== false"
+    :module="module"
+    :capability="capability"
+    :capability-type="capabilityType"
+  />
+</template>
diff --git a/app/components/modules/ModuleScenarios.vue b/app/components/modules/ModuleScenarios.vue
new file mode 100644
index 0000000..970982d
--- /dev/null
+++ b/app/components/modules/ModuleScenarios.vue
@@ -0,0 +1,95 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '使用场景')
+const layout = computed(() => props.module.props?.layout || 'cards')
+
+const defaultIcons = [
+  'i-lucide-building-2',
+  'i-lucide-shield',
+  'i-lucide-monitor',
+  'i-lucide-globe'
+]
+
+const defaultItems = [
+  { icon: 'i-lucide-building-2', title: '企业安全运营', description: '提升SOC运营效率，实现告警自动研判与响应' },
+  { icon: 'i-lucide-shield', title: '威胁检测防御', description: '精准识别APT攻击，自动提取IOC指标' },
+  { icon: 'i-lucide-monitor', title: '安全合规审计', description: '自动化合规检查，生成整改建议报告' },
+  { icon: 'i-lucide-globe', title: '态势感知分析', description: '全局安全态势可视化，实时威胁监控预警' }
+]
+
+const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <!-- Cards layout: grid -->
+    <div v-if="layout === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
+      <div
+        v-for="(item, i) in items"
+        :key="i"
+        class="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow text-center"
+      >
+        <img
+          v-if="item.image"
+          :src="item.image"
+          :alt="item.title"
+          class="w-full h-32 object-cover rounded-lg mb-4"
+        >
+        <div v-else class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
+          <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-6 h-6 text-primary-600" />
+        </div>
+        <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
+        <p class="text-sm text-gray-500">{{ item.description }}</p>
+      </div>
+    </div>
+
+    <!-- Carousel layout: horizontal scroll -->
+    <div v-else class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
+      <div
+        v-for="(item, i) in items"
+        :key="i"
+        class="min-w-[280px] snap-start p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow shrink-0"
+      >
+        <img
+          v-if="item.image"
+          :src="item.image"
+          :alt="item.title"
+          class="w-full h-32 object-cover rounded-lg mb-4"
+        >
+        <div v-else class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
+          <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-6 h-6 text-primary-600" />
+        </div>
+        <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
+        <p class="text-sm text-gray-500">{{ item.description }}</p>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleSteps.vue b/app/components/modules/ModuleSteps.vue
new file mode 100644
index 0000000..fc9a16f
--- /dev/null
+++ b/app/components/modules/ModuleSteps.vue
@@ -0,0 +1,105 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '使用步骤')
+const direction = computed(() => props.module.props?.direction || 'vertical')
+
+const defaultIcons = [
+  'i-lucide-rocket',
+  'i-lucide-settings',
+  'i-lucide-play',
+  'i-lucide-check-circle'
+]
+
+const defaultItems = [
+  { icon: 'i-lucide-rocket', title: '注册账号', description: '创建奇安信AI开放平台账号' },
+  { icon: 'i-lucide-key', title: '获取API Key', description: '在控制台创建API密钥' },
+  { icon: 'i-lucide-code-2', title: '接入调用', description: '使用SDK或HTTP接口接入' },
+  { icon: 'i-lucide-check-circle', title: '开始使用', description: '体验AI安全能力' }
+]
+
+const items = computed(() => props.module.props?.items?.length ? props.module.props.items : defaultItems)
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
+      {{ title }}
+    </h2>
+
+    <!-- Vertical steps -->
+    <div v-if="direction === 'vertical'" class="relative">
+      <div
+        v-for="(item, i) in items"
+        :key="i"
+        class="flex gap-4 relative pb-8 last:pb-0"
+      >
+        <!-- Connecting line -->
+        <div class="flex flex-col items-center">
+          <div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold shrink-0 z-10">
+            {{ i + 1 }}
+          </div>
+          <div v-if="i < items.length - 1" class="w-0.5 flex-1 bg-primary-200 mt-2" />
+        </div>
+        <!-- Content -->
+        <div class="pt-1.5">
+          <div class="flex items-center gap-2 mb-1">
+            <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-4 h-4 text-primary-600" />
+            <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
+          </div>
+          <p class="text-sm text-gray-500">{{ item.description }}</p>
+        </div>
+      </div>
+    </div>
+
+    <!-- Horizontal steps -->
+    <div v-else class="relative">
+      <div class="flex items-start">
+        <div
+          v-for="(item, i) in items"
+          :key="i"
+          class="flex-1 relative"
+        >
+          <div class="flex flex-col items-center text-center">
+            <div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold z-10">
+              {{ i + 1 }}
+            </div>
+            <div class="flex items-center gap-1.5 mt-3 mb-1">
+              <UIcon :name="item.icon || defaultIcons[i % defaultIcons.length]" class="w-4 h-4 text-primary-600" />
+              <h3 class="font-semibold text-gray-900 text-sm">{{ item.title }}</h3>
+            </div>
+            <p class="text-xs text-gray-500 max-w-[160px]">{{ item.description }}</p>
+          </div>
+          <!-- Connecting line -->
+          <div
+            v-if="i < items.length - 1"
+            class="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 bg-primary-200"
+          />
+        </div>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/components/modules/ModuleTabs.vue b/app/components/modules/ModuleTabs.vue
new file mode 100644
index 0000000..d220ac9
--- /dev/null
+++ b/app/components/modules/ModuleTabs.vue
@@ -0,0 +1,75 @@
+<script setup lang="ts">
+import type { TemplateModule } from '~/data/mock'
+
+const props = defineProps<{
+  module: TemplateModule
+  capability: any
+  capabilityType: 'model' | 'app'
+}>()
+
+const spacingMap: Record<string, string> = {
+  xs: 'py-2',
+  sm: 'py-4',
+  md: 'py-8',
+  lg: 'py-12'
+}
+
+const backgroundMap: Record<string, string> = {
+  white: 'bg-white',
+  gray: 'bg-gray-50',
+  'primary-light': 'bg-primary-50'
+}
+
+const spacingTop = computed(() => spacingMap[props.module.spacing?.top] || 'py-8')
+const spacingBottom = computed(() => spacingMap[props.module.spacing?.bottom] || 'py-8')
+const bgClass = computed(() => backgroundMap[props.module.background] || 'bg-white')
+
+const title = computed(() => props.module.props?.title || '')
+const tabs = computed(() => {
+  if (props.module.props?.tabs?.length) {
+    return props.module.props.tabs
+  }
+  return props.module.children || []
+})
+
+const activeTab = ref(0)
+
+const activeModules = computed(() => {
+  const currentTab = tabs.value[activeTab.value]
+  return currentTab?.children || []
+})
+</script>
+
+<template>
+  <div :class="[spacingTop, spacingBottom, bgClass]">
+    <h2 v-if="title" class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
+      {{ title }}
+    </h2>
+
+    <!-- Tab headers -->
+    <div class="flex gap-1 border-b border-gray-200 mb-6">
+      <button
+        v-for="(tab, i) in tabs"
+        :key="i"
+        class="px-4 py-2.5 text-sm font-medium transition-colors relative -mb-px border-b-2"
+        :class="activeTab === i
+          ? 'border-primary-600 text-primary-600'
+          : 'border-transparent text-gray-500 hover:text-gray-700'"
+        @click="activeTab = i"
+      >
+        {{ tab.name }}
+      </button>
+    </div>
+
+    <!-- Tab content: render child modules recursively -->
+    <div class="space-y-0">
+      <template v-for="(child, i) in activeModules" :key="child.id || i">
+        <ModulesModuleRenderer
+          :module="child"
+          :capability="capability"
+          :capability-type="capabilityType"
+        />
+      </template>
+    </div>
+  </div>
+</template>
