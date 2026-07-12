<script setup lang="ts">
import { activities, models, apps, getDefaultTemplate } from '~/data/mock'
import type { PageTemplate, TemplateModule, ModuleType } from '~/data/mock'

const route = useRoute()
const activityId = route.params.id as string
const activity = activities.find(a => a.id === activityId)

useHead({ title: `${activity?.title || '活动'} 模板配置 - 奇安信AI运营后台` })

// Load template from localStorage or use default
const storageKey = `admin-template-${activityId}`
const savedTemplate = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null

// Activity templates use 'model' as base type since there's no 'activity' targetType
const template = reactive<PageTemplate>(
  savedTemplate
    ? JSON.parse(savedTemplate)
    : {
        id: `tpl-${activityId}`,
        targetType: 'model' as const,
        targetId: activityId,
        theme: { bgStyle: 'light' as const },
        modules: [
          {
            id: 'mod-banner-1',
            type: 'banner' as ModuleType,
            visible: true,
            order: 1,
            props: {
              gradient: activity?.gradient || 'from-primary-700 via-primary-600 to-accent-500',
              title: activity?.title || '',
              subtitle: activity?.subtitle || '',
              badge: activity?.discount || '',
              ctaText: activity?.ctaText || '立即参与'
            },
            spacing: { top: 'md' as const, bottom: 'md' as const },
            background: 'white' as const
          },
          {
            id: 'mod-intro-2',
            type: 'intro' as ModuleType,
            visible: true,
            order: 2,
            props: {
              title: '活动详情',
              body: activity?.description || ''
            },
            spacing: { top: 'md' as const, bottom: 'md' as const },
            background: 'white' as const
          },
          {
            id: 'mod-advantages-3',
            type: 'advantages' as ModuleType,
            visible: true,
            order: 3,
            props: {
              title: '活动权益',
              items: (activity?.benefits || []).map((b: string) => ({
                advantage: b,
                traditional: ''
              }))
            },
            spacing: { top: 'md' as const, bottom: 'md' as const },
            background: 'white' as const
          },
          {
            id: 'mod-related-4',
            type: 'related' as ModuleType,
            visible: true,
            order: 4,
            props: {
              title: '关联能力',
              maxCount: 4,
              ids: activity?.relatedCapabilityIds || []
            },
            spacing: { top: 'md' as const, bottom: 'md' as const },
            background: 'white' as const
          }
        ]
      }
)

const selectedModuleId = ref<string | null>(null)
const showAddMenu = ref(false)

const selectedModule = computed(() =>
  template.modules.find(m => m.id === selectedModuleId.value) || null
)

// Activity-specific config
const activityConfig = reactive({
  // Related capability selector
  relatedModelIds: activity?.relatedCapabilityIds?.filter(id => models.some(m => m.id === id)) || [],
  relatedAppIds: (activity?.relatedCapabilityIds || []).filter(id => apps.some(a => a.id === id)),
  // Discount plan config
  enableDiscount: !!(activity?.discountPlans?.length),
  discountPlans: activity?.discountPlans || [],
  // Countdown toggle
  enableCountdown: true,
  countdownEndDate: activity?.endDate || '',
  // Visual config
  gradient: activity?.gradient || 'from-primary-700 via-primary-600 to-accent-500',
  bgPattern: 'none' as string
})

const gradientPresets = [
  { label: '紫蓝渐变', value: 'from-primary-700 via-primary-600 to-accent-500' },
  { label: '深紫渐变', value: 'from-deep-800 via-primary-800 to-primary-600' },
  { label: '红紫渐变', value: 'from-red-700 via-red-600 to-primary-500' },
  { label: '青紫渐变', value: 'from-accent-700 via-accent-600 to-primary-500' },
  { label: '蓝紫渐变', value: 'from-blue-700 via-blue-600 to-primary-500' },
  { label: '橙紫渐变', value: 'from-orange-700 via-orange-600 to-primary-500' }
]

const bgPatterns = [
  { label: '无', value: 'none' },
  { label: '网格', value: 'grid' },
  { label: '圆点', value: 'dots' },
  { label: '波纹', value: 'waves' }
]

