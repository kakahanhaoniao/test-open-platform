<script setup lang="ts">
import { currentUser, organization, models, members } from '~/data/mock'

useHead({ title: '使用看板 - 奇安信AI开放平台' })

const viewMode = ref<'personal' | 'enterprise'>(currentUser.isEnterprise ? 'enterprise' : 'personal')
const viewModeDropdownOpen = ref(false)
const viewModeDropdownRef = ref<HTMLElement | null>(null)
const trendRange = ref('7d')

const trendRanges = [
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' },
  { value: '90d', label: '90天' }
]

function onDocumentClick(e: MouseEvent) {
  if (viewModeDropdownRef.value && !viewModeDropdownRef.value.contains(e.target as Node)) {
    viewModeDropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

// Call trend data (7 days)
const callTrendData = [
  { date: '07/05', calls: 38200 },
  { date: '07/06', calls: 34800 },
  { date: '07/07', calls: 42500 },
  { date: '07/08', calls: 47200 },
  { date: '07/09', calls: 43800 },
  { date: '07/10', calls: 51600 },
  { date: '07/11', calls: 25900 }
]

const maxCalls = Math.max(...callTrendData.map(d => d.calls))

// Model consumption ranking (top 5)
const modelRanking = [
  { name: '奇安信安全大模型', percentage: 45, tokens: '524万' },
  { name: '威胁检测模型 V3', percentage: 30, tokens: '289万' },
  { name: '代码安全扫描模型', percentage: 18, tokens: '178万' },
  { name: '漏洞分析专家', percentage: 8, tokens: '96万' },
  { name: '合规卫士', percentage: 4, tokens: '48万' }
]

// Alerts
const alerts = [
  { id: 1, severity: 'red' as const, icon: 'i-lucide-alert-circle', message: '合规卫士接口返回500错误', time: '5分钟前' },
  { id: 2, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '安全大模型触发频率限制(429)', time: '23分钟前' },
  { id: 3, severity: 'amber' as const, icon: 'i-lucide-alert-triangle', message: '威胁检测模型请求频率超限', time: '1小时前' },
  { id: 4, severity: 'green' as const, icon: 'i-lucide-check-circle', message: '代码安全扫描模型服务已恢复', time: '2小时前' },
  { id: 5, severity: 'green' as const, icon: 'i-lucide-check-circle', message: '漏洞分析专家服务已恢复', time: '3小时前' }
]

// Quota data
const packBalance = 1850 // 万
const packTotal = 5000 // 万
const packPercent = Math.round((packBalance / packTotal) * 100)
const apiUsed = 6000
const apiTotal = 10000
const apiPercent = Math.round((apiUsed / apiTotal) * 100)

function getPackBarColor(percent: number) {
  if (percent > 95) return 'bg-red-500'
  if (percent > 80) return 'bg-amber-500'
  return 'bg-primary-500'
}

function getAlertColor(severity: 'red' | 'amber' | 'green') {
  if (severity === 'red') return { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100' }
  if (severity === 'amber') return { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' }
  return { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-100' }
}

// Enterprise: member ranking
const memberRanking = computed(() => {
  if (viewMode.value !== 'enterprise') return []
  return [...members]
    .filter(m => m.monthlyTokens > 0)
    .sort((a, b) => b.monthlyTokens - a.monthlyTokens)
    .slice(0, 5)
    .map(m => ({
      name: m.name,
      role: m.roleLabel,
      tokens: m.monthlyTokens,
      cost: m.monthlyCost,
      percentage: Math.round((m.monthlyTokens / members.reduce((s, x) => s + x.monthlyTokens, 0)) * 100)
    }))
})

// Quick actions
const quickActions = [
  { label: '创建API Key', desc: '生成新的API访问密钥', icon: 'i-lucide-key', to: '/console/keys/create', color: 'bg-primary-50 text-primary-600' },
  { label: '购买充能包', desc: '补充Token调用额度', icon: 'i-lucide-coins', to: '/console/packs', color: 'bg-amber-50 text-amber-600' },
  { label: 'API文档', desc: '查看接口调用指南', icon: 'i-lucide-book-open', to: '/console/docs', color: 'bg-blue-50 text-blue-600' },
  { label: '调用统计', desc: '查看详细调用数据', icon: 'i-lucide-bar-chart-3', to: '/console/stats', color: 'bg-green-50 text-green-600' }
]
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 min-h-screen bg-[#FAFAFA]">
      <div class="p-8">
        <!-- Welcome Bar -->
        <div class="bg-white rounded-xl border border-gray-100 p-5 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-gray-900">欢迎回来，{{ currentUser.name }}</h1>
                <span
                  v-if="viewMode === 'enterprise' && currentUser.isEnterprise"
                  class="text-xs text-gray-400 font-normal"
                >· {{ organization.name }}</span>
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                  服务正常
                </span>
              </div>
            </div>
          </div>
          <!-- View Mode Switcher -->
          <div v-if="currentUser.isEnterprise" ref="viewModeDropdownRef" class="relative">
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
              @click="viewModeDropdownOpen = !viewModeDropdownOpen"
            >
              <UIcon name="i-lucide-eye" class="w-4 h-4 text-gray-400" />
              <span class="font-medium">{{ viewMode === 'enterprise' ? '企业' : '个人' }}视图</span>
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="viewModeDropdownOpen ? 'rotate-180' : ''"
              />
            </button>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="viewModeDropdownOpen"
                class="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
              >
                <button
                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                  :class="viewMode === 'personal' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'"
                  @click="viewMode = 'personal'; viewModeDropdownOpen = false"
                >
                  <UIcon name="i-lucide-user" class="w-4 h-4" />
                  个人
                </button>
                <button
                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                  :class="viewMode === 'enterprise' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'"
                  @click="viewMode = 'enterprise'; viewModeDropdownOpen = false"
                >
                  <UIcon name="i-lucide-building-2" class="w-4 h-4" />
                  企业
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- 4 Stat Cards -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <!-- API调用总量 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <UIcon name="i-lucide-activity" class="w-5 h-5 text-primary-600" />
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                <UIcon name="i-lucide-trending-up" class="w-3 h-3 mr-0.5" />
                +12.5%
              </span>
            </div>
            <p class="text-xs text-gray-400 mb-1">API调用总量</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">284<span class="text-base font-normal text-gray-400">万+</span></p>
          </div>

          <!-- Token消耗 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <UIcon name="i-lucide-zap" class="w-5 h-5 text-blue-600" />
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                <UIcon name="i-lucide-trending-up" class="w-3 h-3 mr-0.5" />
                +8.3%
              </span>
            </div>
            <p class="text-xs text-gray-400 mb-1">Token消耗</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">485<span class="text-base font-normal text-gray-400">万</span></p>
          </div>

          <!-- 本月费用 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <UIcon name="i-lucide-receipt" class="w-5 h-5 text-amber-600" />
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                <UIcon name="i-lucide-trending-up" class="w-3 h-3 mr-0.5" />
                +15.2%
              </span>
            </div>
            <p class="text-xs text-gray-400 mb-1">本月费用</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">¥12,860</p>
          </div>

          <!-- 充能包余额 -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <UIcon name="i-lucide-coins" class="w-5 h-5 text-green-600" />
              </div>
              <span class="text-xs font-mono text-gray-400">37%</span>
            </div>
            <p class="text-xs text-gray-400 mb-1">充能包余额</p>
            <p class="text-2xl font-bold text-gray-900 font-mono">1,850<span class="text-base font-normal text-gray-400">万</span></p>
            <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 rounded-full" style="width: 37%" />
            </div>
          </div>
        </div>

        <!-- Call Trend Chart -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-semibold text-gray-900">调用趋势</h3>
              <p class="text-xs text-gray-400 mt-0.5">API每日调用量统计</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-for="range in trendRanges"
                :key="range.value"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="trendRange === range.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'"
                @click="trendRange = range.value"
              >
                {{ range.label }}
              </button>
            </div>
          </div>
          <div class="flex items-end gap-4 h-44">
            <div
              v-for="item in callTrendData"
              :key="item.date"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <span class="text-xs font-mono text-gray-500">{{ (item.calls / 10000).toFixed(1) }}万</span>
              <div
                class="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-300"
                :style="{ height: `${(item.calls / maxCalls) * 140}px` }"
              />
              <span class="text-xs text-gray-400">{{ item.date }}</span>
            </div>
          </div>
        </div>

        <!-- Two-column: Model Ranking + Alerts -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <!-- Model Consumption Ranking -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-gray-900">模型消耗排行</h3>
                <p class="text-xs text-gray-400 mt-0.5">Token消耗Top 5</p>
              </div>
              <NuxtLink to="/console/stats" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                查看详情
                <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
            <div class="space-y-4">
              <div v-for="(item, idx) in modelRanking" :key="idx">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                      :class="idx < 3 ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'"
                    >{{ idx + 1 }}</span>
                    <span class="text-sm text-gray-900 font-medium">{{ item.name }}</span>
                  </div>
                  <span class="text-xs font-mono text-gray-500">{{ item.tokens }} Token</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-primary-400' : 'bg-primary-300'"
                    :style="{ width: item.percentage + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-gray-900">异常告警</h3>
                <p class="text-xs text-gray-400 mt-0.5">最近服务异常与恢复通知</p>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                {{ alerts.filter(a => a.severity === 'red').length }} 严重
              </span>
            </div>
            <div class="space-y-3">
              <div
                v-for="alert in alerts"
                :key="alert.id"
                class="flex items-start gap-3 p-3 rounded-lg border"
                :class="getAlertColor(alert.severity).border"
                :style="{ backgroundColor: getAlertColor(alert.severity).bg }"
              >
                <UIcon :name="alert.icon" class="w-4 h-4 mt-0.5 shrink-0" :class="getAlertColor(alert.severity).icon" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{{ alert.message }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ alert.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enterprise: Member Ranking -->
        <div v-if="viewMode === 'enterprise' && memberRanking.length" class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-gray-900">成员消耗排行</h3>
              <p class="text-xs text-gray-400 mt-0.5">团队成员Token消耗Top 5</p>
            </div>
            <NuxtLink to="/console/workspace" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              成员管理
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
          <div class="space-y-4">
            <div v-for="(m, idx) in memberRanking" :key="m.name">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-3">
                  <span
                    class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                    :class="idx < 3 ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'"
                  >{{ idx + 1 }}</span>
                  <div class="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <UIcon name="i-lucide-user" class="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <div>
                    <span class="text-sm text-gray-900 font-medium">{{ m.name }}</span>
                    <span class="text-xs text-gray-400 ml-2">{{ m.role }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono text-gray-500">{{ (m.tokens / 10000).toFixed(0) }}万 Token</span>
                  <span class="text-xs text-gray-400 ml-2">¥{{ m.cost.toLocaleString() }}</span>
                </div>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-400 rounded-full transition-all duration-500"
                  :style="{ width: m.percentage + '%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Quota Progress Section -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-5">额度使用</h3>
          <div class="space-y-6">
            <!-- 充能包 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-coins" class="w-4 h-4 text-primary-500" />
                  <span class="text-sm font-medium text-gray-900">充能包</span>
                </div>
                <span class="text-xs text-gray-500 font-mono">1,850万 / 5,000万 Token</span>
              </div>
              <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getPackBarColor(packPercent)"
                  :style="{ width: packPercent + '%' }"
                />
              </div>
              <div class="flex items-center justify-between mt-1.5">
                <span class="text-xs text-gray-400">已使用 {{ packTotal - packBalance }}万 Token</span>
                <span
                  class="text-xs font-medium"
                  :class="packPercent > 80 ? 'text-amber-600' : 'text-gray-400'"
                >{{ packPercent }}%</span>
              </div>
            </div>

            <!-- API频率 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-gauge" class="w-4 h-4 text-blue-500" />
                  <span class="text-sm font-medium text-gray-900">API频率</span>
                </div>
                <span class="text-xs text-gray-500 font-mono">6,000 / 10,000 次/分</span>
              </div>
              <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getPackBarColor(apiPercent)"
                  :style="{ width: apiPercent + '%' }"
                />
              </div>
              <div class="flex items-center justify-between mt-1.5">
                <span class="text-xs text-gray-400">当前频率限制</span>
                <span class="text-xs text-gray-400">{{ apiPercent }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-4 gap-4">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="bg-white rounded-xl border border-gray-100 p-5 card-hover group"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="action.color">
                <UIcon :name="action.icon" class="w-5 h-5" />
              </div>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">{{ action.label }}</p>
            <p class="text-xs text-gray-400">{{ action.desc }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
