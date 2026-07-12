diff --git a/app/pages/console/billing/index.vue b/app/pages/console/billing/index.vue
index 788fe06..49d9fe3 100644
--- a/app/pages/console/billing/index.vue
+++ b/app/pages/console/billing/index.vue
@@ -1,31 +1,114 @@
 <script setup lang="ts">
 import { billingRecords } from '~/data/mock'
+import { useChartTheme } from '~/composables/useChartTheme'
 
 useHead({ title: '账单中心 - 奇安信AI开放平台' })
 
+const theme = useChartTheme()
+
 // Current and last month records (with safety checks)
 const currentMonth = billingRecords[0]
 const lastMonth = billingRecords[1]
 
-// Monthly trend data for bar chart
+// Monthly trend data for bar+line combo chart
 const monthlyTrend = computed(() =>
   billingRecords.slice().reverse().map(r => ({
     month: r.month.replace('2026年', '').replace('月', '') + '月',
     amount: r.amount,
     tokens: r.tokens
   }))
 )
 
-const maxAmount = computed(() => Math.max(...monthlyTrend.value.map(m => m.amount)))
-
 // Year-over-year change
 const yoyChange = computed(() => {
   if (!currentMonth || !lastMonth || lastMonth.amount === 0) return '0.0'
   return ((currentMonth.amount - lastMonth.amount) / lastMonth.amount * 100).toFixed(1)
 })
 
