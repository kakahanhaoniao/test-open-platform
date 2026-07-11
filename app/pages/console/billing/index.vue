<script setup lang="ts">
import { currentUser, billingRecords, members, organization } from '~/data/mock'

useHead({ title: '账单中心 - 奇安信AI开放平台' })

const activeTab = ref<'enterprise' | 'personal'>(currentUser.isEnterprise ? 'enterprise' : 'personal')

// Monthly trend data for bar chart
const monthlyTrend = computed(() =>
  billingRecords.slice().reverse().map(r => ({
    month: r.month.replace('2026年', '').replace('月', '') + '月',
    amount: r.amount,
    tokens: r.tokens
  }))
)

const maxAmount = computed(() => Math.max(...monthlyTrend.value.map(m => m.amount)))

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

// Enterprise totals
const enterpriseTotalTokens = computed(() =>
  members.reduce((sum, m) => sum + m.monthlyTokens, 0)
)
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

        <!-- View Mode Tabs (Enterprise only) -->
        <div v-if="currentUser.isEnterprise" class="mb-6">
          <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              :class="activeTab === 'enterprise'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="activeTab = 'enterprise'"
            >
              企业账单
            </button>
            <button
              class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              :class="activeTab === 'personal'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="activeTab = 'personal'"
            >
              我的消耗
            </button>
          </div>
        </div>

        <!-- ===================== PERSONAL VIEW ===================== -->
        <div v-if="activeTab === 'personal'">
          <!-- Summary Cards -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
              <p class="text-xs text-gray-400 font-medium mb-2">本月消费</p>
              <p class="text-2xl font-bold text-gray-900">&yen;{{ formatAmount(billingRecords[0].amount) }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ billingRecords[0].month }}账单</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
              <p class="text-xs text-gray-400 font-medium mb-2">上月消费</p>
              <p class="text-2xl font-bold text-gray-900">&yen;{{ formatAmount(billingRecords[1].amount) }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ billingRecords[1].month }}账单</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
              <p class="text-xs text-gray-400 font-medium mb-2">同比</p>
              <p class="text-2xl font-bold text-green-600">
                +{{ ((billingRecords[0].amount - billingRecords[1].amount) / billingRecords[1].amount * 100).toFixed(1) }}%
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
        </div>

        <!-- ===================== ENTERPRISE VIEW ===================== -->
        <div v-if="activeTab === 'enterprise'">
          <!-- Summary Cards -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
              <p class="text-xs text-gray-400 font-medium mb-2">企业本月消费</p>
              <p class="text-2xl font-bold text-gray-900">&yen;{{ formatAmount(organization.monthlyCost) }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ organization.name }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
              <p class="text-xs text-gray-400 font-medium mb-2">成员数</p>
              <p class="text-2xl font-bold text-gray-900">{{ organization.memberCount }}</p>
              <p class="text-xs text-gray-400 mt-2">活跃成员 {{ members.filter(m => m.status === 'active').length }} 人</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
              <p class="text-xs text-gray-400 font-medium mb-2">企业Token消耗</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatTokens(enterpriseTotalTokens) }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ billingRecords[0].month }}</p>
            </div>
          </div>

          <!-- Member Cost Distribution -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-5">成员消耗分布</h3>
            <div class="space-y-4">
              <div
                v-for="member in memberCostDistribution.members"
                :key="member.name"
                class="flex items-center gap-4"
              >
                <span class="text-sm text-gray-700 w-12 shrink-0 font-medium">{{ member.name }}</span>
                <div class="flex-1 bg-gray-50 rounded-full h-7 overflow-hidden relative">
                  <div
                    class="h-full rounded-full transition-all duration-500 flex items-center px-3"
                    :style="{ width: member.percent + '%' }"
                    :class="member.name === '其他' ? 'bg-gray-300' : 'bg-gradient-to-r from-primary-600 to-primary-400'"
                  >
                    <span v-if="member.percent >= 15" class="text-xs text-white font-medium">{{ member.percent }}%</span>
                  </div>
                  <span
                    v-if="member.percent < 15"
                    class="absolute top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium"
                    :style="{ left: member.percent + 2 + '%' }"
                  >
                    {{ member.percent }}%
                  </span>
                </div>
                <span class="text-xs text-gray-400 w-16 shrink-0 text-right">&yen;{{ formatAmount(member.cost) }}</span>
              </div>
            </div>
          </div>

          <!-- Enterprise Billing Table -->
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div class="px-5 py-4 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-gray-900">企业账单明细</h3>
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

          <!-- Member Cost Detail Table -->
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div class="px-5 py-4 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-gray-900">成员消耗明细</h3>
            </div>
            <table class="w-full">
              <thead>
                <tr class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                  <th class="text-left py-3 px-5 font-medium">成员</th>
                  <th class="text-left py-3 px-5 font-medium">角色</th>
                  <th class="text-left py-3 px-5 font-medium">本月Token</th>
                  <th class="text-left py-3 px-5 font-medium">本月费用</th>
                  <th class="text-left py-3 px-5 font-medium">占比</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="member in members"
                  :key="member.id"
                  class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-3.5 px-5">
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <UIcon name="i-lucide-user" class="w-3.5 h-3.5 text-primary-600" />
                      </div>
                      <span class="text-sm text-gray-900 font-medium">{{ member.name }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">
                      {{ member.roleLabel }}
                    </span>
                  </td>
                  <td class="py-3.5 px-5 text-sm text-gray-500">{{ formatTokens(member.monthlyTokens) }}</td>
                  <td class="py-3.5 px-5 text-sm text-gray-900">&yen;{{ formatAmount(member.monthlyCost) }}</td>
                  <td class="py-3.5 px-5">
                    <div class="flex items-center gap-2">
                      <div class="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          class="h-full rounded-full bg-primary-500 transition-all duration-500"
                          :style="{ width: (memberCostDistribution.totalCost > 0 ? (member.monthlyCost / memberCostDistribution.totalCost * 100) : 0) + '%' }"
                        />
                      </div>
                      <span class="text-xs text-gray-400">
                        {{ memberCostDistribution.totalCost > 0 ? (member.monthlyCost / memberCostDistribution.totalCost * 100).toFixed(1) : 0 }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ===================== RECHARGE RECORDS (Both views) ===================== -->
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
