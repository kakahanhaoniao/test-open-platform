<script setup lang="ts">
import { currentUser, members, organization, models, apps } from '~/data/mock'
import { useChartTheme } from '~/composables/useChartTheme'
import { useFavorites } from '~/composables/useFavorites'

useHead({ title: '使用看板 - 奇安信AI开放平台' })

const theme = useChartTheme()
const { favorites, isFavorite } = useFavorites()

// Favorited capabilities
const favoritedCapabilities = computed(() => {
  const allItems = [
    ...models.map(m => ({ ...m, _type: 'model' as const })),
    ...apps.map(a => ({ ...a, _type: 'app' as const }))
  ]
  return allItems.filter(item => isFavorite(item.id))
})

// Personal data (current user only)
const personalMember = members.find(m => m.id === 'm1')!
const personalCalls = 12800
const personalTokens = personalMember.monthlyTokens
const personalCost = personalMember.monthlyCost

const trendRange = ref('7d')

const trendRanges = [
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' },
  { value: '90d', label: '90天' }
]

// Personal call trend data (7 days)
const callTrendData = [
  { date: '07/05', calls: 1680 },
  { date: '07/06', calls: 1520 },
  { date: '07/07', calls: 2100 },
  { date: '07/08', calls: 2340 },
  { date: '07/09', calls: 1980 },
  { date: '07/10', calls: 2560 },
  { date: '07/11', calls: 620 }
]

// --- ECharts option ---

// Area Line Chart - 7-day Call Trend
const callTrendChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const p = params[0]
      return `${p.axisValue}<br/>${p.marker} 调用量: ${p.value.toLocaleString()} 次`
    }
  },
  grid: { left: 50, right: 20, top: 20, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: callTrendData.map(d => d.date),
    axisLabel: { fontSize: 11, color: '#9CA3AF' },
    axisLine: { lineStyle: { color: '#E5E7EB' } },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 10,
      color: '#9CA3AF',
      formatter: (val: number) => val >= 10000 ? (val / 10000).toFixed(1) + '万' : String(val)
    },
    splitLine: { lineStyle: { color: '#F3F4F6' } },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  series: [{
    name: '调用量',
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { width: 2, color: '#7C3AED' },
    itemStyle: { color: '#7C3AED' },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(124, 58, 237, 0.25)' },
          { offset: 1, color: 'rgba(124, 58, 237, 0.02)' }
        ]
      }
    },
    data: callTrendData.map(d => d.calls)
  }]
}))

// Model consumption ranking (personal top 5)
const modelRanking = [
  { name: '奇安信安全大模型', modelId: 'qax-security-llm', percentage: 45, tokens: '234万' },
  { name: '代码安全扫描模型', modelId: 'code-security-scan', percentage: 25, tokens: '130万' },
  { name: '威胁检测模型 V3', modelId: 'threat-detect-v3', percentage: 15, tokens: '78万' },
  { name: '应急响应模型', modelId: 'incident-response', percentage: 10, tokens: '52万' },
  { name: '其他模型', modelId: '', percentage: 5, tokens: '26万' }
]

// Alerts
const alerts = [
  { id: 1, severity: 'red' as const, icon: 'i-lucide-alert-circle', message: '合规卫士接口返回500错误', time: '5分钟前' },
  { id: 2, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '安全大模型触发频率限制(429)', time: '23分钟前' },
  { id: 3, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '威胁检测模型请求频率超限', time: '1小时前' },
  { id: 4, severity: 'green' as const, icon: 'i-lucide-check-circle', message: '代码安全扫描模型服务已恢复', time: '2小时前' },
  { id: 5, severity: 'green' as const, icon: 'i-lucide-check-circle', message: '漏洞分析专家服务已恢复', time: '3小时前' }
]

// Quota data (personal share)
const packBalance = 370 // 万 (personal share of org pack)
const packTotal = 1000 // 万
const packPercent = Math.round((packBalance / packTotal) * 100)
const apiUsed = 2400
const apiTotal = 5000
const apiPercent = Math.round((apiUsed / apiTotal) * 100)

