<script setup lang="ts">
import { monitorMetrics, models, members } from '~/data/mock'
import { useChartTheme } from '~/composables/useChartTheme'

useHead({ title: '调用监控 - 奇安信AI开放平台' })

const theme = useChartTheme()
const router = useRouter()

// Refresh rate selector
const refreshRate = ref<'5s' | '30s' | '1min'>('30s')
const refreshRates = [
  { value: '5s' as const, label: '5s' },
  { value: '30s' as const, label: '30s' },
  { value: '1min' as const, label: '1min' }
]

// Simulated refresh: update QPS and latency with small random variations
const liveQPS = ref(monitorMetrics.realtimeQPS)
const liveLatency = ref(monitorMetrics.avgLatency)
const lastUpdated = ref(new Date())

function getRefreshInterval() {
  if (refreshRate.value === '5s') return 5000
  if (refreshRate.value === '30s') return 30000
  return 60000
}

let refreshTimer: ReturnType<typeof setInterval> | null = null

function startRefresh() {
  stopRefresh()
  refreshTimer = setInterval(() => {
    liveQPS.value = Math.max(0, monitorMetrics.realtimeQPS + Math.floor((Math.random() - 0.5) * 40))
    liveLatency.value = Math.max(10, monitorMetrics.avgLatency + Math.floor((Math.random() - 0.5) * 20))
    lastUpdated.value = new Date()
  }, getRefreshInterval())
}

function stopRefresh() {
  if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null }
}

watch(refreshRate, () => startRefresh())
onMounted(() => startRefresh())
onUnmounted(() => stopRefresh)

// --- ECharts options ---

// 1. Stacked Area Chart - Real-time Call Flow
const realtimeChartOption = computed(() => {
  const times = monitorMetrics.realtimeSeries.map(d => d.time)
  const totalModelCalls = monitorMetrics.modelDistribution.reduce((s, m) => s + m.calls, 0)

  const series = monitorMetrics.modelDistribution.map((model) => {
    const data = monitorMetrics.realtimeSeries.map(point => {
      const proportion = model.calls / totalModelCalls
      return Math.round(point.calls * proportion)
    })
    return {
      name: model.name,
      type: 'line',
      stack: 'total',
      areaStyle: { opacity: 0.6 },
      emphasis: { focus: 'series' },
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1 },
      data
    }
  })

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#6B7280' } }
    },
    legend: {
      data: monitorMetrics.modelDistribution.map(m => m.name),
      bottom: 0,
      textStyle: { fontSize: 11, color: '#6B7280' },
      itemWidth: 12,
      itemHeight: 8
    },
    grid: { left: 50, right: 20, top: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLabel: { fontSize: 10, color: '#9CA3AF', interval: 9 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: '#9CA3AF' },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series
  }
})

// 2. Doughnut Chart - Model Distribution
const modelDistChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { fontSize: 12, color: '#6B7280' },
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 12
  },
  series: [{
    name: '模型调用分布',
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: {
      show: true,
      position: 'center',
      formatter: () => `{total|${monitorMetrics.todayCalls.toLocaleString()}}\n{label|总调用}`,
      rich: {
        total: { fontSize: 22, fontWeight: 'bold', color: '#111827', lineHeight: 30 },
        label: { fontSize: 12, color: '#9CA3AF', lineHeight: 20 }
      }
    },
    emphasis: {
      label: { show: true },
      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
    },
    data: monitorMetrics.modelDistribution.map(m => ({
      name: m.name,
      value: m.calls
    }))
  }]
}))

// 3. Horizontal Bar Chart - Member Ranking
const memberRankChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: { left: 80, right: 40, top: 10, bottom: 10 },
  xAxis: {
    type: 'value',
    axisLabel: { fontSize: 10, color: '#9CA3AF' },
    splitLine: { lineStyle: { color: '#F3F4F6' } },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'category',
    data: [...monitorMetrics.memberRanking].reverse().map(m => m.name),
    axisLabel: { fontSize: 12, color: '#374151' },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  series: [{
    name: '调用量',
    type: 'bar',
    data: [...monitorMetrics.memberRanking].reverse().map(m => m.calls),
    barWidth: 16,
    itemStyle: {
      borderRadius: [0, 4, 4, 0],
      color: (params: any) => {
        const idx = monitorMetrics.memberRanking.length - 1 - params.dataIndex
        if (idx === 0) return '#7C3AED'
        if (idx === 1) return '#A78BFA'
        if (idx === 2) return '#C4B5FD'
        return '#DDD6FE'
      }
    },
    label: {
      show: true,
      position: 'right',
      formatter: (params: any) => params.value.toLocaleString() + ' 次',
      fontSize: 10,
      color: '#6B7280'
    }
  }]
}))

// Drilldown handlers
function onRealtimeDrilldown(data: { chartType: string; field: string; value: any }) {
  if (data.field) {
    router.push(`/enterprise/logs?model=${encodeURIComponent(data.field)}&from=monitor`)
  }
}

function onModelDistDrilldown(data: { chartType: string; field: string; value: any }) {
  if (data.value) {
    router.push(`/enterprise/logs?model=${encodeURIComponent(data.value)}&from=monitor`)
  }
}

function onMemberRankDrilldown(data: { chartType: string; field: string; value: any }) {
  if (data.value) {
    router.push(`/enterprise/logs?member=${encodeURIComponent(data.value)}&from=monitor`)
  }
}

