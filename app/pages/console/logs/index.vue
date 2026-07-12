<script setup lang="ts">
import { callLogs, currentUser } from '~/data/mock'
import { useChartTheme } from '~/composables/useChartTheme'

useHead({ title: '调用日志 - 奇安信AI开放平台' })

const theme = useChartTheme()
const route = useRoute()

// --- State ---
const searchQuery = ref('')
const timeRange = ref('today')
const modelFilter = ref('all')
const statusFilter = ref('all')
const aggregation = ref<'hour' | 'day'>('hour')
const currentPage = ref(1)
const pageSize = 20
const expandedRow = ref<string | null>(null)
const fromStats = ref(false)

// Handle query params from drilldown (e.g., ?model=xxx&from=stats)
onMounted(() => {
  if (route.query.model && typeof route.query.model === 'string') {
    modelFilter.value = route.query.model
  }
  if (route.query.from === 'stats') {
    fromStats.value = true
  }
  document.addEventListener('click', onDocumentClick)
})

// --- Time range options ---
const timeRanges = [
  { value: 'today', label: '今天' },
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' }
]

// --- Model options (derived from personal logs) ---
const personalLogs = computed(() =>
  callLogs.filter(log => log.memberName === currentUser.name)
)

const modelOptions = computed(() => {
  const names = [...new Set(personalLogs.value.map(log => log.modelName))]
  return [{ value: 'all', label: '全部模型' }, ...names.map(n => ({ value: n, label: n }))]
})

// --- Status options ---
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: '200', label: '200' },
  { value: '400', label: '400' },
  { value: '429', label: '429' },
  { value: '500', label: '500' }
]

// --- Filtered logs ---
const filteredLogs = computed(() => {
  let logs = personalLogs.value

  // Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    logs = logs.filter(log =>
      log.modelName.toLowerCase().includes(q) ||
      log.apiKey.toLowerCase().includes(q) ||
      log.requestId.toLowerCase().includes(q) ||
      log.errorMessage?.toLowerCase().includes(q)
    )
  }

  // Model filter
  if (modelFilter.value !== 'all') {
    logs = logs.filter(log => log.modelName === modelFilter.value)
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    logs = logs.filter(log => log.status === Number(statusFilter.value))
  }

  // Time range (mock: all logs are today, so just return all for 'today')
  // For 7d/30d we still return all since mock data is all from today
  return logs
})

// --- Pagination ---
const totalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / pageSize)))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

// Reset page when filters change
watch([searchQuery, timeRange, modelFilter, statusFilter], () => {
  currentPage.value = 1
})

// --- Trend chart data ---
const trendData = computed(() => {
  if (aggregation.value === 'hour') {
    // Group by hour from timestamps
    const hourMap = new Map<string, { total: number, success: number, error: number }>()
    for (const log of filteredLogs.value) {
      const hour = log.timestamp.substring(11, 13) + ':00'
      const existing = hourMap.get(hour) || { total: 0, success: 0, error: 0 }
      existing.total++
      if (log.status >= 200 && log.status < 300) existing.success++
      else existing.error++
      hourMap.set(hour, existing)
    }
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
    return hours
      .filter(h => hourMap.has(h))
      .map(h => ({ label: h, ...hourMap.get(h)! }))
  } else {
    // Group by day
    const dayMap = new Map<string, { total: number, success: number, error: number }>()
    for (const log of filteredLogs.value) {
      const day = log.timestamp.substring(0, 10)
      const existing = dayMap.get(day) || { total: 0, success: 0, error: 0 }
      existing.total++
      if (log.status >= 200 && log.status < 300) existing.success++
      else existing.error++
      dayMap.set(day, existing)
    }
    return Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, data]) => ({ label, ...data }))
  }
})

// --- Status distribution data ---
const statusDistData = computed(() => {
  const counts: Record<string, number> = { '2xx': 0, '4xx': 0, '5xx': 0 }
  for (const log of filteredLogs.value) {
    if (log.status >= 200 && log.status < 300) counts['2xx']!++
    else if (log.status >= 400 && log.status < 500) counts['4xx']!++
    else if (log.status >= 500) counts['5xx']!++
  }
  return counts
})

// --- ECharts options ---