// Module type metadata
const moduleTypeLabels: Record<ModuleType, string> = {
  banner: '横幅',
  hero: '英雄区',
  intro: '介绍',
  features: '特性',
  advantages: '优势对比',
  scenarios: '场景',
  tabs: '标签页',
  carousel: '轮播',
  cards: '卡片',
  steps: '步骤',
  pricing: '定价',
  integration: '接入指南',
  related: '相关推荐'
}

const moduleTypeIcons: Record<ModuleType, string> = {
  banner: 'i-lucide-image',
  hero: 'i-lucide-sparkles',
  intro: 'i-lucide-file-text',
  features: 'i-lucide-layers',
  advantages: 'i-lucide-git-compare',
  scenarios: 'i-lucide-layout-grid',
  tabs: 'i-lucide-columns',
  carousel: 'i-lucide-gallery-horizontal-end',
  cards: 'i-lucide-square-stack',
  steps: 'i-lucide-list-ordered',
  pricing: 'i-lucide-tag',
  integration: 'i-lucide-plug',
  related: 'i-lucide-link'
}

const allModuleTypes: ModuleType[] = [
  'banner', 'hero', 'intro', 'features', 'advantages',
  'scenarios', 'tabs', 'carousel', 'cards', 'steps',
  'pricing', 'integration', 'related'
]

// Drag state
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragIndex.value = index
}

function onDragOver(index: number, e: DragEvent) {
  e.preventDefault()
  dragOverIndex.value = index
}

function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) {
    dragIndex.value = null
    dragOverIndex.value = null
    return
  }
  const modules = [...template.modules]
  const [moved] = modules.splice(dragIndex.value, 1)
  modules.splice(index, 0, moved)
  modules.forEach((m, i) => { m.order = i + 1 })
  template.modules = modules
  dragIndex.value = null
  dragOverIndex.value = null
}

function onDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
}

function selectModule(id: string) {
  selectedModuleId.value = id
}

function toggleVisibility(mod: TemplateModule) {
  mod.visible = !mod.visible
}

function addModule(type: ModuleType) {
  const order = template.modules.length + 1
  const newModule: TemplateModule = {
    id: `mod-${type}-${Date.now()}`,
    type,
    visible: true,
    order,
    props: {},
    spacing: { top: 'md', bottom: 'md' },
    background: 'white'
  }
  template.modules.push(newModule)
  selectedModuleId.value = newModule.id
  showAddMenu.value = false
}

function removeModule(id: string) {
  const index = template.modules.findIndex(m => m.id === id)
  if (index !== -1) {
    template.modules.splice(index, 1)
    if (selectedModuleId.value === id) {
      selectedModuleId.value = null
    }
  }
}

function updateModule(updated: TemplateModule) {
  const index = template.modules.findIndex(m => m.id === updated.id)
  if (index !== -1) {
    template.modules[index] = updated
  }
}

function addDiscountPlan() {
  activityConfig.discountPlans.push({ planId: '', discountPrice: 0 })
}

function removeDiscountPlan(index: number) {
  activityConfig.discountPlans.splice(index, 1)
}

function saveTemplate() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(template))
  }
  alert('模板配置已保存')
}

