<script setup lang="ts">
import { apps, models } from '~/data/mock'

const route = useRoute()
const appId = route.params.id as string
const app = apps.find(a => a.id === appId)

useHead({ title: `${app?.name || '应用'} 模板配置 - 奇安信AI运营后台` })

const appTypeOptions = [
  { value: 'chat', label: '对话型' },
  { value: 'tool', label: '工具型' },
  { value: 'showcase', label: '展示型' },
  { value: 'external-link', label: '外链型' }
]

const form = reactive({
  name: app?.name || '',
  description: app?.description || '',
  icon: app?.icon || 'i-lucide-layout-grid',
  type: app?.type || 'chat',
  // Chat type specific
  welcomeMessage: '您好，我是安全助手，请问有什么可以帮助您的？',
  exampleQuestions: ['如何检测SQL注入攻击？', 'OWASP Top 10有哪些？', '如何进行安全合规审计？'],
  relatedModel: 'qax-security-llm',
  // Tool type specific
  inputSchema: '{\n  "type": "object",\n  "properties": {\n    "target": { "type": "string", "description": "扫描目标" }\n  }\n}',
  outputFormat: 'JSON',
  // Showcase type specific
  showcaseContent: '',
  embedUrl: '',
  // External-link type specific
  externalUrl: app?.link || '',
  openMode: 'new-window',
  // Common
  features: app?.features ? [...app.features] : [''],
  relatedModels: [models[0]?.id || '']
})

const currentTypeLabel = computed(() => {
  const opt = appTypeOptions.find(o => o.value === form.type)
  return opt?.label || '对话型'
})

function addFeature() {
  form.features.push('')
}

function removeFeature(index: number) {
  form.features.splice(index, 1)
}

function addExampleQuestion() {
  form.exampleQuestions.push('')
}

function removeExampleQuestion(index: number) {
  form.exampleQuestions.splice(index, 1)
}

