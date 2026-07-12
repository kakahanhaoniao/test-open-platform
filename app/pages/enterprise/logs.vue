<script setup lang="ts">
import { callLogs, models, members } from '~/data/mock'
import type { CallLog } from '~/data/mock'

useHead({ title: '日志审计 - 奇安信AI开放平台' })

// --- Search & Filter State ---
const searchQuery = ref('')
const filterTimeRange = ref('today')
const filterModel = ref('all')
const filterMember = ref('all')
const filterStatus = ref('all')
const trendAggregation = ref<'hour' | 'day' | 'week'>('hour')
const currentPage = ref(1)
const pageSize = 20
const expandedRowId = ref<string | null>(null)
const toastMessage = ref('')
const toastVisible = ref(false)

// --- Filter Options ---
const timeRangeOptions = [
  { value: 'today', label: '今天' },
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' },
  { value: 'custom', label: '自定义' }
]

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: '200', label: '200' },
  { value: '400', label: '400' },
  { value: '429', label: '429' },
  { value: '500', label: '500' }
]

const modelOptions = computed(() => {
  const unique = [...new Set(callLogs.map(l => l.model))]
  return [
    { value: 'all', label: '全部模型' },
    ...unique.map(m => {
      const log = callLogs.find(l => l.model === m)
      return { value: m, label: log?.modelName || m }
    })
  ]
})

const memberOptions = computed(() => {
  const unique = [...new Set(callLogs.map(l => l.memberId))]
  return [
    { value: 'all', label: '全部成员' },
    ...unique.map(id => {
      const log = callLogs.find(l => l.memberId === id)
      return { value: id, label: log?.memberName || id }
    })
  ]
})

// --- Filtered Logs ---
const filteredLogs = computed(() => {
  let result = [...callLogs]

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(log =>
      log.memberName.toLowerCase().includes(q) ||
      log.modelName.toLowerCase().includes(q) ||
      log.apiKey.toLowerCase().includes(q) ||
      log.requestId.toLowerCase().includes(q) ||
      log.errorMessage?.toLowerCase().includes(q)
    )
  }

  // Time range filter
  if (filterTimeRange.value !== 'custom') {
    const now = new Date('2026-07-12T14:32:15')
    let cutoff: Date
    if (filterTimeRange.value === 'today') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }
    else if (filterTimeRange.value === '7d') {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
    else if (filterTimeRange.value === '30d') {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    else {
      cutoff = new Date(0)
    }
    result = result.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= cutoff!
    })
  }

  // Model filter
  if (filterModel.value !== 'all') {
    result = result.filter(log => log.model === filterModel.value)
  }

  // Member filter
  if (filterMember.value !== 'all') {
    result = result.filter(log => log.memberId === filterMember.value)
  }

  // Status filter
  if (filterStatus.value !== 'all') {
    result = result.filter(log => log.status === Number(filterStatus.value))
  }

  return result
})

// --- Pagination ---
const totalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / pageSize)))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

// Reset page when filters change
watch([searchQuery, filterTimeRange, filterModel, filterMember, filterStatus], () => {
  currentPage.value = 1
})

// --- Trend Chart Data ---
const trendData = computed(() => {
  const logs = filteredLogs.value
  if (trendAggregation.value === 'hour') {
    // Group by hour
    const groups: Record<string, { total: number; s200: number; s429: number; s500: number }> = {}
    logs.forEach(log => {
      const hour = log.timestamp.substring(0, 13) // '2026-07-12 14'
      const label = log.timestamp.substring(11, 16) // '14:32'
      const key = hour
      if (!groups[key]) groups[key] = { total: 0, s200: 0, s429: 0, s500: 0 }
      groups[key].total++
      if (log.status === 200) groups[key].s200++
      else if (log.status === 429) groups[key].s429++
      else if (log.status === 500) groups[key].s500++
    })
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        label: key.substring(11, 16),
        ...val
      }))
  }
  else if (trendAggregation.value === 'day') {
    const groups: Record<string, { total: number; s200: number; s429: number; s500: number }> = {}
    logs.forEach(log => {
      const day = log.timestamp.substring(0, 10)
      if (!groups[day]) groups[day] = { total: 0, s200: 0, s429: 0, s500: 0 }
      groups[day].total++
      if (log.status === 200) groups[day].s200++
      else if (log.status === 429) groups[day].s429++
      else if (log.status === 500) groups[day].s500++
    })
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        label: key.substring(5),
        ...val
      }))
  }
  else {
    // Week aggregation - just group all into one bar per week-ish
    const groups: Record<string, { total: number; s200: number; s429: number; s500: number }> = {}
    logs.forEach(log => {
      const day = log.timestamp.substring(0, 10)
      const d = new Date(day)
      const weekStart = new Date(d.getTime() - d.getDay() * 86400000)
      const weekKey = weekStart.toISOString().substring(0, 10)
      if (!groups[weekKey]) groups[weekKey] = { total: 0, s200: 0, s429: 0, s500: 0 }
      groups[weekKey].total++
      if (log.status === 200) groups[weekKey].s200++
      else if (log.status === 429) groups[weekKey].s429++
      else if (log.status === 500) groups[weekKey].s500++
    })
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        label: key.substring(5),
        ...val
      }))
  }
})

