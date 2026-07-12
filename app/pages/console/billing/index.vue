<script setup lang="ts">
import { billingRecords } from '~/data/mock'

useHead({ title: '账单中心 - 奇安信AI开放平台' })

// Current and last month records (with safety checks)
const currentMonth = billingRecords[0]
const lastMonth = billingRecords[1]

// Monthly trend data for bar chart
const monthlyTrend = computed(() =>
  billingRecords.slice().reverse().map(r => ({
    month: r.month.replace('2026年', '').replace('月', '') + '月',
    amount: r.amount,
    tokens: r.tokens
  }))
)

const maxAmount = computed(() => Math.max(...monthlyTrend.value.map(m => m.amount)))

// Year-over-year change
const yoyChange = computed(() => {
  if (!currentMonth || !lastMonth || lastMonth.amount === 0) return '0.0'
  return ((currentMonth.amount - lastMonth.amount) / lastMonth.amount * 100).toFixed(1)
})

// Purchase/recharge records
const rechargeRecords = [
  { id: 'rc-1', time: '2026-07-01 09:30:22', name: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
  { id: 'rc-2', time: '2026-06-15 14:22:10', name: '企业包', tokens: '2000万Token', amount: '¥1,499', status: 'success' as const },
  { id: 'rc-3', time: '2026-05-20 11:08:33', name: '体验包', tokens: '100万Token', amount: '¥99', status: 'success' as const }
]

// Format numbers
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
    <ConsoleSidebar />
    <div class="ml-60 min-h-screen" style="background-color: #FAFAFA;">
      <div class="p-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">账单中心</h1>
          <p class="text-sm text-gray-400 mt-1">查看您的消费记录与账单明细</p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <p class="text-xs text-gray-400 font-medium mb-2">本月消费</p>
            <p class="text-2xl font-bold text-gray-900">&yen;{{ currentMonth ? formatAmount(currentMonth.amount) : '-' }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ currentMonth?.month }}账单</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <p class="text-xs text-gray-400 font-medium mb-2">上月消费</p>
            <p class="text-2xl font-bold text-gray-900">&yen;{{ lastMonth ? formatAmount(lastMonth.amount) : '-' }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ lastMonth?.month }}账单</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <p class="text-xs text-gray-400 font-medium mb-2">同比</p>
            <p class="text-2xl font-bold text-green-600">
              +{{ yoyChange }}%
            </p>
            <p class="text-xs text-gray-400 mt-2">较上月增长</p>
          </div>
        </div>

        <!-- Monthly Spending Trend -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-5">月度消费趋势</h3>
          <div class="flex items-end gap-3 h-48">
            <div
              v-for="(item, idx) in monthlyTrend"
              :key="idx"
              class="flex-1 flex flex-col items-center justify-end h-full"
            >
              <p class="text-xs font-semibold text-gray-700 mb-2">&yen;{{ formatAmount(item.amount) }}</p>
              <div
                class="w-full rounded-t-lg transition-all duration-300"
                :style="{
                  height: (item.amount / maxAmount * 100) + '%',
                  background: idx === monthlyTrend.length - 1
                    ? 'linear-gradient(180deg, #7C3AED, #A78BFA)'
                    : 'linear-gradient(180deg, #A78BFA, #DDD6FE)',
                  minHeight: '16px'
                }"
              />
              <p class="text-xs text-gray-400 mt-2">{{ item.month }}</p>
            </div>
          </div>
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
                <th class="text-left py-3 px-5 font-medium">金额</th>
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
                  <button class="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    <UIcon name="i-lucide-download" class="w-3.5 h-3.5" />
                    下载
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Recharge Records -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">充值记录</h3>
          </div>
          <table class="w-full">
            <thead>
              <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <th class="text-left py-3 px-5 font-medium">时间</th>
                <th class="text-left py-3 px-5 font-medium">充能包名</th>
                <th class="text-left py-3 px-5 font-medium">Token数</th>
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
                    <span class="text-sm text-gray-900 font-medium">{{ record.name }}</span>
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
  </div>
</template>