+// --- ECharts option ---
+
+// Bar+Line Combo Chart - Monthly Spending Trend
+const monthlyTrendChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'axis',
+    axisPointer: { type: 'cross' }
+  },
+  legend: {
+    data: ['消费金额', 'Token消耗'],
+    bottom: 0,
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 12,
+    itemHeight: 8
+  },
+  grid: { left: 70, right: 70, top: 20, bottom: 40 },
+  xAxis: {
+    type: 'category',
+    data: monthlyTrend.value.map(m => m.month),
+    axisLabel: { fontSize: 11, color: '#9CA3AF' },
+    axisLine: { lineStyle: { color: '#E5E7EB' } },
+    axisTick: { show: false }
+  },
+  yAxis: [
+    {
+      type: 'value',
+      name: '金额(¥)',
+      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
+      axisLabel: { fontSize: 10, color: '#9CA3AF', formatter: '¥{value}' },
+      splitLine: { lineStyle: { color: '#F3F4F6' } },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    },
+    {
+      type: 'value',
+      name: 'Token',
+      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
+      axisLabel: {
+        fontSize: 10,
+        color: '#9CA3AF',
+        formatter: (val: number) => {
+          if (val >= 10000000) return (val / 10000000).toFixed(0) + '千万'
+          if (val >= 10000) return (val / 10000).toFixed(0) + '万'
+          return String(val)
+        }
+      },
+      splitLine: { show: false },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    }
+  ],
+  series: [
+    {
+      name: '消费金额',
+      type: 'bar',
+      barWidth: 24,
+      itemStyle: {
+        borderRadius: [4, 4, 0, 0],
+        color: {
+          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
+          colorStops: [
+            { offset: 0, color: '#7C3AED' },
+            { offset: 1, color: '#A78BFA' }
+          ]
+        }
+      },
+      data: monthlyTrend.value.map(m => m.amount)
+    },
+    {
+      name: 'Token消耗',
+      type: 'line',
+      yAxisIndex: 1,
+      smooth: true,
+      symbol: 'circle',
+      symbolSize: 6,
+      lineStyle: { width: 2, color: '#F59E0B' },
+      itemStyle: { color: '#F59E0B' },
+      data: monthlyTrend.value.map(m => m.tokens)
+    }
+  ]
+}))
+
 // Purchase/recharge records
 const rechargeRecords = [
   { id: 'rc-1', time: '2026-07-01 09:30:22', name: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
   { id: 'rc-2', time: '2026-06-15 14:22:10', name: '企业包', tokens: '2000万Token', amount: '¥1,499', status: 'success' as const },
   { id: 'rc-3', time: '2026-05-20 11:08:33', name: '体验包', tokens: '100万Token', amount: '¥99', status: 'success' as const }
@@ -72,33 +155,14 @@ function formatTokens(tokens: number) {
             </p>
             <p class="text-xs text-gray-400 mt-2">较上月增长</p>
           </div>
         </div>
 
-        <!-- Monthly Spending Trend -->
+        <!-- Monthly Spending Trend Chart -->
         <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
           <h3 class="text-sm font-semibold text-gray-900 mb-5">月度消费趋势</h3>
-          <div class="flex items-end gap-3 h-48">
-            <div
-              v-for="(item, idx) in monthlyTrend"
-              :key="idx"
-              class="flex-1 flex flex-col items-center justify-end h-full"
-            >
-              <p class="text-xs font-semibold text-gray-700 mb-2">&yen;{{ formatAmount(item.amount) }}</p>
-              <div
-                class="w-full rounded-t-lg transition-all duration-300"
-                :style="{
-                  height: (item.amount / maxAmount * 100) + '%',
-                  background: idx === monthlyTrend.length - 1
-                    ? 'linear-gradient(180deg, #7C3AED, #A78BFA)'
-                    : 'linear-gradient(180deg, #A78BFA, #DDD6FE)',
-                  minHeight: '16px'
-                }"
-              />
-              <p class="text-xs text-gray-400 mt-2">{{ item.month }}</p>
-            </div>
-          </div>
+          <ChartsBaseChart :option="monthlyTrendChartOption" height="280px" />
         </div>
 
         <!-- Billing Table -->
         <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
           <div class="px-5 py-4 border-b border-gray-100">
diff --git a/app/pages/console/index.vue b/app/pages/console/index.vue
index d66838a..62e8e5b 100644
--- a/app/pages/console/index.vue
+++ b/app/pages/console/index.vue
@@ -1,10 +1,13 @@
 <script setup lang="ts">
 import { currentUser, members, organization } from '~/data/mock'
+import { useChartTheme } from '~/composables/useChartTheme'
 
 useHead({ title: '使用看板 - 奇安信AI开放平台' })
 
+const theme = useChartTheme()
+
 // Personal data (current user only)
 const personalMember = members.find(m => m.id === 'm1')!
 const personalCalls = 12800
 const personalTokens = personalMember.monthlyTokens
 const personalCost = personalMember.monthlyCost
@@ -26,11 +29,61 @@ const callTrendData = [
   { date: '07/09', calls: 1980 },
   { date: '07/10', calls: 2560 },
   { date: '07/11', calls: 620 }
 ]
 
-const maxCalls = Math.max(...callTrendData.map(d => d.calls))
+// --- ECharts option ---
+
+// Area Line Chart - 7-day Call Trend
+const callTrendChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'axis',
+    formatter: (params: any) => {
+      const p = params[0]
+      return `${p.axisValue}<br/>${p.marker} 调用量: ${p.value.toLocaleString()} 次`
+    }
+  },
+  grid: { left: 50, right: 20, top: 20, bottom: 30 },
+  xAxis: {
+    type: 'category',
+    boundaryGap: false,
+    data: callTrendData.map(d => d.date),
+    axisLabel: { fontSize: 11, color: '#9CA3AF' },
+    axisLine: { lineStyle: { color: '#E5E7EB' } },
+    axisTick: { show: false }
+  },
+  yAxis: {
+    type: 'value',
+    axisLabel: {
+      fontSize: 10,
+      color: '#9CA3AF',
+      formatter: (val: number) => val >= 10000 ? (val / 10000).toFixed(1) + '万' : String(val)
+    },
+    splitLine: { lineStyle: { color: '#F3F4F6' } },
+    axisLine: { show: false },
+    axisTick: { show: false }
+  },
+  series: [{
+    name: '调用量',
+    type: 'line',
+    smooth: true,
+    symbol: 'circle',
+    symbolSize: 6,
+    lineStyle: { width: 2, color: '#7C3AED' },
+    itemStyle: { color: '#7C3AED' },
+    areaStyle: {
+      color: {
+        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
+        colorStops: [
+          { offset: 0, color: 'rgba(124, 58, 237, 0.25)' },
+          { offset: 1, color: 'rgba(124, 58, 237, 0.02)' }
+        ]
+      }
+    },
+    data: callTrendData.map(d => d.calls)
+  }]
+}))
 
 // Model consumption ranking (personal top 5)
 const modelRanking = [
   { name: '奇安信安全大模型', percentage: 45, tokens: '234万' },
   { name: '代码安全扫描模型', percentage: 25, tokens: '130万' },
@@ -165,11 +218,11 @@ const quickActions = [
           </div>
         </div>
 
         <!-- Call Trend Chart -->
         <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
-          <div class="flex items-center justify-between mb-6">
+          <div class="flex items-center justify-between mb-5">
             <div>
               <h3 class="font-semibold text-gray-900">调用趋势</h3>
               <p class="text-xs text-gray-400 mt-0.5">API每日调用量统计</p>
             </div>
             <div class="flex items-center gap-2">
@@ -184,24 +237,11 @@ const quickActions = [
               >
                 {{ range.label }}
               </button>
             </div>
           </div>
-          <div class="flex items-end gap-4 h-44">
-            <div
-              v-for="item in callTrendData"
-              :key="item.date"
-              class="flex-1 flex flex-col items-center gap-2"
-            >
-              <span class="text-xs font-mono text-gray-500">{{ (item.calls / 10000).toFixed(1) }}万</span>
-              <div
-                class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-300"
-                :style="{ height: `${(item.calls / maxCalls) * 140}px` }"
-              />
-              <span class="text-xs text-gray-400">{{ item.date }}</span>
-            </div>
-          </div>
+          <ChartsBaseChart :option="callTrendChartOption" height="220px" />
         </div>
 
         <!-- Two-column: Model Ranking + Alerts -->
         <div class="grid grid-cols-2 gap-6 mb-6">
           <!-- Model Consumption Ranking -->
diff --git a/app/pages/console/logs/index.vue b/app/pages/console/logs/index.vue
new file mode 100644
index 0000000..0484603
--- /dev/null
+++ b/app/pages/console/logs/index.vue
@@ -0,0 +1,653 @@
+<script setup lang="ts">
+import { callLogs, currentUser } from '~/data/mock'
+import { useChartTheme } from '~/composables/useChartTheme'
+
+useHead({ title: '调用日志 - 奇安信AI开放平台' })
+
+const theme = useChartTheme()
+
+// --- State ---
+const searchQuery = ref('')
+const timeRange = ref('today')
+const modelFilter = ref('all')
+const statusFilter = ref('all')
+const aggregation = ref<'hour' | 'day'>('hour')
+const currentPage = ref(1)
+const pageSize = 20
+const expandedRow = ref<string | null>(null)
+
+// --- Time range options ---
+const timeRanges = [
+  { value: 'today', label: '今天' },
+  { value: '7d', label: '7天' },
+  { value: '30d', label: '30天' }
+]
+
+// --- Model options (derived from personal logs) ---
+const personalLogs = computed(() =>
+  callLogs.filter(log => log.memberName === currentUser.name)
+)
+
+const modelOptions = computed(() => {
+  const names = [...new Set(personalLogs.value.map(log => log.modelName))]
+  return [{ value: 'all', label: '全部模型' }, ...names.map(n => ({ value: n, label: n }))]
+})
+
+// --- Status options ---
+const statusOptions = [
+  { value: 'all', label: '全部状态' },
+  { value: '200', label: '200' },
+  { value: '400', label: '400' },
+  { value: '429', label: '429' },
+  { value: '500', label: '500' }
+]
+
+// --- Filtered logs ---
+const filteredLogs = computed(() => {
+  let logs = personalLogs.value
+
+  // Search
+  if (searchQuery.value) {
+    const q = searchQuery.value.toLowerCase()
+    logs = logs.filter(log =>
+      log.modelName.toLowerCase().includes(q) ||
+      log.apiKey.toLowerCase().includes(q) ||
+      log.requestId.toLowerCase().includes(q) ||
+      log.errorMessage?.toLowerCase().includes(q)
+    )
+  }
+
+  // Model filter
+  if (modelFilter.value !== 'all') {
+    logs = logs.filter(log => log.modelName === modelFilter.value)
+  }
+
+  // Status filter
+  if (statusFilter.value !== 'all') {
+    logs = logs.filter(log => log.status === Number(statusFilter.value))
+  }
+
+  // Time range (mock: all logs are today, so just return all for 'today')
+  // For 7d/30d we still return all since mock data is all from today
+  return logs
+})
+
+// --- Pagination ---
+const totalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / pageSize)))
+const paginatedLogs = computed(() => {
+  const start = (currentPage.value - 1) * pageSize
+  return filteredLogs.value.slice(start, start + pageSize)
+})
+
+// Reset page when filters change
+watch([searchQuery, timeRange, modelFilter, statusFilter], () => {
+  currentPage.value = 1
+})
+
+// --- Trend chart data ---
+const trendData = computed(() => {
+  if (aggregation.value === 'hour') {
+    // Group by hour from timestamps
+    const hourMap = new Map<string, { total: number, success: number, error: number }>()
+    for (const log of filteredLogs.value) {
+      const hour = log.timestamp.substring(11, 13) + ':00'
+      const existing = hourMap.get(hour) || { total: 0, success: 0, error: 0 }
+      existing.total++
+      if (log.status >= 200 && log.status < 300) existing.success++
+      else existing.error++
+      hourMap.set(hour, existing)
+    }
+    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
+    return hours
+      .filter(h => hourMap.has(h))
+      .map(h => ({ label: h, ...hourMap.get(h)! }))
+  } else {
+    // Group by day
+    const dayMap = new Map<string, { total: number, success: number, error: number }>()
+    for (const log of filteredLogs.value) {
+      const day = log.timestamp.substring(0, 10)
+      const existing = dayMap.get(day) || { total: 0, success: 0, error: 0 }
+      existing.total++
+      if (log.status >= 200 && log.status < 300) existing.success++
+      else existing.error++
+      dayMap.set(day, existing)
+    }
+    return Array.from(dayMap.entries())
+      .sort(([a], [b]) => a.localeCompare(b))
+      .map(([label, data]) => ({ label, ...data }))
+  }
+})
+
+// --- Status distribution data ---
+const statusDistData = computed(() => {
+  const counts: Record<string, number> = { '2xx': 0, '4xx': 0, '5xx': 0 }
+  for (const log of filteredLogs.value) {
+    if (log.status >= 200 && log.status < 300) counts['2xx']!++
+    else if (log.status >= 400 && log.status < 500) counts['4xx']!++
+    else if (log.status >= 500) counts['5xx']!++
+  }
+  return counts
+})
+
+// --- ECharts options ---
+
+// 1. Area Chart - Call Volume Trend
+const trendChartOption = computed(() => {
+  if (trendData.value.length === 0) return {}
+  return {
+    tooltip: {
+      trigger: 'axis',
+      axisPointer: { type: 'cross' }
+    },
+    legend: {
+      data: ['成功', '错误'],
+      bottom: 0,
+      textStyle: { fontSize: 11, color: '#6B7280' },
+      itemWidth: 12,
+      itemHeight: 8
+    },
+    grid: { left: 50, right: 20, top: 20, bottom: 40 },
+    xAxis: {
+      type: 'category',
+      boundaryGap: false,
+      data: trendData.value.map(d => d.label),
+      axisLabel: { fontSize: 10, color: '#9CA3AF' },
+      axisLine: { lineStyle: { color: '#E5E7EB' } },
+      axisTick: { show: false }
+    },
+    yAxis: {
+      type: 'value',
+      axisLabel: { fontSize: 10, color: '#9CA3AF' },
+      splitLine: { lineStyle: { color: '#F3F4F6' } },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    },
+    series: [
+      {
+        name: '成功',
+        type: 'line',
+        smooth: true,
+        symbol: 'none',
+        lineStyle: { width: 2, color: '#10B981' },
+        itemStyle: { color: '#10B981' },
+        areaStyle: {
+          color: {
+            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
+            colorStops: [
+              { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
+              { offset: 1, color: 'rgba(16, 185, 129, 0.02)' }
+            ]
+          }
+        },
+        data: trendData.value.map(d => d.success)
+      },
+      {
+        name: '错误',
+        type: 'line',
+        smooth: true,
+        symbol: 'none',
+        lineStyle: { width: 2, color: '#EF4444' },
+        itemStyle: { color: '#EF4444' },
+        areaStyle: {
+          color: {
+            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
+            colorStops: [
+              { offset: 0, color: 'rgba(239, 68, 68, 0.15)' },
+              { offset: 1, color: 'rgba(239, 68, 68, 0.02)' }
+            ]
+          }
+        },
+        data: trendData.value.map(d => d.error)
+      }
+    ]
+  }
+})
+
+// 2. Doughnut Chart - Status Code Distribution
+const statusDistChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'item',
+    formatter: '{b}: {c} ({d}%)'
+  },
+  legend: {
+    bottom: 0,
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 10,
+    itemHeight: 10
+  },
+  series: [{
+    name: '状态码分布',
+    type: 'pie',
+    radius: ['40%', '70%'],
+    center: ['50%', '45%'],
+    avoidLabelOverlap: false,
+    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
+    label: { show: false },
+    emphasis: {
+      label: { show: true, fontSize: 14, fontWeight: 'bold' },
+      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
+    },
+    data: [
+      { name: '2xx 成功', value: statusDistData.value['2xx'], itemStyle: { color: '#10B981' } },
+      { name: '4xx 客户端错误', value: statusDistData.value['4xx'], itemStyle: { color: '#F59E0B' } },
+      { name: '5xx 服务端错误', value: statusDistData.value['5xx'], itemStyle: { color: '#EF4444' } }
+    ]
+  }]
+}))
+
+// Drilldown: click status doughnut to filter
+function onStatusDistDrilldown(data: { chartType: string; field: string; value: any }) {
+  if (data.value === '2xx 成功') statusFilter.value = '200'
+  else if (data.value === '4xx 客户端错误') statusFilter.value = '400'
+  else if (data.value === '5xx 服务端错误') statusFilter.value = '500'
+}
+
+// --- Helpers ---
+function getStatusBadge(status: number) {
+  if (status === 200) return { bg: 'bg-green-50', text: 'text-green-600', label: '200' }
+  if (status === 400) return { bg: 'bg-amber-50', text: 'text-amber-600', label: '400' }
+  if (status === 429) return { bg: 'bg-orange-50', text: 'text-orange-600', label: '429' }
+  if (status === 500) return { bg: 'bg-red-50', text: 'text-red-600', label: '500' }
+  return { bg: 'bg-gray-50', text: 'text-gray-600', label: String(status) }
+}
+
+function formatCost(cost: number) {
+  return cost < 0.01 && cost > 0 ? cost.toFixed(4) : cost.toFixed(2)
+}
+
+function toggleExpand(id: string) {
+  expandedRow.value = expandedRow.value === id ? null : id
+}
+
+function exportCSV() {
+  const toast = useToast()
+  toast.add({ title: '导出提示', description: 'CSV导出功能开发中，敬请期待', color: 'primary' })
+}
+
+function exportJSON() {
+  const toast = useToast()
+  toast.add({ title: '导出提示', description: 'JSON导出功能开发中，敬请期待', color: 'primary' })
+}
+
+// --- Dropdown refs ---
+const modelDropdownOpen = ref(false)
+const modelDropdownRef = ref<HTMLElement | null>(null)
+const statusDropdownOpen = ref(false)
+const statusDropdownRef = ref<HTMLElement | null>(null)
+
+function onDocumentClick(e: MouseEvent) {
+  if (modelDropdownRef.value && !modelDropdownRef.value.contains(e.target as Node)) {
+    modelDropdownOpen.value = false
+  }
+  if (statusDropdownRef.value && !statusDropdownRef.value.contains(e.target as Node)) {
+    statusDropdownOpen.value = false
+  }
+}
+onMounted(() => document.addEventListener('click', onDocumentClick))
+onUnmounted(() => document.removeEventListener('click', onDocumentClick))
+</script>
+
+<template>
+  <div>
+    <ConsoleSidebar />
+    <div class="ml-60 min-h-screen bg-[#FAFAFA]">
+      <div class="p-8">
+        <!-- Page Header -->
+        <div class="mb-6">
+          <h1 class="text-xl font-bold text-gray-900">调用日志</h1>
+          <p class="text-sm text-gray-400 mt-1">查看您的API调用记录、状态与费用明细</p>
+        </div>
+
+        <!-- Search Bar -->
+        <div class="bg-white rounded-xl border border-gray-100 p-4 mb-4">
+          <div class="relative">
+            <UIcon name="i-lucide-search" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
+            <input
+              v-model="searchQuery"
+              type="text"
+              placeholder="搜索关键词、API Key、模型名..."
+              class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all duration-200"
+            />
+            <span
+              v-if="searchQuery"
+              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"
+            >{{ filteredLogs.length }} 条结果</span>
+          </div>
+        </div>
+
+        <!-- Filter Row -->
+        <div class="flex items-center gap-3 mb-6">
+          <!-- Time Range -->
+          <div class="flex items-center gap-1 bg-white rounded-lg border border-gray-100 p-1">
+            <button
+              v-for="range in timeRanges"
+              :key="range.value"
+              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
+              :class="timeRange === range.value
+                ? 'bg-primary-600 text-white shadow-sm'
+                : 'text-gray-500 hover:text-gray-700'"
+              @click="timeRange = range.value"
+            >
+              {{ range.label }}
+            </button>
+          </div>
+
+          <!-- Model Filter Dropdown -->
+          <div ref="modelDropdownRef" class="relative">
+            <button
+              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
+              @click="modelDropdownOpen = !modelDropdownOpen"
+            >
+              <UIcon name="i-lucide-cpu" class="w-4 h-4 text-gray-400" />
+              <span class="font-medium">{{ modelOptions.find(o => o.value === modelFilter)?.label || '全部模型' }}</span>
+              <UIcon
+                name="i-lucide-chevron-down"
+                class="w-4 h-4 text-gray-400 transition-transform duration-200"
+                :class="modelDropdownOpen ? 'rotate-180' : ''"
+              />
+            </button>
+            <Transition
+              enter-active-class="transition duration-150 ease-out"
+              enter-from-class="opacity-0 scale-95 -translate-y-1"
+              enter-to-class="opacity-100 scale-100 translate-y-0"
+              leave-active-class="transition duration-100 ease-in"
+              leave-from-class="opacity-100 scale-100 translate-y-0"
+              leave-to-class="opacity-0 scale-95 -translate-y-1"
+            >
+              <div
+                v-if="modelDropdownOpen"
+                class="absolute left-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
+              >
+                <button
+                  v-for="opt in modelOptions"
+                  :key="opt.value"
+                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
+                  :class="modelFilter === opt.value ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'"
+                  @click="modelFilter = opt.value; modelDropdownOpen = false"
+                >
+                  {{ opt.label }}
+                </button>
+              </div>
+            </Transition>
+          </div>
+
+          <!-- Status Filter Dropdown -->
+          <div ref="statusDropdownRef" class="relative">
+            <button
+              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
+              @click="statusDropdownOpen = !statusDropdownOpen"
+            >
+              <UIcon name="i-lucide-filter" class="w-4 h-4 text-gray-400" />
+              <span class="font-medium">{{ statusOptions.find(o => o.value === statusFilter)?.label || '全部状态' }}</span>
+              <UIcon
+                name="i-lucide-chevron-down"
+                class="w-4 h-4 text-gray-400 transition-transform duration-200"
+                :class="statusDropdownOpen ? 'rotate-180' : ''"
+              />
+            </button>
+            <Transition
+              enter-active-class="transition duration-150 ease-out"
+              enter-from-class="opacity-0 scale-95 -translate-y-1"
+              enter-to-class="opacity-100 scale-100 translate-y-0"
+              leave-active-class="transition duration-100 ease-in"
+              leave-from-class="opacity-100 scale-100 translate-y-0"
+              leave-to-class="opacity-0 scale-95 -translate-y-1"
+            >
+              <div
+                v-if="statusDropdownOpen"
+                class="absolute left-0 mt-2 w-40 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
+              >
+                <button
+                  v-for="opt in statusOptions"
+                  :key="opt.value"
+                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
+                  :class="statusFilter === opt.value ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'"
+                  @click="statusFilter = opt.value; statusDropdownOpen = false"
+                >
+                  {{ opt.label }}
+                </button>
+              </div>
+            </Transition>
+          </div>
+
+          <!-- Spacer -->
+          <div class="flex-1" />
+
+          <!-- Export Buttons -->
+          <button
+            class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
+            @click="exportCSV"
+          >
+            <UIcon name="i-lucide-download" class="w-4 h-4" />
+            导出 CSV
+          </button>
+          <button
+            class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
+            @click="exportJSON"
+          >
+            <UIcon name="i-lucide-file-json" class="w-4 h-4" />
+            导出 JSON
+          </button>
+        </div>
+
+        <!-- Call Volume Trend Chart -->
+        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
+          <div class="flex items-center justify-between mb-5">
+            <div>
+              <h3 class="font-semibold text-gray-900">调用量趋势</h3>
+              <p class="text-xs text-gray-400 mt-0.5">个人API调用统计</p>
+            </div>
+            <div class="flex items-center gap-2">
+              <!-- Aggregation toggle -->
+              <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
+                <button
+                  class="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
+                  :class="aggregation === 'hour'
+                    ? 'bg-white text-gray-900 shadow-sm'
+                    : 'text-gray-500 hover:text-gray-700'"
+                  @click="aggregation = 'hour'"
+                >
+                  按小时
+                </button>
+                <button
+                  class="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
+                  :class="aggregation === 'day'
+                    ? 'bg-white text-gray-900 shadow-sm'
+                    : 'text-gray-500 hover:text-gray-700'"
+                  @click="aggregation = 'day'"
+                >
+                  按天
+                </button>
+              </div>
+            </div>
+          </div>
+          <ChartsBaseChart :option="trendChartOption" height="220px" />
+        </div>
+
+        <!-- Status Code Distribution -->
+        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
+          <div class="flex items-center justify-between mb-5">
+            <div>
+              <h3 class="font-semibold text-gray-900">状态码分布</h3>
+              <p class="text-xs text-gray-400 mt-0.5">点击扇区可筛选对应状态码</p>
+            </div>
+          </div>
+          <ChartsBaseChart
+            :option="statusDistChartOption"
+            height="220px"
+            @drilldown="onStatusDistDrilldown"
+          />
+        </div>
+
+        <!-- Log List Table -->
+        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
+          <!-- Table Header -->
+          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
+            <div>
+              <h3 class="font-semibold text-gray-900">调用记录</h3>
+              <p class="text-xs text-gray-400 mt-0.5">共 {{ filteredLogs.length }} 条记录</p>
+            </div>
+          </div>
+
+          <!-- Table -->
+          <table class="w-full">
+            <thead>
+              <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
+                <th class="text-left py-3 px-6 font-medium">时间</th>
+                <th class="text-left py-3 px-4 font-medium">模型</th>
+                <th class="text-left py-3 px-4 font-medium">API Key</th>
+                <th class="text-left py-3 px-4 font-medium">状态码</th>
+                <th class="text-left py-3 px-4 font-medium">延迟</th>
+                <th class="text-left py-3 px-4 font-medium">Token</th>
+                <th class="text-left py-3 px-4 font-medium">费用</th>
+              </tr>
+            </thead>
+            <tbody>
+              <template v-for="log in paginatedLogs" :key="log.id">
+                <!-- Main Row -->
+                <tr
+                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
+                  @click="toggleExpand(log.id)"
+                >
+                  <td class="py-3 px-6 text-xs font-mono text-gray-500">{{ log.timestamp }}</td>
+                  <td class="py-3 px-4 text-sm text-gray-900 font-medium">{{ log.modelName }}</td>
+                  <td class="py-3 px-4 text-xs font-mono text-gray-500">{{ log.apiKey }}</td>
+                  <td class="py-3 px-4">
+                    <span
+                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium"
+                      :class="[getStatusBadge(log.status).bg, getStatusBadge(log.status).text]"
+                    >
+                      {{ getStatusBadge(log.status).label }}
+                    </span>
+                  </td>
+                  <td class="py-3 px-4 text-xs font-mono text-gray-500">{{ log.latency }}ms</td>
+                  <td class="py-3 px-4 text-xs font-mono text-gray-500">{{ log.totalTokens.toLocaleString() }}</td>
+                  <td class="py-3 px-4 text-xs font-mono text-gray-900 font-medium">¥{{ formatCost(log.cost) }}</td>
+                </tr>
+                <!-- Expanded Detail Row -->
+                <tr v-if="expandedRow === log.id">
+                  <td colspan="7" class="px-6 py-4 bg-gray-50/30">
+                    <div class="grid grid-cols-3 gap-6 text-sm">
+                      <!-- Request ID -->
+                      <div>
+                        <p class="text-xs text-gray-400 mb-1">Request ID</p>
+                        <p class="font-mono text-xs text-gray-700">{{ log.requestId }}</p>
+                      </div>
+                      <!-- Token Breakdown -->
+                      <div>
+                        <p class="text-xs text-gray-400 mb-1">Token 明细</p>
+                        <div class="flex items-center gap-3 text-xs">
+                          <span class="text-gray-600">输入: <span class="font-mono">{{ log.promptTokens.toLocaleString() }}</span></span>
+                          <span class="text-gray-300">|</span>
+                          <span class="text-gray-600">输出: <span class="font-mono">{{ log.completionTokens.toLocaleString() }}</span></span>
+                          <span class="text-gray-300">|</span>
+                          <span class="text-gray-600">合计: <span class="font-mono font-medium">{{ log.totalTokens.toLocaleString() }}</span></span>
+                        </div>
+                      </div>
+                      <!-- Error Message -->
+                      <div v-if="log.errorMessage">
+                        <p class="text-xs text-gray-400 mb-1">错误信息</p>
+                        <p class="text-xs text-red-600">{{ log.errorMessage }}</p>
+                      </div>
+                    </div>
+                    <!-- Request/Response Preview -->
+                    <div class="mt-4 grid grid-cols-2 gap-4">
+                      <div>
+                        <p class="text-xs text-gray-400 mb-1.5">请求预览</p>
+                        <div class="bg-gray-900 rounded-lg p-3 text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
+                          <span class="text-blue-400">POST</span> /v1/{{ log.model }}/completions<br>
+                          <span class="text-gray-500">Authorization:</span> Bearer {{ log.apiKey }}<br>
+                          <span class="text-gray-500">Content-Type:</span> application/json<br>
+                          <br>
+                          {<br>
+                          &nbsp;&nbsp;<span class="text-green-400">"model"</span>: <span class="text-amber-300">"{{ log.model }}"</span>,<br>
+                          &nbsp;&nbsp;<span class="text-green-400">"prompt"</span>: <span class="text-amber-300">"..."</span>,<br>
+                          &nbsp;&nbsp;<span class="text-green-400">"max_tokens"</span>: <span class="text-purple-400">{{ log.completionTokens || 1024 }}</span><br>
+                          }
+                        </div>
+                      </div>
+                      <div>
+                        <p class="text-xs text-gray-400 mb-1.5">响应预览</p>
+                        <div
+                          class="bg-gray-900 rounded-lg p-3 text-xs font-mono leading-relaxed overflow-x-auto"
+                          :class="log.status === 200 ? 'text-gray-300' : 'text-red-400'"
+                        >
+                          <template v-if="log.status === 200">
+                            {<br>
+                            &nbsp;&nbsp;<span class="text-green-400">"id"</span>: <span class="text-amber-300">"{{ log.requestId }}"</span>,<br>
+                            &nbsp;&nbsp;<span class="text-green-400">"status"</span>: <span class="text-purple-400">200</span>,<br>
+                            &nbsp;&nbsp;<span class="text-green-400">"usage"</span>: {<br>
+                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"prompt_tokens"</span>: <span class="text-purple-400">{{ log.promptTokens }}</span>,<br>
+                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"completion_tokens"</span>: <span class="text-purple-400">{{ log.completionTokens }}</span><br>
+                            &nbsp;&nbsp;}<br>
+                            }
+                          </template>
+                          <template v-else>
+                            {<br>
+                            &nbsp;&nbsp;<span class="text-green-400">"error"</span>: {<br>
+                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"code"</span>: <span class="text-purple-400">{{ log.status }}</span>,<br>
+                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-green-400">"message"</span>: <span class="text-amber-300">"{{ log.errorMessage }}"</span><br>
+                            &nbsp;&nbsp;}<br>
+                            }
+                          </template>
+                        </div>
+                      </div>
+                    </div>
+                  </td>
+                </tr>
+              </template>
+              <!-- Empty State -->
+              <tr v-if="paginatedLogs.length === 0">
+                <td colspan="7" class="py-16 text-center">
+                  <UIcon name="i-lucide-inbox" class="w-10 h-10 text-gray-200 mx-auto mb-3" />
+                  <p class="text-sm text-gray-400">暂无调用记录</p>
+                  <p class="text-xs text-gray-300 mt-1">尝试调整筛选条件</p>
+                </td>
+              </tr>
+            </tbody>
+          </table>
+
+          <!-- Pagination -->
+          <div v-if="filteredLogs.length > pageSize" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
+            <p class="text-xs text-gray-400">
+              第 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredLogs.length) }} 条，共 {{ filteredLogs.length }} 条
+            </p>
+            <div class="flex items-center gap-1">
+              <button
+                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
+                :class="currentPage === 1
+                  ? 'text-gray-300 cursor-not-allowed'
+                  : 'text-gray-600 hover:bg-gray-100'"
+                :disabled="currentPage === 1"
+                @click="currentPage--"
+              >
+                <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
+              </button>
+              <button
+                v-for="page in totalPages"
+                :key="page"
+                class="w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200"
+                :class="currentPage === page
+                  ? 'bg-primary-600 text-white'
+                  : 'text-gray-600 hover:bg-gray-100'"
+                @click="currentPage = page"
+              >
+                {{ page }}
+              </button>
+              <button
+                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
+                :class="currentPage === totalPages
+                  ? 'text-gray-300 cursor-not-allowed'
+                  : 'text-gray-600 hover:bg-gray-100'"
+                :disabled="currentPage === totalPages"
+                @click="currentPage++"
+              >
+                <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
+              </button>
+            </div>
+          </div>
+        </div>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/pages/console/stats/index.vue b/app/pages/console/stats/index.vue
index bb49968..fe7f67c 100644
--- a/app/pages/console/stats/index.vue
+++ b/app/pages/console/stats/index.vue
@@ -1,6 +1,12 @@
 <script setup lang="ts">
