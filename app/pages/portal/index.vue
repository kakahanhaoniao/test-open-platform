<script setup lang="ts">
useHead({
  title: '奇安信AI开放平台 - 以AI之力，守护数字世界安全',
  meta: [
    { name: 'description', content: '奇安信AI开放平台提供安全大模型、威胁检测、漏洞分析等AI安全能力，助力企业构建智能安全防护体系。' }
  ]
})

const capabilities = [
  {
    icon: 'i-lucide-brain',
    title: '安全大模型',
    description: '基于千亿参数的安全领域大语言模型，深度融合20年安全知识库，支持威胁分析、安全问答、报告生成',
    color: 'bg-primary-50 text-primary-600'
  },
  {
    icon: 'i-lucide-shield-alert',
    title: '威胁检测',
    description: '专注高级威胁识别，支持APT攻击链分析、恶意流量检测与IOC自动提取，检测率达99.2%',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: 'i-lucide-bug',
    title: '漏洞分析',
    description: '深度漏洞分析模型，支持CVE解读、PoC生成、修复方案推荐与风险评估，覆盖OWASP Top 10全类别',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    icon: 'i-lucide-code-2',
    title: '代码安全',
    description: '源代码安全审计模型，支持SAST/DAST分析、安全编码建议与漏洞模式识别，覆盖主流编程语言',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: 'i-lucide-monitor-dot',
    title: '智能运营',
    description: 'AI驱动的安全运营中心，集成告警聚合、威胁研判、自动化响应，将MTTR从小时级缩短至分钟级',
    color: 'bg-accent-50 text-accent-600'
  },
  {
    icon: 'i-lucide-globe',
    title: '态势感知',
    description: '实时安全态势可视化，全球威胁地图、攻击链路追踪、资产风险热力图，一屏掌控全局安全态势',
    color: 'bg-emerald-50 text-emerald-600'
  }
]

const stats = [
  { value: '10+', label: 'AI安全模型', icon: 'i-lucide-cpu' },
  { value: '8+', label: '安全应用', icon: 'i-lucide-layout-grid' },
  { value: '5000万+', label: '累计调用次数', icon: 'i-lucide-activity' },
  { value: '99.9%', label: '服务可用性', icon: 'i-lucide-shield-check' }
]