function saveTemplate() {
  alert('模板配置已保存')
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

        <!-- Two-column layout -->
        <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <!-- Left: Live Preview -->
          <div class="xl:col-span-2">
            <div class="bg-white rounded-xl border border-gray-100 p-4 sticky top-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-semibold text-gray-700">实时预览</h2>
                <span class="text-xs text-gray-400">Market 详情页效果</span>
              </div>
              <div class="border border-gray-200 rounded-lg overflow-hidden bg-[#FAFAFA]">
                <!-- Preview header -->
                <div class="p-5 border-b border-gray-100">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center" :style="{ backgroundColor: (app?.typeColor || '#7C3AED') + '15' }">
                      <UIcon :name="form.icon" class="w-6 h-6" :style="{ color: app?.typeColor || '#7C3AED' }" />
                    </div>
                    <div>
                      <h3 class="font-bold text-base text-gray-900">{{ form.name || '应用名称' }}</h3>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="px-1.5 py-0.5 rounded text-xs font-medium" :class="form.type === 'chat' ? 'bg-primary-50 text-primary-600' : form.type === 'tool' ? 'bg-amber-50 text-amber-600' : form.type === 'showcase' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'">
                          {{ currentTypeLabel }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 line-clamp-2">{{ form.description || '应用描述' }}</p>
                </div>
                <!-- Preview body -->
                <div class="p-4 space-y-4">
                  <!-- Chat preview -->
                  <template v-if="form.type === 'chat'">
                    <div class="bg-primary-50 rounded-lg p-3">
                      <p class="text-xs text-primary-700">{{ form.welcomeMessage }}</p>
                    </div>
                    <div class="space-y-1.5">
                      <div
                        v-for="(q, i) in form.exampleQuestions.filter(Boolean).slice(0, 3)"
                        :key="i"
                        class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600"
                      >
                        {{ q }}
                      </div>
                    </div>
                  </template>
                  <!-- Tool preview -->
                  <template v-else-if="form.type === 'tool'">
                    <div class="border border-gray-200 rounded-lg p-3">
                      <p class="text-xs text-gray-500 mb-2">输入表单</p>
                      <div class="h-6 bg-gray-100 rounded mb-2"></div>
                      <div class="h-6 bg-primary-500 rounded w-20"></div>
                    </div>
                  </template>
                  <!-- Showcase preview -->
                  <template v-else-if="form.type === 'showcase'">
                    <div class="border border-gray-200 rounded-lg h-24 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                      <UIcon name="i-lucide-monitor" class="w-8 h-8 text-primary-400" />
                    </div>
                  </template>
                  <!-- External link preview -->
                  <template v-else>
                    <div class="border border-gray-200 rounded-lg p-3 flex items-center gap-2">
                      <UIcon name="i-lucide-external-link" class="w-4 h-4 text-blue-500" />
                      <span class="text-xs text-blue-600">{{ form.externalUrl || 'https://...' }}</span>
                    </div>
                  </template>
                  <!-- Features -->
                  <div>
                    <h4 class="text-xs font-semibold text-gray-700 mb-2">功能特性</h4>
                    <div class="space-y-1">
                      <div
                        v-for="(f, i) in form.features.filter(Boolean).slice(0, 4)"
                        :key="i"
                        class="flex items-center gap-2"
                      >
                        <UIcon name="i-lucide-check-circle-2" class="w-3 h-3 text-primary-500" />
                        <span class="text-xs text-gray-600">{{ f }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Configuration Form -->
          <div class="xl:col-span-3 space-y-6">
            <!-- 基本信息 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">基本信息</h2>
              <p class="text-xs text-gray-400 mb-5">配置应用在详情页展示的基本信息</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">应用名称</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">应用描述</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">图标</label>
                    <input
                      v-model="form.icon"
                      type="text"
                      placeholder="i-lucide-layout-grid"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">应用类型</label>
                    <select
                      v-model="form.type"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300"
                    >
                      <option v-for="opt in appTypeOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- 对话型配置 -->
            <div v-if="form.type === 'chat'" class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">对话型配置</h2>
              <p class="text-xs text-gray-400 mb-5">配置对话应用特有的交互参数</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">欢迎语</label>
                  <input
                    v-model="form.welcomeMessage"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-sm font-medium text-gray-700">示例问题</label>
                    <button
                      class="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
                      @click="addExampleQuestion"
                    >
                      <UIcon name="i-lucide-plus" class="w-3 h-3" />
                      添加
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(q, index) in form.exampleQuestions"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="form.exampleQuestions[index]"
                        type="text"
                        class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                        :placeholder="`示例问题 ${index + 1}`"
                      >
                      <button
                        class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        @click="removeExampleQuestion(index)"
                      >
                        <UIcon name="i-lucide-x" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">关联模型</label>
                  <select
                    v-model="form.relatedModel"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300"
                  >
                    <option v-for="m in models" :key="m.id" :value="m.id">{{ m.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 工具型配置 -->
            <div v-if="form.type === 'tool'" class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">工具型配置</h2>
              <p class="text-xs text-gray-400 mb-5">配置工具应用的输入输出参数</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">输入表单配置 (JSON Schema)</label>
                  <textarea
                    v-model="form.inputSchema"
                    rows="6"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
                  <select
                    v-model="form.outputFormat"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300"
                  >
                    <option value="JSON">JSON</option>
                    <option value="Text">Text</option>
                    <option value="HTML">HTML</option>
                    <option value="Markdown">Markdown</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 展示型配置 -->
            <div v-if="form.type === 'showcase'" class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">展示型配置</h2>
              <p class="text-xs text-gray-400 mb-5">配置展示应用的内容与嵌入页面</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">展示内容编辑</label>
                  <textarea
                    v-model="form.showcaseContent"
                    rows="4"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                    placeholder="输入展示内容描述..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">嵌入页面URL</label>
                  <input
                    v-model="form.embedUrl"
                    type="text"
                    placeholder="https://..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
              </div>
            </div>

            <!-- 外链型配置 -->
            <div v-if="form.type === 'external-link'" class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">外链型配置</h2>
              <p class="text-xs text-gray-400 mb-5">配置外链应用的跳转地址与打开方式</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">外链URL</label>
                  <input
                    v-model="form.externalUrl"
                    type="text"
                    placeholder="https://..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">打开方式</label>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="form.openMode"
                        type="radio"
                        value="new-window"
                        class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      >
                      <span class="text-sm text-gray-700">新窗口</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="form.openMode"
                        type="radio"
                        value="iframe"
                        class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span class="text-sm text-gray-700">iframe嵌入</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 功能特性 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-base font-semibold text-gray-900">功能特性</h2>
                <button
                  class="flex items-center gap-1 px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  @click="addFeature"
                >
                  <UIcon name="i-lucide-plus" class="w-3 h-3" />
                  添加特性
                </button>
              </div>
              <p class="text-xs text-gray-400 mb-5">拖拽排序，点击删除按钮移除</p>
              <div class="space-y-2">
                <div
                  v-for="(feature, index) in form.features"
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <UIcon name="i-lucide-grip-vertical" class="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
                  <input
                    v-model="form.features[index]"
                    type="text"
                    class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                    :placeholder="`特性 ${index + 1}`"
                  >
                  <button
                    class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    @click="removeFeature(index)"
                  >
                    <UIcon name="i-lucide-x" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 关联模型 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">关联模型</h2>
              <p class="text-xs text-gray-400 mb-5">选择该应用关联的AI模型</p>
              <div class="space-y-3">
                <label
                  v-for="m in models"
                  :key="m.id"
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all cursor-pointer"
                >
                  <input
                    v-model="form.relatedModels"
                    type="checkbox"
                    :value="m.id"
                    class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  >
                  <div class="w-7 h-7 rounded bg-primary-50 flex items-center justify-center shrink-0">
                    <UIcon :name="m.icon" class="w-4 h-4 text-primary-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ m.name }}</p>
                    <p class="text-xs text-gray-400">{{ m.typeName }} · {{ m.parameters }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Bottom actions -->
            <div class="flex items-center justify-end gap-3 pt-4 pb-8">
              <button class="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button class="px-6 py-2.5 border border-primary-200 text-primary-600 rounded-lg text-sm hover:bg-primary-50 transition-colors">
                预览
              </button>
              <button
                class="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                @click="saveTemplate"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