+import { useChartTheme } from '~/composables/useChartTheme'
+
+useHead({ title: '调用统计 - 奇安信AI开放平台' })
+
+const theme = useChartTheme()
+
 const dateRange = ref('7d')
 const dateRanges = [
   { value: 'today', label: '今日' },
   { value: '7d', label: '7天' },
   { value: '30d', label: '30天' },
@@ -15,12 +21,10 @@ const dailyData = [
   { date: '07/09', calls: 3890, errors: 18 },
   { date: '07/10', calls: 4650, errors: 9 },
   { date: '07/11', calls: 2294, errors: 5 }
 ]
 
-const maxDailyCalls = Math.max(...dailyData.map(d => d.calls))
-
 const modelBreakdown = [
   { name: '奇安信安全大模型', calls: 12840, tokens: 5240000, cost: '¥478.32', percentage: 45 },
   { name: '威胁检测模型 V3', calls: 8650, tokens: 2890000, cost: '¥216.75', percentage: 30 },
   { name: '代码安全扫描模型', calls: 5200, tokens: 1780000, cost: '¥142.40', percentage: 18 },
   { name: '漏洞分析专家', calls: 2400, tokens: 960000, cost: '¥57.60', percentage: 8 },
@@ -37,10 +41,198 @@ const errorLog = [
 ]
 
 const totalCalls = computed(() => dailyData.reduce((sum, d) => sum + d.calls, 0))
 const totalErrors = computed(() => dailyData.reduce((sum, d) => sum + d.errors, 0))
 const successRate = computed(() => ((1 - totalErrors.value / totalCalls.value) * 100).toFixed(2))
+
+// --- ECharts options ---
+
+// 1. Dual-Y Line Chart - Call Trend (calls on left, errors on right)
+const callTrendChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'axis',
+    axisPointer: { type: 'cross' }
+  },
+  legend: {
+    data: ['调用量', '错误数'],
+    bottom: 0,
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 12,
+    itemHeight: 8
+  },
+  grid: { left: 60, right: 60, top: 20, bottom: 40 },
+  xAxis: {
+    type: 'category',
+    data: dailyData.map(d => d.date),
+    axisLabel: { fontSize: 11, color: '#9CA3AF' },
+    axisLine: { lineStyle: { color: '#E5E7EB' } },
+    axisTick: { show: false }
+  },
+  yAxis: [
+    {
+      type: 'value',
+      name: '调用量',
+      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
+      axisLabel: { fontSize: 10, color: '#9CA3AF' },
+      splitLine: { lineStyle: { color: '#F3F4F6' } },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    },
+    {
+      type: 'value',
+      name: '错误数',
+      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
+      axisLabel: { fontSize: 10, color: '#9CA3AF' },
+      splitLine: { show: false },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    }
+  ],
+  series: [
+    {
+      name: '调用量',
+      type: 'line',
+      smooth: true,
+      symbol: 'circle',
+      symbolSize: 6,
+      lineStyle: { width: 2, color: '#7C3AED' },
+      itemStyle: { color: '#7C3AED' },
+      areaStyle: {
+        color: {
+          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
+          colorStops: [
+            { offset: 0, color: 'rgba(124, 58, 237, 0.2)' },
+            { offset: 1, color: 'rgba(124, 58, 237, 0.02)' }
+          ]
+        }
+      },
+      data: dailyData.map(d => d.calls)
+    },
+    {
+      name: '错误数',
+      type: 'line',
+      yAxisIndex: 1,
+      smooth: true,
+      symbol: 'circle',
+      symbolSize: 6,
+      lineStyle: { width: 2, color: '#EF4444' },
+      itemStyle: { color: '#EF4444' },
+      data: dailyData.map(d => d.errors)
+    }
+  ]
+}))
+
+// 2. Doughnut Chart - Token Distribution
+const tokenDistChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'item',
+    formatter: '{b}<br/>Token: {c} ({d}%)'
+  },
+  legend: {
+    orient: 'vertical',
+    right: 10,
+    top: 'center',
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 10,
+    itemHeight: 10,
+    itemGap: 10
+  },
+  series: [{
+    name: 'Token分布',
+    type: 'pie',
+    radius: ['40%', '70%'],
+    center: ['35%', '50%'],
+    avoidLabelOverlap: false,
+    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
+    label: { show: false },
+    emphasis: {
+      label: { show: true, fontSize: 14, fontWeight: 'bold' },
+      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
+    },
+    data: modelBreakdown.map(m => ({
+      name: m.name,
+      value: m.tokens
+    }))
+  }]
+}))
+
+// 3. Latency Line Chart - P50/P95/P99
+const latencyData = {
+  times: ['07/05', '07/06', '07/07', '07/08', '07/09', '07/10', '07/11'],
+  p50: [180, 165, 195, 210, 188, 175, 160],
+  p95: [420, 380, 450, 490, 410, 395, 370],
+  p99: [780, 720, 830, 890, 760, 730, 680]
+}
+
+const latencyChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'axis',
+    formatter: (params: any) => {
+      let s = params[0].axisValue + '<br/>'
+      params.forEach((p: any) => {
+        s += `${p.marker} ${p.seriesName}: ${p.value}ms<br/>`
+      })
+      return s
+    }
+  },
+  legend: {
+    data: ['P50', 'P95', 'P99'],
+    bottom: 0,
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 12,
+    itemHeight: 8
+  },
+  grid: { left: 60, right: 20, top: 20, bottom: 40 },
+  xAxis: {
+    type: 'category',
+    data: latencyData.times,
+    axisLabel: { fontSize: 11, color: '#9CA3AF' },
+    axisLine: { lineStyle: { color: '#E5E7EB' } },
+    axisTick: { show: false }
+  },
+  yAxis: {
+    type: 'value',
+    name: '延迟(ms)',
+    nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
+    axisLabel: { fontSize: 10, color: '#9CA3AF', formatter: '{value}ms' },
+    splitLine: { lineStyle: { color: '#F3F4F6' } },
+    axisLine: { show: false },
+    axisTick: { show: false }
+  },
+  series: [
+    {
+      name: 'P50',
+      type: 'line',
+      smooth: true,
+      symbol: 'circle',
+      symbolSize: 6,
+      lineStyle: { width: 2, color: '#10B981' },
+      itemStyle: { color: '#10B981' },
+      data: latencyData.p50
+    },
+    {
+      name: 'P95',
+      type: 'line',
+      smooth: true,
+      symbol: 'circle',
+      symbolSize: 6,
+      lineStyle: { width: 2, color: '#F59E0B' },
+      itemStyle: { color: '#F59E0B' },
+      data: latencyData.p95
+    },
+    {
+      name: 'P99',
+      type: 'line',
+      smooth: true,
+      symbol: 'circle',
+      symbolSize: 6,
+      lineStyle: { width: 2, color: '#EF4444' },
+      itemStyle: { color: '#EF4444' },
+      data: latencyData.p99
+    }
+  ]
+}))
 </script>
 
 <template>
   <div>
     <ConsoleSidebar />