// 1. Area Chart - Call Volume Trend
const trendChartOption = computed(() => {
  if (trendData.value.length === 0) return {}
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['成功', '错误'],
      bottom: 0,
      textStyle: { fontSize: 11, color: '#6B7280' },
      itemWidth: 12,
      itemHeight: 8
    },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.value.map(d => d.label),
      axisLabel: { fontSize: 10, color: '#9CA3AF' },
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
    series: [
      {
        name: '成功',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#10B981' },
        itemStyle: { color: '#10B981' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.02)' }
            ]
          }
        },
        data: trendData.value.map(d => d.success)
      },
      {
        name: '错误',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#EF4444' },
        itemStyle: { color: '#EF4444' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 68, 68, 0.15)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0.02)' }
            ]
          }
        },
        data: trendData.value.map(d => d.error)
      }
    ]
  }
})

// 2. Doughnut Chart - Status Code Distribution
const statusDistChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    bottom: 0,
    textStyle: { fontSize: 11, color: '#6B7280' },
    itemWidth: 10,
    itemHeight: 10
  },
  series: [{
    name: '状态码分布',
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' },
      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
    },
    data: [
      { name: '2xx 成功', value: statusDistData.value['2xx'], itemStyle: { color: '#10B981' } },
      { name: '4xx 客户端错误', value: statusDistData.value['4xx'], itemStyle: { color: '#F59E0B' } },
      { name: '5xx 服务端错误', value: statusDistData.value['5xx'], itemStyle: { color: '#EF4444' } }
    ]
  }]
}))

// Drilldown: click status doughnut to filter
function onStatusDistDrilldown(data: { chartType: string; field: string; value: any }) {
  if (data.value === '2xx 成功') statusFilter.value = '200'
  else if (data.value === '4xx 客户端错误') statusFilter.value = '400'
  else if (data.value === '5xx 服务端错误') statusFilter.value = '500'
}

// --- Helpers ---
function getStatusBadge(status: number) {
  if (status === 200) return { bg: 'bg-green-50', text: 'text-green-600', label: '200' }
  if (status === 400) return { bg: 'bg-amber-50', text: 'text-amber-600', label: '400' }
  if (status === 429) return { bg: 'bg-orange-50', text: 'text-orange-600', label: '429' }
  if (status === 500) return { bg: 'bg-red-50', text: 'text-red-600', label: '500' }
  return { bg: 'bg-gray-50', text: 'text-gray-600', label: String(status) }
}

function formatCost(cost: number) {
  return cost < 0.01 && cost > 0 ? cost.toFixed(4) : cost.toFixed(2)
}

function toggleExpand(id: string) {
  expandedRow.value = expandedRow.value === id ? null : id
}

function exportCSV() {
  const toast = useToast()
  toast.add({ title: '导出提示', description: 'CSV导出功能开发中，敬请期待', color: 'primary' })
}

function exportJSON() {
  const toast = useToast()
  toast.add({ title: '导出提示', description: 'JSON导出功能开发中，敬请期待', color: 'primary' })
}

// --- Dropdown refs ---
const modelDropdownOpen = ref(false)
const modelDropdownRef = ref<HTMLElement | null>(null)
const statusDropdownOpen = ref(false)
const statusDropdownRef = ref<HTMLElement | null>(null)

