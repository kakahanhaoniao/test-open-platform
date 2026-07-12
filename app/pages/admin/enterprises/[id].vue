<script setup lang="ts">
import { adminEnterprises, members, billingRecords } from '~/data/mock'

const route = useRoute()
const enterpriseId = route.params.id as string

const enterprise = adminEnterprises.find(e => e.id === enterpriseId)

useHead({ title: enterprise ? `${enterprise.name} - 企业详情` : '企业详情 - 奇安信AI运营后台' })

// Charging pack records (mock data for this enterprise)
const chargingPackRecords = [
  { id: 'cp-1', type: '企业标准包', tokens: 50000000, amount: 5000, purchasedAt: '2026-07-01', status: 'active' as const },
  { id: 'cp-2', type: '企业专业包', tokens: 200000000, amount: 18000, purchasedAt: '2026-06-15', status: 'active' as const },
  { id: 'cp-3', type: '企业体验包', tokens: 10000000, amount: 990, purchasedAt: '2026-05-20', status: 'expired' as const },
  { id: 'cp-4', type: '企业标准包', tokens: 50000000, amount: 5000, purchasedAt: '2026-04-10', status: 'expired' as const }
]

// 7-day call trend data (mock)
const callTrend = [
  { day: '7/6', calls: 5800 },
  { day: '7/7', calls: 7200 },
  { day: '7/8', calls: 6400 },
  { day: '7/9', calls: 8100 },
  { day: '7/10', calls: 7600 },
  { day: '7/11', calls: 9200 },
  { day: '7/12', calls: 6800 }
]

const maxCalls = Math.max(...callTrend.map(d => d.calls))

function getStatusBadge(status: string) {
  if (status === 'active') return 'bg-green-50 text-green-700'
  if (status === 'pending') return 'bg-amber-50 text-amber-700'
  if (status === 'disabled') return 'bg-red-50 text-red-700'
  return 'bg-gray-50 text-gray-600'
}

function getStatusLabel(status: string) {
  if (status === 'active') return '已认证'
  if (status === 'pending') return '待认证'
  if (status === 'disabled') return '已禁用'
  return status
}

function getMemberStatusBadge(status: string) {
  if (status === 'active') return 'bg-green-50 text-green-700'
  if (status === 'pending') return 'bg-amber-50 text-amber-700'
  if (status === 'disabled') return 'bg-red-50 text-red-700'
  return 'bg-gray-50 text-gray-600'
}

function getMemberStatusLabel(status: string) {
  if (status === 'active') return '正常'
  if (status === 'pending') return '待激活'
  if (status === 'disabled') return '已禁用'
  return status
}

function getPackStatusBadge(status: string) {
  if (status === 'active') return 'bg-green-50 text-green-700'
  if (status === 'expired') return 'bg-gray-100 text-gray-500'
  return 'bg-gray-50 text-gray-600'
}

function getPackStatusLabel(status: string) {
  if (status === 'active') return '有效'
  if (status === 'expired') return '已过期'
  return status
}

function getBillingStatusBadge(status: string) {
  if (status === 'paid') return 'bg-green-50 text-green-700'
  if (status === 'pending') return 'bg-amber-50 text-amber-700'
  return 'bg-gray-50 text-gray-600'
}

function getBillingStatusLabel(status: string) {
  if (status === 'paid') return '已支付'
  if (status === 'pending') return '待支付'
  return status
}

function formatCost(cost: number) {
  return `¥${cost.toLocaleString()}`
}

function formatTokens(tokens: number) {
  if (tokens >= 100000000) return `${(tokens / 100000000).toFixed(1)}亿`
  if (tokens >= 10000) return `${(tokens / 10000).toFixed(0)}万`
  return tokens.toLocaleString()
}

