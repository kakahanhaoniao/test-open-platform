<script setup lang="ts">
const dateRange = ref('7d')
const dateRanges = [
  { value: 'today', label: '今日' },
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' },
  { value: 'custom', label: '自定义' }
]

const dailyData = [
  { date: '07/05', calls: 3200, errors: 12 },
  { date: '07/06', calls: 2840, errors: 8 },
  { date: '07/07', calls: 3520, errors: 15 },
  { date: '07/08', calls: 4120, errors: 22 },
  { date: '07/09', calls: 3890, errors: 18 },
  { date: '07/10', calls: 4650, errors: 9 },
  { date: '07/11', calls: 2294, errors: 5 }
]

const maxDailyCalls = Math.max(...dailyData.map(d => d.calls))

const modelBreakdown = [
  { name: '奇安信安全大模型', calls: 12840, tokens: 5240000, cost: '¥478.32', percentage: 45 },
  { name: '威胁检测模型 V3', calls: 8650, tokens: 2890000, cost: '¥216.75', percentage: 30 },
  { name: '代码安全扫描模型', calls: 5200, tokens: 1780000, cost: '¥142.40', percentage: 18 },
  { name: '漏洞分析专家', calls: 2400, tokens: 960000, cost: '¥57.60', percentage: 8 },
  { name: '合规卫士', calls: 1200, tokens: 480000, cost: '¥28.80', percentage: 4 },
  { name: '日志智能分析模型', calls: 800, tokens: 320000, cost: '¥12.80', percentage: 3 }
]

const errorLog = [
  { id: 1, time: '07/11 14:23:05', model: '合规卫士', endpoint: '/v1/compliance/check', errorCode: 500, message: 'Internal Server Error', requestId: 'req-8f3e2d1c' },
  { id: 2, time: '07/11 13:45:12', model: '奇安信安全大模型', endpoint: '/v1/chat/completions', errorCode: 429, message: 'Rate limit exceeded', requestId: 'req-4b5a6f7e' },
  { id: 3, time: '07/11 11:30:08', model: '威胁检测模型 V3', endpoint: '/v1/threat/detect', errorCode: 400, message: 'Invalid request body', requestId: 'req-c9b8a7f6' },
  { id: 4, time: '07/10 22:15:33', model: '代码安全扫描模型', endpoint: '/v1/code/scan', errorCode: 401, message: 'Invalid API key', requestId: 'req-e5d4c3b2' },
  { id: 5, time: '07/10 19:08:21', model: '漏洞分析专家', endpoint: '/v1/vuln/analyze', errorCode: 503, message: 'Service temporarily unavailable', requestId: 'req-a3f2e1d0' }
]

const totalCalls = computed(() => dailyData.reduce((sum, d) => sum + d.calls, 0))
const totalErrors = computed(() => dailyData.reduce((sum, d) => sum + d.errors, 0))
const successRate = computed(() => ((1 - totalErrors.value / totalCalls.value) * 100).toFixed(2))
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-xl font-bold text-gray-900">调用统计</h1>
          <p class="text-sm text-gray-400 mt-1">查看API调用详情、模型使用分布与错误日志</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-for="range in dateRanges"
            :key="range.value"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            :class="dateRange === range.value
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'"
            @click="dateRange = range.value"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <UIcon name="i-lucide-activity" class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-xs text-gray-400">总调用次数</p>
              <p class="text-2xl font-bold text-gray-900 font-mono">{{ totalCalls.toLocaleString() }}</p>
            </div>
          </div>
          <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-primary-500 rounded-full" style="width: 78%" />
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p class="text-xs text-gray-400">成功率</p>
              <p class="text-2xl font-bold text-gray-900 font-mono">{{ successRate }}%</p>
            </div>
          </div>
          <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-green-500 rounded-full" :style="{ width: successRate + '%' }" />
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-xs text-gray-400">平均延迟</p>
              <p class="text-2xl font-bold text-gray-900 font-mono">248ms</p>
            </div>
          </div>
          <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full" style="width: 35%" />
          </div>
        </div>
      </div>

      <!-- Daily Chart -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-semibold text-gray-900">每日调用量</h3>
            <p class="text-xs text-gray-400 mt-0.5">过去7天的API调用统计</p>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-400">
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-primary-500" />
              调用量
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-red-400" />
              错误数
            </span>
          </div>
        </div>
        <div class="flex items-end gap-4 h-44">
          <div
            v-for="item in dailyData"
            :key="item.date"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <span class="text-xs font-mono text-gray-500">{{ item.calls.toLocaleString() }}</span>
            <div class="w-full relative">
              <div
                class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400"
                :style="{ height: `${(item.calls / maxDailyCalls) * 140}px` }"
              />
              <div
                class="absolute bottom-0 w-full rounded-t-sm bg-red-400/60"
                :style="{ height: `${Math.max((item.errors / maxDailyCalls) * 140, 2)}px` }"
              />
            </div>
            <span class="text-xs text-gray-400">{{ item.date }}</span>
          </div>
        </div>
      </div>

      <!-- Model Breakdown -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-semibold text-gray-900">模型调用分布</h3>
            <p class="text-xs text-gray-400 mt-0.5">各模型的调用次数、Token消耗与费用</p>
          </div>
        </div>
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100">
              <th class="text-left py-3 font-medium">模型</th>
              <th class="text-left py-3 font-medium">调用次数</th>
              <th class="text-left py-3 font-medium">Token消耗</th>
              <th class="text-left py-3 font-medium">费用</th>
              <th class="text-left py-3 font-medium">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in modelBreakdown"
              :key="idx"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 text-sm font-medium text-gray-900">{{ item.name }}</td>
              <td class="py-3 text-sm font-mono text-gray-600">{{ item.calls.toLocaleString() }}</td>
              <td class="py-3 text-sm font-mono text-gray-600">{{ item.tokens.toLocaleString() }}</td>
              <td class="py-3 text-sm font-mono text-gray-900 font-medium">{{ item.cost }}</td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-500 rounded-full" :style="{ width: item.percentage + '%' }" />
                  </div>
                  <span class="text-xs text-gray-400 font-mono">{{ item.percentage }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Error Log -->
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-semibold text-gray-900">错误日志</h3>
            <p class="text-xs text-gray-400 mt-0.5">最近的API调用错误记录</p>
          </div>
          <button class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            导出日志
            <UIcon name="i-lucide-download" class="w-3.5 h-3.5" />
          </button>
        </div>
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100">
              <th class="text-left py-3 font-medium">时间</th>
              <th class="text-left py-3 font-medium">模型</th>
              <th class="text-left py-3 font-medium">接口</th>
              <th class="text-left py-3 font-medium">错误码</th>
              <th class="text-left py-3 font-medium">错误信息</th>
              <th class="text-left py-3 font-medium">Request ID</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="err in errorLog"
              :key="err.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 text-xs font-mono text-gray-500">{{ err.time }}</td>
              <td class="py-3 text-sm text-gray-900">{{ err.model }}</td>
              <td class="py-3 text-xs font-mono text-gray-500">{{ err.endpoint }}</td>
              <td class="py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-red-50 text-red-600">
                  {{ err.errorCode }}
                </span>
              </td>
              <td class="py-3 text-xs text-red-600">{{ err.message }}</td>
              <td class="py-3 text-xs font-mono text-gray-400">{{ err.requestId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
