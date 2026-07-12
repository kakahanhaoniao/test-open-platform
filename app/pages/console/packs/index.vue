<script setup lang="ts">
import type { Plan } from '~/data/mock'
import { chargingPacks, modelPlans, appPlans, parsePrice, parseTokens } from '~/data/mock'

useHead({ title: '套餐管理 - 奇安信AI开放平台' })

const activeTab = ref('packs')

const tabs = [
  { value: 'packs', label: '充能包', icon: 'i-lucide-coins' },
  { value: 'model-plans', label: '模型套餐', icon: 'i-lucide-brain' },
  { value: 'app-plans', label: '应用套餐', icon: 'i-lucide-puzzle' }
]

// Convert ChargingPack[] to Plan[] for unified rendering
const packPlans: Plan[] = chargingPacks.map(pack => ({
  id: pack.id,
  type: 'pack' as const,
  name: pack.name,
  description: '',
  billingCycle: 'one-time' as const,
  price: parsePrice(pack.price),
  originalPrice: pack.originalPrice ? parsePrice(pack.originalPrice) : undefined,
  includedTokens: parseTokens(pack.tokens),
  features: pack.features,
  popular: pack.popular,
  icon: 'i-lucide-coins',
  badge: pack.originalPrice ? '限时优惠' : undefined
}))

const purchaseHistory = [
  { time: '2026-07-08 14:30', planName: '专业包', detail: '500万Token', amount: '¥399', status: 'success' as const },
  { time: '2026-06-15 10:20', planName: '体验包', detail: '100万Token', amount: '¥99', status: 'success' as const },
  { time: '2026-05-22 09:15', planName: '安全大模型专业版', detail: '月度订阅', amount: '¥999', status: 'success' as const },
  { time: '2026-04-10 16:45', planName: '威胁检测助手专业版', detail: '月度订阅', amount: '¥299', status: 'success' as const },
  { time: '2026-03-01 11:30', planName: '体验包', detail: '100万Token', amount: '¥99', status: 'expired' as const }
]

const usageTrend = [
  { month: '2月', used: 180 },
  { month: '3月', used: 320 },
  { month: '4月', used: 450 },
  { month: '5月', used: 520 },
  { month: '6月', used: 680 },
  { month: '7月', used: 550 }
]

const maxUsage = Math.max(...usageTrend.map(d => d.used))

// Post-purchase dialog
const purchasedPlan = ref<Plan | null>(null)
const showPostPurchase = ref(false)

function handleBuy(plan: Plan) {
  purchasedPlan.value = plan
  showPostPurchase.value = true
}
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">套餐管理</h1>
        <p class="text-sm text-gray-400 mt-1">管理Token余额，购买套餐，查看使用记录</p>
      </div>

      <!-- Balance Card -->
      <div class="deep-block rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div class="relative">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-white/60 text-sm mb-1">当前余额</p>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-bold text-white font-mono">4,850,000</span>
                <span class="text-white/40 text-sm">Token</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-white/40 text-xs mb-0.5">已使用</p>
                <p class="text-white font-mono text-lg">10,150,000</p>
              </div>
              <div class="w-px h-10 bg-white/10" />
              <div class="text-right">
                <p class="text-white/40 text-xs mb-0.5">过期时间</p>
                <p class="text-white text-lg">2026-12-31</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between text-xs text-white/40 mb-1.5">
              <span>使用进度</span>
              <span class="font-mono">67.7%</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000" style="width: 67.7%" />
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Trend + Tabs -->
      <div class="grid grid-cols-3 gap-6 mb-6">
        <!-- Usage Trend Chart -->
        <div class="col-span-1 bg-white rounded-xl border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-1">使用趋势</h3>
          <p class="text-xs text-gray-400 mb-6">近6月Token消耗(万)</p>
          <div class="flex items-end gap-3 h-36">
            <div
              v-for="item in usageTrend"
              :key="item.month"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <span class="text-xs font-mono text-gray-400">{{ item.used }}</span>
              <div
                class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400"
                :style="{ height: `${(item.used / maxUsage) * 110}px` }"
              />
              <span class="text-xs text-gray-400">{{ item.month }}</span>
            </div>
          </div>
        </div>

        <!-- Three-tab Plan Section -->
        <div class="col-span-2">
          <UTabs
            v-model="activeTab"
            :items="tabs"
            color="primary"
            variant="pill"
            :content="false"
            class="mb-4"
          />

          <!-- Packs Tab -->
          <div v-if="activeTab === 'packs'" class="grid grid-cols-2 gap-4">
            <PlanCard
              v-for="plan in packPlans"
              :key="plan.id"
              :plan="plan"
              @buy="handleBuy"
            />
          </div>

          <!-- Model Plans Tab -->
          <div v-if="activeTab === 'model-plans'" class="grid grid-cols-2 gap-4">
            <div v-if="modelPlans.length === 0" class="col-span-2 py-12 text-center">
              <UIcon name="i-lucide-package-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-sm text-gray-400">暂无模型套餐</p>
              <p class="text-xs text-gray-300 mt-1">请先选择具体模型查看可用套餐</p>
            </div>
            <PlanCard
              v-for="plan in modelPlans"
              :key="plan.id"
              :plan="plan"
              @buy="handleBuy"
            />
          </div>

          <!-- App Plans Tab -->
          <div v-if="activeTab === 'app-plans'" class="grid grid-cols-2 gap-4">
            <div v-if="appPlans.length === 0" class="col-span-2 py-12 text-center">
              <UIcon name="i-lucide-package-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-sm text-gray-400">暂无应用套餐</p>
              <p class="text-xs text-gray-300 mt-1">请先选择具体应用查看可用套餐</p>
            </div>
            <PlanCard
              v-for="plan in appPlans"
              :key="plan.id"
              :plan="plan"
              @buy="handleBuy"
            />
          </div>
        </div>
      </div>

      <!-- Purchase History -->
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-5">购买记录</h3>
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100">
              <th class="text-left py-3 font-medium">时间</th>
              <th class="text-left py-3 font-medium">套餐类型</th>
              <th class="text-left py-3 font-medium">详情</th>
              <th class="text-left py-3 font-medium">金额</th>
              <th class="text-left py-3 font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(record, idx) in purchaseHistory"
              :key="idx"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 text-xs font-mono text-gray-500">{{ record.time }}</td>
              <td class="py-3 text-sm font-medium text-gray-900">{{ record.planName }}</td>
              <td class="py-3 text-sm font-mono text-gray-600">{{ record.detail }}</td>
              <td class="py-3 text-sm font-mono text-gray-900 font-medium">{{ record.amount }}</td>
              <td class="py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="record.status === 'success'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-500'"
                >
                  {{ record.status === 'success' ? '已完成' : '已过期' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Post-purchase guidance dialog -->
    <PostPurchaseDialog
      v-if="purchasedPlan"
      :plan="purchasedPlan"
      :open="showPostPurchase"
      @close="showPostPurchase = false"
    />
  </div>
</template>
