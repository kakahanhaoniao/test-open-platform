<script setup lang="ts">
import { models, chargingPacks } from '~/data/mock'
import type { Model } from '~/data/mock'

const route = useRoute()
const modelId = route.params.id as string
const model = models.find(m => m.id === modelId)

useHead({ title: `${model?.name || '模型'} 模板配置 - 奇安信AI运营后台` })

// Form state
const form = reactive({
  name: model?.name || '',
  description: model?.description || '',
  icon: model?.icon || 'i-lucide-brain',
  tags: model?.tags?.join(', ') || '',
  intro: model?.intro || '',
  features: model?.features ? [...model.features] : [''],
  apiEndpoint: model?.apiEndpoint || '',
  apiMethod: 'POST',
  apiParams: '',
  inputPrice: model?.pricing?.input || '',
  outputPrice: model?.pricing?.output || '',
  chargingPacks: chargingPacks.map(p => p.id)
})

// Parameters table
const parameters = reactive([
  { name: 'messages', type: 'array', defaultVal: '[]', desc: '对话消息列表' },
  { name: 'model', type: 'string', defaultVal: model?.id || '', desc: '模型标识' },
  { name: 'temperature', type: 'number', defaultVal: '0.7', desc: '生成温度' },
  { name: 'max_tokens', type: 'integer', defaultVal: '4096', desc: '最大生成Token数' }
])

function addFeature() {
  form.features.push('')
}

function removeFeature(index: number) {
  form.features.splice(index, 1)
}

function addParameter() {
  parameters.push({ name: '', type: 'string', defaultVal: '', desc: '' })
}

function removeParameter(index: number) {
  parameters.splice(index, 1)
}

