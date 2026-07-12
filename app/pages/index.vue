<script setup lang="ts">
import { models, apps, chargingPacks, modelPlans, appPlans } from '~/data/mock'

useHead({
  title: '奇安信AI开放平台 - 安全AI能力 一站式获取',
  meta: [
    { name: 'description', content: '奇安信AI开放平台汇聚安全大模型、智能应用与专业工具，统一市场、按需选用，让安全能力触手可及。' }
  ]
})

// ─── 1. Hero Canvas Animation ───
const heroCanvas = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

function initCanvas() {
  const canvas = heroCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  let width = canvas.parentElement?.offsetWidth || window.innerWidth
  let height = canvas.parentElement?.offsetHeight || 600

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  const nodeCount = Math.min(Math.floor((width * height) / 25000), 60)
  const nodes: Node[] = []

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5
    })
  }

  const connectionDistance = 150

  function animate() {
    ctx!.clearRect(0, 0, width, height)

    // Update positions
    for (const node of nodes) {
      node.x += node.vx
      node.y += node.vy
      if (node.x < 0 || node.x > width) node.vx *= -1
      if (node.y < 0 || node.y > height) node.vy *= -1
    }

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i]!.x - nodes[j]!.x
        const dy = nodes[i]!.y - nodes[j]!.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15
          ctx!.beginPath()
          ctx!.strokeStyle = `rgba(124, 58, 237, ${alpha})`
          ctx!.lineWidth = 1
          ctx!.moveTo(nodes[i]!.x, nodes[i]!.y)
          ctx!.lineTo(nodes[j]!.x, nodes[j]!.y)
          ctx!.stroke()
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      ctx!.beginPath()
      ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(124, 58, 237, 0.35)'
      ctx!.fill()
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  // Handle resize
  const onResize = () => {
    width = canvas.parentElement?.offsetWidth || window.innerWidth
    height = canvas.parentElement?.offsetHeight || 600
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)
  }
  window.addEventListener('resize', onResize)

  // Return cleanup
  return () => {
    window.removeEventListener('resize', onResize)
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
  }
}

let cleanupCanvas: (() => void) | null = null

onMounted(() => {
  cleanupCanvas = initCanvas()
})

onUnmounted(() => {
  cleanupCanvas?.()
})

// ─── 2. Capability Carousel ───
const hotCapabilities = computed(() => {
  const hotModels = models.filter(m => m.hot).map(m => ({ ...m, _type: 'model' as const }))
  const hotApps = apps.filter(a => a.hot).map(a => ({ ...a, _type: 'app' as const }))
  return [...hotModels, ...hotApps].slice(0, 4)
})

const carouselIndex = ref(0)
let carouselTimer: ReturnType<typeof setInterval> | null = null
const isCarouselPaused = ref(false)

function startCarouselTimer() {
  stopCarouselTimer()
  carouselTimer = setInterval(() => {
    if (!isCarouselPaused.value) {
      carouselIndex.value = (carouselIndex.value + 1) % hotCapabilities.value.length
    }
  }, 4000)
}

