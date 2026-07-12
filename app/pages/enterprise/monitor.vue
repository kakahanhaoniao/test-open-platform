<script setup lang="ts">
import { monitorMetrics, models, members } from '~/data/mock'

useHead({ title: '调用监控 - 奇安信AI开放平台' })

// Refresh rate selector
const refreshRate = ref<'5s' | '30s' | '1min'>('30s')
const refreshRates = [
  { value: '5s' as const, label: '5s' },
  { value: '30s' as const, label: '30s' },
  { value: '1min' as const, label: '1min' }
]

// Tooltip state for area chart
const tooltipState = ref<{ show: boolean; x: number; y: number; time: string; calls: number; errors: number }>({
  show: false, x: 0, y: 0, time: '', calls: 0, errors: 0
})

// Process realtime series data for stacked area chart
const seriesData = computed(() => monitorMetrics.realtimeSeries)
const maxCalls = computed(() => Math.max(...seriesData.value.map(d => d.calls)))

// Model colors for the stacked area chart segments
const modelColors = monitorMetrics.modelDistribution.map(m => m.color)
const modelNames = monitorMetrics.modelDistribution.map(m => m.name)

// For each time point, distribute calls across models proportionally
const stackedData = computed(() => {
  const totalModelCalls = monitorMetrics.modelDistribution.reduce((s, m) => s + m.calls, 0)
  return seriesData.value.map(point => {
    const segments: { color: string; name: string; height: number; value: number }[] = []
    let remaining = point.calls
    monitorMetrics.modelDistribution.forEach((model, idx) => {
      const proportion = model.calls / totalModelCalls
      const value = idx === monitorMetrics.modelDistribution.length - 1
        ? remaining
        : Math.round(point.calls * proportion)
      remaining -= value
      segments.push({
        color: model.color,
        name: model.name,
        height: (value / maxCalls.value) * 100,
        value
      })
    })
    return { ...point, segments }
  })
})

// Donut chart data
const donutData = computed(() => {
  const total = monitorMetrics.modelDistribution.reduce((s, m) => s + m.calls, 0)
  let cumulativePercent = 0
  return monitorMetrics.modelDistribution.map(m => {
    const percent = (m.calls / total) * 100
    const start = cumulativePercent
    cumulativePercent += percent
    return { ...m, percent, startPercent: start }
  })
})
const donutGradient = computed(() => {
  return donutData.value
    .map(d => `${d.color} ${d.startPercent}% ${d.startPercent + d.percent}%`)
    .join(', ')
})

// Member ranking for bar chart (top 6)
const memberBarData = computed(() => {
  const maxCalls = Math.max(...monitorMetrics.memberRanking.map(m => m.calls))
  return monitorMetrics.memberRanking.map(m => ({
    ...m,
    widthPercent: (m.calls / maxCalls) * 100
  }))
})

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
const metricCards = [
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
    value: '347/s',
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
    value: '128ms',
    change: '-5ms',
    changeType: 'down-good' as const,
    changeLabel: '',
    icon: 'i-lucide-clock',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600'
  }
]

// Chart hover handler
function onChartHover(event: MouseEvent, pointIndex: number) {
  const point = seriesData.value[pointIndex]
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  tooltipState.value = {
    show: true,
    x,
    y,
    time: point.time,
    calls: point.calls,
    errors: point.errors
  }
}