const customers = [
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

const pricingTiers = [
  {
    name: '体验包',
    price: '¥99',
    tokens: '100万Token',
    features: ['基础模型调用', '标准响应速度', '社区技术支持'],
    popular: false
  },
  {
    name: '专业包',
    price: '¥399',
    tokens: '500万Token',
    originalPrice: '¥495',
    features: ['全模型调用', '优先响应速度', '工单技术支持', 'API调用统计'],
    popular: true
  },
  {
    name: '企业包',
    price: '¥1,499',
    tokens: '2000万Token',
    originalPrice: '¥1,980',
    features: ['全模型调用', '最高响应速度', '1对1技术支持', 'API调用统计', '专属模型实例', 'SLA保障'],
    popular: false
  }
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <PortalNav />

    <!-- Hero Section -->
    <section class="relative overflow-hidden deep-block">
      <!-- Animated background dots -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="hero-dot" style="top: 15%; left: 10%; animation-delay: 0s;" />
        <div class="hero-dot" style="top: 25%; left: 30%; animation-delay: 0.5s;" />
        <div class="hero-dot" style="top: 60%; left: 20%; animation-delay: 1s;" />
        <div class="hero-dot" style="top: 40%; left: 70%; animation-delay: 1.5s;" />
        <div class="hero-dot" style="top: 70%; left: 80%; animation-delay: 2s;" />
        <div class="hero-dot" style="top: 20%; left: 60%; animation-delay: 0.3s;" />
        <div class="hero-dot" style="top: 80%; left: 45%; animation-delay: 0.8s;" />
        <div class="hero-dot" style="top: 50%; left: 90%; animation-delay: 1.2s;" />
        <div class="hero-dot" style="top: 35%; left: 50%; animation-delay: 1.8s;" />
        <div class="hero-dot" style="top: 55%; left: 5%; animation-delay: 0.6s;" />
        <!-- Grid lines -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;" />
      </div>

      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/40 to-transparent" />

      <!-- Decorative circles -->
      <div class="absolute top-20 right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div class="absolute bottom-10 right-40 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div class="max-w-3xl">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
            <span class="w-2 h-2 rounded-full bg-accent-400 badge-pulse" />
            <span class="text-white/80 text-xs font-medium">AI安全能力开放平台</span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            以AI之力
            <br />
            <span class="bg-gradient-to-r from-primary-300 via-primary-200 to-accent-300 bg-clip-text text-transparent">守护数字世界安全</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mb-10">
            奇安信AI开放平台汇聚安全大模型、智能应用与专业工具，为企业提供一站式AI安全能力服务，让安全防护更智能、更高效。
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4">
            <UButton
              label="免费体验"
              icon="i-lucide-play"
              size="xl"
              to="/"
              class="bg-white text-primary-700 hover:bg-white/90 font-semibold"
            />
            <UButton
              label="查看定价"
              icon="i-lucide-tag"
              size="xl"
              variant="outline"
              to="/portal/pricing"
              class="border-white/20 text-white hover:bg-white/10"
            />
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
            <div v-for="stat in stats" :key="stat.label">
              <p class="text-2xl md:text-3xl font-bold text-white">{{ stat.value }}</p>
              <p class="text-white/40 text-sm mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Capabilities Section -->
    <section class="py-20 bg-[#FAFAFA]">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-cpu" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">核心能力</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            全方位<span class="gradient-text">AI安全能力</span>
          </h2>
          <p class="text-gray-500 text-lg max-w-2xl mx-auto">
            覆盖安全运营全场景的AI能力矩阵，从威胁检测到应急响应，为您的安全体系注入智能动力
          </p>
        </div>

        <!-- Capability Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cap in capabilities"
            :key="cap.title"
            class="bg-white rounded-2xl border border-gray-100 p-7 card-hover"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              :class="cap.color"
            >
              <UIcon :name="cap.icon" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ cap.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ cap.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <UIcon :name="stat.icon" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Cases Section -->
    <section id="customers" class="py-20 bg-[#FAFAFA]">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-users" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">客户案例</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            深受<span class="gradient-text">行业领军者</span>信赖
          </h2>
          <p class="text-gray-500 text-lg max-w-2xl mx-auto">
            从金融到能源，从政府到互联网，数百家企业选择奇安信AI开放平台
          </p>
        </div>

        <!-- Customer Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="customer in customers"
            :key="customer.name"
            class="bg-white rounded-2xl border border-gray-100 p-7 card-hover"
          >
            <!-- Quote Icon -->
            <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-5">
              <UIcon name="i-lucide-quote" class="w-5 h-5 text-primary-400" />
            </div>

            <!-- Quote Text -->
            <p class="text-sm text-gray-600 leading-relaxed mb-6">{{ customer.quote }}</p>

            <!-- Customer Info -->
            <div class="flex items-center gap-3 pt-5 border-t border-gray-50">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <UIcon :name="customer.icon" class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ customer.name }}</p>
                <p class="text-xs text-gray-500">{{ customer.title }} · {{ customer.company }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Preview Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-tag" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">灵活定价</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            选择适合您的<span class="gradient-text">方案</span>
          </h2>
          <p class="text-gray-500 text-lg max-w-2xl mx-auto">
            从个人开发者到大型企业，我们提供灵活的定价方案满足不同需求
          </p>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            v-for="tier in pricingTiers"
            :key="tier.name"
            class="relative bg-white rounded-2xl border p-7 card-hover"
            :class="tier.popular ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-gray-100'"
          >
            <!-- Popular Badge -->
            <div v-if="tier.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white">
                最受欢迎
              </span>
            </div>

            <!-- Tier Name -->
            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ tier.name }}</h3>
            <p class="text-sm text-gray-500 mb-5">{{ tier.tokens }}</p>

            <!-- Price -->
            <div class="mb-6">
              <span class="text-4xl font-bold text-gray-900">{{ tier.price }}</span>
              <span v-if="tier.originalPrice" class="text-sm text-gray-400 line-through ml-2">{{ tier.originalPrice }}</span>
            </div>

            <!-- Features -->
            <ul class="space-y-3 mb-8">
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex items-center gap-2.5 text-sm text-gray-600"
              >
                <UIcon name="i-lucide-check" class="w-4 h-4 text-primary-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>

            <!-- CTA Button -->
            <UButton
              :label="tier.popular ? '立即购买' : '选择方案'"
              :color="tier.popular ? 'primary' : 'neutral'"
              :variant="tier.popular ? 'solid' : 'outline'"
              block
              size="lg"
              to="/portal/pricing"
            />
          </div>
        </div>

        <!-- Link to full pricing -->
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

    <!-- CTA Section -->
    <section class="py-20 bg-[#FAFAFA]">
      <div class="max-w-7xl mx-auto px-6">
        <div class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 p-12 md:p-16">
          <!-- Decorative elements -->
          <div class="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10" />
          <div class="absolute -left-4 -bottom-4 w-36 h-36 rounded-full bg-white/5" />
          <div class="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5" />

          <div class="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="max-w-lg">
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">立即开始使用</h2>
              <p class="text-white/80 text-lg leading-relaxed">
                注册即可获得1000万Token免费体验额度，探索全部安全AI能力。无需信用卡，即刻开启智能安全之旅。
              </p>
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <UButton
                label="免费注册"
                icon="i-lucide-rocket"
                color="white"
                size="xl"
                to="/portal/register"
              />
              <UButton
                label="联系销售"
                icon="i-lucide-phone"
                variant="outline"
                size="xl"
                class="text-white border-white/30 hover:bg-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
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
              <li><NuxtLink to="/" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">安全大模型</NuxtLink></li>
              <li><NuxtLink to="/" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">威胁检测</NuxtLink></li>
              <li><NuxtLink to="/" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">漏洞分析</NuxtLink></li>
              <li><NuxtLink to="/" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">代码安全</NuxtLink></li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">资源与支持</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="/portal/pricing" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">定价方案</NuxtLink></li>
              <li><span class="text-sm text-gray-500">API文档</span></li>
              <li><span class="text-sm text-gray-500">开发者指南</span></li>
              <li><span class="text-sm text-gray-500">帮助中心</span></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">关于我们</h4>
            <ul class="space-y-2.5">
              <li><span class="text-sm text-gray-500">公司介绍</span></li>
              <li><span class="text-sm text-gray-500">隐私政策</span></li>
              <li><span class="text-sm text-gray-500">服务条款</span></li>
              <li><span class="text-sm text-gray-500">联系我们</span></li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <span class="text-xs text-gray-400">&copy; 2026 奇安信科技集团股份有限公司. 保留所有权利.</span>
          <div class="flex items-center gap-6 text-xs text-gray-400">
            <span>京ICP备XXXXXXXX号</span>
            <span>京公网安备XXXXXXXXXXXXXX号</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes hero-dot-float {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.5);
  }
}

.hero-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-primary-400);
  animation: hero-dot-float 4s ease-in-out infinite;
}
</style>