function getPackBarColor(percent: number) {
  if (percent > 95) return 'bg-red-500'
  if (percent > 80) return 'bg-amber-500'
  return 'bg-primary-500'
}

function getAlertColor(severity: 'red' | 'amber' | 'green') {
  if (severity === 'red') return { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100' }
  if (severity === 'amber') return { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' }
  return { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-100' }
}

// Quick actions
const quickActions = [
  { label: '创建API Key', desc: '生成新的API访问密钥', icon: 'i-lucide-key', to: '/console/keys/create', color: 'bg-primary-50 text-primary-600' },
  { label: '购买充能包', desc: '补充Token调用额度', icon: 'i-lucide-coins', to: '/console/packs', color: 'bg-amber-50 text-amber-600' },
  { label: 'API文档', desc: '查看接口调用指南', icon: 'i-lucide-book-open', to: '/console/docs', color: 'bg-blue-50 text-blue-600' },
  { label: '调用统计', desc: '查看详细调用数据', icon: 'i-lucide-bar-chart-3', to: '/console/stats', color: 'bg-green-50 text-green-600' }
]
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 min-h-screen bg-[#FAFAFA]">
      <div class="p-8">
        <!-- Welcome Bar -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-gray-900">欢迎回来，{{ currentUser.name }}</h1>
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                  服务正常
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- My Favorites Section -->
        <div v-if="favoritedCapabilities.length > 0" class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-heart" class="w-5 h-5 text-red-500 fill-red-500" />
              <h3 class="font-semibold text-gray-900">我的收藏</h3>
              <span class="text-xs text-gray-400">{{ favoritedCapabilities.length }} 个能力</span>
            </div>
            <NuxtLink to="/marketplace" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              浏览更多
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
          <div class="grid grid-cols-4 gap-3">
            <NuxtLink
              v-for="cap in favoritedCapabilities"
              :key="cap.id"
              :to="`/marketplace/${cap.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
            >
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                :class="cap._type === 'model' ? 'bg-primary-50' : 'bg-accent-50'"
              >
                <UIcon
                  :name="cap.icon"
                  class="w-4.5 h-4.5"
                  :class="cap._type === 'model' ? 'text-primary-600' : 'text-accent-600'"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 group-hover:text-primary-700 truncate">{{ cap.name }}</p>
                <p class="text-[11px] text-gray-400">{{ cap._type === 'model' ? '模型' : '应用' }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- 4 Stat Cards -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <!-- API调用总量 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <UIcon name="i-lucide-activity" class="w-5 h-5 text-primary-600" />
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                <UIcon name="i-lucide-trending-up" class="w-3 h-3 mr-0.5" />
                +12.5%
              </span>
            </div>
            <p class="text-xs text-gray-400 mb-1">本月调用</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">1.28<span class="text-base font-normal text-gray-400">万</span></p>
          </div>

          <!-- Token消耗 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <UIcon name="i-lucide-zap" class="w-5 h-5 text-blue-600" />
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                <UIcon name="i-lucide-trending-up" class="w-3 h-3 mr-0.5" />
                +8.3%
              </span>
            </div>
            <p class="text-xs text-gray-400 mb-1">Token消耗</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">520<span class="text-base font-normal text-gray-400">万</span></p>
          </div>

          <!-- 本月费用 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <UIcon name="i-lucide-receipt" class="w-5 h-5 text-amber-600" />
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                <UIcon name="i-lucide-trending-up" class="w-3 h-3 mr-0.5" />
                +15.2%
              </span>
            </div>
            <p class="text-xs text-gray-400 mb-1">本月费用</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">¥4,780</p>
          </div>

          <!-- 充能包余额 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <UIcon name="i-lucide-coins" class="w-5 h-5 text-green-600" />
              </div>
              <span class="text-xs font-mono text-gray-400">37%</span>
            </div>
            <p class="text-xs text-gray-400 mb-1">充能包余额</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">370<span class="text-base font-normal text-gray-400">万</span></p>
            <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 rounded-full" style="width: 37%" />
            </div>
          </div>
        </div>

        <!-- Call Trend Chart -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">调用趋势</h3>
              <p class="text-xs text-gray-400 mt-0.5">API每日调用量统计</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-for="range in trendRanges"
                :key="range.value"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="trendRange === range.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'"
                @click="trendRange = range.value"
              >
                {{ range.label }}
              </button>
            </div>
          </div>
          <ChartsBaseChart :option="callTrendChartOption" height="220px" />
        </div>

        <!-- Two-column: Model Ranking + Alerts -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <!-- Model Consumption Ranking -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-gray-900">模型消耗排行</h3>
                <p class="text-xs text-gray-400 mt-0.5">Token消耗Top 5</p>
              </div>
              <NuxtLink to="/console/stats" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                查看详情
                <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
            <div class="space-y-4">
              <div v-for="(item, idx) in modelRanking" :key="idx">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                      :class="idx < 3 ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'"
                    >{{ idx + 1 }}</span>
                    <span class="text-sm text-gray-900 font-medium">
                      <NuxtLink v-if="item.modelId" :to="`/marketplace/${item.modelId}`" class="text-primary-600 hover:text-primary-700">{{ item.name }}</NuxtLink>
                      <span v-else>{{ item.name }}</span>
                    </span>
                  </div>
                  <span class="text-xs font-mono text-gray-500">{{ item.tokens }} Token</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-primary-400' : 'bg-primary-300'"
                    :style="{ width: item.percentage + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-gray-900">异常告警</h3>
                <p class="text-xs text-gray-400 mt-0.5">最近服务异常与恢复通知</p>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                {{ alerts.filter(a => a.severity === 'red').length }} 严重
              </span>
            </div>
            <div class="space-y-3">
              <div
                v-for="alert in alerts"
                :key="alert.id"
                class="flex items-start gap-3 p-3 rounded-lg border"
                :class="getAlertColor(alert.severity).border"
                :style="{ backgroundColor: getAlertColor(alert.severity).bg }"
              >
                <UIcon :name="alert.icon" class="w-4 h-4 mt-0.5 shrink-0" :class="getAlertColor(alert.severity).icon" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{{ alert.message }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ alert.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quota Progress Section -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-5">额度使用</h3>
          <div class="space-y-6">
            <!-- 充能包 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-coins" class="w-4 h-4 text-primary-500" />
                  <span class="text-sm font-medium text-gray-900">充能包</span>
                </div>
                <span class="text-xs text-gray-500 font-mono">370万 / 1,000万 Token</span>
              </div>
              <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getPackBarColor(packPercent)"
                  :style="{ width: packPercent + '%' }"
                />
              </div>
              <div class="flex items-center justify-between mt-1.5">
                <span class="text-xs text-gray-400">已使用 {{ packTotal - packBalance }}万 Token</span>
                <span
                  class="text-xs font-medium"
                  :class="packPercent > 80 ? 'text-amber-600' : 'text-gray-400'"
                >{{ packPercent }}%</span>
              </div>
            </div>

            <!-- API频率 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-gauge" class="w-4 h-4 text-blue-500" />
                  <span class="text-sm font-medium text-gray-900">API频率</span>
                </div>
                <span class="text-xs text-gray-500 font-mono">2,400 / 5,000 次/分</span>
              </div>
              <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getPackBarColor(apiPercent)"
                  :style="{ width: apiPercent + '%' }"
                />
              </div>
              <div class="flex items-center justify-between mt-1.5">
                <span class="text-xs text-gray-400">当前频率限制</span>
                <span class="text-xs text-gray-400">{{ apiPercent }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-4 gap-4">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="bg-white rounded-xl border border-gray-100 p-5 card-hover group"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="action.color">
                <UIcon :name="action.icon" class="w-5 h-5" />
              </div>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">{{ action.label }}</p>
            <p class="text-xs text-gray-400">{{ action.desc }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