function stopCarouselTimer() {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

function onCarouselHover() {
  isCarouselPaused.value = true
}

function onCarouselLeave() {
  isCarouselPaused.value = false
}

onMounted(() => {
  startCarouselTimer()
})

onUnmounted(() => {
  stopCarouselTimer()
})

// ─── 3. Security Capability Matrix ───
const securityDomains = [
  { name: '网络安全', icon: 'i-lucide-globe', type: 'network', count: 3, model: '日志智能分析模型' },
  { name: '威胁检测', icon: 'i-lucide-shield-alert', type: 'threat', count: 5, model: '威胁检测模型 V3' },
  { name: '漏洞分析', icon: 'i-lucide-bug', type: 'vulnerability', count: 4, model: '漏洞分析专家' },
  { name: '合规审计', icon: 'i-lucide-clipboard-check', type: 'compliance', count: 3, model: '合规卫士' },
  { name: '代码安全', icon: 'i-lucide-code-2', type: 'code', count: 4, model: '代码安全扫描模型' },
  { name: '应急响应', icon: 'i-lucide-siren', type: 'incident', count: 3, model: '应急响应模型' }
]

// ─── 4. Enterprise Section ───
const enterpriseFeatures = [
  { icon: 'i-lucide-shopping-cart', number: '5000+', title: '企业客户', description: '集中采购AI安全能力，统一结算与管理，简化企业采购流程' },
  { icon: 'i-lucide-users', number: '50万+', title: '开发者用户', description: '灵活的成员邀请与角色权限管理，支持管理员、开发者、财务等多种角色' },
  { icon: 'i-lucide-gauge', number: '1亿+', title: 'API调用', description: '实时监控成员API调用量与Token消耗，设置用量上限与告警阈值' },
  { icon: 'i-lucide-percent', number: '30%', title: '专属折扣', description: '企业客户享受专属批量折扣，充能包单价更低，性价比更高' }
]

// ─── 5. Pricing Tabs ───
const pricingTab = ref<'pack' | 'model' | 'app'>('pack')

const featuredPacks = computed(() => chargingPacks.slice(0, 3))
const featuredModelPlans = computed(() => modelPlans.slice(0, 2))
const featuredAppPlans = computed(() => appPlans.slice(0, 2))

const pricingTabs = [
  { key: 'pack' as const, label: '充能包' },
  { key: 'model' as const, label: '模型套餐' },
  { key: 'app' as const, label: '应用套餐' }
]

// ─── 6. Quick Start ───
const quickSteps = [
  { step: 1, title: '注册账号', description: '免费注册奇安信AI开放平台账号，即刻获得体验包', icon: 'i-lucide-user-plus' },
  { step: 2, title: '获取Key', description: '在控制台创建API Key，一键获取调用凭证', icon: 'i-lucide-key' },
  { step: 3, title: '调用API', description: '按照文档指引，快速集成安全AI能力', icon: 'i-lucide-terminal' }
]

const codeSnippet = `curl https://api.qianxin.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qax-security-llm",
    "messages": [
      {"role": "user", "content": "分析这段日志中的异常行为"}
    ]
  }'`

// ─── Stats ───
const stats = [
  { value: '18+', label: 'AI安全能力', icon: 'i-lucide-cpu' },
  { value: '1亿+', label: '累计调用', icon: 'i-lucide-activity' },
  { value: '5000+', label: '企业客户', icon: 'i-lucide-building-2' },
  { value: '100万+', label: '安全事件处理', icon: 'i-lucide-shield-check' }
]

// ─── Testimonials ───
const testimonials = [
  {
    quote: '奇安信AI开放平台的安全大模型帮助我们实现了威胁研判自动化，安全运营效率提升了300%，MTTR从4小时缩短至30分钟。',
    name: '张明',
    title: '信息安全总监',
    company: '某大型金融机构',
    icon: 'i-lucide-landmark'
  },
  {
    quote: '威胁检测模型的APT攻击链分析能力非常强大，帮助我们发现了多起高级持续性威胁，有效保障了国家关键基础设施安全运行。',
    name: '李伟',
    title: '安全运营负责人',
    company: '某能源企业',
    icon: 'i-lucide-zap'
  },
  {
    quote: '代码安全扫描模型深度集成到我们的DevSecOps流程中，上线前漏洞发现率提升了85%，大幅降低了安全风险和修复成本。',
    name: '王芳',
    title: '技术架构师',
    company: '某政府单位',
    icon: 'i-lucide-building-2'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section with Canvas Animation -->
    <section class="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20">
      <!-- Canvas particle animation -->
      <canvas ref="heroCanvas" class="absolute inset-0 pointer-events-none z-0" />

      <!-- Grid / Circuit pattern background -->
      <div class="absolute inset-0 hero-grid pointer-events-none z-0" />

      <!-- Decorative glows -->
      <div class="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-accent-100/15 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/10 rounded-full blur-3xl" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div class="max-w-3xl mx-auto text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50/80 border border-primary-200/60 mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-500 badge-pulse" />
            <span class="text-xs font-semibold text-primary-700 tracking-wide">AI安全能力统一市场</span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            安全AI能力
            <br />
            <span class="gradient-text">一站式获取</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-12">
            奇安信AI开放平台汇聚安全大模型、智能应用与专业工具，统一市场、按需选用，让安全能力触手可及。
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-4">
            <UButton
              label="探索能力市场"
              icon="i-lucide-compass"
              color="primary"
              size="xl"
              to="/marketplace"
            />
            <UButton
              label="企业咨询"
              icon="i-lucide-phone"
              variant="outline"
              color="primary"
              size="xl"
              to="mailto:enterprise@qianxin.ai"
            />
          </div>

          <!-- Micro trust signal -->
          <div class="mt-10 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5 text-primary-400" />
              等保三级认证
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-lock" class="w-3.5 h-3.5 text-primary-400" />
              数据安全合规
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-server" class="w-3.5 h-3.5 text-primary-400" />
              99.9% SLA保障
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="relative bg-white border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-10 md:py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div v-for="(stat, i) in stats" :key="stat.label" class="flex items-center gap-4 stat-item" :style="{ animationDelay: `${i * 100}ms` }">
            <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <UIcon :name="stat.icon" class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{{ stat.value }}</p>
              <p class="text-sm text-gray-500 mt-0.5">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="border-b border-gray-100" />
    </div>

    <!-- Capability Carousel -->
    <section class="py-20 md:py-24">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-cpu" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">热门能力</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            最受欢迎的<span class="gradient-text">安全AI能力</span>
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">
            精选热门安全大模型与智能应用，助力您的安全运营更智能、更高效
          </p>
        </div>

        <!-- Carousel Container -->
        <div
          class="relative max-w-4xl mx-auto"
          @mouseenter="onCarouselHover"
          @mouseleave="onCarouselLeave"
        >
          <!-- Carousel Track -->
          <div class="overflow-hidden rounded-2xl">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${carouselIndex * 100}%)` }"
            >
              <div
                v-for="cap in hotCapabilities"
                :key="cap.id"
                class="w-full shrink-0 px-2"
              >
                <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-lg hover:shadow-primary-500/10 transition-shadow duration-300">
                  <div class="flex flex-col md:flex-row items-start gap-6">
                    <!-- Icon -->
                    <div
                      class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                      :class="cap._type === 'model' ? 'bg-primary-50' : 'bg-accent-50'"
                    >
                      <UIcon
                        :name="cap.icon"
                        class="w-7 h-7"
                        :class="cap._type === 'model' ? 'text-primary-600' : 'text-accent-600'"
                      />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="text-lg font-bold text-gray-900">{{ cap.name }}</h3>
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                          :class="cap._type === 'model' ? 'bg-primary-100 text-primary-700' : 'bg-accent-100 text-accent-700'"
                        >
                          {{ cap._type === 'model' ? '模型' : '应用' }}
                        </span>
                        <span v-if="cap.hot" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">HOT</span>
                      </div>

                      <!-- Core params -->
                      <div class="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span v-if="cap._type === 'model'" class="flex items-center gap-1">
                          <UIcon name="i-lucide-cpu" class="w-3.5 h-3.5" />
                          {{ (cap as any).parameters }} 参数
                        </span>
                        <span class="flex items-center gap-1">
                          <UIcon name="i-lucide-star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {{ cap.rating }}
                        </span>
                        <span class="flex items-center gap-1">
                          <UIcon name="i-lucide-activity" class="w-3.5 h-3.5" />
                          {{ cap._type === 'model' ? (cap as any).callCount : (cap as any).useCount }}
                        </span>
                      </div>

                      <p class="text-sm text-gray-500 leading-relaxed mb-4">{{ cap.description }}</p>

                      <!-- Tags -->
                      <div class="flex flex-wrap gap-1.5 mb-4">
                        <span
                          v-for="tag in cap.tags.slice(0, 3)"
                          :key="tag"
                          class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-500"
                        >
                          {{ tag }}
                        </span>
                      </div>

                      <!-- CTA -->
                      <UButton
                        label="快速体验"
                        icon="i-lucide-play"
                        size="sm"
                        color="primary"
                        :to="`/marketplace/${cap.id}`"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carousel Indicators -->
          <div class="flex items-center justify-center gap-2 mt-6">
            <button
              v-for="(_, i) in hotCapabilities"
              :key="i"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="i === carouselIndex ? 'w-6 bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'"
              @click="carouselIndex = i"
            />
          </div>
        </div>

        <!-- View All Link -->
        <div class="text-center mt-10">
          <UButton
            label="查看全部能力 →"
            icon="i-lucide-arrow-right"
            variant="ghost"
            color="primary"
            trailing
            to="/marketplace"
          />
        </div>
      </div>
    </section>

    <!-- Security Capability Matrix -->
    <section class="py-20 md:py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-layout-grid" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">安全能力矩阵</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            全域<span class="gradient-text">安全能力</span>覆盖
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">
            六大安全领域，18+专业AI能力，构建全方位智能安全防护体系
          </p>
        </div>

        <!-- 2x3 Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <NuxtLink
            v-for="domain in securityDomains"
            :key="domain.name"
            :to="`/marketplace?type=${domain.type}`"
            class="group bg-white rounded-2xl border border-gray-100 p-6 hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(109,40,217,0.18)] transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                <UIcon :name="domain.icon" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">{{ domain.name }}</h3>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-sm font-semibold text-primary-600">{{ domain.count }} 项能力</span>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed">代表模型：{{ domain.model }}</p>
              </div>
            </div>
            <!-- Arrow indicator -->
            <div class="mt-4 flex items-center gap-1 text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>查看能力</span>
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Enterprise Section — White cards with purple gradient border -->
    <section id="enterprise" class="py-20 md:py-28 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-5">
            <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">企业专属</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            企业专属<span class="gradient-text">方案</span>
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">
            为企业客户提供统一采购、成员管理、用量管控与专属折扣，让团队协作更高效
          </p>

          <!-- Trust indicator -->
          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50/60 border border-primary-100">
            <UIcon name="i-lucide-badge-check" class="w-4 h-4 text-primary-600" />
            <span class="text-sm font-medium text-primary-700">已服务5000+企业客户</span>
          </div>
        </div>

        <!-- Feature Cards — 2x2 with gradient border -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div
            v-for="feature in enterpriseFeatures"
            :key="feature.title"
            class="relative bg-white rounded-2xl p-8 card-hover"
          >
            <!-- Gradient border effect -->
            <div class="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary-500 to-accent-400 opacity-20 hover:opacity-40 transition-opacity -z-10" style="margin: -2px; border-radius: 1rem;" />
            <div class="absolute inset-[2px] bg-white rounded-[14px]" />

            <div class="relative">
              <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5">
                <UIcon :name="feature.icon" class="w-6 h-6 text-primary-600" />
              </div>
              <p class="text-3xl font-extrabold text-primary-600 mb-1">{{ feature.number }}</p>
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-12">
          <UButton
            label="了解企业方案"
            icon="i-lucide-arrow-right"
            color="primary"
            size="lg"
            trailing
            to="/enterprise"
          />
        </div>
      </div>
    </section>

    <!-- Trust / Testimonials Section -->
    <section class="py-20 md:py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-users" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">客户信赖</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            深受<span class="gradient-text">行业领军者</span>信赖
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">
            从金融到能源，从政府到互联网，数百家企业选择奇安信AI开放平台
          </p>
        </div>

        <!-- Testimonial Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="bg-white rounded-2xl border border-gray-100 p-8 card-hover shadow-sm"
          >
            <!-- Quote Icon -->
            <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-6">
              <UIcon name="i-lucide-quote" class="w-5 h-5 text-primary-400" />
            </div>

            <!-- Quote Text -->
            <p class="text-sm text-gray-600 leading-relaxed mb-6">{{ testimonial.quote }}</p>

            <!-- Star Rating -->
            <div class="flex items-center gap-0.5 mb-6">
              <UIcon v-for="n in 5" :key="n" name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>

            <!-- Customer Info -->
            <div class="flex items-center gap-3 pt-5 border-t border-gray-100">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <UIcon :name="testimonial.icon" class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ testimonial.name }}</p>
                <p class="text-xs text-gray-500">{{ testimonial.title }} · {{ testimonial.company }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Divider -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="border-b border-gray-100" />
    </div>

    <!-- Pricing Preview with Tabs -->
    <section class="py-20 md:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-tag" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">灵活定价</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            选择适合您的<span class="gradient-text">方案</span>
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">
            从个人开发者到大型企业，我们提供灵活的定价方案满足不同需求
          </p>
        </div>

        <!-- Tab Switcher -->
        <div class="flex items-center justify-center gap-1 mb-10">
          <button
            v-for="tab in pricingTabs"
            :key="tab.key"
            class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            :class="pricingTab === tab.key
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="pricingTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content: Charging Packs -->
        <div v-if="pricingTab === 'pack'" class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            v-for="pack in featuredPacks"
            :key="pack.id"
            class="relative bg-white rounded-2xl border p-7 card-hover shadow-sm"
            :class="pack.popular ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-gray-100'"
          >
            <!-- Popular Badge -->
            <div v-if="pack.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white">
                最受欢迎
              </span>
            </div>

            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ pack.name }}</h3>
            <p class="text-sm text-gray-500 mb-5">{{ pack.tokens }}</p>

            <div class="mb-2">
              <span class="text-4xl font-bold text-gray-900">{{ pack.price }}</span>
              <span v-if="pack.originalPrice" class="text-sm text-gray-400 line-through ml-2">{{ pack.originalPrice }}</span>
            </div>
            <p class="text-xs text-primary-600 font-medium mb-6">{{ pack.unitPrice }}</p>

            <div class="border-t border-gray-100 mb-6" />

            <ul class="space-y-3 mb-8">
              <li
                v-for="feature in pack.features"
                :key="feature"
                class="flex items-center gap-2.5 text-sm text-gray-600"
              >
                <UIcon name="i-lucide-check" class="w-4 h-4 text-primary-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>

            <UButton
              :label="pack.popular ? '立即购买' : '选择方案'"
              :color="pack.popular ? 'primary' : 'neutral'"
              :variant="pack.popular ? 'solid' : 'outline'"
              block
              size="lg"
              to="/console/packs"
            />
          </div>
        </div>

        <!-- Tab Content: Model Plans -->
        <div v-if="pricingTab === 'model'" class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            v-for="plan in featuredModelPlans"
            :key="plan.id"
            class="relative bg-white rounded-2xl border p-7 card-hover shadow-sm"
            :class="plan.popular ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-gray-100'"
          >
            <div v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white">
                最受欢迎
              </span>
            </div>

            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <UIcon :name="plan.icon" class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900">{{ plan.name }}</h3>
                <p class="text-xs text-gray-500">{{ plan.description }}</p>
              </div>
            </div>

            <div class="mb-2">
              <span class="text-3xl font-bold text-gray-900">¥{{ plan.price }}</span>
              <span class="text-sm text-gray-500">/{{ plan.billingCycle === 'monthly' ? '月' : '年' }}</span>
              <span v-if="plan.originalPrice" class="text-sm text-gray-400 line-through ml-2">¥{{ plan.originalPrice }}</span>
            </div>

            <div class="border-t border-gray-100 my-5" />

            <ul class="space-y-2.5 mb-6">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-center gap-2.5 text-sm text-gray-600"
              >
                <UIcon name="i-lucide-check" class="w-4 h-4 text-primary-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>

            <UButton
              :label="plan.popular ? '立即购买' : '选择方案'"
              :color="plan.popular ? 'primary' : 'neutral'"
              :variant="plan.popular ? 'solid' : 'outline'"
              block
              size="lg"
              to="/console/packs"
            />
          </div>
        </div>

        <!-- Tab Content: App Plans -->
        <div v-if="pricingTab === 'app'" class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            v-for="plan in featuredAppPlans"
            :key="plan.id"
            class="relative bg-white rounded-2xl border p-7 card-hover shadow-sm"
            :class="plan.popular ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-gray-100'"
          >
            <div v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white">
                最受欢迎
              </span>
            </div>

            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                <UIcon :name="plan.icon" class="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900">{{ plan.name }}</h3>
                <p class="text-xs text-gray-500">{{ plan.description }}</p>
              </div>
            </div>

            <div class="mb-2">
              <span class="text-3xl font-bold text-gray-900">¥{{ plan.price }}</span>
              <span class="text-sm text-gray-500">/{{ plan.billingCycle === 'monthly' ? '月' : '年' }}</span>
            </div>

            <div class="border-t border-gray-100 my-5" />

            <ul class="space-y-2.5 mb-6">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-center gap-2.5 text-sm text-gray-600"
              >
                <UIcon name="i-lucide-check" class="w-4 h-4 text-primary-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>

            <UButton
              :label="plan.popular ? '立即购买' : '选择方案'"
              :color="plan.popular ? 'primary' : 'neutral'"
              :variant="plan.popular ? 'solid' : 'outline'"
              block
              size="lg"
              to="/console/packs"
            />
          </div>
        </div>

        <!-- Link to full pricing page -->
        <div class="text-center mt-8">
          <UButton
            label="查看完整定价"
            icon="i-lucide-arrow-right"
            variant="ghost"
            color="primary"
            trailing
            to="/portal/pricing"
          />
        </div>
      </div>
    </section>

    <!-- Quick Start Section -->
    <section class="py-20 md:py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-rocket" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">快速接入</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span class="gradient-text">3步</span>开启安全AI之旅
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">
            简单三步，即刻接入专业安全AI能力
          </p>
        </div>

        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <!-- Steps -->
            <div class="space-y-6">
              <div
                v-for="step in quickSteps"
                :key="step.step"
                class="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-5 card-hover"
              >
                <!-- Step Number -->
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shrink-0">
                  <span class="text-sm font-bold text-white">{{ step.step }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <UIcon :name="step.icon" class="w-4 h-4 text-primary-600" />
                    <h3 class="text-sm font-bold text-gray-900">{{ step.title }}</h3>
                  </div>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ step.description }}</p>
                </div>
              </div>

              <!-- CTA -->
              <div class="pt-2">
                <UButton
                  label="立即开始"
                  icon="i-lucide-arrow-right"
                  color="primary"
                  size="lg"
                  trailing
                  to="/console/keys/create"
                />
              </div>
            </div>

            <!-- Code Snippet Preview -->
            <div class="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
              <!-- Code header -->
              <div class="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
                <div class="flex items-center gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500/80" />
                  <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div class="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span class="text-xs text-gray-400 ml-2">Terminal</span>
              </div>
              <!-- Code content -->
              <div class="p-5 overflow-x-auto">
                <pre class="text-sm text-gray-300 leading-relaxed font-mono"><code>{{ codeSnippet }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 md:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 p-10 md:p-14">
          <!-- Decorative elements -->
          <div class="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10" />
          <div class="absolute -left-4 -bottom-4 w-36 h-36 rounded-full bg-white/5" />
          <div class="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5" />

          <div class="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="max-w-lg">
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">开始使用安全AI能力</h2>
              <p class="text-white/80 leading-relaxed">
                注册即可获得体验包，探索全部安全AI能力。无需信用卡，即刻开启智能安全之旅。
              </p>
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <UButton
                label="免费注册"
                icon="i-lucide-rocket"
                color="primary"
                size="xl"
                to="/portal/register"
                class="bg-white text-primary-700 hover:bg-white/90"
              />
              <UButton
                label="联系销售"
                icon="i-lucide-phone"
                variant="outline"
                size="xl"
                color="neutral"
                to="mailto:enterprise@qianxin.ai"
                class="text-white border-white/30 hover:bg-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-100 py-14">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <!-- Brand -->
          <div class="md:col-span-1">
            <div class="flex items-center gap-2.5 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                <UIcon name="i-lucide-shield-check" class="w-4.5 h-4.5 text-white" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-900 leading-tight">奇安信</span>
                <span class="text-[10px] text-primary-500 font-medium leading-tight">AI 开放平台</span>
              </div>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">
              以AI之力，守护数字世界安全。奇安信AI开放平台提供一站式AI安全能力服务。
            </p>
          </div>

          <!-- Products -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">产品能力</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="/marketplace" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">安全大模型</NuxtLink></li>
              <li><NuxtLink to="/marketplace" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">威胁检测</NuxtLink></li>
              <li><NuxtLink to="/marketplace" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">漏洞分析</NuxtLink></li>
              <li><NuxtLink to="/marketplace" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">代码安全</NuxtLink></li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">开发者资源</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="/console/docs" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">API文档</NuxtLink></li>
              <li><NuxtLink to="/console/docs" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">SDK下载</NuxtLink></li>
              <li><NuxtLink to="/console/docs" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">开发者指南</NuxtLink></li>
              <li><NuxtLink to="/console" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">帮助中心</NuxtLink></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">联系我们</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="mailto:enterprise@qianxin.ai" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">公司介绍</NuxtLink></li>
              <li><NuxtLink to="mailto:enterprise@qianxin.ai" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">隐私政策</NuxtLink></li>
              <li><NuxtLink to="mailto:enterprise@qianxin.ai" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">服务条款</NuxtLink></li>
              <li><NuxtLink to="mailto:enterprise@qianxin.ai" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">联系销售</NuxtLink></li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <span class="text-xs text-gray-400">&copy; 2026 奇安信科技集团股份有限公司. 保留所有权利.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Hero grid/circuit pattern */
.hero-grid {
  background-image:
    linear-gradient(rgba(124, 58, 237, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124, 58, 237, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
}

/* Stats fade-in animation */
.stat-item {
  animation: statFadeIn 0.6s ease-out both;
}

@keyframes statFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
