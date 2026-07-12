<script setup lang="ts">
import type { Model, App, Activity } from '~/data/mock'
import { activities, chargingPacks, currentUser } from '~/data/mock'

const props = defineProps<{
  capability: Model | App
  capabilityType: 'model' | 'app'
}>()

const isModel = computed(() => props.capabilityType === 'model')

// Find related promotions by checking if capability tags overlap with activity tags
const relatedPromos = computed(() => {
  return activities.filter(a => a.hot || a.new).slice(0, 2)
})

const activeTab = ref('overview')

const tabs = computed(() => {
  const base = [
    { id: 'overview', label: '概览', icon: 'i-lucide-info' }
  ]
  if (isModel.value) {
    base.push({ id: 'playground', label: '体验', icon: 'i-lucide-play' })
    base.push({ id: 'pricing', label: '定价', icon: 'i-lucide-coins' })
  } else {
    const app = props.capability as App
    if (app.type === 'chat') {
      base.push({ id: 'chat', label: '对话', icon: 'i-lucide-message-circle' })
    }
    if (app.type === 'showcase') {
      base.push({ id: 'demo', label: '演示', icon: 'i-lucide-monitor' })
    }
    base.push({ id: 'integration', label: '集成', icon: 'i-lucide-plug' })
  }
  base.push({ id: 'docs', label: '文档', icon: 'i-lucide-book-open' })
  return base
})

const appTypeLabel = computed(() => {
  if (isModel.value) return ''
  const app = props.capability as App
  return app.typeName
})

const model = computed(() => isModel.value ? props.capability as Model : null)
const app = computed(() => !isModel.value ? props.capability as App : null)

// Modal states
const showChargingPackModal = ref(false)
const showIntegrationModal = ref(false)
const showEnterpriseModal = ref(false)
const purchaseSuccess = ref(false)
const enterpriseSuccess = ref(false)

// Copy feedback
const copiedStep = ref<number | null>(null)

// Action: open playground/chat tab
function handleTryNow() {
  if (isModel.value) {
    activeTab.value = 'playground'
  } else if (app.value?.type === 'chat') {
    activeTab.value = 'chat'
  } else if (app.value?.type === 'showcase') {
    activeTab.value = 'demo'
  }
}

// Action: open integration guide modal
function handleIntegration() {
  showIntegrationModal.value = true
}

// Action: open charging pack modal
function handleBuyPack() {
  showChargingPackModal.value = true
  purchaseSuccess.value = false
}

// Action: purchase a specific pack
function handlePurchasePack(packId: string) {
  purchaseSuccess.value = true
  setTimeout(() => {
    purchaseSuccess.value = false
    showChargingPackModal.value = false
  }, 2000)
}

// Action: enterprise batch purchase
function handleEnterpriseSubmit() {
  enterpriseSuccess.value = true
  setTimeout(() => {
    enterpriseSuccess.value = false
    showEnterpriseModal.value = false
  }, 2000)
}

// Copy code to clipboard
async function copyCode(step: number, code: string) {
  try {
    await navigator.clipboard.writeText(code)
    copiedStep.value = step
    setTimeout(() => { copiedStep.value = null }, 2000)
  } catch {
    // fallback: do nothing
  }
}