const maxTrendValue = computed(() => {
  if (trendData.value.length === 0) return 1
  return Math.max(...trendData.value.map(d => d.total), 1)
})

// --- Helper Functions ---
function getStatusBadge(status: number) {
  if (status === 200) return 'bg-green-50 text-green-700'
  if (status === 400) return 'bg-amber-50 text-amber-700'
  if (status === 429) return 'bg-orange-50 text-orange-700'
  if (status === 500) return 'bg-red-50 text-red-700'
  return 'bg-gray-50 text-gray-700'
}

function getLatencyColor(latency: number) {
  if (latency < 100) return 'text-green-600'
  if (latency <= 500) return 'text-amber-600'
  return 'text-red-600'
}

function maskApiKey(key: string) {
  // Already masked in mock data, but ensure full display for detail
  return key
}

function toggleRow(id: string) {
  expandedRowId.value = expandedRowId.value === id ? null : id
}

function showToast(msg: string) {
  toastMessage.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}

function exportCSV() {
  showToast('导出成功')
}

function exportJSON() {
  showToast('导出成功')
}

// Mock request/response bodies for expanded detail
function getMockRequestBody(log: CallLog) {
  return JSON.stringify({
    model: log.model,
    messages: [
      { role: 'system', content: '你是一个专业的安全分析助手。' },
      { role: 'user', content: '请分析以下安全事件...' }
    ],
    temperature: 0.7,
    max_tokens: 4096,
    stream: false
  }, null, 2)
}

function getMockResponseBody(log: CallLog) {
  if (log.status !== 200) {
    return JSON.stringify({
      error: {
        type: log.status === 429 ? 'rate_limit_error' : log.status === 400 ? 'invalid_request_error' : 'internal_server_error',
        message: log.errorMessage || 'Unknown error'
      }
    }, null, 2)
  }
  return JSON.stringify({
    id: log.requestId,
    object: 'chat.completion',
    model: log.model,
    choices: [{
      index: 0,
      message: { role: 'assistant', content: '根据分析结果，该安全事件属于...' },
      finish_reason: 'stop'
    }],
    usage: {
      prompt_tokens: log.promptTokens,
      completion_tokens: log.completionTokens,
      total_tokens: log.totalTokens
    }
  }, null, 2)
}
</script>

