<script setup lang="ts">
import type { TemplateModule, ModuleType } from '~/data/mock'

const props = defineProps<{
  module: TemplateModule
}>()

const emit = defineEmits<{
  'update:module': [module: TemplateModule]
}>()

// Reactive access to module props
const moduleProps = computed({
  get: () => props.module.props,
  set: (val) => emit('update:module', { ...props.module, props: val })
})

function updateProp(key: string, value: any) {
  moduleProps.value = { ...moduleProps.value, [key]: value }
}

// Module type config metadata
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

const gradientOptions = [
  { label: '紫蓝渐变', value: 'from-primary-600 to-primary-400' },
  { label: '深紫渐变', value: 'from-primary-800 to-primary-600' },
  { label: '红紫渐变', value: 'from-red-600 to-primary-500' },
  { label: '青紫渐变', value: 'from-accent-600 to-primary-500' },
  { label: '蓝紫渐变', value: 'from-blue-600 to-primary-500' },
  { label: '橙紫渐变', value: 'from-orange-600 to-primary-500' }
]

const layoutOptions = [
  { label: '网格', value: 'grid' },
  { label: '列表', value: 'list' },
  { label: '卡片', value: 'cards' }
]

const backgroundStyleOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '渐变', value: 'gradient' }
]

const introLayoutOptions = [
  { label: '左右', value: 'left-right' },
  { label: '右左', value: 'right-left' },
  { label: '居中', value: 'center' }
]

const columnOptions = [
  { label: '2列', value: 2 },
  { label: '3列', value: 3 },
  { label: '4列', value: 4 }
]

const directionOptions = [
  { label: '垂直', value: 'vertical' },
  { label: '水平', value: 'horizontal' }
]

// Items list management
function addItem(key: string, template: Record<string, any>) {
  const items = [...(moduleProps.value[key] || []), { ...template }]
  updateProp(key, items)
}

function removeItem(key: string, index: number | string) {
  const idx = Number(index)
  const items = [...(moduleProps.value[key] || [])]
  items.splice(idx, 1)
  updateProp(key, items)
}

function updateItem(key: string, index: number | string, field: string, value: any) {
  const idx = Number(index)
  const items = [...(moduleProps.value[key] || [])]
  items[idx] = { ...items[idx], [field]: value }
  updateProp(key, items)
}

// Tab children management
function addTab() {
  const tabs = [...(moduleProps.value.tabs || []), { name: '新标签', children: [] }]
  updateProp('tabs', tabs)
}

function removeTab(index: number | string) {
  const idx = Number(index)
  const tabs = [...(moduleProps.value.tabs || [])]
  tabs.splice(idx, 1)
  updateProp('tabs', tabs)
}

function updateTabName(index: number | string, name: string) {
  const idx = Number(index)
  const tabs = [...(moduleProps.value.tabs || [])]
  tabs[idx] = { ...tabs[idx], name }
  updateProp('tabs', tabs)
}

// Spacing helpers
const spacingOptions = [
  { label: '极小', value: 'xs' },
  { label: '小', value: 'sm' },
  { label: '中', value: 'md' },
  { label: '大', value: 'lg' }
]

const bgOptions = [
  { label: '白色', value: 'white' },
  { label: '灰色', value: 'gray' },
  { label: '主题浅色', value: 'primary-light' }
]

function updateSpacing(key: 'top' | 'bottom', value: any) {
  emit('update:module', {
    ...props.module,
    spacing: { ...props.module.spacing, [key]: value }
  })
}

function updateBackground(value: any) {
  emit('update:module', { ...props.module, background: value as TemplateModule['background'] })
}

function updateVisibility(value: boolean) {
  emit('update:module', { ...props.module, visible: value })
}

// Related ids management
function addRelatedId() {
  const ids = [...(moduleProps.value.ids || []), '']
  updateProp('ids', ids)
}

function removeRelatedId(index: number | string) {
  const idx = Number(index)
  const ids = [...(moduleProps.value.ids || [])]
  ids.splice(idx, 1)
  updateProp('ids', ids)
}

function updateRelatedId(index: number | string, value: string) {
  const idx = Number(index)
  const ids = [...(moduleProps.value.ids || [])]
  ids[idx] = value
  updateProp('ids', ids)
}
</script>