function saveTemplate() {
  // Mock save
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
          <NuxtLink to="/admin/models" class="hover:text-primary-600 transition-colors">模型管理</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-gray-700">{{ model?.name || '模型' }}</span>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-gray-700">模板配置</span>
        </div>

        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">模型详情页模板配置</h1>
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

        <!-- Two-column layout: Preview + Form -->
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
                <div class="bg-gradient-to-r from-primary-700 to-primary-500 p-6 text-white">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <UIcon :name="form.icon" class="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 class="font-bold text-lg">{{ form.name || '模型名称' }}</h3>
                      <p class="text-white/70 text-xs">{{ model?.provider }}</p>
                    </div>
                  </div>
                  <p class="text-white/80 text-xs line-clamp-2">{{ form.description || '模型描述' }}</p>
                  <div v-if="form.tags" class="flex flex-wrap gap-1 mt-3">
                    <span
                      v-for="tag in form.tags.split(',').filter(Boolean).slice(0, 3)"
                      :key="tag"
                      class="px-2 py-0.5 bg-white/15 rounded text-xs text-white/90"
                    >
                      {{ tag.trim() }}
                    </span>
                  </div>
                </div>
                <!-- Preview body -->
                <div class="p-4 space-y-4">
                  <div>
                    <h4 class="text-xs font-semibold text-gray-700 mb-2">模型介绍</h4>
                    <p class="text-xs text-gray-500 line-clamp-3">{{ form.intro || '暂无介绍' }}</p>
                  </div>
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
                  <div>
                    <h4 class="text-xs font-semibold text-gray-700 mb-2">定价</h4>
                    <div class="flex gap-4 text-xs">
                      <span class="text-gray-500">输入: <span class="text-primary-600 font-medium">{{ form.inputPrice || '-' }}</span></span>
                      <span class="text-gray-500">输出: <span class="text-primary-600 font-medium">{{ form.outputPrice || '-' }}</span></span>
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
              <p class="text-xs text-gray-400 mb-5">配置模型在详情页展示的基本信息</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">模型名称</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">模型描述</label>
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
                      placeholder="i-lucide-brain"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
                    <input
                      v-model="form.tags"
                      type="text"
                      placeholder="用逗号分隔"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 模型介绍 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">模型介绍</h2>
              <p class="text-xs text-gray-400 mb-5">详情页展示的模型详细介绍内容</p>
              <textarea
                v-model="form.intro"
                rows="6"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                placeholder="输入模型详细介绍..."
              />
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

            <!-- 参数配置 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-base font-semibold text-gray-900">参数配置</h2>
                <button
                  class="flex items-center gap-1 px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  @click="addParameter"
                >
                  <UIcon name="i-lucide-plus" class="w-3 h-3" />
                  添加参数
                </button>
              </div>
              <p class="text-xs text-gray-400 mb-5">API接口参数定义</p>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="text-left py-2 px-3 text-xs font-medium text-gray-500">名称</th>
                      <th class="text-left py-2 px-3 text-xs font-medium text-gray-500">类型</th>
                      <th class="text-left py-2 px-3 text-xs font-medium text-gray-500">默认值</th>
                      <th class="text-left py-2 px-3 text-xs font-medium text-gray-500">描述</th>
                      <th class="w-10 py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(param, index) in parameters"
                      :key="index"
                      class="border-b border-gray-50"
                    >
                      <td class="py-2 px-3">
                        <input v-model="param.name" type="text" class="w-full px-2 py-1 rounded border border-gray-200 text-xs focus:outline-none focus:border-primary-300" />
                      </td>
                      <td class="py-2 px-3">
                        <select v-model="param.type" class="w-full px-2 py-1 rounded border border-gray-200 text-xs focus:outline-none focus:border-primary-300">
                          <option value="string">string</option>
                          <option value="integer">integer</option>
                          <option value="number">number</option>
                          <option value="boolean">boolean</option>
                          <option value="array">array</option>
                          <option value="object">object</option>
                        </select>
                      </td>
                      <td class="py-2 px-3">
                        <input v-model="param.defaultVal" type="text" class="w-full px-2 py-1 rounded border border-gray-200 text-xs focus:outline-none focus:border-primary-300" />
                      </td>
                      <td class="py-2 px-3">
                        <input v-model="param.desc" type="text" class="w-full px-2 py-1 rounded border border-gray-200 text-xs focus:outline-none focus:border-primary-300" />
                      </td>
                      <td class="py-2 px-3">
                        <button
                          class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          @click="removeParameter(index)"
                        >
                          <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- API端点配置 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">API端点配置</h2>
              <p class="text-xs text-gray-400 mb-5">配置模型API接口信息</p>
              <div class="space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">请求方法</label>
                    <select
                      v-model="form.apiMethod"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                    </select>
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">端点URL</label>
                    <input
                      v-model="form.apiEndpoint"
                      type="text"
                      placeholder="/v1/chat/completions"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                    >
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">参数说明</label>
                  <textarea
                    v-model="form.apiParams"
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                    placeholder='{"messages": "对话消息列表", "temperature": "生成温度"}'
                  />
                </div>
              </div>
            </div>

            <!-- 定价配置 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">定价配置</h2>
              <p class="text-xs text-gray-400 mb-5">设置模型调用的Token计费价格</p>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">输入价格</label>
                  <input
                    v-model="form.inputPrice"
                    type="text"
                    placeholder="¥0.06/千Token"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">输出价格</label>
                  <input
                    v-model="form.outputPrice"
                    type="text"
                    placeholder="¥0.12/千Token"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
              </div>
            </div>

            <!-- 充能包关联 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">充能包关联</h2>
              <p class="text-xs text-gray-400 mb-5">选择该模型可使用的充能包</p>
              <div class="space-y-3">
                <label
                  v-for="pack in chargingPacks"
                  :key="pack.id"
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all cursor-pointer"
                >
                  <input
                    v-model="form.chargingPacks"
                    type="checkbox"
                    :value="pack.id"
                    class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  >
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-900">{{ pack.name }}</span>
                      <span v-if="pack.popular" class="px-1.5 py-0.5 bg-primary-50 text-primary-600 text-xs rounded font-medium">热门</span>
                    </div>
                    <p class="text-xs text-gray-400">{{ pack.tokens }} · {{ pack.price }}</p>
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