function onClickOutside() {
  showAddMenu.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <AdminSidebar />
    <div class="ml-60">
      <div class="p-6 md:p-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <NuxtLink to="/admin/activities" class="hover:text-primary-600 transition-colors">活动管理</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-gray-700">{{ activity?.title || '活动' }}</span>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-gray-700">模板配置</span>
        </div>

        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">活动详情页模板配置</h1>
          <div class="flex items-center gap-3">
            <button class="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              预览
            </button>
            <button
              class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              @click="saveTemplate"
            >
              保存配置
            </button>
          </div>
        </div>

        <!-- Three-column layout -->
        <div class="flex gap-4 items-start">
          <!-- Left: Module list (w-60) -->
          <div class="w-60 shrink-0">
            <div class="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-6">
              <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 class="text-sm font-semibold text-gray-700">模块列表</h2>
                <div class="relative">
                  <button
                    class="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    @click="showAddMenu = !showAddMenu"
                  >
                    <UIcon name="i-lucide-plus" class="w-3.5 h-3.5" />
                    添加
                  </button>
                  <div
                    v-if="showAddMenu"
                    class="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-gray-200 shadow-lg z-20 py-1 max-h-80 overflow-y-auto"
                    @click.stop
                  >
                    <button
                      v-for="type in allModuleTypes"
                      :key="type"
                      class="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      @click="addModule(type)"
                    >
                      <UIcon :name="moduleTypeIcons[type]" class="w-4 h-4" />
                      {{ moduleTypeLabels[type] }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="max-h-[calc(100vh-220px)] overflow-y-auto">
                <div
                  v-for="(mod, index) in template.modules"
                  :key="mod.id"
                  class="flex items-center gap-2 px-3 py-2.5 border-b border-gray-50 cursor-pointer transition-all duration-150"
                  :class="[
                    selectedModuleId === mod.id
                      ? 'bg-primary-50 border-l-2 border-l-primary-500'
                      : 'hover:bg-gray-50 border-l-2 border-l-transparent',
                    dragOverIndex === index && dragIndex !== index ? 'border-t-2 border-t-primary-400' : '',
                    !mod.visible ? 'opacity-50' : ''
                  ]"
                  draggable="true"
                  @dragstart="onDragStart(index)"
                  @dragover="onDragOver(index, $event)"
                  @drop="onDrop(index)"
                  @dragend="onDragEnd"
                  @click="selectModule(mod.id)"
                >
                  <UIcon name="i-lucide-grip-vertical" class="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
                  <div class="w-6 h-6 rounded flex items-center justify-center shrink-0"
                    :class="selectedModuleId === mod.id ? 'bg-primary-100' : 'bg-gray-100'"
                  >
                    <UIcon :name="moduleTypeIcons[mod.type]" class="w-3.5 h-3.5"
                      :class="selectedModuleId === mod.id ? 'text-primary-600' : 'text-gray-500'"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium truncate"
                      :class="selectedModuleId === mod.id ? 'text-primary-700' : 'text-gray-700'"
                    >
                      {{ mod.title || moduleTypeLabels[mod.type] }}
                    </p>
                  </div>
                  <button
                    class="p-0.5 rounded hover:bg-gray-200 transition-colors"
                    :title="mod.visible ? '隐藏模块' : '显示模块'"
                    @click.stop="toggleVisibility(mod)"
                  >
                    <UIcon
                      :name="mod.visible ? 'i-lucide-eye' : 'i-lucide-eye-off'"
                      class="w-3.5 h-3.5"
                      :class="mod.visible ? 'text-gray-400' : 'text-gray-300'"
                    />
                  </button>
                  <button
                    class="p-0.5 rounded hover:bg-red-50 hover:text-red-500 transition-colors text-gray-300"
                    title="删除模块"
                    @click.stop="removeModule(mod.id)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>

                <div
                  v-if="template.modules.length === 0"
                  class="text-center py-8 text-gray-400"
                >
                  <UIcon name="i-lucide-layout-template" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p class="text-xs">暂无模块</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Center: Template Preview (flex-1) -->
          <div class="flex-1 min-w-0">
            <AdminTemplatePreview
              :modules="template.modules"
              :selected-module-id="selectedModuleId"
              :capability="activity"
              capability-type="model"
              @select-module="selectModule"
            />
          </div>

          <!-- Right: Module Editor + Activity-specific config (w-80) -->
          <div class="w-80 shrink-0 space-y-4">
            <!-- Activity-specific config panel -->
            <div class="bg-white rounded-xl border border-gray-100 p-4 sticky top-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">活动专属配置</h3>

              <!-- Related capability selector -->
              <div class="space-y-3 mb-4">
                <div>
                  <label class="text-xs font-medium text-gray-600 mb-1.5 block">关联模型</label>
                  <div class="space-y-1.5 max-h-32 overflow-y-auto">
                    <label
                      v-for="m in models"
                      :key="m.id"
                      class="flex items-center gap-2 p-1.5 rounded border border-gray-100 hover:border-primary-200 transition-all cursor-pointer"
                    >
                      <input
                        v-model="activityConfig.relatedModelIds"
                        type="checkbox"
                        :value="m.id"
                        class="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      >
                      <span class="text-xs text-gray-700 truncate">{{ m.name }}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-600 mb-1.5 block">关联应用</label>
                  <div class="space-y-1.5 max-h-32 overflow-y-auto">
                    <label
                      v-for="a in apps"
                      :key="a.id"
                      class="flex items-center gap-2 p-1.5 rounded border border-gray-100 hover:border-primary-200 transition-all cursor-pointer"
                    >
                      <input
                        v-model="activityConfig.relatedAppIds"
                        type="checkbox"
                        :value="a.id"
                        class="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      >
                      <span class="text-xs text-gray-700 truncate">{{ a.name }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Discount plan config -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-medium text-gray-600">优惠方案配置</label>
                  <UToggle v-model="activityConfig.enableDiscount" />
                </div>
                <div v-if="activityConfig.enableDiscount" class="space-y-2">
                  <div
                    v-for="(plan, i) in activityConfig.discountPlans"
                    :key="i"
                    class="flex items-center gap-2"
                  >
                    <UInput
                      :model-value="plan.planId"
                      placeholder="方案ID"
                      size="sm"
                      class="flex-1"
                      @update:model-value="activityConfig.discountPlans[i].planId = $event"
                    />
                    <UInput
                      :model-value="plan.discountPrice"
                      placeholder="优惠价"
                      size="sm"
                      type="number"
                      class="w-20"
                      @update:model-value="activityConfig.discountPlans[i].discountPrice = Number($event)"
                    />
                    <button
                      class="p-1 text-gray-400 hover:text-red-500 rounded"
                      @click="removeDiscountPlan(i)"
                    >
                      <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                    @click="addDiscountPlan"
                  >
                    <UIcon name="i-lucide-plus" class="w-3 h-3" />
                    添加优惠方案
                  </button>
                </div>
              </div>

              <!-- Countdown toggle -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-medium text-gray-600">倒计时</label>
                  <UToggle v-model="activityConfig.enableCountdown" />
                </div>
                <div v-if="activityConfig.enableCountdown">
                  <UInput
                    v-model="activityConfig.countdownEndDate"
                    type="date"
                    size="sm"
                    placeholder="截止日期"
                  />
                </div>
              </div>

              <!-- Visual config -->
              <div class="mb-4">
                <label class="text-xs font-medium text-gray-600 mb-2 block">渐变色选择</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="preset in gradientPresets"
                    :key="preset.value"
                    class="rounded-lg p-2 border-2 transition-all text-left"
                    :class="activityConfig.gradient === preset.value ? 'border-primary-500 ring-1 ring-primary-200' : 'border-gray-100 hover:border-gray-200'"
                    @click="activityConfig.gradient = preset.value"
                  >
                    <div :class="['h-4 rounded bg-gradient-to-r mb-1', preset.value]" />
                    <p class="text-[10px] text-gray-500 leading-tight">{{ preset.label }}</p>
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-600 mb-2 block">背景图案</label>
                <div class="flex gap-2">
                  <button
                    v-for="pattern in bgPatterns"
                    :key="pattern.value"
                    class="px-3 py-1.5 rounded-lg border text-xs transition-all"
                    :class="activityConfig.bgPattern === pattern.value ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                    @click="activityConfig.bgPattern = pattern.value"
                  >
                    {{ pattern.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Module editor -->
            <div class="bg-white rounded-xl border border-gray-100 p-4 max-h-[calc(100vh-500px)] overflow-y-auto">
              <template v-if="selectedModule">
                <AdminModuleEditor
                  :module="selectedModule"
                  @update:module="updateModule"
                />
              </template>
              <div v-else class="text-center py-8 text-gray-400">
                <UIcon name="i-lucide-mouse-pointer-click" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p class="text-sm">请选择模块编辑</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showAddMenu"
    class="fixed inset-0 z-10"
    @click="onClickOutside"
  />
</template>
