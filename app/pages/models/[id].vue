<script setup lang="ts">
import { getModelById, chargingPacks } from '~/data/mock'

const route = useRoute()
const model = computed(() => getModelById(route.params.id as string))

const activeTab = ref('intro')

const tabs = [
  { key: 'intro', label: '介绍', icon: 'i-lucide-info' },
  { key: 'playground', label: '体验', icon: 'i-lucide-play' },
  { key: 'api', label: 'API', icon: 'i-lucide-code-2' },
  { key: 'pricing', label: '定价', icon: 'i-lucide-tag' }
]

const apiCode = computed(() => {
  if (!model.value) return ''
  return `curl -X POST https://api.qianxin.ai${model.value.apiEndpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model.value.id}",
    "messages": [
      {"role": "user", "content": "分析这个安全事件..."}
    ],
    "temperature": 0.7,
    "max_tokens": 2048
  }'`
})

const pythonCode = computed(() => {
  if (!model.value) return ''
  return `import requests

url = "https://api.qianxin.ai${model.value.apiEndpoint}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "${model.value.id}",
    "messages": [
        {"role": "user", "content": "分析这个安全事件..."}
    ],
    "temperature": 0.7,
    "max_tokens": 2048
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
})

useHead({
  title: computed(() => model.value ? `${model.value.name} - 奇安信AI开放平台` : '模型详情 - 奇安信AI开放平台')
})
</script>

<template>
  <div v-if="model" class="p-6 md:p-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <NuxtLink to="/models" class="hover:text-primary-600 transition-colors">模型中心</NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
      <span class="text-gray-700">{{ model.name }}</span>
    </div>

    <!-- Model header -->
    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-start gap-6">
        <!-- Icon -->
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
          :style="{ backgroundColor: model.typeColor + '12' }"
        >
          <UIcon :name="model.icon" class="w-8 h-8" :style="{ color: model.typeColor }" />
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-900">{{ model.name }}</h1>
            <span
              v-if="model.hot"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600"
            >
              <UIcon name="i-lucide-flame" class="w-3 h-3 mr-1" />
              热门
            </span>
            <span
              v-if="model.new"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-600"
            >
              NEW
            </span>
          </div>

          <p class="text-gray-500 mb-4">{{ model.description }}</p>

          <div class="flex flex-wrap items-center gap-3">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
              :style="{ backgroundColor: model.typeColor + '10', color: model.typeColor }"
            >
              {{ model.typeName }}
            </span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600">
              {{ model.parameters }}参数
            </span>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
              <span class="text-sm font-medium text-gray-700">{{ model.rating }}</span>
            </div>
            <span class="text-sm text-gray-400">{{ model.callCount }}次调用</span>
          </div>
        </div>

        <div class="flex flex-col gap-2 shrink-0">
          <UButton size="lg" color="primary">
            <UIcon name="i-lucide-play" class="w-4 h-4 mr-1" />
            在线体验
          </UButton>
          <UButton size="lg" variant="outline" color="primary">
            <UIcon name="i-lucide-code-2" class="w-4 h-4 mr-1" />
            API接入
          </UButton>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-1 mb-6 bg-white rounded-xl border border-gray-100 p-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="activeTab === tab.key
          ? 'bg-primary-600 text-white'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
        @click="activeTab = tab.key"
      >
        <UIcon :name="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content: Intro -->
    <div v-if="activeTab === 'intro'" class="space-y-6">
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">模型介绍</h2>
        <p class="text-gray-600 leading-relaxed">{{ model.intro }}</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">核心能力</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="feature in model.features"
            :key="feature"
            class="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
          >
            <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-primary-600" />
            </div>
            <span class="text-sm text-gray-700">{{ feature }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">标签</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in model.tags"
            :key="tag"
            class="px-3 py-1.5 rounded-lg text-sm bg-gray-50 text-gray-600"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tab content: Playground -->
    <div v-if="activeTab === 'playground'">
      <ModelPlayground :model="model" />
    </div>

    <!-- Tab content: API -->
    <div v-if="activeTab === 'api'" class="space-y-6">
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">API端点</h2>
        <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm">
          <span class="text-green-400">POST</span>
          <span class="text-white ml-2">https://api.qianxin.ai{{ model.apiEndpoint }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">cURL 示例</h2>
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-sm text-green-300 whitespace-pre-wrap">{{ apiCode }}</pre>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Python 示例</h2>
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-sm text-blue-300 whitespace-pre-wrap">{{ pythonCode }}</pre>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">请求参数</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left py-3 px-4 font-medium text-gray-700">参数</th>
                <th class="text-left py-3 px-4 font-medium text-gray-700">类型</th>
                <th class="text-left py-3 px-4 font-medium text-gray-700">必填</th>
                <th class="text-left py-3 px-4 font-medium text-gray-700">说明</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-50">
                <td class="py-3 px-4 font-mono text-primary-600">model</td>
                <td class="py-3 px-4 text-gray-500">string</td>
                <td class="py-3 px-4"><span class="text-red-500">是</span></td>
                <td class="py-3 px-4 text-gray-600">模型ID: {{ model.id }}</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="py-3 px-4 font-mono text-primary-600">messages</td>
                <td class="py-3 px-4 text-gray-500">array</td>
                <td class="py-3 px-4"><span class="text-red-500">是</span></td>
                <td class="py-3 px-4 text-gray-600">对话消息列表</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="py-3 px-4 font-mono text-primary-600">temperature</td>
                <td class="py-3 px-4 text-gray-500">float</td>
                <td class="py-3 px-4"><span class="text-gray-400">否</span></td>
                <td class="py-3 px-4 text-gray-600">生成温度，0-1之间，默认0.7</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-mono text-primary-600">max_tokens</td>
                <td class="py-3 px-4 text-gray-500">integer</td>
                <td class="py-3 px-4"><span class="text-gray-400">否</span></td>
                <td class="py-3 px-4 text-gray-600">最大生成Token数，默认2048</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab content: Pricing -->
    <div v-if="activeTab === 'pricing'" class="space-y-6">
      <div class="bg-white rounded-xl border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">按量计费</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 rounded-lg bg-gray-50">
            <p class="text-sm text-gray-500 mb-1">输入价格</p>
            <p class="text-2xl font-bold text-gray-900">{{ model.pricing.input }}</p>
          </div>
          <div class="p-4 rounded-lg bg-gray-50">
            <p class="text-sm text-gray-500 mb-1">输出价格</p>
            <p class="text-2xl font-bold text-gray-900">{{ model.pricing.output }}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-4">充值套餐</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <ChargingPackCard
            v-for="pack in chargingPacks"
            :key="pack.id"
            :pack="pack"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 404 state -->
  <div v-else class="flex flex-col items-center justify-center py-20">
    <UIcon name="i-lucide-search-x" class="w-16 h-16 text-gray-300 mb-4" />
    <p class="text-gray-400 text-lg mb-2">模型未找到</p>
    <NuxtLink to="/models">
      <UButton variant="soft" color="primary">返回模型中心</UButton>
    </NuxtLink>
  </div>
</template>