// Alerts data
const alerts = [
  { id: 1, severity: 'red' as const, icon: 'i-lucide-alert-circle', message: '合规卫士接口返回500错误', time: '5分钟前' },
  { id: 2, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '安全大模型触发频率限制(429)', time: '23分钟前' },
  { id: 3, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '威胁检测模型请求频率超限', time: '1小时前' },
  { id: 4, severity: 'green' as const, icon: 'i-lucide-check-circle', message: '代码安全扫描模型服务已恢复', time: '2小时前' },
  { id: 5, severity: 'green' as const, icon: 'i-lucide-check-circle', message: '漏洞分析专家服务已恢复', time: '3小时前' }
]

const alertCount = alerts.filter(a => a.severity === 'red').length

function getAlertStyle(severity: 'red' | 'amber' | 'green') {
  if (severity === 'red') return { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-l-4 border-l-red-500' }
  if (severity === 'amber') return { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-l-4 border-l-amber-500' }
  return { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-l-4 border-l-green-500' }
}

// Metric cards data
const metricCards = computed(() => [
  {
    label: '今日调用',
    value: '47,236',
    change: '+12%',
    changeType: 'up' as const,
    changeLabel: 'vs昨日',
    icon: 'i-lucide-activity',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    label: '实时QPS',
    value: `${liveQPS.value}/s`,
    change: '',
    changeType: 'neutral' as const,
    changeLabel: '当前峰值',
    icon: 'i-lucide-gauge',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    label: '错误率',
    value: '0.3%',
    change: '-0.1%',
    changeType: 'down-good' as const,
    changeLabel: '',
    icon: 'i-lucide-alert-triangle',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  {
    label: '平均延迟',
    value: `${liveLatency.value}ms`,
    change: '-5ms',
    changeType: 'down-good' as const,
    changeLabel: '',
    icon: 'i-lucide-clock',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600'
  }
])

// Format number with comma
function formatNumber(n: number): string {
  return n.toLocaleString()
}
</script>

<template>
  <div>
    <EnterpriseSidebar />
    <div class="ml-60 min-h-screen bg-[#FAFAFA]">
      <div class="p-8">
        <!-- Page Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-xl font-bold text-gray-900">调用监控</h1>
            <p class="text-sm text-gray-400 mt-1">全企业实时API调用监控与异常告警</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              实时监控中
            </span>
          </div>
        </div>

        <!-- 4 Real-time Metric Cards -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div
            v-for="card in metricCards"
            :key="card.label"
            class="bg-white rounded-xl border border-gray-100 p-5 card-hover"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="card.iconBg">
                <UIcon :name="card.icon" class="w-5 h-5" :class="card.iconColor" />
              </div>
              <span
                v-if="card.change"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="[
                  card.changeType === 'up' ? 'bg-green-50 text-green-600' : '',
                  card.changeType === 'down-good' ? 'bg-green-50 text-green-600' : ''
                ]"
              >
                <UIcon
                  v-if="card.changeType === 'up'"
                  name="i-lucide-trending-up"
                  class="w-3 h-3 mr-0.5"
                />
                <UIcon
                  v-if="card.changeType === 'down-good'"
                  name="i-lucide-trending-down"
                  class="w-3 h-3 mr-0.5"
                />
                {{ card.change }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mb-1">{{ card.label }}</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">{{ card.value }}</p>
            <p v-if="card.changeLabel" class="text-xs text-gray-400 mt-1">{{ card.changeLabel }}</p>
          </div>
        </div>

        <!-- Real-time Call Flow Chart -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <h3 class="font-semibold text-gray-900">实时调用流量</h3>
              <span class="inline-flex items-center gap-1.5 text-xs text-green-600">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-for="rate in refreshRates"
                :key="rate.value"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="refreshRate === rate.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'"
                @click="refreshRate = rate.value"
              >
                {{ rate.label }}
              </button>
            </div>
          </div>

          <ChartsBaseChart
            :option="realtimeChartOption"
            height="250px"
            @drilldown="onRealtimeDrilldown"
          />
        </div>

        <!-- Dual-column: Model Distribution + Member Ranking -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <!-- Model Distribution - Doughnut Chart -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-gray-900">模型调用分布</h3>
                <p class="text-xs text-gray-400 mt-0.5">今日各模型调用量占比</p>
              </div>
            </div>

            <ChartsBaseChart
              :option="modelDistChartOption"
              height="280px"
              @drilldown="onModelDistDrilldown"
            />
          </div>

          <!-- Member Ranking - Horizontal Bar Chart -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-gray-900">成员调用排行</h3>
                <p class="text-xs text-gray-400 mt-0.5">今日调用量Top 6</p>
              </div>
              <NuxtLink to="/enterprise/members" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                成员管理
                <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>

            <ChartsBaseChart
              :option="memberRankChartOption"
              height="280px"
              @drilldown="onMemberRankDrilldown"
            />
          </div>
        </div>

        <!-- Anomaly Alerts -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <h3 class="font-semibold text-gray-900">异常告警</h3>
              <span
                v-if="alertCount > 0"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600"
              >
                {{ alertCount }} 严重
              </span>
            </div>
            <NuxtLink to="/enterprise/logs" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              查看全部
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>

          <div class="space-y-3">
            <div
              v-for="alert in alerts"
              :key="alert.id"
              class="flex items-start gap-3 p-3 rounded-lg"
              :class="[getAlertStyle(alert.severity).bg, getAlertStyle(alert.severity).border]"
            >
              <UIcon :name="alert.icon" class="w-4 h-4 mt-0.5 shrink-0" :class="getAlertStyle(alert.severity).icon" />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">{{ alert.message }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ alert.time }}</p>
              </div>
              <NuxtLink
                to="/enterprise/logs"
                class="text-xs text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap mt-0.5"
              >
                查看详情
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
