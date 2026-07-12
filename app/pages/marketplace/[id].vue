<script setup lang="ts">
import type { Model, App } from '~/data/mock'
import { getModelById, getAppById, getDefaultTemplate, activities, currentUser } from '~/data/mock'

const route = useRoute()
const id = computed(() => route.params.id as string)

// Find the capability - check models first, then apps
const modelData = computed(() => getModelById(id.value))
const appData = computed(() => getAppById(id.value))

const capability = computed(() => modelData.value || appData.value)
const capabilityType = computed<'model' | 'app'>(() => modelData.value ? 'model' : 'app')
const isModel = computed(() => capabilityType.value === 'model')
const model = computed(() => isModel.value ? capability.value as Model : null)
const app = computed(() => !isModel.value ? capability.value as App : null)

// Get the template for this capability
const pageTemplate = computed(() => {
  if (!capability.value) return null
  const appType = app.value?.type
  return getDefaultTemplate(capabilityType.value, id.value, appType)
})

// Visible modules sorted by order
const visibleModules = computed(() => {
  if (!pageTemplate.value) return []
  return pageTemplate.value.modules
    .filter(m => m.visible !== false)
    .sort((a, b) => a.order - b.order)
})

// Set page title
useHead({
  title: capability.value ? `${capability.value.name} - 奇安信AI开放平台` : '能力详情 - 奇安信AI开放平台'
})

// Related promotions
const relatedPromos = computed(() => {
  return activities.filter(a => a.hot || a.new).slice(0, 2)
})

// Modal states
const showIntegrationModal = ref(false)
const showEnterpriseModal = ref(false)
const enterpriseSuccess = ref(false)

// Copy feedback
const copiedStep = ref<number | null>(null)

// Action: open playground/chat (for sidebar button)
function handleTryNow() {
  const moduleArea = document.querySelector('[data-module-area]')
  if (moduleArea) {
    moduleArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Action: open integration guide modal
function handleIntegration() {
  showIntegrationModal.value = true
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
  <div>
    <div v-if="capability" class="max-w-7xl mx-auto px-6 py-8">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">首页</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
        <NuxtLink to="/marketplace" class="hover:text-primary-600 transition-colors">能力市场</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
        <span class="text-gray-600">{{ capability.name }}</span>
      </div>

      <!-- Header -->
      <div class="flex items-start gap-5 mb-6">
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
              {{ isModel ? '模型' : app?.typeName }}
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
      <div v-if="relatedPromos.length" class="flex gap-3 mb-6">
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

      <!-- Two-column layout: modules + sidebar -->
      <div class="flex gap-6">
        <!-- Left column: module rendering -->
        <div data-module-area class="flex-1 min-w-0 space-y-6">
          <ClientOnly>
            <ModulesModuleRenderer
              v-for="mod in visibleModules"
              :key="mod.id"
              :module="mod"
              :capability="capability"
              :capability-type="capabilityType"
            />
          </ClientOnly>
        </div>

        <!-- Right column: sticky sidebar -->
        <div class="w-80 shrink-0">
          <div class="sticky top-8">
            <CapabilitySidebar
              :capability="capability"
              :capability-type="capabilityType"
              @try-now="handleTryNow"
              @integration="handleIntegration"
              @enterprise-purchase="showEnterpriseModal = true"
            />
          </div>
        </div>
      </div>

    </div>

    <!-- Not Found -->
    <div v-else class="max-w-7xl mx-auto px-6 py-20 text-center">
      <UIcon name="i-lucide-search-x" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-gray-900 mb-2">未找到该能力</h2>
      <p class="text-sm text-gray-500 mb-6">该能力可能已下线或ID不正确</p>
      <UButton
        label="返回能力市场"
        icon="i-lucide-arrow-left"
        color="primary"
        to="/marketplace"
      />
    </div>

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
              <p class="text-xs text-gray-500 pl-10">使用以下代码快速调用{{ capability?.name }}</p>
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