@@ -112,51 +304,47 @@ const successRate = computed(() => ((1 - totalErrors.value / totalCalls.value) *
             <div class="h-full bg-blue-500 rounded-full" style="width: 35%" />
           </div>
         </div>
       </div>
 
-      <!-- Daily Chart -->
+      <!-- Call Trend Chart (Dual-Y) -->
       <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
-        <div class="flex items-center justify-between mb-6">
+        <div class="flex items-center justify-between mb-5">
           <div>
             <h3 class="font-semibold text-gray-900">每日调用量</h3>
             <p class="text-xs text-gray-400 mt-0.5">过去7天的API调用统计</p>
           </div>
-          <div class="flex items-center gap-4 text-xs text-gray-400">
-            <span class="flex items-center gap-1.5">
-              <span class="w-2.5 h-2.5 rounded-sm bg-primary-500" />
-              调用量
-            </span>
-            <span class="flex items-center gap-1.5">
-              <span class="w-2.5 h-2.5 rounded-sm bg-red-400" />
-              错误数
-            </span>
+        </div>
+        <ChartsBaseChart :option="callTrendChartOption" height="280px" />
+      </div>
+
+      <!-- Two-column: Token Distribution + Latency -->
+      <div class="grid grid-cols-2 gap-6 mb-6">
+        <!-- Token Distribution Doughnut -->
+        <div class="bg-white rounded-xl border border-gray-100 p-6">
+          <div class="flex items-center justify-between mb-5">
+            <div>
+              <h3 class="font-semibold text-gray-900">Token消耗分布</h3>
+              <p class="text-xs text-gray-400 mt-0.5">各模型Token消耗占比</p>
+            </div>
           </div>
+          <ChartsBaseChart :option="tokenDistChartOption" height="280px" />
         </div>
-        <div class="flex items-end gap-4 h-44">
-          <div
-            v-for="item in dailyData"
-            :key="item.date"
-            class="flex-1 flex flex-col items-center gap-2"
-          >
-            <span class="text-xs font-mono text-gray-500">{{ item.calls.toLocaleString() }}</span>
-            <div class="w-full relative">
-              <div
-                class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400"
-                :style="{ height: `${(item.calls / maxDailyCalls) * 140}px` }"
-              />
-              <div
-                class="absolute bottom-0 w-full rounded-t-sm bg-red-400/60"
-                :style="{ height: `${Math.max((item.errors / maxDailyCalls) * 140, 2)}px` }"
-              />
+
+        <!-- Latency Line Chart -->
+        <div class="bg-white rounded-xl border border-gray-100 p-6">
+          <div class="flex items-center justify-between mb-5">
+            <div>
+              <h3 class="font-semibold text-gray-900">延迟分布</h3>
+              <p class="text-xs text-gray-400 mt-0.5">P50 / P95 / P99 延迟趋势</p>
             </div>
-            <span class="text-xs text-gray-400">{{ item.date }}</span>
           </div>
+          <ChartsBaseChart :option="latencyChartOption" height="280px" />
         </div>
       </div>
 
-      <!-- Model Breakdown -->
+      <!-- Model Breakdown Table -->
       <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
         <div class="flex items-center justify-between mb-5">
           <div>
             <h3 class="font-semibold text-gray-900">模型调用分布</h3>
             <p class="text-xs text-gray-400 mt-0.5">各模型的调用次数、Token消耗与费用</p>
diff --git a/app/pages/enterprise/billing.vue b/app/pages/enterprise/billing.vue
index 84c7d6d..534d3ea 100644
--- a/app/pages/enterprise/billing.vue
+++ b/app/pages/enterprise/billing.vue
@@ -1,29 +1,30 @@
 <script setup lang="ts">
 import { billingRecords, members, organization } from '~/data/mock'
+import { useChartTheme } from '~/composables/useChartTheme'
 
 useHead({ title: '企业账单 - 奇安信AI开放平台' })
 
+const theme = useChartTheme()
+
 // Summary calculations
-const currentMonth = billingRecords[0]
-const lastMonth = billingRecords[1]
+const currentMonth = billingRecords[0]!
+const lastMonth = billingRecords[1]!
 const monthOverMonth = computed(() => {
-  if (lastMonth.amount === 0) return 0
+  if (!lastMonth || lastMonth.amount === 0) return 0
   return Number(((currentMonth.amount - lastMonth.amount) / lastMonth.amount * 100).toFixed(1))
 })
 
-// Monthly trend data for bar chart
+// Monthly trend data for bar+line combo chart
 const monthlyTrend = computed(() =>
   billingRecords.slice().reverse().map(r => ({
     month: r.month.replace('2026年', '').replace('月', '') + '月',
     amount: r.amount,
     tokens: r.tokens
   }))
 )
 
-const maxAmount = computed(() => Math.max(...monthlyTrend.value.map(m => m.amount)))
-
 // Enterprise member cost distribution
 const memberCostDistribution = computed(() => {
   const activeMembers = members.filter(m => m.monthlyCost > 0)
   const totalCost = activeMembers.reduce((sum, m) => sum + m.monthlyCost, 0)
   const namedMembers = activeMembers
@@ -41,10 +42,130 @@ const memberCostDistribution = computed(() => {
     namedMembers.push({ name: '其他', cost: otherCost, percent: otherPercent })
   }
   return { members: namedMembers, totalCost }
 })
 
+// --- ECharts options ---
+
+// 1. Bar+Line Combo Chart - Monthly Spending Trend
+const monthlyTrendChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'axis',
+    axisPointer: { type: 'cross' }
+  },
+  legend: {
+    data: ['消费金额', 'Token消耗'],
+    bottom: 0,
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 12,
+    itemHeight: 8
+  },
+  grid: { left: 70, right: 70, top: 20, bottom: 40 },
+  xAxis: {
+    type: 'category',
+    data: monthlyTrend.value.map(m => m.month),
+    axisLabel: { fontSize: 11, color: '#9CA3AF' },
+    axisLine: { lineStyle: { color: '#E5E7EB' } },
+    axisTick: { show: false }
+  },
+  yAxis: [
+    {
+      type: 'value',
+      name: '金额(¥)',
+      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
+      axisLabel: { fontSize: 10, color: '#9CA3AF', formatter: '¥{value}' },
+      splitLine: { lineStyle: { color: '#F3F4F6' } },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    },
+    {
+      type: 'value',
+      name: 'Token',
+      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
+      axisLabel: {
+        fontSize: 10,
+        color: '#9CA3AF',
+        formatter: (val: number) => {
+          if (val >= 10000000) return (val / 10000000).toFixed(0) + '千万'
+          if (val >= 10000) return (val / 10000).toFixed(0) + '万'
+          return String(val)
+        }
+      },
+      splitLine: { show: false },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    }
+  ],
+  series: [
+    {
+      name: '消费金额',
+      type: 'bar',
+      barWidth: 24,
+      itemStyle: {
+        borderRadius: [4, 4, 0, 0],
+        color: {
+          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
+          colorStops: [
+            { offset: 0, color: '#7C3AED' },
+            { offset: 1, color: '#A78BFA' }
+          ]
+        }
+      },
+      data: monthlyTrend.value.map(m => m.amount)
+    },
+    {
+      name: 'Token消耗',
+      type: 'line',
+      yAxisIndex: 1,
+      smooth: true,
+      symbol: 'circle',
+      symbolSize: 6,
+      lineStyle: { width: 2, color: '#F59E0B' },
+      itemStyle: { color: '#F59E0B' },
+      data: monthlyTrend.value.map(m => m.tokens)
+    }
+  ]
+}))
+
+// 2. Doughnut Chart - Member Cost Distribution
+const memberCostChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'item',
+    formatter: '{b}: ¥{c} ({d}%)'
+  },
+  legend: {
+    orient: 'vertical',
+    right: 10,
+    top: 'center',
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 10,
+    itemHeight: 10,
+    itemGap: 10,
+    formatter: (name: string) => {
+      const m = memberCostDistribution.value.members.find(m => m.name === name)
+      return m ? `${name}  ¥${m.cost.toLocaleString()}` : name
+    }
+  },
+  series: [{
+    name: '成员消耗分布',
+    type: 'pie',
+    radius: ['40%', '70%'],
+    center: ['35%', '50%'],
+    avoidLabelOverlap: false,
+    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
+    label: { show: false },
+    emphasis: {
+      label: { show: true, fontSize: 14, fontWeight: 'bold' },
+      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
+    },
+    data: memberCostDistribution.value.members.map(m => ({
+      name: m.name,
+      value: m.cost
+    }))
+  }]
+}))
+
 // Recharge records
 const rechargeRecords = [
   { id: 'rc-1', time: '2026-07-01 09:30:22', type: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
   { id: 'rc-2', time: '2026-06-15 14:22:10', type: '企业包', tokens: '2000万Token', amount: '¥1,499', status: 'success' as const },
   { id: 'rc-3', time: '2026-05-20 11:08:33', type: '体验包', tokens: '100万Token', amount: '¥99', status: 'success' as const },
@@ -116,62 +237,20 @@ function formatTokens(tokens: number) {
           </div>
           <p class="text-xs text-gray-400 mt-2">较上月增长</p>
         </div>
       </div>
 
-      <!-- Monthly Spending Trend -->
+      <!-- Monthly Spending Trend Chart -->
       <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
         <h3 class="text-sm font-semibold text-gray-900 mb-5">月度消费趋势</h3>
-        <div class="flex items-end gap-3 h-48">
-          <div
-            v-for="(item, idx) in monthlyTrend"
-            :key="idx"
-            class="flex-1 flex flex-col items-center justify-end h-full"
-          >
-            <p class="text-xs font-semibold text-gray-700 mb-2">&yen;{{ formatAmount(item.amount) }}</p>
-            <div
-              class="w-full rounded-t-lg transition-all duration-300"
-              :class="idx === monthlyTrend.length - 1 ? 'bg-gradient-to-t from-primary-600 to-primary-400' : 'bg-gradient-to-t from-primary-300 to-primary-100'"
-              :style="{
-                height: (item.amount / maxAmount * 100) + '%',
-                minHeight: '16px'
-              }"
-            />
-            <p class="text-xs text-gray-400 mt-2">{{ item.month }}</p>
-          </div>
-        </div>
+        <ChartsBaseChart :option="monthlyTrendChartOption" height="280px" />
       </div>
 
-      <!-- Member Cost Distribution -->
+      <!-- Member Cost Distribution Doughnut -->
       <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
         <h3 class="text-sm font-semibold text-gray-900 mb-5">成员消耗分布</h3>
-        <div class="space-y-4">
-          <div
-            v-for="member in memberCostDistribution.members"
-            :key="member.name"
-            class="flex items-center gap-4"
-          >
-            <span class="text-sm text-gray-700 w-12 shrink-0 font-medium">{{ member.name }}</span>
-            <div class="flex-1 bg-gray-50 rounded-full h-7 overflow-hidden relative">
-              <div
-                class="h-full rounded-full transition-all duration-500 flex items-center px-3"
-                :style="{ width: member.percent + '%' }"
-                :class="member.name === '其他' ? 'bg-gray-300' : 'bg-gradient-to-r from-primary-600 to-primary-400'"
-              >
-                <span v-if="member.percent >= 15" class="text-xs text-white font-medium">{{ member.percent }}%</span>
-              </div>
-              <span
-                v-if="member.percent < 15"
-                class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium"
-                :style="{ left: member.percent + 2 + '%' }"
-              >
-                {{ member.percent }}%
-              </span>
-            </div>
-            <span class="text-xs text-gray-400 w-16 shrink-0 text-right">&yen;{{ formatAmount(member.cost) }}</span>
-          </div>
-        </div>
+        <ChartsBaseChart :option="memberCostChartOption" height="280px" />
       </div>
 
       <!-- Billing Table -->
       <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
         <div class="px-5 py-4 border-b border-gray-100">
diff --git a/app/pages/enterprise/index.vue b/app/pages/enterprise/index.vue
index f349877..5d2d0df 100644
--- a/app/pages/enterprise/index.vue
+++ b/app/pages/enterprise/index.vue
@@ -1,19 +1,85 @@
 <script setup lang="ts">
 import { organization, members, currentUser } from '~/data/mock'
+import { useChartTheme } from '~/composables/useChartTheme'
 
 useHead({ title: '企业概览 - 奇安信AI开放平台' })
 
+const theme = useChartTheme()
+
 const previewMembers = members.slice(0, 5)
 
 const activeMembers = members.filter(m => m.status === 'active').length
 const pendingMembers = members.filter(m => m.status === 'pending').length
 
 function getInitials(name: string): string {
   return name.slice(0, 1)
 }
 
+// 7-day call trend data for enterprise
+const callTrendData = [
+  { date: '07/05', calls: 6800 },
+  { date: '07/06', calls: 5960 },
+  { date: '07/07', calls: 7350 },
+  { date: '07/08', calls: 8640 },
+  { date: '07/09', calls: 8120 },
+  { date: '07/10', calls: 9750 },
+  { date: '07/11', calls: 4724 }
+]
+
+// --- ECharts option ---
+
+// Area Line Chart - 7-day Call Trend
+const callTrendChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'axis',
+    formatter: (params: any) => {
+      const p = params[0]
+      return `${p.axisValue}<br/>${p.marker} 调用量: ${p.value.toLocaleString()} 次`
+    }
+  },
+  grid: { left: 60, right: 20, top: 20, bottom: 30 },
+  xAxis: {
+    type: 'category',
+    boundaryGap: false,
+    data: callTrendData.map(d => d.date),
+    axisLabel: { fontSize: 11, color: '#9CA3AF' },
+    axisLine: { lineStyle: { color: '#E5E7EB' } },
+    axisTick: { show: false }
+  },
+  yAxis: {
+    type: 'value',
+    axisLabel: {
+      fontSize: 10,
+      color: '#9CA3AF',
+      formatter: (val: number) => val >= 10000 ? (val / 10000).toFixed(1) + '万' : String(val)
+    },
+    splitLine: { lineStyle: { color: '#F3F4F6' } },
+    axisLine: { show: false },
+    axisTick: { show: false }
+  },
+  series: [{
+    name: '调用量',
+    type: 'line',
+    smooth: true,
+    symbol: 'circle',
+    symbolSize: 6,
+    lineStyle: { width: 2, color: '#7C3AED' },
+    itemStyle: { color: '#7C3AED' },
+    areaStyle: {
+      color: {
+        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
+        colorStops: [
+          { offset: 0, color: 'rgba(124, 58, 237, 0.25)' },
+          { offset: 1, color: 'rgba(124, 58, 237, 0.02)' }
+        ]
+      }
+    },
+    data: callTrendData.map(d => d.calls)
+  }]
+}))
+
 // Alerts (same data as console dashboard)
 const alerts = [
   { id: 1, severity: 'red' as const, icon: 'i-lucide-alert-circle', message: '合规卫士接口返回500错误', time: '5分钟前' },
   { id: 2, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '安全大模型触发频率限制(429)', time: '23分钟前' },
   { id: 3, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '威胁检测模型请求频率超限', time: '1小时前' }
@@ -145,10 +211,21 @@ const quickActions = [
             <span class="text-2xl font-bold text-gray-900 font-mono">&yen;{{ organization.monthlyCost.toLocaleString() }}</span>
           </div>
         </div>
       </div>
 
+      <!-- 7-day Call Trend Chart -->
+      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
+        <div class="flex items-center justify-between mb-5">
+          <div>
+            <h3 class="font-semibold text-gray-900">调用趋势</h3>
+            <p class="text-xs text-gray-400 mt-0.5">近7天企业API调用量统计</p>
+          </div>
+        </div>
+        <ChartsBaseChart :option="callTrendChartOption" height="220px" />
+      </div>
+
       <!-- Quick Actions -->
       <div class="grid grid-cols-4 gap-4 mb-6">
         <NuxtLink
           v-for="action in quickActions"
           :key="action.to"
diff --git a/app/pages/enterprise/logs.vue b/app/pages/enterprise/logs.vue
index 187096c..bfb7ea6 100644
--- a/app/pages/enterprise/logs.vue
+++ b/app/pages/enterprise/logs.vue
@@ -1,11 +1,15 @@
 <script setup lang="ts">
 import { callLogs, models, members } from '~/data/mock'
 import type { CallLog } from '~/data/mock'
+import { useChartTheme } from '~/composables/useChartTheme'
 
 useHead({ title: '日志审计 - 奇安信AI开放平台' })
 
+const theme = useChartTheme()
+const route = useRoute()
+
 // --- Search & Filter State ---
 const searchQuery = ref('')
 const filterTimeRange = ref('today')
 const filterModel = ref('all')
 const filterMember = ref('all')
@@ -15,10 +19,20 @@ const currentPage = ref(1)
 const pageSize = 20
 const expandedRowId = ref<string | null>(null)
 const toastMessage = ref('')
 const toastVisible = ref(false)
 
+// Handle query params from drilldown (e.g., ?model=xxx&from=monitor)
+onMounted(() => {
+  if (route.query.model && typeof route.query.model === 'string') {
+    filterModel.value = route.query.model
+  }
+  if (route.query.member && typeof route.query.member === 'string') {
+    filterMember.value = route.query.member
+  }
+})
+
 // --- Filter Options ---
 const timeRangeOptions = [
   { value: 'today', label: '今天' },
   { value: '7d', label: '7天' },
   { value: '30d', label: '30天' },
@@ -126,15 +140,13 @@ watch([searchQuery, filterTimeRange, filterModel, filterMember, filterStatus], (
 
 // --- Trend Chart Data ---
 const trendData = computed(() => {
   const logs = filteredLogs.value
   if (trendAggregation.value === 'hour') {
-    // Group by hour
     const groups: Record<string, { total: number; s200: number; s429: number; s500: number }> = {}
     logs.forEach(log => {
-      const hour = log.timestamp.substring(0, 13) // '2026-07-12 14'
-      const label = log.timestamp.substring(11, 16) // '14:32'
+      const hour = log.timestamp.substring(0, 13)
       const key = hour
       if (!groups[key]) groups[key] = { total: 0, s200: 0, s429: 0, s500: 0 }
       groups[key].total++
       if (log.status === 200) groups[key].s200++
       else if (log.status === 429) groups[key].s429++
@@ -163,11 +175,10 @@ const trendData = computed(() => {
         label: key.substring(5),
         ...val
       }))
   }
   else {
-    // Week aggregation - just group all into one bar per week-ish
     const groups: Record<string, { total: number; s200: number; s429: number; s500: number }> = {}
     logs.forEach(log => {
       const day = log.timestamp.substring(0, 10)
       const d = new Date(day)
       const weekStart = new Date(d.getTime() - d.getDay() * 86400000)
@@ -185,15 +196,131 @@ const trendData = computed(() => {
         ...val
       }))
   }
 })
 
-const maxTrendValue = computed(() => {
-  if (trendData.value.length === 0) return 1
-  return Math.max(...trendData.value.map(d => d.total), 1)
+// --- Status distribution data ---
+const statusDistData = computed(() => {
+  const counts: Record<string, number> = { '2xx': 0, '4xx': 0, '5xx': 0 }
+  for (const log of filteredLogs.value) {
+    if (log.status >= 200 && log.status < 300) counts['2xx']!++
+    else if (log.status >= 400 && log.status < 500) counts['4xx']!++
+    else if (log.status >= 500) counts['5xx']!++
+  }
+  return counts
 })
 
+// --- ECharts options ---
+
+// 1. Area Chart - Call Volume Trend
+const trendChartOption = computed(() => {
+  if (trendData.value.length === 0) return {}
+  return {
+    tooltip: {
+      trigger: 'axis',
+      axisPointer: { type: 'cross' }
+    },
+    legend: {
+      data: ['200 成功', '429 限流', '500 错误'],
+      bottom: 0,
+      textStyle: { fontSize: 11, color: '#6B7280' },
+      itemWidth: 12,
+      itemHeight: 8
+    },
+    grid: { left: 50, right: 20, top: 20, bottom: 40 },
+    xAxis: {
+      type: 'category',
+      boundaryGap: false,
+      data: trendData.value.map(d => d.label),
+      axisLabel: { fontSize: 10, color: '#9CA3AF' },
+      axisLine: { lineStyle: { color: '#E5E7EB' } },
+      axisTick: { show: false }
+    },
+    yAxis: {
+      type: 'value',
+      axisLabel: { fontSize: 10, color: '#9CA3AF' },
+      splitLine: { lineStyle: { color: '#F3F4F6' } },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    },
+    series: [
+      {
+        name: '200 成功',
+        type: 'line',
+        stack: 'total',
+        smooth: true,
+        symbol: 'none',
+        lineStyle: { width: 1, color: '#10B981' },
+        itemStyle: { color: '#10B981' },
+        areaStyle: { opacity: 0.4 },
+        data: trendData.value.map(d => d.s200)
+      },
+      {
+        name: '429 限流',
+        type: 'line',
+        stack: 'total',
+        smooth: true,
+        symbol: 'none',
+        lineStyle: { width: 1, color: '#F59E0B' },
+        itemStyle: { color: '#F59E0B' },
+        areaStyle: { opacity: 0.4 },
+        data: trendData.value.map(d => d.s429)
+      },
+      {
+        name: '500 错误',
+        type: 'line',
+        stack: 'total',
+        smooth: true,
+        symbol: 'none',
+        lineStyle: { width: 1, color: '#EF4444' },
+        itemStyle: { color: '#EF4444' },
+        areaStyle: { opacity: 0.4 },
+        data: trendData.value.map(d => d.s500)
+      }
+    ]
+  }
+})
+
+// 2. Doughnut Chart - Status Code Distribution
+const statusDistChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'item',
+    formatter: '{b}: {c} ({d}%)'
+  },
+  legend: {
+    bottom: 0,
+    textStyle: { fontSize: 11, color: '#6B7280' },
+    itemWidth: 10,
+    itemHeight: 10
+  },
+  series: [{
+    name: '状态码分布',
+    type: 'pie',
+    radius: ['40%', '70%'],
+    center: ['50%', '45%'],
+    avoidLabelOverlap: false,
+    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
+    label: { show: false },
+    emphasis: {
+      label: { show: true, fontSize: 14, fontWeight: 'bold' },
+      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
+    },
+    data: [
+      { name: '2xx 成功', value: statusDistData.value['2xx'], itemStyle: { color: '#10B981' } },
+      { name: '4xx 客户端错误', value: statusDistData.value['4xx'], itemStyle: { color: '#F59E0B' } },
+      { name: '5xx 服务端错误', value: statusDistData.value['5xx'], itemStyle: { color: '#EF4444' } }
+    ]
+  }]
+}))
+
+// Drilldown: click status doughnut to filter
+function onStatusDistDrilldown(data: { chartType: string; field: string; value: any }) {
+  if (data.value === '2xx 成功') filterStatus.value = '200'
+  else if (data.value === '4xx 客户端错误') filterStatus.value = '400'
+  else if (data.value === '5xx 服务端错误') filterStatus.value = '500'
+}
+
 // --- Helper Functions ---
 function getStatusBadge(status: number) {
   if (status === 200) return 'bg-green-50 text-green-700'
   if (status === 400) return 'bg-amber-50 text-amber-700'
   if (status === 429) return 'bg-orange-50 text-orange-700'
@@ -206,11 +333,10 @@ function getLatencyColor(latency: number) {
   if (latency <= 500) return 'text-amber-600'
   return 'text-red-600'
 }
 
 function maskApiKey(key: string) {
-  // Already masked in mock data, but ensure full display for detail
   return key
 }
 
 function toggleRow(id: string) {
   expandedRowId.value = expandedRowId.value === id ? null : id
@@ -267,10 +393,15 @@ function getMockResponseBody(log: CallLog) {
       completion_tokens: log.completionTokens,
       total_tokens: log.totalTokens
     }
   }, null, 2)
 }
+
+// Format number with comma
+function formatNumber(n: number): string {
+  return n.toLocaleString()
+}
 </script>
 
 <template>
   <div>
     <EnterpriseSidebar />
@@ -372,60 +503,26 @@ function getMockResponseBody(log: CallLog) {
               >
                 {{ agg.label }}
               </button>
             </div>
           </div>
+          <ChartsBaseChart :option="trendChartOption" height="220px" />
+        </div>
 
-          <!-- Legend -->
-          <div class="flex items-center gap-5 mb-4 text-xs text-gray-400">
-            <span class="flex items-center gap-1.5">
-              <span class="w-2.5 h-2.5 rounded-sm bg-green-500" />
-              200 成功
-            </span>
-            <span class="flex items-center gap-1.5">
-              <span class="w-2.5 h-2.5 rounded-sm bg-amber-500" />
-              429 限流
-            </span>
-            <span class="flex items-center gap-1.5">
-              <span class="w-2.5 h-2.5 rounded-sm bg-red-500" />
-              500 错误
-            </span>
-          </div>
-
-          <!-- Bar Chart -->
-          <div v-if="trendData.length > 0" class="flex items-end gap-2 h-44">
-            <div
-              v-for="(item, idx) in trendData"
-              :key="idx"
-              class="flex-1 flex flex-col items-center gap-1.5 min-w-0"
-            >
-              <span class="text-xs font-mono text-gray-500 truncate w-full text-center">{{ item.total }}</span>
-              <div class="w-full flex flex-col justify-end" style="height: 140px;">
-                <!-- Stacked bar: 500 (red) on top, 429 (amber) middle, 200 (green) bottom -->
-                <div
-                  v-if="item.s500 > 0"
-                  class="w-full bg-red-500 rounded-t-sm"
-                  :style="{ height: `${Math.max((item.s500 / maxTrendValue) * 140, 3)}px` }"
-                />
-                <div
-                  v-if="item.s429 > 0"
-                  class="w-full bg-amber-500"
-                  :class="item.s500 === 0 ? 'rounded-t-sm' : ''"
-                  :style="{ height: `${Math.max((item.s429 / maxTrendValue) * 140, 3)}px` }"
-                />
-                <div
-                  class="w-full bg-green-500 rounded-b-sm"
-                  :class="item.s429 === 0 && item.s500 === 0 ? 'rounded-t-sm' : ''"
-                  :style="{ height: `${Math.max((item.s200 / maxTrendValue) * 140, item.s200 > 0 ? 3 : 0)}px` }"
-                />
-              </div>
-              <span class="text-xs text-gray-400 truncate w-full text-center">{{ item.label }}</span>
+        <!-- Status Code Distribution -->
+        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
+          <div class="flex items-center justify-between mb-5">
+            <div>
+              <h3 class="font-semibold text-gray-900">状态码分布</h3>
+              <p class="text-xs text-gray-400 mt-0.5">点击扇区可筛选对应状态码</p>
             </div>
           </div>
-          <div v-else class="flex items-center justify-center h-44 text-sm text-gray-400">
-            暂无数据
-          </div>
+          <ChartsBaseChart
+            :option="statusDistChartOption"
+            height="220px"
+            @drilldown="onStatusDistDrilldown"
+          />
         </div>
 
         <!-- Log List Table -->
         <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
           <div class="overflow-x-auto">
diff --git a/app/pages/enterprise/monitor.vue b/app/pages/enterprise/monitor.vue
index e1688e0..6dd8df2 100644
--- a/app/pages/enterprise/monitor.vue
+++ b/app/pages/enterprise/monitor.vue
@@ -1,10 +1,14 @@
 <script setup lang="ts">
 import { monitorMetrics, models, members } from '~/data/mock'
+import { useChartTheme } from '~/composables/useChartTheme'
 
 useHead({ title: '调用监控 - 奇安信AI开放平台' })
 
+const theme = useChartTheme()
+const router = useRouter()
+
 // Refresh rate selector
 const refreshRate = ref<'5s' | '30s' | '1min'>('30s')
 const refreshRates = [
   { value: '5s' as const, label: '5s' },
   { value: '30s' as const, label: '30s' },
@@ -39,71 +43,173 @@ function stopRefresh() {
 
 watch(refreshRate, () => startRefresh())
 onMounted(() => startRefresh())
 onUnmounted(() => stopRefresh)
 
-// Tooltip state for area chart
-const tooltipState = ref<{ show: boolean; x: number; y: number; time: string; calls: number; errors: number }>({
-  show: false, x: 0, y: 0, time: '', calls: 0, errors: 0
-})
-
-// Process realtime series data for stacked area chart
-const seriesData = computed(() => monitorMetrics.realtimeSeries)
-const maxCalls = computed(() => Math.max(...seriesData.value.map(d => d.calls)))
-
-// Model colors for the stacked area chart segments
-const modelColors = monitorMetrics.modelDistribution.map(m => m.color)
-const modelNames = monitorMetrics.modelDistribution.map(m => m.name)
+// --- ECharts options ---
 
-// For each time point, distribute calls across models proportionally
-const stackedData = computed(() => {
+// 1. Stacked Area Chart - Real-time Call Flow
+const realtimeChartOption = computed(() => {
+  const times = monitorMetrics.realtimeSeries.map(d => d.time)
   const totalModelCalls = monitorMetrics.modelDistribution.reduce((s, m) => s + m.calls, 0)
-  return seriesData.value.map(point => {
-    const segments: { color: string; name: string; height: number; value: number }[] = []
-    let remaining = point.calls
-    monitorMetrics.modelDistribution.forEach((model, idx) => {
+
+  const series = monitorMetrics.modelDistribution.map((model) => {
+    const data = monitorMetrics.realtimeSeries.map(point => {
       const proportion = model.calls / totalModelCalls
-      const value = idx === monitorMetrics.modelDistribution.length - 1
-        ? remaining
-        : Math.round(point.calls * proportion)
-      remaining -= value
-      segments.push({
-        color: model.color,
-        name: model.name,
-        height: (value / maxCalls.value) * 100,
-        value
-      })
+      return Math.round(point.calls * proportion)
     })
-    return { ...point, segments }
+    return {
+      name: model.name,
+      type: 'line',
+      stack: 'total',
+      areaStyle: { opacity: 0.6 },
+      emphasis: { focus: 'series' },
+      smooth: true,
+      symbol: 'none',
+      lineStyle: { width: 1 },
+      data
+    }
   })
-})
 
-// Donut chart data
-const donutData = computed(() => {
-  const total = monitorMetrics.modelDistribution.reduce((s, m) => s + m.calls, 0)
-  let cumulativePercent = 0
-  return monitorMetrics.modelDistribution.map(m => {
-    const percent = (m.calls / total) * 100
-    const start = cumulativePercent
-    cumulativePercent += percent
-    return { ...m, percent, startPercent: start }
-  })
-})
-const donutGradient = computed(() => {
-  return donutData.value
-    .map(d => `${d.color} ${d.startPercent}% ${d.startPercent + d.percent}%`)
-    .join(', ')
+  return {
+    tooltip: {
+      trigger: 'axis',
+      axisPointer: { type: 'cross', label: { backgroundColor: '#6B7280' } }
+    },
+    legend: {
+      data: monitorMetrics.modelDistribution.map(m => m.name),
+      bottom: 0,
+      textStyle: { fontSize: 11, color: '#6B7280' },
+      itemWidth: 12,
+      itemHeight: 8
+    },
+    grid: { left: 50, right: 20, top: 10, bottom: 40 },
+    xAxis: {
+      type: 'category',
+      boundaryGap: false,
+      data: times,
+      axisLabel: { fontSize: 10, color: '#9CA3AF', interval: 9 },
+      axisLine: { lineStyle: { color: '#E5E7EB' } },
+      axisTick: { show: false }
+    },
+    yAxis: {
+      type: 'value',
+      axisLabel: { fontSize: 10, color: '#9CA3AF' },
+      splitLine: { lineStyle: { color: '#F3F4F6' } },
+      axisLine: { show: false },
+      axisTick: { show: false }
+    },
+    series
+  }
 })
 
-// Member ranking for bar chart (top 6)
-const memberBarData = computed(() => {
-  const maxCalls = Math.max(...monitorMetrics.memberRanking.map(m => m.calls))
-  return monitorMetrics.memberRanking.map(m => ({
-    ...m,
-    widthPercent: (m.calls / maxCalls) * 100
-  }))
-})
+// 2. Doughnut Chart - Model Distribution
+const modelDistChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'item',
+    formatter: '{b}: {c} ({d}%)'
+  },
+  legend: {
+    orient: 'vertical',
+    right: 10,
+    top: 'center',
+    textStyle: { fontSize: 12, color: '#6B7280' },
+    itemWidth: 10,
+    itemHeight: 10,
+    itemGap: 12
+  },
+  series: [{
+    name: '模型调用分布',
+    type: 'pie',
+    radius: ['40%', '70%'],
+    center: ['35%', '50%'],
+    avoidLabelOverlap: false,
+    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
+    label: {
+      show: true,
+      position: 'center',
+      formatter: () => `{total|${monitorMetrics.todayCalls.toLocaleString()}}\n{label|总调用}`,
+      rich: {
+        total: { fontSize: 22, fontWeight: 'bold', color: '#111827', lineHeight: 30 },
+        label: { fontSize: 12, color: '#9CA3AF', lineHeight: 20 }
+      }
+    },
+    emphasis: {
+      label: { show: true },
+      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
+    },
+    data: monitorMetrics.modelDistribution.map(m => ({
+      name: m.name,
+      value: m.calls
+    }))
+  }]
+}))
+
+// 3. Horizontal Bar Chart - Member Ranking
+const memberRankChartOption = computed(() => ({
+  tooltip: {
+    trigger: 'axis',
+    axisPointer: { type: 'shadow' }
+  },
+  grid: { left: 80, right: 40, top: 10, bottom: 10 },
+  xAxis: {
+    type: 'value',
+    axisLabel: { fontSize: 10, color: '#9CA3AF' },
+    splitLine: { lineStyle: { color: '#F3F4F6' } },
+    axisLine: { show: false },
+    axisTick: { show: false }
+  },
+  yAxis: {
+    type: 'category',
+    data: [...monitorMetrics.memberRanking].reverse().map(m => m.name),
+    axisLabel: { fontSize: 12, color: '#374151' },
+    axisLine: { show: false },
+    axisTick: { show: false }
+  },
+  series: [{
+    name: '调用量',
+    type: 'bar',
+    data: [...monitorMetrics.memberRanking].reverse().map(m => m.calls),
+    barWidth: 16,
+    itemStyle: {
+      borderRadius: [0, 4, 4, 0],
+      color: (params: any) => {
+        const idx = monitorMetrics.memberRanking.length - 1 - params.dataIndex
+        if (idx === 0) return '#7C3AED'
+        if (idx === 1) return '#A78BFA'
+        if (idx === 2) return '#C4B5FD'
+        return '#DDD6FE'
+      }
+    },
+    label: {
+      show: true,
+      position: 'right',
+      formatter: (params: any) => params.value.toLocaleString() + ' 次',
+      fontSize: 10,
+      color: '#6B7280'
+    }
+  }]
+}))
+
+// Drilldown handlers
+function onRealtimeDrilldown(data: { chartType: string; field: string; value: any }) {
+  if (data.field) {
+    router.push(`/enterprise/logs?model=${encodeURIComponent(data.field)}&from=monitor`)
+  }
+}
+
+function onModelDistDrilldown(data: { chartType: string; field: string; value: any }) {
+  if (data.value) {
+    router.push(`/enterprise/logs?model=${encodeURIComponent(data.value)}&from=monitor`)
+  }
+}
+
+function onMemberRankDrilldown(data: { chartType: string; field: string; value: any }) {
+  if (data.value) {
+    router.push(`/enterprise/logs?member=${encodeURIComponent(data.value)}&from=monitor`)
+  }
+}
 
 // Alerts data
 const alerts = [
   { id: 1, severity: 'red' as const, icon: 'i-lucide-alert-circle', message: '合规卫士接口返回500错误', time: '5分钟前' },
   { id: 2, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '安全大模型触发频率限制(429)', time: '23分钟前' },
@@ -162,30 +268,10 @@ const metricCards = computed(() => [
     iconBg: 'bg-green-50',
     iconColor: 'text-green-600'
   }
 ])
 
-// Chart hover handler
-function onChartHover(event: MouseEvent, pointIndex: number) {
-  const point = seriesData.value[pointIndex]
-  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
-  const x = event.clientX - rect.left
-  const y = event.clientY - rect.top
-  tooltipState.value = {
-    show: true,
-    x,
-    y,
-    time: point.time,
-    calls: point.calls,
-    errors: point.errors
-  }
-}
-
-function onChartLeave() {
-  tooltipState.value.show = false
-}
-
 // Format number with comma
 function formatNumber(n: number): string {
   return n.toLocaleString()
 }
 </script>
@@ -270,145 +356,33 @@ function formatNumber(n: number): string {
                 {{ rate.label }}
               </button>
             </div>
           </div>
 
-          <!-- Stacked Area Chart -->
-          <div
-            class="relative h-48"
-            @mouseleave="onChartLeave"
-          >
-            <!-- Y-axis labels -->
-            <div class="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-right">
-              <span class="text-[10px] text-gray-400 font-mono">{{ maxCalls }}</span>
-              <span class="text-[10px] text-gray-400 font-mono">{{ Math.round(maxCalls / 2) }}</span>
-              <span class="text-[10px] text-gray-400 font-mono">0</span>
-            </div>
-
-            <!-- Chart area -->
-            <div class="ml-12 h-full relative">
-              <!-- Grid lines -->
-              <div class="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
-                <div class="border-b border-gray-50" />
-                <div class="border-b border-gray-50" />
-                <div class="border-b border-gray-100" />
-              </div>
-
-              <!-- Stacked columns (area chart effect) -->
-              <div class="flex items-end h-[calc(100%-24px)]">
-                <div
-                  v-for="(point, idx) in stackedData"
-                  :key="idx"
-                  class="flex-1 flex flex-col justify-end h-full relative group cursor-crosshair"
-                  @mouseenter="onChartHover($event, idx)"
-                >
-                  <!-- Stacked segments from bottom to top -->
-                  <div
-                    v-for="(seg, segIdx) in [...point.segments].reverse()"
-                    :key="segIdx"
-                    class="w-full"
-                    :style="{ height: seg.height + '%', backgroundColor: seg.color, opacity: 0.8 }"
-                  />
-                  <!-- Hover highlight line -->
-                  <div class="absolute inset-0 border-l border-r border-primary-400/30 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
-                </div>
-              </div>
-
-              <!-- X-axis labels -->
-              <div class="flex mt-1 h-5">
-                <div
-                  v-for="(point, idx) in stackedData"
-                  :key="idx"
-                  class="flex-1 text-center"
-                >
-                  <span
-                    v-if="idx % 10 === 0"
-                    class="text-[10px] text-gray-400 font-mono"
-                  >{{ point.time }}</span>
-                </div>
-              </div>
-            </div>
-
-            <!-- Tooltip -->
-            <Transition
-              enter-active-class="transition duration-100 ease-out"
-              enter-from-class="opacity-0"
-              enter-to-class="opacity-100"
-              leave-active-class="transition duration-75 ease-in"
-              leave-from-class="opacity-100"
-              leave-to-class="opacity-0"
-            >
-              <div
-                v-if="tooltipState.show"
-                class="absolute z-50 bg-gray-900 text-white rounded-lg px-3 py-2 text-xs pointer-events-none shadow-lg"
-                :style="{
-                  left: (tooltipState.x + 12) + 'px',
-                  top: (tooltipState.y - 40) + 'px'
-                }"
-              >
-                <p class="font-mono text-white font-medium mb-1">{{ tooltipState.time }}</p>
-                <p class="text-gray-300">调用: <span class="text-white font-mono font-medium">{{ formatNumber(tooltipState.calls) }}</span></p>
-                <p class="text-gray-300">错误: <span class="text-red-400 font-mono font-medium">{{ tooltipState.errors }}</span></p>
-              </div>
-            </Transition>
-          </div>
-
-          <!-- Chart legend -->
-          <div class="flex items-center gap-5 mt-4 pt-4 border-t border-gray-50">
-            <div
-              v-for="model in monitorMetrics.modelDistribution"
-              :key="model.name"
-              class="flex items-center gap-1.5"
-            >
-              <span class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: model.color }" />
-              <span class="text-xs text-gray-500">{{ model.name }}</span>
-            </div>
-          </div>
+          <ChartsBaseChart
+            :option="realtimeChartOption"
+            height="250px"
+            @drilldown="onRealtimeDrilldown"
+          />
         </div>
 
         <!-- Dual-column: Model Distribution + Member Ranking -->
         <div class="grid grid-cols-2 gap-6 mb-6">
-          <!-- Model Distribution - Donut Chart -->
+          <!-- Model Distribution - Doughnut Chart -->
           <div class="bg-white rounded-xl border border-gray-100 p-6">
             <div class="flex items-center justify-between mb-5">
               <div>
                 <h3 class="font-semibold text-gray-900">模型调用分布</h3>
                 <p class="text-xs text-gray-400 mt-0.5">今日各模型调用量占比</p>
               </div>
             </div>
 
-            <!-- Donut Chart -->
-            <div class="flex items-center justify-center mb-5">
-              <div class="relative w-44 h-44">
-                <div
-                  class="w-full h-full rounded-full"
-                  :style="{ background: `conic-gradient(${donutGradient})` }"
-                />
-                <!-- White center circle -->
-                <div class="absolute inset-0 flex items-center justify-center">
-                  <div class="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
-                    <p class="text-2xl font-bold text-gray-900 font-mono">{{ formatNumber(monitorMetrics.todayCalls) }}</p>
-                    <p class="text-xs text-gray-400">总调用</p>
-                  </div>
-                </div>
-              </div>
-            </div>
-
-            <!-- Legend -->
-            <div class="space-y-2.5">
-              <div
-                v-for="model in monitorMetrics.modelDistribution"
-                :key="model.name"
-                class="flex items-center justify-between"
-              >
-                <div class="flex items-center gap-2">
-                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: model.color }" />
-                  <span class="text-sm text-gray-700">{{ model.name }}</span>
-                </div>
-                <span class="text-sm font-mono text-gray-500">{{ formatNumber(model.calls) }}</span>
-              </div>
-            </div>
+            <ChartsBaseChart
+              :option="modelDistChartOption"
+              height="280px"
+              @drilldown="onModelDistDrilldown"
+            />
           </div>
 
           <!-- Member Ranking - Horizontal Bar Chart -->
           <div class="bg-white rounded-xl border border-gray-100 p-6">
             <div class="flex items-center justify-between mb-5">
@@ -420,31 +394,15 @@ function formatNumber(n: number): string {
                 成员管理
                 <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
               </NuxtLink>
             </div>
 
-            <div class="space-y-4">
-              <div v-for="(member, idx) in memberBarData" :key="member.name">
-                <div class="flex items-center justify-between mb-1.5">
-                  <div class="flex items-center gap-2.5">
-                    <span
-                      class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
-                      :class="idx < 3 ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'"
-                    >{{ idx + 1 }}</span>
-                    <span class="text-sm text-gray-900 font-medium">{{ member.name }}</span>
-                  </div>
-                  <span class="text-xs font-mono text-gray-500">{{ formatNumber(member.calls) }} 次</span>
-                </div>
-                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
-                  <div
-                    class="h-full rounded-full transition-all duration-500"
-                    :class="idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-primary-400' : idx === 2 ? 'bg-primary-300' : 'bg-primary-200'"
-                    :style="{ width: member.widthPercent + '%' }"
-                  />
-                </div>
-              </div>
-            </div>
+            <ChartsBaseChart
+              :option="memberRankChartOption"
+              height="280px"
+              @drilldown="onMemberRankDrilldown"
+            />
           </div>
         </div>
 
         <!-- Anomaly Alerts -->
         <div class="bg-white rounded-xl border border-gray-100 p-6">