<template>
  <div class="space-y-5">
    <!-- Module header -->
    <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
      <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
        <UIcon :name="moduleTypeIcons[module.type]" class="w-4 h-4 text-primary-600" />
      </div>
      <div>
        <h3 class="text-sm font-semibold text-gray-900">{{ moduleTypeLabels[module.type] }}模块</h3>
        <p class="text-xs text-gray-400">ID: {{ module.id }}</p>
      </div>
    </div>

    <!-- Common: Visibility & Spacing -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-medium text-gray-600">显示模块</label>
        <UToggle
          :model-value="module.visible"
          @update:model-value="updateVisibility"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">上间距</label>
          <USelect
            :model-value="module.spacing?.top || 'md'"
            :options="spacingOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateSpacing('top', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">下间距</label>
          <USelect
            :model-value="module.spacing?.bottom || 'md'"
            :options="spacingOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateSpacing('bottom', $event)"
          />
        </div>
      </div>

      <div>
        <label class="text-xs font-medium text-gray-600 mb-1 block">背景色</label>
        <USelect
          :model-value="module.background || 'white'"
          :options="bgOptions"
          value-attribute="value"
          option-attribute="label"
          size="sm"
          @update:model-value="updateBackground"
        />
      </div>
    </div>

    <div class="border-t border-gray-100 pt-4 space-y-4">
      <!-- ==================== BANNER ==================== -->
      <template v-if="module.type === 'banner'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="横幅标题"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">副标题</label>
          <UTextarea
            :model-value="moduleProps.subtitle || ''"
            placeholder="横幅副标题"
            :rows="2"
            size="sm"
            @update:model-value="updateProp('subtitle', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">渐变色</label>
          <USelect
            :model-value="moduleProps.gradient || 'from-primary-600 to-primary-400'"
            :options="gradientOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateProp('gradient', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">徽标</label>
          <UInput
            :model-value="moduleProps.badge || ''"
            placeholder="如: 新品上线"
            size="sm"
            @update:model-value="updateProp('badge', $event)"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1 block">CTA文字</label>
            <UInput
              :model-value="moduleProps.ctaText || ''"
              placeholder="立即体验"
              size="sm"
              @update:model-value="updateProp('ctaText', $event)"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600 mb-1 block">CTA链接</label>
            <UInput
              :model-value="moduleProps.ctaLink || ''"
              placeholder="#"
              size="sm"
              @update:model-value="updateProp('ctaLink', $event)"
            />
          </div>
        </div>
      </template>

      <!-- ==================== HERO ==================== -->
      <template v-if="module.type === 'hero'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="英雄区标题"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">描述</label>
          <UTextarea
            :model-value="moduleProps.description || ''"
            placeholder="英雄区描述"
            :rows="3"
            size="sm"
            @update:model-value="updateProp('description', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">背景样式</label>
          <USelect
            :model-value="moduleProps.backgroundStyle || 'gradient'"
            :options="backgroundStyleOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateProp('backgroundStyle', $event)"
          />
        </div>
      </template>

      <!-- ==================== INTRO ==================== -->
      <template v-if="module.type === 'intro'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="介绍标题"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">正文</label>
          <UTextarea
            :model-value="moduleProps.body || ''"
            placeholder="介绍正文"
            :rows="4"
            size="sm"
            @update:model-value="updateProp('body', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">布局</label>
          <USelect
            :model-value="moduleProps.layout || 'left-right'"
            :options="introLayoutOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateProp('layout', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">图片URL</label>
          <UInput
            :model-value="moduleProps.image || ''"
            placeholder="https://..."
            size="sm"
            @update:model-value="updateProp('image', $event)"
          />
        </div>
      </template>

      <!-- ==================== FEATURES ==================== -->
      <template v-if="module.type === 'features'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="核心特性"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">布局</label>
          <USelect
            :model-value="moduleProps.layout || 'grid'"
            :options="layoutOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateProp('layout', $event)"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">特性列表</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('items', { icon: 'i-lucide-star', title: '', description: '' })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(item, i) in (moduleProps.items || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('items', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <label class="text-xs text-gray-500 mb-0.5 block">图标</label>
                <AdminIconPicker
                  :model-value="item.icon || 'i-lucide-star'"
                  @update:model-value="updateItem('items', i, 'icon', $event)"
                />
              </div>
              <UInput
                :model-value="item.title"
                placeholder="特性标题"
                size="sm"
                @update:model-value="updateItem('items', i, 'title', $event)"
              />
              <UTextarea
                :model-value="item.description || ''"
                placeholder="特性描述"
                :rows="2"
                size="sm"
                @update:model-value="updateItem('items', i, 'description', $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== ADVANTAGES ==================== -->
      <template v-if="module.type === 'advantages'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="优势对比"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">对比项</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('items', { advantage: '', traditional: '' })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(item, i) in (moduleProps.items || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('items', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <UInput
                :model-value="item.advantage"
                placeholder="我们的优势"
                size="sm"
                @update:model-value="updateItem('items', i, 'advantage', $event)"
              />
              <UInput
                :model-value="item.traditional"
                placeholder="传统方式"
                size="sm"
                @update:model-value="updateItem('items', i, 'traditional', $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== SCENARIOS ==================== -->
      <template v-if="module.type === 'scenarios'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="应用场景"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">布局</label>
          <USelect
            :model-value="moduleProps.layout || 'cards'"
            :options="layoutOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateProp('layout', $event)"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">场景列表</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('items', { icon: 'i-lucide-target', title: '', description: '' })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(item, i) in (moduleProps.items || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('items', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <AdminIconPicker
                :model-value="item.icon || 'i-lucide-target'"
                @update:model-value="updateItem('items', i, 'icon', $event)"
              />
              <UInput
                :model-value="item.title"
                placeholder="场景标题"
                size="sm"
                @update:model-value="updateItem('items', i, 'title', $event)"
              />
              <UTextarea
                :model-value="item.description || ''"
                placeholder="场景描述"
                :rows="2"
                size="sm"
                @update:model-value="updateItem('items', i, 'description', $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== TABS ==================== -->
      <template v-if="module.type === 'tabs'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="标签页标题"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">标签页列表</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addTab"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加标签
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(tab, i) in (moduleProps.tabs || [])"
              :key="i"
              class="flex items-center gap-2"
            >
              <UIcon name="i-lucide-grip-vertical" class="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
              <UInput
                :model-value="tab.name"
                :placeholder="`标签 ${Number(i) + 1}`"
                size="sm"
                class="flex-1"
                @update:model-value="updateTabName(i, $event)"
              />
              <button
                class="p-1.5 text-gray-400 hover:text-red-500 rounded"
                @click="removeTab(i)"
              >
                <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== CAROUSEL ==================== -->
      <template v-if="module.type === 'carousel'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="轮播标题"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-xs font-medium text-gray-600">自动播放</label>
          <UToggle
            :model-value="moduleProps.autoplay || false"
            @update:model-value="updateProp('autoplay', $event)"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">轮播项</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('items', { image: '', title: '', description: '' })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(item, i) in (moduleProps.items || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('items', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <UInput
                :model-value="item.image || ''"
                placeholder="图片URL"
                size="sm"
                @update:model-value="updateItem('items', i, 'image', $event)"
              />
              <UInput
                :model-value="item.title || ''"
                placeholder="标题"
                size="sm"
                @update:model-value="updateItem('items', i, 'title', $event)"
              />
              <UTextarea
                :model-value="item.description || ''"
                placeholder="描述"
                :rows="2"
                size="sm"
                @update:model-value="updateItem('items', i, 'description', $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== CARDS ==================== -->
      <template v-if="module.type === 'cards'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="卡片标题"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">列数</label>
          <USelect
            :model-value="moduleProps.columns || 3"
            :options="columnOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateProp('columns', $event)"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">卡片列表</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('items', { icon: 'i-lucide-star', title: '', description: '' })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(item, i) in (moduleProps.items || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('items', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <AdminIconPicker
                :model-value="item.icon || 'i-lucide-star'"
                @update:model-value="updateItem('items', i, 'icon', $event)"
              />
              <UInput
                :model-value="item.title"
                placeholder="卡片标题"
                size="sm"
                @update:model-value="updateItem('items', i, 'title', $event)"
              />
              <UTextarea
                :model-value="item.description || ''"
                placeholder="卡片描述"
                :rows="2"
                size="sm"
                @update:model-value="updateItem('items', i, 'description', $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== STEPS ==================== -->
      <template v-if="module.type === 'steps'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="使用步骤"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">方向</label>
          <USelect
            :model-value="moduleProps.direction || 'vertical'"
            :options="directionOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            @update:model-value="updateProp('direction', $event)"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">步骤列表</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('items', { icon: 'i-lucide-rocket', title: '', description: '' })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(item, i) in (moduleProps.items || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('items', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <AdminIconPicker
                :model-value="item.icon || 'i-lucide-rocket'"
                @update:model-value="updateItem('items', i, 'icon', $event)"
              />
              <UInput
                :model-value="item.title"
                placeholder="步骤标题"
                size="sm"
                @update:model-value="updateItem('items', i, 'title', $event)"
              />
              <UTextarea
                :model-value="item.description || ''"
                placeholder="步骤描述"
                :rows="2"
                size="sm"
                @update:model-value="updateItem('items', i, 'description', $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== PRICING ==================== -->
      <template v-if="module.type === 'pricing'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="定价方案"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-xs font-medium text-gray-600">使用默认方案</label>
          <UToggle
            :model-value="moduleProps.useDefault !== false"
            @update:model-value="updateProp('useDefault', $event)"
          />
        </div>
        <div v-if="!moduleProps.useDefault">
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">自定义方案</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('plans', { name: '', price: 0, billingCycle: 'monthly', features: [] })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(plan, i) in (moduleProps.plans || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('plans', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <UInput
                :model-value="plan.name"
                placeholder="方案名称"
                size="sm"
                @update:model-value="updateItem('plans', i, 'name', $event)"
              />
              <UInput
                :model-value="plan.price"
                placeholder="价格"
                size="sm"
                type="number"
                @update:model-value="updateItem('plans', i, 'price', Number($event))"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== INTEGRATION ==================== -->
      <template v-if="module.type === 'integration'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="接入指南"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="text-xs font-medium text-gray-600">使用默认步骤</label>
          <UToggle
            :model-value="moduleProps.useDefault !== false"
            @update:model-value="updateProp('useDefault', $event)"
          />
        </div>
        <div v-if="!moduleProps.useDefault">
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">自定义步骤</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addItem('steps', { title: '', description: '', code: '' })"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(step, i) in (moduleProps.steps || [])"
              :key="i"
              class="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">#{{ Number(i) + 1 }}</span>
                <button
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                  @click="removeItem('steps', i)"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              <UInput
                :model-value="step.title"
                placeholder="步骤标题"
                size="sm"
                @update:model-value="updateItem('steps', i, 'title', $event)"
              />
              <UTextarea
                :model-value="step.description || ''"
                placeholder="步骤描述"
                :rows="2"
                size="sm"
                @update:model-value="updateItem('steps', i, 'description', $event)"
              />
              <UTextarea
                :model-value="step.code || ''"
                placeholder="代码示例"
                :rows="2"
                size="sm"
                @update:model-value="updateItem('steps', i, 'code', $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== RELATED ==================== -->
      <template v-if="module.type === 'related'">
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">标题</label>
          <UInput
            :model-value="moduleProps.title || ''"
            placeholder="相关推荐"
            size="sm"
            @update:model-value="updateProp('title', $event)"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">最大数量</label>
          <UInput
            :model-value="moduleProps.maxCount || 4"
            type="number"
            placeholder="4"
            size="sm"
            @update:model-value="updateProp('maxCount', Number($event))"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-gray-600">关联ID列表</label>
            <button
              class="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
              @click="addRelatedId"
            >
              <UIcon name="i-lucide-plus" class="w-3 h-3" />
              添加
            </button>
          </div>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="(id, i) in (moduleProps.ids || [])"
              :key="i"
              class="flex items-center gap-2"
            >
              <UInput
                :model-value="id"
                placeholder="能力ID"
                size="sm"
                class="flex-1"
                @update:model-value="updateRelatedId(i, $event)"
              />
              <button
                class="p-1.5 text-gray-400 hover:text-red-500 rounded"
                @click="removeRelatedId(i)"
              >
                <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
