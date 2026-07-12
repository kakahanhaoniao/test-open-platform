<script setup lang="ts">
import { models, apps } from '~/data/mock'

useHead({
  title: '奇安信AI开放平台 - 安全AI能力 一站式获取',
  meta: [
    { name: 'description', content: '奇安信AI开放平台汇聚安全大模型、智能应用与专业工具，统一市场、按需选用，让安全能力触手可及。' }
  ]
})

// Hot capabilities for preview section (3-4 cards)
const hotCapabilities = computed(() => {
  const hotModels = models.filter(m => m.hot).map(m => ({ ...m, _type: 'model' as const }))
  const hotApps = apps.filter(a => a.hot).map(a => ({ ...a, _type: 'app' as const }))
  return [...hotModels, ...hotApps].slice(0, 4)
})

// Stats
const stats = [
  { value: '18+', label: 'AI安全能力', icon: 'i-lucide-cpu' },
  { value: '1亿+', label: '累计调用', icon: 'i-lucide-activity' },
  { value: '5000+', label: '企业客户', icon: 'i-lucide-building-2' },
  { value: '100万+', label: '安全事件处理', icon: 'i-lucide-shield-check' }
]

// Enterprise features
const enterpriseFeatures = [
  {
    icon: 'i-lucide-shopping-cart',
    title: '统一采购',
    description: '集中采购AI安全能力，统一结算与管理，简化企业采购流程'
  },
  {
    icon: 'i-lucide-users',
    title: '成员管理',
    description: '灵活的成员邀请与角色权限管理，支持管理员、开发者、财务等多种角色'
  },
  {
    icon: 'i-lucide-gauge',
    title: '用量管控',
    description: '实时监控成员API调用量与Token消耗，设置用量上限与告警阈值'
  },
  {
    icon: 'i-lucide-percent',
    title: '专属折扣',
    description: '企业客户享受专属批量折扣，充能包单价更低，性价比更高'
  }
]

// Customer testimonials
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

// Pricing tiers
const pricingTiers = [
  {
    name: '个人版',
    price: '¥99',
    tokens: '100万Token',
    unitPrice: '¥0.099/千Token',
    description: '适合个人开发者和小团队体验AI安全能力',
    features: ['基础模型调用', '标准响应速度', '社区技术支持', '每日1000次调用上限'],
    popular: false
  },
  {
    name: '团队版',
    price: '¥399',
    tokens: '500万Token',
    unitPrice: '¥0.080/千Token',
    originalPrice: '¥495',
    description: '适合中小团队日常安全运营使用',
    features: ['全模型调用', '优先响应速度', '工单技术支持', '每日10000次调用上限', '多API Key管理'],
    popular: true
  },
  {
    name: '企业版',
    price: '¥1,499',
    tokens: '2000万Token',
    unitPrice: '¥0.075/千Token',
    originalPrice: '¥1,980',
    description: '适合大型企业安全团队深度使用',
    features: ['全模型调用', '最高响应速度', '1对1专属技术支持', '无限调用次数', '专属模型实例', '99.9% SLA保障'],
    popular: false
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20">
      <!-- Grid / Circuit pattern background -->
      <div class="absolute inset-0 hero-grid pointer-events-none" />

      <!-- Decorative glows -->
      <div class="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-accent-100/15 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/10 rounded-full blur-3xl" />

      <div class="relative max-w-7xl mx-auto px-6 pt-28 pb-24">
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

    <!-- Capability Preview -->
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

        <!-- Capability Cards — 2x2 grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <CapabilityCard
            v-for="cap in hotCapabilities"
            :key="cap.id"
            :capability="cap"
            :capability-type="cap._type"
          />
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

    <!-- Enterprise Section — Dark premium treatment -->
    <section id="enterprise" class="relative py-20 md:py-28 bg-gray-900 overflow-hidden">
      <!-- Subtle grid pattern on dark bg -->
      <div class="absolute inset-0 enterprise-grid pointer-events-none" />

      <!-- Decorative glows -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-3xl" />

      <div class="relative max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-5">
            <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5 text-primary-400" />
            <span class="text-xs font-semibold text-primary-300">企业专属</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            企业专属<span class="text-primary-400">方案</span>
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg">
            为企业客户提供统一采购、成员管理、用量管控与专属折扣，让团队协作更高效
          </p>

          <!-- Trust indicator -->
          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <UIcon name="i-lucide-badge-check" class="w-4 h-4 text-primary-400" />
            <span class="text-sm font-medium text-gray-300">已服务5000+企业客户</span>
          </div>
        </div>

        <!-- Feature Cards — 2x2 on larger, stacked on mobile -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div
            v-for="feature in enterpriseFeatures"
            :key="feature.title"
            class="bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-8 hover:bg-white/[0.07] transition-colors duration-300"
          >
            <div class="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center mb-5">
              <UIcon :name="feature.icon" class="w-6 h-6 text-primary-400" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ feature.description }}</p>
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
    <section class="py-20 md:py-24 bg-white">
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

    <!-- Pricing Preview -->
    <section class="py-20 md:py-24 bg-gray-50/50">
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
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">
            从个人开发者到大型企业，我们提供灵活的定价方案满足不同需求
          </p>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            v-for="tier in pricingTiers"
            :key="tier.name"
            class="relative bg-white rounded-2xl border p-7 card-hover shadow-sm"
            :class="tier.popular ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-gray-100'"
          >
            <!-- Popular Badge -->
            <div v-if="tier.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white">
                最受欢迎
              </span>
            </div>

            <!-- Tier Name & Description -->
            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ tier.name }}</h3>
            <p class="text-sm text-gray-500 mb-5">{{ tier.description }}</p>

            <!-- Price -->
            <div class="mb-2">
              <span class="text-4xl font-bold text-gray-900">{{ tier.price }}</span>
              <span v-if="tier.originalPrice" class="text-sm text-gray-400 line-through ml-2">{{ tier.originalPrice }}</span>
            </div>
            <p class="text-sm text-gray-500 mb-1">{{ tier.tokens }}</p>
            <p class="text-xs text-primary-600 font-medium mb-6">{{ tier.unitPrice }}</p>

            <!-- Divider -->
            <div class="border-t border-gray-100 mb-6" />

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

            <!-- CTA Button — goes to marketplace for discovery -->
            <UButton
              :label="tier.popular ? '立即购买' : '选择方案'"
              :color="tier.popular ? 'primary' : 'neutral'"
              :variant="tier.popular ? 'solid' : 'outline'"
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

/* Enterprise section grid pattern */
.enterprise-grid {
  background-image:
    linear-gradient(rgba(124, 58, 237, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124, 58, 237, 0.06) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 100%);
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
