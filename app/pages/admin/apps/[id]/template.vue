<script setup lang="ts">
import { apps, getDefaultTemplate } from '~/data/mock'
import type { PageTemplate, TemplateModule, ModuleType } from '~/data/mock'

const route = useRoute()
const appId = route.params.id as string
const app = apps.find(a => a.id === appId)

useHead({ title: `${app?.name || '应用'} 模板配置 - 奇安信AI运营后台` })

// Load template from localStorage or use default
const storageKey = `admin-template-${appId}`
const savedTemplate = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null

const template = reactive<PageTemplate>(
  savedTemplate
    ? JSON.parse(savedTemplate)
    : getDefaultTemplate('app', appId, app?.type)
)

const selectedModuleId = ref<string | null>(null)
const showAddMenu = ref(false)

const selectedModule = computed(() =>
  template.modules.find(m => m.id === selectedModuleId.value) || null
)

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
  if (!moved) return
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
          <NuxtLink to="/admin/apps" class="hover:text-primary-600 transition-colors">应用管理</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-gray-700">{{ app?.name || '应用' }}</span>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-gray-700">模板配置</span>
        </div>

        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">应用详情页模板配置</h1>
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
              :capability="app"
              capability-type="app"
              @select-module="selectModule"
            />
          </div>

          <!-- Right: Module Editor (w-80) -->
          <div class="w-80 shrink-0">
            <div class="bg-white rounded-xl border border-gray-100 p-4 sticky top-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              <template v-if="selectedModule">
                <AdminModuleEditor
                  :module="selectedModule"
                  @update:module="updateModule"
                />
              </template>
              <div v-else class="text-center py-12 text-gray-400">
                <UIcon name="i-lucide-mouse-pointer-click" class="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p class="text-sm">请选择一个模块进行编辑</p>
                <p class="text-xs mt-1">点击左侧列表或中间预览区</p>
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