<template>
  <div>
    <EnterpriseSidebar />
    <div class="ml-60 min-h-screen bg-[#FAFAFA]">
      <div class="p-8">
        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-xl font-bold text-gray-900">日志审计</h1>
          <p class="text-sm text-gray-400 mt-1">全企业API调用日志、多维筛选与趋势分析</p>
        </div>

        <!-- Search Bar -->
        <div class="mb-4">
          <div class="relative">
            <UIcon name="i-lucide-search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索关键词、API Key、模型名、成员名..."
              class="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200"
            />
            <span
              v-if="searchQuery"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400"
            >{{ filteredLogs.length }} 条结果</span>
          </div>
        </div>

        <!-- Filter Row -->
        <div class="flex items-center gap-3 mb-6 flex-wrap">
          <!-- Time Range -->
          <div class="flex items-center gap-1">
            <button
              v-for="opt in timeRangeOptions"
              :key="opt.value"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              :class="filterTimeRange === opt.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'"
              @click="filterTimeRange = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>

          <div class="w-px h-6 bg-gray-200" />

          <!-- Model Filter -->
          <select
            v-model="filterModel"
            class="h-8 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 appearance-none cursor-pointer"
          >
            <option v-for="opt in modelOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>

          <!-- Member Filter -->
          <select
            v-model="filterMember"
            class="h-8 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 appearance-none cursor-pointer"
          >
            <option v-for="opt in memberOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="filterStatus"
            class="h-8 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 appearance-none cursor-pointer"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>

          <!-- Clear Filters -->
          <button
            v-if="searchQuery || filterModel !== 'all' || filterMember !== 'all' || filterStatus !== 'all' || filterTimeRange !== 'today'"
            class="h-8 px-3 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            @click="searchQuery = ''; filterTimeRange = 'today'; filterModel = 'all'; filterMember = 'all'; filterStatus = 'all'"
          >
            <UIcon name="i-lucide-x" class="w-3.5 h-3.5 inline-block mr-1" />
            清除筛选
          </button>
        </div>

        <!-- Call Volume Trend Chart -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">调用量趋势</h3>
              <p class="text-xs text-gray-400 mt-0.5">按筛选条件动态更新 · 共 {{ filteredLogs.length }} 条日志</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-for="agg in [{ value: 'hour', label: '按小时' }, { value: 'day', label: '按天' }, { value: 'week', label: '按周' }]"
                :key="agg.value"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="trendAggregation === agg.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'"
                @click="trendAggregation = agg.value as any"
              >
                {{ agg.label }}
              </button>
            </div>
          </div>

          <!-- Legend -->
          <div class="flex items-center gap-5 mb-4 text-xs text-gray-400">
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-green-500" />
              200 成功
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              429 限流
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-red-500" />
              500 错误
            </span>
          </div>

          <!-- Bar Chart -->
          <div v-if="trendData.length > 0" class="flex items-end gap-2 h-44">
            <div
              v-for="(item, idx) in trendData"
              :key="idx"
              class="flex-1 flex flex-col items-center gap-1.5 min-w-0"
            >
              <span class="text-xs font-mono text-gray-500 truncate w-full text-center">{{ item.total }}</span>
              <div class="w-full flex flex-col justify-end" style="height: 140px;">
                <!-- Stacked bar: 500 (red) on top, 429 (amber) middle, 200 (green) bottom -->
                <div
                  v-if="item.s500 > 0"
                  class="w-full bg-red-500 rounded-t-sm"
                  :style="{ height: `${Math.max((item.s500 / maxTrendValue) * 140, 3)}px` }"
                />
                <div
                  v-if="item.s429 > 0"
                  class="w-full bg-amber-500"
                  :class="item.s500 === 0 ? 'rounded-t-sm' : ''"
                  :style="{ height: `${Math.max((item.s429 / maxTrendValue) * 140, 3)}px` }"
                />
                <div
                  class="w-full bg-green-500 rounded-b-sm"
                  :class="item.s429 === 0 && item.s500 === 0 ? 'rounded-t-sm' : ''"
                  :style="{ height: `${Math.max((item.s200 / maxTrendValue) * 140, item.s200 > 0 ? 3 : 0)}px` }"
                />
              </div>
              <span class="text-xs text-gray-400 truncate w-full text-center">{{ item.label }}</span>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-44 text-sm text-gray-400">
            暂无数据
          </div>
        </div>

        <!-- Log List Table -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">时间</th>
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">成员</th>
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">模型</th>
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">API Key</th>
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">状态码</th>
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">延迟</th>
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">Token</th>
                  <th class="text-left py-3 px-4 font-medium whitespace-nowrap">费用</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="log in paginatedLogs" :key="log.id">
                  <!-- Main Row -->
                  <tr
                    class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                    :class="expandedRowId === log.id ? 'bg-primary-50/30' : ''"
                    @click="toggleRow(log.id)"
                  >
                    <td class="py-3 px-4 text-xs font-mono text-gray-500 whitespace-nowrap">{{ log.timestamp.substring(5) }}</td>
                    <td class="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">{{ log.memberName }}</td>
                    <td class="py-3 px-4 text-sm text-gray-700 whitespace-nowrap max-w-[180px] truncate">{{ log.modelName }}</td>
                    <td class="py-3 px-4 text-xs font-mono text-gray-500 whitespace-nowrap">{{ log.apiKey }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium"
                        :class="getStatusBadge(log.status)"
                      >
                        {{ log.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-xs font-mono whitespace-nowrap" :class="getLatencyColor(log.latency)">
                      {{ log.latency }}ms
                    </td>
                    <td class="py-3 px-4 text-xs font-mono text-gray-600 whitespace-nowrap">{{ log.totalTokens.toLocaleString() }}</td>
                    <td class="py-3 px-4 text-xs font-mono text-gray-900 whitespace-nowrap">¥{{ log.cost.toFixed(4) }}</td>
                  </tr>

                  <!-- Expanded Detail Row -->
                  <tr v-if="expandedRowId === log.id">
                    <td colspan="8" class="px-4 py-0">
                      <div class="bg-gray-50 border-t border-b border-gray-100 py-4 px-2">
                        <div class="grid grid-cols-3 gap-6 mb-4">
                          <!-- Request ID -->
                          <div>
                            <p class="text-xs text-gray-400 mb-1">Request ID</p>
                            <p class="text-xs font-mono text-gray-700">{{ log.requestId }}</p>
                          </div>
                          <!-- Full API Key -->
                          <div>
                            <p class="text-xs text-gray-400 mb-1">API Key</p>
                            <p class="text-xs font-mono text-gray-700">{{ maskApiKey(log.apiKey) }}</p>
                          </div>
                          <!-- Token Breakdown -->
                          <div>
                            <p class="text-xs text-gray-400 mb-1">Token 明细</p>
                            <div class="flex items-center gap-3 text-xs font-mono">
                              <span class="text-blue-600">Prompt: {{ log.promptTokens.toLocaleString() }}</span>
                              <span class="text-gray-300">|</span>
                              <span class="text-green-600">Completion: {{ log.completionTokens.toLocaleString() }}</span>
                              <span class="text-gray-300">|</span>
                              <span class="text-gray-700">Total: {{ log.totalTokens.toLocaleString() }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Error Message (if any) -->
                        <div v-if="log.status !== 200 && log.errorMessage" class="mb-4">
                          <p class="text-xs text-gray-400 mb-1">错误信息</p>
                          <div class="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            <p class="text-xs font-mono text-red-600">{{ log.errorMessage }}</p>
                          </div>
                        </div>

                        <!-- Request & Response Bodies -->
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-xs text-gray-400 mb-1.5">请求体</p>
                            <pre class="bg-gray-900 text-green-400 text-xs font-mono p-3 rounded-lg overflow-x-auto max-h-48 leading-relaxed">{{ getMockRequestBody(log) }}</pre>
                          </div>
                          <div>
                            <p class="text-xs text-gray-400 mb-1.5">响应体</p>
                            <pre
                              class="text-xs font-mono p-3 rounded-lg overflow-x-auto max-h-48 leading-relaxed"
                              :class="log.status !== 200 ? 'bg-red-950 text-red-300' : 'bg-gray-900 text-green-400'"
                            >{{ getMockResponseBody(log) }}</pre>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>

                <!-- Empty State -->
                <tr v-if="paginatedLogs.length === 0">
                  <td colspan="8" class="py-16 text-center">
                    <UIcon name="i-lucide-search-x" class="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p class="text-sm text-gray-400">未找到匹配的日志记录</p>
                    <p class="text-xs text-gray-300 mt-1">尝试调整搜索条件或筛选器</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="filteredLogs.length > pageSize" class="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
            <p class="text-xs text-gray-400">
              共 {{ filteredLogs.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
            </p>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="currentPage <= 1
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300'"
                :disabled="currentPage <= 1"
                @click="currentPage--"
              >
                上一页
              </button>
              <button
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="currentPage >= totalPages
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300'"
                :disabled="currentPage >= totalPages"
                @click="currentPage++"
              >
                下一页
              </button>
            </div>
          </div>
        </div>

        <!-- Export Buttons -->
        <div class="flex items-center justify-end gap-3">
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            @click="exportCSV"
          >
            <UIcon name="i-lucide-file-spreadsheet" class="w-4 h-4 text-gray-400" />
            导出 CSV
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            @click="exportJSON"
          >
            <UIcon name="i-lucide-file-json" class="w-4 h-4 text-gray-400" />
            导出 JSON
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="toastVisible"
        class="fixed bottom-8 right-8 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white text-sm shadow-lg"
      >
        <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-400" />
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>
