<script setup lang="ts">
useHead({
  title: '定价方案 - 奇安信AI开放平台',
  meta: [
    { name: 'description', content: '奇安信AI开放平台提供灵活的定价方案，从个人开发者到大型企业，满足不同需求。' }
  ]
})

const pricingTiers = [
  {
    name: '体验包',
    price: '¥99',
    period: '',
    tokens: '100万Token',
    unitPrice: '¥0.099/千Token',
    description: '适合个人开发者和小团队体验AI安全能力',
    features: [
      '基础模型调用（安全大模型、日志分析等）',
      '标准响应速度',
      '社区技术支持',
      '每日1000次调用上限',
      '基础API统计'
    ],
    popular: false
  },
  {
    name: '专业包',
    price: '¥399',
    period: '',
    tokens: '500万Token',
    unitPrice: '¥0.080/千Token',
    originalPrice: '¥495',
    description: '适合中小团队日常安全运营使用',
    features: [
      '全模型调用（含威胁检测、漏洞分析等）',
      '优先响应速度',
      '工单技术支持',
      '每日10000次调用上限',
      '高级API统计与报表',
      '自定义Webhook通知',
      '多API Key管理'
    ],
    popular: true
  },
  {
    name: '企业包',
    price: '¥1,499',
    period: '',
    tokens: '2000万Token',
    unitPrice: '¥0.075/千Token',
    originalPrice: '¥1,980',
    description: '适合大型企业安全团队深度使用',
    features: [
      '全模型调用（含所有专业模型）',
      '最高响应速度',
      '1对1专属技术支持',
      '无限调用次数',
      '高级API统计与报表',
      '专属模型实例',
      '99.9% SLA保障',
      '私有化部署选项',
      '合规审计报告'
    ],
    popular: false
  }
]

const modelPricing = [
  { name: '安全大模型', type: '安全大模型', input: '¥0.06', output: '¥0.12', unit: '/千Token' },
  { name: '威胁检测模型 V3', type: '威胁检测', input: '¥0.03', output: '¥0.06', unit: '/千Token' },
  { name: '漏洞分析专家', type: '漏洞分析', input: '¥0.02', output: '¥0.04', unit: '/千Token' },
  { name: '代码安全扫描模型', type: '代码安全', input: '¥0.03', output: '¥0.06', unit: '/千Token' },
  { name: '合规卫士', type: '合规检查', input: '¥0.02', output: '¥0.04', unit: '/千Token' },
  { name: '数据安全卫士', type: '数据安全', input: '¥0.02', output: '¥0.04', unit: '/千Token' },
  { name: '恶意软件分析模型', type: '恶意软件', input: '¥0.03', output: '¥0.06', unit: '/千Token' },
  { name: '应急响应模型', type: '应急响应', input: '¥0.04', output: '¥0.08', unit: '/千Token' },
  { name: '钓鱼识别模型', type: '钓鱼检测', input: '¥0.01', output: '¥0.02', unit: '/千Token' },
  { name: '日志智能分析模型', type: '日志分析', input: '¥0.02', output: '¥0.03', unit: '/千Token' }
]

const faqs = [
  {
    question: 'Token如何计费？',
    answer: 'Token是模型调用的计费单位，约等于1个中文字符或0.75个英文单词。输入Token和输出Token分别计费，具体价格请参考模型定价表。每次API调用的费用 = 输入Token数 x 输入单价 + 输出Token数 x 输出单价。'
  },
  {
    question: '购买套餐后Token有效期多久？',
    answer: '体验包和专业包的Token有效期为6个月，企业包的Token有效期为12个月。有效期内未使用的Token将自动失效，建议根据实际使用量选择合适的套餐。'
  },
  {
    question: '可以同时使用多个模型吗？',
    answer: '体验包仅支持基础模型调用（安全大模型、日志分析等），专业包和企业包支持全模型调用。您可以在套餐范围内自由调用所有可用模型，不同模型的Token消耗分别计算。'
  },
  {
    question: '超出套餐额度如何收费？',
    answer: '超出套餐额度后，系统将按量计费，价格与套餐内单价相同。您也可以随时升级套餐或购买额外的Token包。专业包和企业包用户可设置自动充值，避免服务中断。'
  },
  {
    question: '企业版支持私有化部署吗？',
    answer: '企业包用户可选择私有化部署方案，将模型部署在客户自有的服务器或私有云环境中。私有化部署需额外付费，具体价格请联系销售团队获取定制方案。'
  },
  {
    question: '如何申请退款？',
    answer: '套餐购买后7天内且Token使用量不超过10%的情况下，可申请全额退款。超过7天或Token使用量超过10%的，按剩余Token比例退款。详情请参阅服务条款或联系客服。'
  }
]

const expandedFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  expandedFaq.value = expandedFaq.value === index ? null : index
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <PortalNav />

    <!-- Page Header -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <UIcon name="i-lucide-tag" class="w-3.5 h-3.5 text-primary-600" />
            <span class="text-xs font-semibold text-primary-700">灵活定价</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            选择适合您的<span class="gradient-text">方案</span>
          </h1>
          <p class="text-gray-500 text-lg max-w-2xl mx-auto">
            从个人开发者到大型企业，我们提供灵活的定价方案满足不同需求。所有方案均含1000万Token免费体验额度。
          </p>
        </div>
      </div>
    </section>

    <!-- Pricing Tiers -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            v-for="tier in pricingTiers"
            :key="tier.name"
            class="relative bg-white rounded-2xl border p-8 card-hover"
            :class="tier.popular ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-gray-100'"
          >
            <!-- Popular Badge -->
            <div v-if="tier.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white">
                最受欢迎
              </span>
            </div>

            <!-- Tier Name & Description -->
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ tier.name }}</h3>
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
                class="flex items-start gap-2.5 text-sm text-gray-600"
              >
                <UIcon name="i-lucide-check" class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
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
              to="/portal/register"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Model Pricing Table -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            模型<span class="gradient-text">按量计费</span>价格
          </h2>
          <p class="text-gray-500">所有模型均支持按Token用量灵活计费，用多少付多少</p>
        </div>

        <div class="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-gray-100">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">模型名称</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">类型</th>
                <th class="text-right px-6 py-4 text-sm font-semibold text-gray-900">输入价格</th>
                <th class="text-right px-6 py-4 text-sm font-semibold text-gray-900">输出价格</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(model, index) in modelPricing"
                :key="model.name"
                class="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ model.name }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
                    {{ model.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ model.input }}{{ model.unit }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ model.output }}{{ model.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-center text-xs text-gray-400 mt-4">
          * 以上价格为标准按量计费价格，购买套餐可享受更优惠的Token单价
        </p>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            常见<span class="gradient-text">问题</span>
          </h2>
          <p class="text-gray-500">关于定价和计费的常见问题解答</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <button
              class="w-full flex items-center justify-between px-6 py-5 text-left"
              @click="toggleFaq(index)"
            >
              <span class="text-sm font-semibold text-gray-900 pr-4">{{ faq.question }}</span>
              <UIcon
                :name="expandedFaq === index ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="w-5 h-5 text-gray-400 shrink-0 transition-transform"
              />
            </button>
            <div
              v-if="expandedFaq === index"
              class="px-6 pb-5"
            >
              <p class="text-sm text-gray-500 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 p-12">
          <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div class="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-white/5" />

          <div class="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">准备好开始了吗？</h2>
              <p class="text-white/80 text-sm max-w-md">注册即可获得1000万Token免费体验额度，探索全部安全AI能力。</p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
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
    <footer class="bg-white border-t border-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-md bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
              <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5 text-white" />
            </div>
            <span class="text-xs text-gray-400">奇安信AI开放平台 &copy; 2026</span>
          </div>
          <div class="flex items-center gap-6 text-xs text-gray-400">
            <span>隐私政策</span>
            <span>服务条款</span>
            <span>帮助中心</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