function onDocumentClick(e: MouseEvent) {
  if (modelDropdownRef.value && !modelDropdownRef.value.contains(e.target as Node)) {
    modelDropdownOpen.value = false
  }
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(e.target as Node)) {
    statusDropdownOpen.value = false
  }
}
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 min-h-screen bg-[#FAFAFA]">
      <div class="p-8">
        <!-- Page Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-bold text-gray-900">调用日志</h1>
            <NuxtLink
              v-if="fromStats"
              to="/console/stats"
              class="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5" />
              返回统计
            </NuxtLink>
          </div>
          <p class="text-sm text-gray-400 mt-1">查看您的API调用记录、状态与费用明细</p>
        </div>

        <!-- Search Bar -->
        <div class="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div class="relative">
            <UIcon name="i-lucide-search" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索关键词、API Key、模型名..."
              class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all duration-200"
            />
            <span
              v-if="searchQuery"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"
            >{{ filteredLogs.length }} 条结果</span>
          </div>
        </div>

        <!-- Filter Row -->
        <div class="flex items-center gap-3 mb-6">
          <!-- Time Range -->
          <div class="flex items-center gap-1 bg-white rounded-lg border border-gray-100 p-1">
            <button
              v-for="range in timeRanges"
              :key="range.value"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
              :class="timeRange === range.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="timeRange = range.value"
            >
              {{ range.label }}
            </button>
          </div>

          <!-- Model Filter Dropdown -->
          <div ref="modelDropdownRef" class="relative">
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
              @click="modelDropdownOpen = !modelDropdownOpen"
            >
              <UIcon name="i-lucide-cpu" class="w-4 h-4 text-gray-400" />
              <span class="font-medium">{{ modelOptions.find(o => o.value === modelFilter)?.label || '全部模型' }}</span>
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="modelDropdownOpen ? 'rotate-180' : ''"
              />
            </button>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="modelDropdownOpen"
                class="absolute left-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
              >
                <button
                  v-for="opt in modelOptions"
                  :key="opt.value"
                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                  :class="modelFilter === opt.value ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'"
                  @click="modelFilter = opt.value; modelDropdownOpen = false"
                >
                  {{ opt.label }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Status Filter Dropdown -->
          <div ref="statusDropdownRef" class="relative">
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
              @click="statusDropdownOpen = !statusDropdownOpen"
            >
              <UIcon name="i-lucide-filter" class="w-4 h-4 text-gray-400" />
              <span class="font-medium">{{ statusOptions.find(o => o.value === statusFilter)?.label || '全部状态' }}</span>
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="statusDropdownOpen ? 'rotate-180' : ''"
              />
            </button>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="statusDropdownOpen"
                class="absolute left-0 mt-2 w-40 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
              >
                <button
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                  :class="statusFilter === opt.value ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'"
                  @click="statusFilter = opt.value; statusDropdownOpen = false"
                >
                  {{ opt.label }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Spacer -->
          <div class="flex-1" />

          <!-- Export Buttons -->
          <button
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
            @click="exportCSV"
          >
            <UIcon name="i-lucide-download" class="w-4 h-4" />
            导出 CSV
          </button>
          <button
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
            @click="exportJSON"
          >
            <UIcon name="i-lucide-file-json" class="w-4 h-4" />
            导出 JSON
          </button>
        </div>

        <!-- Call Volume Trend Chart -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">调用量趋势</h3>
              <p class="text-xs text-gray-400 mt-0.5">个人API调用统计</p>
            </div>
            <div class="flex items-center gap-2">
              <!-- Aggregation toggle -->
              <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                <button
                  class="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
                  :class="aggregation === 'hour'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'"
                  @click="aggregation = 'hour'"
                >
                  按小时
                </button>
                <button
                  class="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
                  :class="aggregation === 'day'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'"
                  @click="aggregation = 'day'"
                >
                  按天
                </button>
              </div>
            </div>
          </div>
          <ChartsBaseChart :option="trendChartOption" height="220px" />
        </div>

        <!-- Status Code Distribution -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">状态码分布</h3>
              <p class="text-xs text-gray-400 mt-0.5">点击扇区可筛选对应状态码</p>
            </div>
          </div>
          <ChartsBaseChart
            :option="statusDistChartOption"
            height="220px"
            @drilldown="onStatusDistDrilldown"
          />
        </div>

        <!-- Log List Table -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900">调用记录</h3>
              <p class="text-xs text-gray-400 mt-0.5">共 {{ filteredLogs.length }} 条记录</p>
            </div>
          </div>

          <!-- Table -->
          <table class="w-full">
            <thead>
              <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <th class="text-left py-3 px-6 font-medium">时间</th>
                <th class="text-left py-3 px-4 font-medium">模型</th>
                <th class="text-left py-3 px-4 font-medium">API Key</th>
                <th class="text-left py-3 px-4 font-medium">状态码</th>
                <th class="text-left py-3 px-4 font-medium">延迟</th>
                <th class="text-left py-3 px-4 font-medium">Token</th>
                <th class="text-left py-3 px-4 font-medium">费用</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="log in paginatedLogs" :key="log.id">
                <!-- Main Row -->
                <tr
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  @click="toggleExpand(log.id)"
                >
                  <td class="py-3 px-6 text-xs font-mono text-gray-500">{{ log.timestamp }}</td>
                  <td class="py-3 px-4 text-sm font-medium">
                    <NuxtLink :to="`/marketplace/${log.model}`" class="text-primary-600 hover:text-primary-700" @click.stop>{{ log.modelName }}</NuxtLink>
                  </td>
                  <td class="py-3 px-4 text-xs font-mono text-gray-500">{{ log.apiKey }}</td>
                  <td class="py-3 px-4">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium"
                      :class="[getStatusBadge(log.status).bg, getStatusBadge(log.status).text]"
                    >
                      {{ getStatusBadge(log.status).label }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-xs font-mono text-gray-500">{{ log.latency }}ms</td>
                  <td class="py-3 px-4 text-xs font-mono text-gray-500">{{ log.totalTokens.toLocaleString() }}</td>
                  <td class="py-3 px-4 text-xs font-mono text-gray-900 font-medium">¥{{ formatCost(log.cost) }}</td>
                </tr>
                <!-- Expanded Detail Row -->
                <tr v-if="expandedRow === log.id">
                  <td colspan="7" class="px-6 py-4 bg-gray-50/30">
                    <div class="grid grid-cols-3 gap-6 text-sm">
                      <!-- Request ID -->
                      <div>
                        <p class="text-xs text-gray-400 mb-1">Request ID</p>
                        <p class="font-mono text-xs text-gray-700">{{ log.requestId }}</p>
                      </div>
                      <!-- Token Breakdown -->
                      <div>
                        <p class="text-xs text-gray-400 mb-1">Token 明细</p>
                        <div class="flex items-center gap-3 text-xs">
                          <span class="text-gray-600">输入: <span class="font-mono">{{ log.promptTokens.toLocaleString() }}</span></span>
                          <span class="text-gray-300">|</span>
                          <span class="text-gray-600">输出: <span class="font-mono">{{ log.completionTokens.toLocaleString() }}</span></span>
                          <span class="text-gray-300">|</span>
                          <span class="text-gray-600">合计: <span class="font-mono font-medium">{{ log.totalTokens.toLocaleString() }}</span></span>
                        </div>
                      </div>
                      <!-- Error Message -->
                      <div v-if="log.errorMessage">
                        <p class="text-xs text-gray-400 mb-1">错误信息</p>
                        <p class="text-xs text-red-600">{{ log.errorMessage }}</p>
                      </div>
                    </div>
                    <!-- Request/Response Preview -->
                    <div class="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-400 mb-1.5">请求预览</p>
                        <div class="bg-gray-900 rounded-lg p-3 text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
                          <span class="text-blue-400">POST</span> /v1/{{ log.model }}/completions<br>
                          <span class="text-gray-500">Authorization:</span> Bearer {{ log.apiKey }}<br>
                          <span class="text-gray-500">Content-Type:</span> application/json<br>
                          <br>
                          {<br>
                          &nbsp;&nbsp;<span class="text-green-400">"model"</span>: <span class="text-amber-300">"{{ log.model }}"</span>,<br>
                          &nbsp;&nbsp;<span class="text-green-400">"prompt"</span>: <span class="text-amber-300">"..."</span>,<br>
                          &nbsp;&nbsp;<span class="text-green-400">"max_tokens"</span>: <span class="text-purple-400">{{ log.completionTokens || 1024 }}</span><br>
                          }
                        </div>
                      </div>
                      <div>
                        <p class="text-xs text-gray-400 mb-1.5">响应预览</p>
                        <div
                          class="bg-gray-900 rounded-lg p-3 text-xs font-mono leading-relaxed overflow-x-auto"
                          :class="log.status === 200 ? 'text-gray-300' : 'text-red-400'"
                        >
                          <template v-if="log.status === 200">
                            {<br>
                            &nbsp;&nbsp;<span class="text-green-400">"id"</span>: <span class="text-amber-300">"{{ log.requestId }}"</span>,<br>
                            &nbsp;&nbsp;<span class="text-green-400">"status"</span>: <span class="text-purple-400">200</span>,<br>
                            &nbsp;&nbsp;<span class="text-green-400">"usage"</span>: {<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"prompt_tokens"</span>: <span class="text-purple-400">{{ log.promptTokens }}</span>,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"completion_tokens"</span>: <span class="text-purple-400">{{ log.completionTokens }}</span><br>
                            &nbsp;&nbsp;}<br>
                            }
                          </template>
                          <template v-else>
                            {<br>
                            &nbsp;&nbsp;<span class="text-green-400">"error"</span>: {<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"code"</span>: <span class="text-purple-400">{{ log.status }}</span>,<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"message"</span>: <span class="text-amber-300">"{{ log.errorMessage }}"</span><br>
                            &nbsp;&nbsp;}<br>
                            }
                          </template>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
              <!-- Empty State -->
              <tr v-if="paginatedLogs.length === 0">
                <td colspan="7" class="py-16 text-center">
                  <UIcon name="i-lucide-inbox" class="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p class="text-sm text-gray-400">暂无调用记录</p>
                  <p class="text-xs text-gray-300 mt-1">尝试调整筛选条件</p>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="filteredLogs.length > pageSize" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p class="text-xs text-gray-400">
              第 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredLogs.length) }} 条，共 {{ filteredLogs.length }} 条
            </p>
            <div class="flex items-center gap-1">
              <button
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                class="w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200"
                :class="currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
              <button
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
