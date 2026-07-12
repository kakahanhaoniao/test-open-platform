<script setup lang="ts">
import { chargingPacks, organization, members } from '~/data/mock'

useHead({ title: '企业充能包 - 奇安信AI开放平台' })

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

// Pack gradient backgrounds
const packGradients: Record<string, string> = {
  'pack-starter': 'from-blue-50 to-indigo-50',
  'pack-pro': 'from-primary-50 to-violet-50',
  'pack-enterprise': 'from-amber-50 to-orange-50',
  'pack-unlimited': 'from-emerald-50 to-teal-50'
}
</script>

<template>
  <div>
    <EnterpriseSidebar />
    <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">企业充能包</h1>
        <p class="text-sm text-gray-400 mt-1">管理企业Token余额，购买充能包，查看成员消耗</p>
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

      <!-- Purchase Section -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-900 mb-4">购买企业充能包</h3>
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="pack in chargingPacks"
            :key="pack.id"
            class="bg-gradient-to-br rounded-xl border p-5 card-hover relative"
            :class="[
              packGradients[pack.id] || 'from-gray-50 to-gray-50',
              pack.popular ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-100'
            ]"
          >
            <!-- Popular badge -->
            <div
              v-if="pack.popular"
              class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-medium"
            >
              最受欢迎
            </div>

            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-bold text-gray-900 text-lg">{{ pack.name }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ pack.tokens }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold gradient-text">{{ pack.price }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ pack.unitPrice }}</p>
              </div>
            </div>

            <div v-if="pack.originalPrice" class="mb-3">
              <span class="text-xs text-gray-400 line-through">{{ pack.originalPrice }}</span>
            </div>

            <div class="space-y-1.5 mb-4">
              <div
                v-for="feature in pack.features"
                :key="feature"
                class="flex items-center gap-2 text-xs text-gray-500"
              >
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-500 shrink-0" />
                {{ feature }}
              </div>
            </div>

            <button
              class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary-600 hover:bg-primary-700 text-white"
            >
              购买
            </button>
          </div>
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
  </div>
</template>
