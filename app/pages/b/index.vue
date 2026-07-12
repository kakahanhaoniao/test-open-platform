<script setup lang="ts">
import { models, apps, activities } from '~/data/mock'

useHead({
  title: '奇安信AI开放平台 - 统一能力市场',
  meta: [
    { name: 'description', content: '奇安信AI开放平台，安全能力一站式市场' }
  ]
})

// Featured capabilities - mix of hot models and apps
const featuredCapabilities = computed(() => {
  const hotModels = models.filter(m => m.hot).map(m => ({ ...m, _type: 'model' as const }))
  const hotApps = apps.filter(a => a.hot).map(a => ({ ...a, _type: 'app' as const }))
  return [...hotModels, ...hotApps].slice(0, 6)
})

// New arrivals
const newArrivals = computed(() => {
  const newModels = models.filter(m => m.new).map(m => ({ ...m, _type: 'model' as const }))
  const newApps = apps.filter(a => a.new).map(a => ({ ...a, _type: 'app' as const }))
  return [...newModels, ...newApps]
})

// Stats
const stats = [
  { label: 'AI安全能力', value: '18+', icon: 'i-lucide-cpu' },
  { label: '累计调用', value: '1亿+', icon: 'i-lucide-activity' },
  { label: '企业客户', value: '5000+', icon: 'i-lucide-building-2' },
  { label: '安全事件处理', value: '100万+', icon: 'i-lucide-shield-check' }
]
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <BTopNav />

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20">
      <!-- Decorative elements -->
      <div class="absolute top-20 right-20 w-72 h-72 bg-primary-100/30 rounded-full blur-3xl" />
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl" />

      <div class="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div class="grid grid-cols-2 gap-12 items-center">
          <!-- Left: Text -->
          <div class="space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-500 badge-pulse" />
              <span class="text-xs font-semibold text-primary-700">AI安全能力统一市场</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              安全AI能力
              <br />
              <span class="gradient-text">一站式获取</span>
            </h1>
            <p class="text-lg text-gray-500 leading-relaxed max-w-lg">
              奇安信AI开放平台汇聚安全大模型、智能应用与专业工具，统一市场、按需选用，让安全能力触手可及。
            </p>
            <div class="flex items-center gap-3">
              <UButton
                label="探索能力市场"
                icon="i-lucide-compass"
                color="primary"
                size="xl"
                to="/b/marketplace"
              />
              <UButton
                label="查看优惠活动"
                icon="i-lucide-gift"
                variant="outline"
                color="primary"
                size="xl"
                to="/b/promotions"
              />
            </div>
          </div>

          <!-- Right: Floating capability cards -->
          <div class="relative h-[360px]">
            <!-- Card 1 -->
            <div class="absolute top-0 right-8 w-64 bg-white rounded-2xl border border-gray-100 p-4 shadow-lg shadow-primary-500/5 card-hover rotate-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <UIcon name="i-lucide-brain" class="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">奇安信安全大模型</p>
                  <p class="text-[10px] text-gray-400">100B 参数</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-primary-50 text-primary-600">模型</span>
                <span class="text-[10px] text-amber-500 flex items-center gap-0.5">
                  <UIcon name="i-lucide-star" class="w-2.5 h-2.5 fill-amber-400" /> 4.9
                </span>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="absolute top-24 left-4 w-60 bg-white rounded-2xl border border-gray-100 p-4 shadow-lg shadow-accent-500/5 card-hover -rotate-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center">
                  <UIcon name="i-lucide-monitor-dot" class="w-4.5 h-4.5 text-accent-600" />
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">智能安全运营中心</p>
                  <p class="text-[10px] text-gray-400">对话应用</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-accent-50 text-accent-600">应用</span>
                <span class="text-[10px] text-amber-500 flex items-center gap-0.5">
                  <UIcon name="i-lucide-star" class="w-2.5 h-2.5 fill-amber-400" /> 4.9
                </span>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="absolute bottom-8 right-16 w-56 bg-white rounded-2xl border border-gray-100 p-4 shadow-lg shadow-primary-500/5 card-hover rotate-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <UIcon name="i-lucide-shield-alert" class="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">威胁检测模型 V3</p>
                  <p class="text-[10px] text-gray-400">7B 参数</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-primary-50 text-primary-600">模型</span>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white">HOT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="bg-white border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="grid grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <UIcon :name="stat.icon" class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-xl font-bold text-gray-900">{{ stat.value }}</p>
              <p class="text-xs text-gray-500">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Promotions Strip -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-lg font-bold text-gray-900">限时优惠</h2>
          <p class="text-sm text-gray-500">精选优惠活动，不容错过</p>
        </div>
        <UButton
          label="查看全部"
          icon="i-lucide-arrow-right"
          variant="ghost"
          color="primary"
          size="sm"
          trailing
          to="/b/promotions"
        />
      </div>
      <BPromotionStrip :promotions="activities" />
    </section>

    <!-- Featured Capabilities -->
    <section class="max-w-7xl mx-auto px-6 pb-10">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-lg font-bold text-gray-900">热门能力</h2>
          <p class="text-sm text-gray-500">最受欢迎的安全AI能力</p>
        </div>
        <UButton
          label="浏览市场"
          icon="i-lucide-arrow-right"
          variant="ghost"
          color="primary"
          size="sm"
          trailing
          to="/b/marketplace"
        />
      </div>
      <div class="grid grid-cols-3 gap-5">
        <BCapabilityCard
          v-for="cap in featuredCapabilities"
          :key="cap.id"
          :capability="cap"
          :capability-type="cap._type"
          :featured="true"
        />
      </div>
    </section>

    <!-- New Arrivals -->
    <section v-if="newArrivals.length" class="max-w-7xl mx-auto px-6 pb-10">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-lg font-bold text-gray-900">最新上线</h2>
          <p class="text-sm text-gray-500">刚刚上线的安全AI能力</p>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <BCapabilityCard
          v-for="cap in newArrivals"
          :key="cap.id"
          :capability="cap"
          :capability-type="cap._type"
        />
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-7xl mx-auto px-6 pb-16">
      <div class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 p-10">
        <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div class="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-white/5" />
        <div class="relative flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">开始使用安全AI能力</h2>
            <p class="text-white/80 text-sm max-w-md">注册即可获得1000万Token免费体验额度，探索全部安全AI能力。</p>
          </div>
          <div class="flex items-center gap-3">
            <UButton
              label="免费注册"
              icon="i-lucide-rocket"
              color="neutral"
              size="xl"
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
