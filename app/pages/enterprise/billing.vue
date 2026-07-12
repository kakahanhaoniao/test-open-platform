<script setup lang="ts">
import { billingRecords, members, organization } from '~/data/mock'
import { useChartTheme } from '~/composables/useChartTheme'

useHead({ title: '企业账单 - 奇安信AI开放平台' })

const theme = useChartTheme()

// Summary calculations
const currentMonth = billingRecords[0]!
const lastMonth = billingRecords[1]!
const monthOverMonth = computed(() => {
  if (!lastMonth || lastMonth.amount === 0) return 0
  return Number(((currentMonth.amount - lastMonth.amount) / lastMonth.amount * 100).toFixed(1))
})

// Monthly trend data for bar+line combo chart
const monthlyTrend = computed(() =>
  billingRecords.slice().reverse().map(r => ({
    month: r.month.replace('2026年', '').replace('月', '') + '月',
    amount: r.amount,
    tokens: r.tokens
  }))
)

// Enterprise member cost distribution
const memberCostDistribution = computed(() => {
  const activeMembers = members.filter(m => m.monthlyCost > 0)
  const totalCost = activeMembers.reduce((sum, m) => sum + m.monthlyCost, 0)
  const namedMembers = activeMembers
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
    .slice(0, 4)
    .map(m => ({
      name: m.name,
      cost: m.monthlyCost,
      percent: totalCost > 0 ? Math.round((m.monthlyCost / totalCost) * 100) : 0
    }))
  const namedTotal = namedMembers.reduce((sum, m) => sum + m.cost, 0)
  const otherCost = totalCost - namedTotal
  const otherPercent = totalCost > 0 ? 100 - namedMembers.reduce((sum, m) => sum + m.percent, 0) : 0
  if (otherCost > 0) {
    namedMembers.push({ name: '其他', cost: otherCost, percent: otherPercent })
  }
  return { members: namedMembers, totalCost }
})

// --- ECharts options ---

// 1. Bar+Line Combo Chart - Monthly Spending Trend
const monthlyTrendChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  legend: {
    data: ['消费金额', 'Token消耗'],
    bottom: 0,
    textStyle: { fontSize: 11, color: '#6B7280' },
    itemWidth: 12,
    itemHeight: 8
  },
  grid: { left: 70, right: 70, top: 20, bottom: 40 },
  xAxis: {
    type: 'category',
    data: monthlyTrend.value.map(m => m.month),
    axisLabel: { fontSize: 11, color: '#9CA3AF' },
    axisLine: { lineStyle: { color: '#E5E7EB' } },
    axisTick: { show: false }
  },
  yAxis: [
    {
      type: 'value',
      name: '金额(¥)',
      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
      axisLabel: { fontSize: 10, color: '#9CA3AF', formatter: '¥{value}' },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    {
      type: 'value',
      name: 'Token',
      nameTextStyle: { fontSize: 10, color: '#9CA3AF' },
      axisLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        formatter: (val: number) => {
          if (val >= 10000000) return (val / 10000000).toFixed(0) + '千万'
          if (val >= 10000) return (val / 10000).toFixed(0) + '万'
          return String(val)
        }
      },
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false }
    }
  ],
  series: [
    {
      name: '消费金额',
      type: 'bar',
      barWidth: 24,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#7C3AED' },
            { offset: 1, color: '#A78BFA' }
          ]
        }
      },
      data: monthlyTrend.value.map(m => m.amount)
    },
    {
      name: 'Token消耗',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2, color: '#F59E0B' },
      itemStyle: { color: '#F59E0B' },
      data: monthlyTrend.value.map(m => m.tokens)
    }
  ]
}))

// 2. Doughnut Chart - Member Cost Distribution
const memberCostChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: ¥{c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { fontSize: 11, color: '#6B7280' },
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 10,
    formatter: (name: string) => {
      const m = memberCostDistribution.value.members.find(m => m.name === name)
      return m ? `${name}  ¥${m.cost.toLocaleString()}` : name
    }
  },
  series: [{
    name: '成员消耗分布',
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' },
      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
    },
    data: memberCostDistribution.value.members.map(m => ({
      name: m.name,
      value: m.cost
    }))
  }]
}))