function onChartLeave() {
  tooltipState.value.show = false
}

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

          <!-- Stacked Area Chart -->
          <div
            class="relative h-48"
            @mouseleave="onChartLeave"
          >
            <!-- Y-axis labels -->
            <div class="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-right">
              <span class="text-[10px] text-gray-400 font-mono">{{ maxCalls }}</span>
              <span class="text-[10px] text-gray-400 font-mono">{{ Math.round(maxCalls / 2) }}</span>
              <span class="text-[10px] text-gray-400 font-mono">0</span>
            </div>

            <!-- Chart area -->
            <div class="ml-12 h-full relative">
              <!-- Grid lines -->
              <div class="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
                <div class="border-b border-gray-50" />
                <div class="border-b border-gray-50" />
                <div class="border-b border-gray-100" />
              </div>

              <!-- Stacked columns (area chart effect) -->
              <div class="flex items-end h-[calc(100%-24px)]">
                <div
                  v-for="(point, idx) in stackedData"
                  :key="idx"
                  class="flex-1 flex flex-col justify-end h-full relative group cursor-crosshair"
                  @mouseenter="onChartHover($event, idx)"
                >
                  <!-- Stacked segments from bottom to top -->
                  <div
                    v-for="(seg, segIdx) in [...point.segments].reverse()"
                    :key="segIdx"
                    class="w-full"
                    :style="{ height: seg.height + '%', backgroundColor: seg.color, opacity: 0.8 }"
                  />
                  <!-- Hover highlight line -->
                  <div class="absolute inset-0 border-l border-r border-primary-400/30 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                </div>
              </div>

              <!-- X-axis labels -->
              <div class="flex mt-1 h-5">
                <div
                  v-for="(point, idx) in stackedData"
                  :key="idx"
                  class="flex-1 text-center"
                >
                  <span
                    v-if="idx % 10 === 0"
                    class="text-[10px] text-gray-400 font-mono"
                  >{{ point.time }}</span>
                </div>
              </div>
            </div>

            <!-- Tooltip -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div
                v-if="tooltipState.show"
                class="absolute z-50 bg-gray-900 text-white rounded-lg px-3 py-2 text-xs pointer-events-none shadow-lg"
                :style="{
                  left: (tooltipState.x + 12) + 'px',
                  top: (tooltipState.y - 40) + 'px'
                }"
              >
                <p class="font-mono text-white font-medium mb-1">{{ tooltipState.time }}</p>
                <p class="text-gray-300">调用: <span class="text-white font-mono font-medium">{{ formatNumber(tooltipState.calls) }}</span></p>
                <p class="text-gray-300">错误: <span class="text-red-400 font-mono font-medium">{{ tooltipState.errors }}</span></p>
              </div>
            </Transition>
          </div>

          <!-- Chart legend -->
          <div class="flex items-center gap-5 mt-4 pt-4 border-t border-gray-50">
            <div
              v-for="model in monitorMetrics.modelDistribution"
              :key="model.name"
              class="flex items-center gap-1.5"
            >
              <span class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: model.color }" />
              <span class="text-xs text-gray-500">{{ model.name }}</span>
            </div>
          </div>
        </div>

        <!-- Dual-column: Model Distribution + Member Ranking -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <!-- Model Distribution - Donut Chart -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-gray-900">模型调用分布</h3>
                <p class="text-xs text-gray-400 mt-0.5">今日各模型调用量占比</p>
              </div>
            </div>

            <!-- Donut Chart -->
            <div class="flex items-center justify-center mb-5">
              <div class="relative w-44 h-44">
                <div
                  class="w-full h-full rounded-full"
                  :style="{ background: `conic-gradient(${donutGradient})` }"
                />
                <!-- White center circle -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                    <p class="text-2xl font-bold text-gray-900 font-mono">{{ formatNumber(monitorMetrics.todayCalls) }}</p>
                    <p class="text-xs text-gray-400">总调用</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="space-y-2.5">
              <div
                v-for="model in monitorMetrics.modelDistribution"
                :key="model.name"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: model.color }" />
                  <span class="text-sm text-gray-700">{{ model.name }}</span>
                </div>
                <span class="text-sm font-mono text-gray-500">{{ formatNumber(model.calls) }}</span>
              </div>
            </div>
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

            <div class="space-y-4">
              <div v-for="(member, idx) in memberBarData" :key="member.name">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                      :class="idx < 3 ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'"
                    >{{ idx + 1 }}</span>
                    <span class="text-sm text-gray-900 font-medium">{{ member.name }}</span>
                  </div>
                  <span class="text-xs font-mono text-gray-500">{{ formatNumber(member.calls) }} 次</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-primary-400' : idx === 2 ? 'bg-primary-300' : 'bg-primary-200'"
                    :style="{ width: member.widthPercent + '%' }"
                  />
                </div>
              </div>
            </div>
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
