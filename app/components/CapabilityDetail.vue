<script setup lang="ts">
import type { Model, App, Activity } from '~/data/mock'
import { activities } from '~/data/mock'

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
      <div class="flex items-center gap-2 shrink-0">
        <UButton
          v-if="isModel"
          label="体验模型"
          icon="i-lucide-play"
          color="primary"
          size="lg"
          to="/dev/playground"
        />
        <UButton
          v-else-if="app?.type === 'chat'"
          label="开始对话"
          icon="i-lucide-message-circle"
          color="accent"
          size="lg"
        />
        <UButton
          v-else-if="app?.type === 'showcase'"
          label="查看演示"
          icon="i-lucide-eye"
          color="accent"
          size="lg"
        />
        <UButton
          v-else
          label="立即使用"
          icon="i-lucide-arrow-right"
          color="accent"
          size="lg"
          trailing
        />
        <UButton
          icon="i-lucide-heart"
          variant="outline"
          color="neutral"
          size="lg"
        />
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

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Model Info Card -->
          <div v-if="isModel && model" class="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 class="text-sm font-semibold text-gray-900">模型信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">参数规模</span>
                <span class="text-xs font-semibold text-gray-900">{{ model.parameters }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">输入定价</span>
                <span class="text-xs font-semibold text-primary-600">{{ model.pricing.input }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">输出定价</span>
                <span class="text-xs font-semibold text-primary-600">{{ model.pricing.output }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">调用次数</span>
                <span class="text-xs font-semibold text-gray-900">{{ model.callCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">API端点</span>
                <span class="text-xs font-mono text-gray-600">{{ model.apiEndpoint }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <UButton label="获取API Key" icon="i-lucide-key" color="primary" block size="sm" to="/dev/keys" />
              <UButton label="立即体验" icon="i-lucide-play" color="primary" variant="outline" block size="sm" to="/dev/playground" />
            </div>
          </div>

          <!-- App Info Card -->
          <div v-else-if="app" class="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 class="text-sm font-semibold text-gray-900">应用信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">类型</span>
                <span class="text-xs font-semibold text-gray-900">{{ app.typeName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">活跃用户</span>
                <span class="text-xs font-semibold text-gray-900">{{ app.useCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">评分</span>
                <span class="text-xs font-semibold text-gray-900">{{ app.rating }}/5.0</span>
              </div>
            </div>
            <UButton
              :label="app.type === 'chat' ? '开始对话' : '立即使用'"
              :icon="app.type === 'chat' ? 'i-lucide-message-circle' : 'i-lucide-arrow-right'"
              color="accent"
              block
              size="sm"
            />
          </div>

          <!-- Cross-system links -->
          <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900">快速入口</h3>
            <NuxtLink
              to="/dev/docs"
              class="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UIcon name="i-lucide-book-open" class="w-4 h-4 text-primary-500" />
              <span class="text-sm text-gray-700">API文档</span>
              <UIcon name="i-lucide-external-link" class="w-3 h-3 text-gray-400 ml-auto" />
            </NuxtLink>
            <NuxtLink
              to="/dev/keys"
              class="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UIcon name="i-lucide-key" class="w-4 h-4 text-primary-500" />
              <span class="text-sm text-gray-700">获取API Key</span>
              <UIcon name="i-lucide-external-link" class="w-3 h-3 text-gray-400 ml-auto" />
            </NuxtLink>
            <NuxtLink
              to="/dev/packs"
              class="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UIcon name="i-lucide-package" class="w-4 h-4 text-primary-500" />
              <span class="text-sm text-gray-700">购买充能包</span>
              <UIcon name="i-lucide-external-link" class="w-3 h-3 text-gray-400 ml-auto" />
            </NuxtLink>
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
          <UButton label="购买充能包" icon="i-lucide-package" color="primary" to="/dev/packs" />
          <UButton label="获取API Key" icon="i-lucide-key" variant="outline" color="primary" to="/dev/keys" />
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
  </div>
</template>