function formatCalls(calls: number) {
  if (calls >= 10000) return `${(calls / 10000).toFixed(1)}万`
  return calls.toLocaleString()
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <AdminSidebar />
    <div class="ml-60">
      <div class="p-6 md:p-8">
        <!-- Not found state -->
        <div v-if="!enterprise" class="flex flex-col items-center justify-center py-20">
          <UIcon name="i-lucide-building-2" class="w-12 h-12 text-gray-300 mb-4" />
          <p class="text-gray-400 text-lg mb-2">未找到该企业</p>
          <NuxtLink to="/admin/enterprises" class="text-primary-600 hover:text-primary-700 text-sm">
            返回企业列表
          </NuxtLink>
        </div>

        <template v-else>
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm mb-6">
            <NuxtLink to="/admin/enterprises" class="text-gray-400 hover:text-gray-600 transition-colors">企业客户</NuxtLink>
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-gray-300" />
            <span class="text-gray-900 font-medium">{{ enterprise.name }}</span>
          </nav>

          <!-- Top dual-column -->
          <div class="grid grid-cols-2 gap-6 mb-8">
            <!-- Left: Enterprise info -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-5">
                <h2 class="text-lg font-semibold text-gray-900">企业信息</h2>
                <div class="flex items-center gap-2">
                  <button class="px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors">
                    编辑
                  </button>
                  <button
                    v-if="enterprise.status === 'active'"
                    class="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                  >
                    禁用
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-building-2" class="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p class="text-base font-semibold text-gray-900">{{ enterprise.name }}</p>
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusBadge(enterprise.status)]">
                      {{ getStatusLabel(enterprise.status) }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p class="text-xs text-gray-400 mb-1">行业</p>
                    <p class="text-sm text-gray-900">{{ enterprise.industry }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 mb-1">规模</p>
                    <p class="text-sm text-gray-900">{{ enterprise.scale }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 mb-1">注册时间</p>
                    <p class="text-sm text-gray-900">{{ enterprise.createdAt }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 mb-1">成员数</p>
                    <p class="text-sm text-gray-900">{{ enterprise.memberCount }}人</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 mb-1">联系人</p>
                    <p class="text-sm text-gray-900">{{ enterprise.contactName }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 mb-1">联系邮箱</p>
                    <p class="text-sm text-gray-900">{{ enterprise.contactEmail }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Usage overview -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-5">用量概览</h2>

              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-400 mb-1">本月调用</p>
                  <p class="text-xl font-bold text-gray-900">{{ formatCalls(enterprise.monthlyCalls) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-400 mb-1">Token消耗</p>
                  <p class="text-xl font-bold text-gray-900">{{ formatTokens(enterprise.monthlyTokens) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-400 mb-1">本月费用</p>
                  <p class="text-xl font-bold text-gray-900">{{ formatCost(enterprise.monthlyCost) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-400 mb-1">充能包余额</p>
                  <p class="text-xl font-bold text-gray-900">{{ formatTokens(enterprise.packBalance) }}</p>
                </div>
              </div>

              <!-- 7-day call trend mini bar chart -->
              <div>
                <p class="text-xs text-gray-400 mb-3">7天调用趋势</p>
                <div class="flex items-end gap-2 h-20">
                  <div
                    v-for="item in callTrend"
                    :key="item.day"
                    class="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-full bg-primary-100 rounded-t transition-all hover:bg-primary-200"
                      :style="{ height: `${item.calls ? (item.calls / maxCalls) * 60 : 0}px` }"
                    />
                    <span class="text-[10px] text-gray-400">{{ item.day }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Member list -->
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">成员列表</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50/80">
                    <th class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Key数</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">月消耗</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in members"
                    :key="member.id"
                    class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                          <span class="text-xs font-medium text-primary-700">{{ member.name.charAt(0) }}</span>
                        </div>
                        <span class="text-sm font-medium text-gray-900">{{ member.name }}</span>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-sm text-gray-600">{{ member.email }}</td>
                    <td class="py-4 px-4">
                      <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {{ member.roleLabel }}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-sm text-gray-600">{{ member.keyCount }}</td>
                    <td class="py-4 px-4 text-sm text-gray-900 font-medium">{{ formatCost(member.monthlyCost) }}</td>
                    <td class="py-4 px-4">
                      <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getMemberStatusBadge(member.status)]">
                        {{ getMemberStatusLabel(member.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Charging pack records -->
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">充能包记录</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50/80">
                    <th class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Token量</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">购买时间</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="pack in chargingPackRecords"
                    :key="pack.id"
                    class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td class="py-4 px-6 text-sm font-medium text-gray-900">{{ pack.type }}</td>
                    <td class="py-4 px-4 text-sm text-gray-600">{{ formatTokens(pack.tokens) }}</td>
                    <td class="py-4 px-4 text-sm text-gray-900 font-medium">{{ formatCost(pack.amount) }}</td>
                    <td class="py-4 px-4 text-sm text-gray-600">{{ pack.purchasedAt }}</td>
                    <td class="py-4 px-4">
                      <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getPackStatusBadge(pack.status)]">
                        {{ getPackStatusLabel(pack.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Billing records -->
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">账单记录</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50/80">
                    <th class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">月份</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Token消耗</th>
                    <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="bill in billingRecords"
                    :key="bill.id"
                    class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td class="py-4 px-6 text-sm font-medium text-gray-900">{{ bill.month }}</td>
                    <td class="py-4 px-4 text-sm text-gray-900 font-medium">{{ formatCost(bill.amount) }}</td>
                    <td class="py-4 px-4 text-sm text-gray-600">{{ formatTokens(bill.tokens) }}</td>
                    <td class="py-4 px-4">
                      <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getBillingStatusBadge(bill.status)]">
                        {{ getBillingStatusLabel(bill.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