// Integration code snippets
const sdkInstallCode = 'pip install qax-ai-sdk'
const apiCallCode = computed(() => {
  const modelId = model.value?.id || app.value?.id || 'qax-security-llm'
  return `from qax_ai import QAXClient

client = QAXClient(api_key="your-api-key")

response = client.chat(
    model="${modelId}",
    messages=[
        {"role": "user", "content": "分析这段日志中的异常行为"}
    ]
)

print(response.choices[0].message.content)`
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start gap-5">
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
        :class="isModel ? 'bg-primary-50' : 'bg-accent-50'"
      >
        <UIcon
          :name="capability.icon"
          class="w-8 h-8"
          :class="isModel ? 'text-primary-600' : 'text-accent-600'"
        />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h1 class="text-2xl font-bold text-gray-900">{{ capability.name }}</h1>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="isModel ? 'bg-primary-100 text-primary-700' : 'bg-accent-100 text-accent-700'"
          >
            {{ isModel ? '模型' : appTypeLabel }}
          </span>
          <span v-if="capability.hot" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">HOT</span>
          <span v-if="capability.new" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-500 text-white">NEW</span>
        </div>
        <p class="text-sm text-gray-500 mb-3">{{ isModel ? model?.typeName : app?.typeName }}</p>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
            <span class="text-sm font-semibold text-gray-700">{{ capability.rating }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-gray-400" />
            <span class="text-sm text-gray-500">
              {{ isModel ? model?.callCount + ' 调用' : app?.useCount + ' 用户' }}
            </span>
          </div>
          <template v-if="isModel && model">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-cpu" class="w-3.5 h-3.5 text-gray-400" />
              <span class="text-sm text-gray-500">{{ model.parameters }} 参数</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Related Promotions -->
    <div v-if="relatedPromos.length" class="flex gap-3">
      <div
        v-for="promo in relatedPromos"
        :key="promo.id"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl"
        :class="`bg-gradient-to-r ${promo.gradient}`"
      >
        <UIcon :name="promo.icon" class="w-4 h-4 text-white" />
        <span class="text-white text-sm font-medium">{{ promo.title }}：{{ promo.discountText }}</span>
        <NuxtLink to="/promotions" class="text-white/80 text-xs underline hover:text-white">了解详情</NuxtLink>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-100">
      <div class="flex gap-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all"
          :class="activeTab === tab.id
            ? 'text-primary-700 border-primary-600'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-200'"
          @click="activeTab = tab.id"
        >
          <UIcon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="min-h-[400px]">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-3 gap-6">
        <div class="col-span-2 space-y-6">
          <!-- Description -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">简介</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ isModel ? model?.intro : app?.detail }}</p>
          </div>

          <!-- Features -->
          <div v-if="capability.features" class="bg-white rounded-xl border border-gray-100 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">核心能力</h3>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="feature in capability.features"
                :key="feature"
                class="flex items-center gap-2.5"
              >
                <div
                  class="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  :class="isModel ? 'bg-primary-50' : 'bg-accent-50'"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="w-3.5 h-3.5"
                    :class="isModel ? 'text-primary-600' : 'text-accent-600'"
                  />
                </div>
                <span class="text-sm text-gray-700">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">标签</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in capability.tags"
                :key="tag"
                class="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Sidebar — Direct Purchase Actions -->
        <div class="space-y-4">
          <!-- Capability Info Card -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
            <!-- Name + Rating + Call Count -->
            <div class="space-y-2">
              <h3 class="text-base font-bold text-gray-900">{{ capability.name }}</h3>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span class="text-sm font-semibold text-gray-700">{{ capability.rating }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-gray-400" />
                  <span class="text-sm text-gray-500">
                    {{ isModel ? model?.callCount + ' 调用' : app?.useCount + ' 用户' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-100" />

            <!-- 3 Action Buttons -->
            <div class="space-y-3">
              <!-- Button 1: Online Experience -->
              <button
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
                @click="handleTryNow"
              >
                <UIcon name="i-lucide-play" class="w-5 h-5 shrink-0" />
                <div class="text-left">
                  <div class="text-sm font-semibold">在线体验</div>
                  <div class="text-[11px] text-green-100">打开Playground</div>
                </div>
              </button>

              <!-- Button 2: Integration -->
              <button
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                @click="handleIntegration"
              >
                <UIcon name="i-lucide-key" class="w-5 h-5 shrink-0" />
                <div class="text-left">
                  <div class="text-sm font-semibold">立即接入</div>
                  <div class="text-[11px] text-primary-200">获取API Key+SDK</div>
                </div>
              </button>

              <!-- Button 3: Buy Charging Pack -->
              <button
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-primary-50/50 hover:bg-primary-50 text-primary-700 transition-colors"
                @click="handleBuyPack"
              >
                <UIcon name="i-lucide-package" class="w-5 h-5 shrink-0" />
                <div class="text-left">
                  <div class="text-sm font-semibold">购买充能包</div>
                  <div class="text-[11px] text-primary-500">体验包 ¥99 起</div>
                </div>
              </button>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-100" />

            <!-- Pricing Info (directly visible) -->
            <div v-if="isModel && model" class="space-y-2">
              <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">定价信息</h4>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">输入价格</span>
                <span class="text-sm font-bold text-primary-600">{{ model.pricing.input }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">输出价格</span>
                <span class="text-sm font-bold text-primary-600">{{ model.pricing.output }}</span>
              </div>
            </div>

            <!-- Divider (only if model has pricing) -->
            <div v-if="isModel && model" class="border-t border-gray-100" />

            <!-- Enterprise Batch Purchase (enterprise users only) -->
            <div v-if="currentUser.isEnterprise">
              <button
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-white hover:bg-primary-50/30 text-primary-700 transition-colors"
                @click="showEnterpriseModal = true"
              >
                <UIcon name="i-lucide-building-2" class="w-5 h-5 shrink-0" />
                <div class="text-left">
                  <div class="text-sm font-semibold">企业批量采购</div>
                  <div class="text-[11px] text-primary-500">专属折扣+统一结算</div>
                </div>
              </button>
            </div>

            <!-- Divider (only if enterprise) -->
            <div v-if="currentUser.isEnterprise" class="border-t border-gray-100" />

            <!-- Tags and Related Info -->
            <div class="space-y-2">
              <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">标签</h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in capability.tags.slice(0, 4)"
                  :key="tag"
                  class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-600"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Model-specific info -->
            <div v-if="isModel && model" class="space-y-2">
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">参数规模</span>
                <span class="text-xs font-semibold text-gray-700">{{ model.parameters }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">API端点</span>
                <span class="text-xs font-mono text-gray-600 truncate ml-2">{{ model.apiEndpoint }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Playground Tab (Model only) -->
      <div v-if="activeTab === 'playground' && isModel" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-900">模型体验</h3>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md text-xs bg-green-50 text-green-600 font-medium">在线</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-3">
            <label class="text-xs font-medium text-gray-700">输入</label>
            <textarea
              class="w-full h-48 rounded-xl border border-gray-200 p-4 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300"
              placeholder="输入安全相关的查询，例如：分析这段日志中的异常行为..."
            />
            <UButton label="发送" icon="i-lucide-send" color="primary" size="sm" />
          </div>
          <div class="space-y-3">
            <label class="text-xs font-medium text-gray-700">输出</label>
            <div class="w-full h-48 rounded-xl border border-gray-200 p-4 text-sm text-gray-400 bg-gray-50">
              模型输出将在这里显示...
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Tab (Chat app only) -->
      <div v-if="activeTab === 'chat' && !isModel && app" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-6">
            <div class="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mx-auto mb-3">
              <UIcon :name="capability.icon" class="w-6 h-6 text-accent-600" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900">{{ capability.name }}</h3>
            <p class="text-xs text-gray-500 mt-1">开始与AI助手对话</p>
          </div>
          <div class="space-y-4 mb-4">
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-bot" class="w-4 h-4 text-accent-600" />
              </div>
              <div class="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 max-w-md">
                你好！我是{{ capability.name }}，有什么安全相关的问题我可以帮你解答？
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <UInput placeholder="输入你的问题..." class="flex-1" size="lg" />
            <UButton icon="i-lucide-send" color="accent" size="lg" />
          </div>
        </div>
      </div>

      <!-- Demo Tab (Showcase app only) -->
      <div v-if="activeTab === 'demo' && !isModel" class="bg-white rounded-xl border border-gray-100 p-6">
        <div class="aspect-video rounded-xl bg-gradient-to-br from-deep-900 to-primary-900 flex items-center justify-center">
          <div class="text-center">
            <UIcon name="i-lucide-play-circle" class="w-16 h-16 text-white/60 mx-auto mb-3" />
            <p class="text-white/80 text-sm">点击查看{{ capability.name }}演示</p>
          </div>
        </div>
      </div>

      <!-- Pricing Tab (Model only) -->
      <div v-if="activeTab === 'pricing' && isModel && model" class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <h4 class="text-xs font-semibold text-gray-500 mb-2">按量计费</h4>
            <p class="text-lg font-bold text-gray-900 mb-1">{{ model.pricing.input }}</p>
            <p class="text-xs text-gray-400">输入价格</p>
            <p class="text-lg font-bold text-gray-900 mt-2">{{ model.pricing.output }}</p>
            <p class="text-xs text-gray-400">输出价格</p>
          </div>
          <div class="bg-white rounded-xl border-2 border-primary-200 p-5 text-center relative">
            <span class="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-bold">推荐</span>
            <h4 class="text-xs font-semibold text-gray-500 mb-2">月度套餐</h4>
            <p class="text-2xl font-bold text-primary-700 mb-1">¥999<span class="text-sm font-normal text-gray-400">/月</span></p>
            <p class="text-xs text-gray-400">500万tokens/月</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <h4 class="text-xs font-semibold text-gray-500 mb-2">年度套餐</h4>
            <p class="text-2xl font-bold text-gray-900 mb-1">¥7,999<span class="text-sm font-normal text-gray-400">/年</span></p>
            <p class="text-xs text-gray-400">不限量调用</p>
          </div>
        </div>
        <div class="flex items-center justify-center gap-3 pt-2">
          <UButton label="购买充能包" icon="i-lucide-package" color="primary" @click="handleBuyPack" />
          <UButton label="获取API Key" icon="i-lucide-key" variant="outline" color="primary" @click="handleIntegration" />
        </div>
      </div>

      <!-- Integration Tab (App only) -->
      <div v-if="activeTab === 'integration' && !isModel" class="bg-white rounded-xl border border-gray-100 p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">集成方式</h3>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/dev/docs" class="p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
            <UIcon name="i-lucide-link" class="w-6 h-6 text-primary-500 mb-2" />
            <h4 class="text-sm font-semibold text-gray-900 mb-1">API 接入</h4>
            <p class="text-xs text-gray-500">RESTful API，快速集成到现有系统</p>
          </NuxtLink>
          <div class="p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
            <UIcon name="i-lucide-webhook" class="w-6 h-6 text-primary-500 mb-2" />
            <h4 class="text-sm font-semibold text-gray-900 mb-1">Webhook</h4>
            <p class="text-xs text-gray-500">事件驱动，实时推送安全告警</p>
          </div>
          <NuxtLink to="/dev/docs" class="p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
            <UIcon name="i-lucide-puzzle" class="w-6 h-6 text-primary-500 mb-2" />
            <h4 class="text-sm font-semibold text-gray-900 mb-1">SDK</h4>
            <p class="text-xs text-gray-500">Python/Java/Go SDK，开箱即用</p>
          </NuxtLink>
          <div class="p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
            <UIcon name="i-lucide-layout-dashboard" class="w-6 h-6 text-primary-500 mb-2" />
            <h4 class="text-sm font-semibold text-gray-900 mb-1">SaaS</h4>
            <p class="text-xs text-gray-500">云端部署，无需本地安装</p>
          </div>
        </div>
      </div>

      <!-- Docs Tab -->
      <div v-if="activeTab === 'docs'" class="bg-white rounded-xl border border-gray-100 p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">文档资源</h3>
        <div class="space-y-3">
          <NuxtLink to="/dev/docs" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <UIcon name="i-lucide-file-text" class="w-5 h-5 text-primary-500" />
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">快速入门指南</p>
              <p class="text-xs text-gray-500">5分钟快速上手</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-400" />
          </NuxtLink>
          <NuxtLink to="/dev/docs" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <UIcon name="i-lucide-code-2" class="w-5 h-5 text-primary-500" />
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">API 参考文档</p>
              <p class="text-xs text-gray-500">完整的接口说明与示例</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-400" />
          </NuxtLink>
          <NuxtLink to="/dev/docs" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <UIcon name="i-lucide-book-open" class="w-5 h-5 text-primary-500" />
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">最佳实践</p>
              <p class="text-xs text-gray-500">行业场景与使用技巧</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-400" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ============================== -->
    <!-- Modal: Charging Pack Selection -->
    <!-- ============================== -->
    <Teleport to="body">
      <div
        v-if="showChargingPackModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="showChargingPackModal = false" />

        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">选择充能包</h2>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              @click="showChargingPackModal = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <!-- Success Alert -->
          <div v-if="purchaseSuccess" class="mx-6 mt-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
              <span class="text-sm font-medium text-green-700">购买成功！充能包已到账</span>
            </div>
          </div>

          <!-- Pack Cards -->
          <div class="p-6 space-y-4">
            <div
              v-for="pack in chargingPacks"
              :key="pack.id"
              class="relative rounded-xl border p-5 transition-all"
              :class="pack.popular
                ? 'border-primary-300 bg-primary-50/30 shadow-sm'
                : 'border-gray-100 hover:border-gray-200'"
            >
              <!-- Popular Badge -->
              <span
                v-if="pack.popular"
                class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-bold"
              >
                最受欢迎
              </span>

              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-bold text-gray-900">{{ pack.name }}</h3>
                  <p class="text-2xl font-bold text-primary-600 mt-1">
                    {{ pack.price }}
                    <span v-if="pack.originalPrice" class="text-sm font-normal text-gray-400 line-through ml-2">{{ pack.originalPrice }}</span>
                  </p>
                  <p class="text-sm text-gray-500 mt-1">{{ pack.tokens }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ pack.unitPrice }}</p>
                </div>
                <UButton
                  label="购买"
                  :color="pack.popular ? 'primary' : 'neutral'"
                  :variant="pack.popular ? 'solid' : 'outline'"
                  size="sm"
                  @click="handlePurchasePack(pack.id)"
                />
              </div>

              <!-- Features -->
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="feature in pack.features"
                  :key="feature"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-gray-50 text-gray-600"
                >
                  <UIcon name="i-lucide-check" class="w-3 h-3 text-green-500" />
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================== -->
    <!-- Modal: Integration Guide       -->
    <!-- ============================== -->
    <Teleport to="body">
      <div
        v-if="showIntegrationModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="showIntegrationModal = false" />

        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">接入引导</h2>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              @click="showIntegrationModal = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <!-- Steps -->
          <div class="p-6 space-y-6">
            <!-- Step 1: Create API Key -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <h3 class="text-sm font-semibold text-gray-900">创建API Key</h3>
              </div>
              <p class="text-xs text-gray-500 pl-10">前往API Key管理页面创建您的专属密钥</p>
              <div class="pl-10">
                <NuxtLink
                  to="/console/keys/create"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
                >
                  <UIcon name="i-lucide-key" class="w-4 h-4" />
                  前往创建
                </NuxtLink>
              </div>
            </div>

            <!-- Step 2: Install SDK -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <h3 class="text-sm font-semibold text-gray-900">安装SDK</h3>
              </div>
              <p class="text-xs text-gray-500 pl-10">通过pip快速安装奇安信AI SDK</p>
              <div class="pl-10 relative">
                <div class="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                  {{ sdkInstallCode }}
                </div>
                <button
                  class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  @click="copyCode(2, sdkInstallCode)"
                >
                  <UIcon
                    :name="copiedStep === 2 ? 'i-lucide-check' : 'i-lucide-copy'"
                    class="w-4 h-4"
                    :class="copiedStep === 2 ? 'text-green-400' : 'text-gray-400'"
                  />
                </button>
              </div>
            </div>

            <!-- Step 3: Call API -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <h3 class="text-sm font-semibold text-gray-900">调用API</h3>
              </div>
              <p class="text-xs text-gray-500 pl-10">使用以下代码快速调用{{ capability.name }}</p>
              <div class="pl-10 relative">
                <div class="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto whitespace-pre">{{ apiCallCode }}</div>
                <button
                  class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  @click="copyCode(3, apiCallCode)"
                >
                  <UIcon
                    :name="copiedStep === 3 ? 'i-lucide-check' : 'i-lucide-copy'"
                    class="w-4 h-4"
                    :class="copiedStep === 3 ? 'text-green-400' : 'text-gray-400'"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================== -->
    <!-- Modal: Enterprise Batch Purchase -->
    <!-- ============================== -->
    <Teleport to="body">
      <div
        v-if="showEnterpriseModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="showEnterpriseModal = false" />

        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">企业批量采购</h2>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              @click="showEnterpriseModal = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <!-- Form -->
          <div class="p-6 space-y-5">
            <!-- Success Alert -->
            <div v-if="enterpriseSuccess" class="px-4 py-3 rounded-xl bg-green-50 border border-green-200">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
                <span class="text-sm font-medium text-green-700">提交成功！我们将在1个工作日内联系您</span>
              </div>
            </div>

            <div class="space-y-4">
              <!-- Estimated Monthly Calls -->
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-gray-700">预估月调用量</label>
                <UInput
                  placeholder="例如：100万次/月"
                  size="md"
                />
              </div>

              <!-- Contact Info -->
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-gray-700">联系方式</label>
                <UInput
                  placeholder="手机号或邮箱"
                  size="md"
                />
              </div>
            </div>

            <!-- Note -->
            <div class="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <UIcon name="i-lucide-info" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p class="text-xs text-amber-700 leading-relaxed">企业客户享受专属折扣，我们将在1个工作日内联系您</p>
            </div>

            <!-- Submit Button -->
            <UButton
              label="提交咨询"
              icon="i-lucide-send"
              color="primary"
              block
              size="lg"
              @click="handleEnterpriseSubmit"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