// Recharge records
const rechargeRecords = [
  { id: 'rc-1', time: '2026-07-01 09:30:22', type: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
  { id: 'rc-2', time: '2026-06-15 14:22:10', type: '企业包', tokens: '2000万Token', amount: '¥1,499', status: 'success' as const },
  { id: 'rc-3', time: '2026-05-20 11:08:33', type: '体验包', tokens: '100万Token', amount: '¥99', status: 'success' as const },
  { id: 'rc-4', time: '2026-04-08 16:45:12', type: '企业包', tokens: '2000万Token', amount: '¥1,499', status: 'success' as const },
  { id: 'rc-5', time: '2026-03-12 10:20:55', type: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const }
]

// Format helpers
function formatAmount(amount: number) {
  return amount.toLocaleString('zh-CN')
}

function formatTokens(tokens: number) {
  if (tokens >= 10000000) return (tokens / 10000000).toFixed(1) + '千万'
  if (tokens >= 10000) return (tokens / 10000).toFixed(0) + '万'
  return tokens.toLocaleString('zh-CN')
}
</script>

<template>
  <div>
    <EnterpriseSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">企业账单</h1>
        <p class="text-sm text-gray-400 mt-1">查看企业消费记录、账单明细与成员消耗分布</p>
      </div>

      <!-- 3 Summary Cards -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <UIcon name="i-lucide-credit-card" class="w-4.5 h-4.5 text-primary-600" />
            </div>
            <span class="text-sm text-gray-500">本月消费</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">&yen;{{ formatAmount(currentMonth.amount) }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">{{ currentMonth.month }}账单</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <UIcon name="i-lucide-calendar" class="w-4.5 h-4.5 text-blue-600" />
            </div>
            <span class="text-sm text-gray-500">上月消费</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gray-900">&yen;{{ formatAmount(lastMonth.amount) }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">{{ lastMonth.month }}账单</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <UIcon name="i-lucide-trending-up" class="w-4.5 h-4.5 text-green-600" />
            </div>
            <span class="text-sm text-gray-500">环比</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold" :class="monthOverMonth > 0 ? 'text-amber-600' : 'text-green-600'">
              {{ monthOverMonth > 0 ? '+' : '' }}{{ monthOverMonth }}%
            </span>
          </div>
          <p class="text-xs text-gray-400 mt-2">较上月增长</p>
        </div>
      </div>

      <!-- Monthly Spending Trend Chart -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-5">月度消费趋势</h3>
        <ChartsBaseChart :option="monthlyTrendChartOption" height="280px" />
      </div>

      <!-- Member Cost Distribution Doughnut -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-5">成员消耗分布</h3>
        <ChartsBaseChart :option="memberCostChartOption" height="280px" />
      </div>

      <!-- Billing Table -->
      <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">账单明细</h3>
        </div>
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th class="text-left py-3 px-5 font-medium">月份</th>
              <th class="text-left py-3 px-5 font-medium">消费金额</th>
              <th class="text-left py-3 px-5 font-medium">Token消耗</th>
              <th class="text-left py-3 px-5 font-medium">状态</th>
              <th class="text-left py-3 px-5 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in billingRecords"
              :key="record.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3.5 px-5 text-sm text-gray-900 font-medium">{{ record.month }}</td>
              <td class="py-3.5 px-5 text-sm text-gray-900">&yen;{{ formatAmount(record.amount) }}</td>
              <td class="py-3.5 px-5 text-sm text-gray-500">{{ formatTokens(record.tokens) }}</td>
              <td class="py-3.5 px-5">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="record.status === 'paid'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-amber-50 text-amber-600'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="record.status === 'paid' ? 'bg-green-500' : 'bg-amber-500'"
                  />
                  {{ record.status === 'paid' ? '已支付' : '待支付' }}
                </span>
              </td>
              <td class="py-3.5 px-5">
                <div class="flex items-center gap-3">
                  <button class="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    <UIcon name="i-lucide-eye" class="w-3.5 h-3.5" />
                    查看
                  </button>
                  <button class="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    <UIcon name="i-lucide-download" class="w-3.5 h-3.5" />
                    下载
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Recharge Records Table -->
      <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">充值记录</h3>
        </div>
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th class="text-left py-3 px-5 font-medium">时间</th>
              <th class="text-left py-3 px-5 font-medium">类型</th>
              <th class="text-left py-3 px-5 font-medium">Token量</th>
              <th class="text-left py-3 px-5 font-medium">金额</th>
              <th class="text-left py-3 px-5 font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in rechargeRecords"
              :key="record.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3.5 px-5 text-xs text-gray-400 font-mono">{{ record.time }}</td>
              <td class="py-3.5 px-5">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-coins" class="w-4 h-4 text-primary-500" />
                  <span class="text-sm text-gray-900 font-medium">{{ record.type }}</span>
                </div>
              </td>
              <td class="py-3.5 px-5 text-sm text-gray-500">{{ record.tokens }}</td>
              <td class="py-3.5 px-5 text-sm text-gray-900 font-medium">{{ record.amount }}</td>
              <td class="py-3.5 px-5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500" />
                  已到账
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
