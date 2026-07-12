<script setup lang="ts">
import type { Plan } from '~/data/mock'
import { chargingPacks, modelPlans, appPlans, organization, members } from '~/data/mock'

useHead({ title: '企业套餐管理 - 奇安信AI开放平台' })

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
  description: pack.tokens,
  billingCycle: 'one-time' as const,
  price: parsePriceValue(pack.price),
  originalPrice: pack.originalPrice ? parsePriceValue(pack.originalPrice) : undefined,
  includedTokens: parseTokensValue(pack.tokens),
  features: pack.features,
  popular: pack.popular,
  icon: 'i-lucide-coins',
  badge: pack.originalPrice ? '限时优惠' : undefined
}))

function parsePriceValue(priceStr: string): number {
  const cleaned = priceStr.replace(/[¥,]/g, '').replace(/\/月$/, '')
  const num = Number(cleaned)
  return isNaN(num) ? 0 : num
}

function parseTokensValue(tokensStr: string): number {
  if (tokensStr.includes('无限')) return -1
  const wanMatch = tokensStr.match(/([\d.]+)万/)
  if (wanMatch) return Math.round(Number(wanMatch[1]) * 10000)
  return 0
}

const balanceWan = Math.floor(organization.packBalance / 10000)
const totalWan = Math.floor(organization.packTotal / 10000)
const usedWan = totalWan - balanceWan
const usageRatio = ((usedWan / totalWan) * 100).toFixed(1)

const totalTokens = members.reduce((sum, m) => sum + m.monthlyTokens, 0)

function formatTokens(tokens: number): string {
  if (tokens >= 10000) {
    return (tokens / 10000).toFixed(0) + '万'
  }
  return tokens.toLocaleString()
}

function getPercentage(tokens: number): number {
  if (totalTokens === 0) return 0
  return Number(((tokens / totalTokens) * 100).toFixed(1))
}

// Progress bar color based on usage
const progressColor = computed(() => {
  const ratio = Number(usageRatio)
  if (ratio > 95) return 'from-red-500 to-red-400'
  if (ratio > 80) return 'from-amber-500 to-amber-400'
  return 'from-primary-500 to-primary-400'
})

const progressBgColor = computed(() => {
  const ratio = Number(usageRatio)
  if (ratio > 95) return 'bg-red-500/10'
  if (ratio > 80) return 'bg-amber-500/10'
  return 'bg-primary-500/10'
})

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
    <EnterpriseSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">企业套餐管理</h1>
        <p class="text-sm text-gray-400 mt-1">管理企业Token余额，购买套餐，查看成员消耗</p>
      </div>

      <!-- Balance Card -->
      <div class="deep-block rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" :class="progressBgColor" />
        <div class="relative">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-white/60 text-sm mb-1">企业充能包余额</p>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-bold text-white font-mono">{{ balanceWan.toLocaleString() }}万</span>
                <span class="text-white/40 text-sm">Token</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-white/40 text-xs mb-0.5">已使用</p>
                <p class="text-white font-mono text-lg">{{ usedWan.toLocaleString() }}万</p>
              </div>
              <div class="w-px h-10 bg-white/10" />
              <div class="text-right">
                <p class="text-white/40 text-xs mb-0.5">累计购买</p>
                <p class="text-white font-mono text-lg">{{ totalWan.toLocaleString() }}万</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between text-xs text-white/40 mb-1.5">
              <span>使用进度</span>
              <span class="font-mono">{{ usageRatio }}%</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r rounded-full transition-all duration-1000"
                :class="progressColor"
                :style="{ width: usageRatio + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Three-tab Purchase Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900">购买企业套餐</h3>
          <!-- Enterprise batch purchase -->
          <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors">
            <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5" />
            批量采购
          </button>
        </div>

        <UTabs
          v-model="activeTab"
          :items="tabs"
          color="primary"
          variant="pill"
          :content="false"
          class="mb-4"
        />

        <!-- Packs Tab -->
        <div v-if="activeTab === 'packs'" class="grid grid-cols-4 gap-4">
          <PlanCard
            v-for="plan in packPlans"
            :key="plan.id"
            :plan="plan"
            @buy="handleBuy"
          />
        </div>

        <!-- Model Plans Tab -->
        <div v-if="activeTab === 'model-plans'" class="grid grid-cols-4 gap-4">
          <div v-if="modelPlans.length === 0" class="col-span-4 py-12 text-center">
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
        <div v-if="activeTab === 'app-plans'" class="grid grid-cols-4 gap-4">
          <div v-if="appPlans.length === 0" class="col-span-4 py-12 text-center">
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

      <!-- Member Usage Breakdown -->
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h3 class="font-semibold text-gray-900 mb-5">成员消耗明细</h3>
        <table class="w-full">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-100">
              <th class="text-left py-3 font-medium">成员名</th>
              <th class="text-left py-3 font-medium">角色</th>
              <th class="text-left py-3 font-medium">Token消耗</th>
              <th class="text-left py-3 font-medium">占比</th>
              <th class="text-left py-3 font-medium">费用</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in members"
              :key="member.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-user" class="text-primary-600 w-3.5 h-3.5" />
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ member.name }}</span>
                </div>
              </td>
              <td class="py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-primary-50 text-primary-700': member.role === 'admin',
                    'bg-blue-50 text-blue-700': member.role === 'developer',
                    'bg-amber-50 text-amber-700': member.role === 'finance',
                    'bg-gray-100 text-gray-600': member.role === 'readonly'
                  }"
                >
                  {{ member.roleLabel }}
                </span>
              </td>
              <td class="py-3 text-sm font-mono text-gray-600">{{ formatTokens(member.monthlyTokens) }} Token</td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary-500 rounded-full"
                      :style="{ width: getPercentage(member.monthlyTokens) + '%' }"
                    />
                  </div>
                  <span class="text-xs font-mono text-gray-500">{{ getPercentage(member.monthlyTokens) }}%</span>
                </div>
              </td>
              <td class="py-3 text-sm font-mono text-gray-900 font-medium">¥{{ member.monthlyCost.toLocaleString() }}</td>
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
