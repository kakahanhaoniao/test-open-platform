diff --git a/app/components/CapabilitySidebar.vue b/app/components/CapabilitySidebar.vue
new file mode 100644
index 0000000..2253141
--- /dev/null
+++ b/app/components/CapabilitySidebar.vue
@@ -0,0 +1,148 @@
+<script setup lang="ts">
+import type { Model, App } from '~/data/mock'
+import { chargingPacks, currentUser } from '~/data/mock'
+
+const props = defineProps<{
+  capability: Model | App
+  capabilityType: 'model' | 'app'
+}>()
+
+const emit = defineEmits<{
+  tryNow: []
+  integration: []
+  buyPack: []
+  enterprisePurchase: []
+}>()
+
+const isModel = computed(() => props.capabilityType === 'model')
+const model = computed(() => isModel.value ? props.capability as Model : null)
+const app = computed(() => !isModel.value ? props.capability as App : null)
+</script>
+
+<template>
+  <div class="space-y-4">
+    <!-- Capability Info Card -->
+    <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
+      <!-- Name + Rating + Call Count -->
+      <div class="space-y-2">
+        <h3 class="text-base font-bold text-gray-900">{{ capability.name }}</h3>
+        <div class="flex items-center gap-3">
+          <div class="flex items-center gap-1">
+            <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
+            <span class="text-sm font-semibold text-gray-700">{{ capability.rating }}</span>
+          </div>
+          <div class="flex items-center gap-1">
+            <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-gray-400" />
+            <span class="text-sm text-gray-500">
+              {{ isModel ? model?.callCount + ' 调用' : app?.useCount + ' 用户' }}
+            </span>
+          </div>
+        </div>
+      </div>
+
+      <!-- Divider -->
+      <div class="border-t border-gray-100" />
+
+      <!-- 3 Action Buttons -->
+      <div class="space-y-3">
+        <!-- Button 1: Online Experience -->
+        <button
+          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
+          @click="emit('tryNow')"
+        >
+          <UIcon name="i-lucide-play" class="w-5 h-5 shrink-0" />
+          <div class="text-left">
+            <div class="text-sm font-semibold">在线体验</div>
+            <div class="text-[11px] text-green-100">打开Playground</div>
+          </div>
+        </button>
+
+        <!-- Button 2: Integration -->
+        <button
+          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
+          @click="emit('integration')"
+        >
+          <UIcon name="i-lucide-key" class="w-5 h-5 shrink-0" />
+          <div class="text-left">
+            <div class="text-sm font-semibold">立即接入</div>
+            <div class="text-[11px] text-primary-200">获取API Key+SDK</div>
+          </div>
+        </button>
+
+        <!-- Button 3: Buy Charging Pack -->
+        <button
+          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-primary-50/50 hover:bg-primary-50 text-primary-700 transition-colors"
+          @click="emit('buyPack')"
+        >
+          <UIcon name="i-lucide-package" class="w-5 h-5 shrink-0" />
+          <div class="text-left">
+            <div class="text-sm font-semibold">购买充能包</div>
+            <div class="text-[11px] text-primary-500">体验包 ¥99 起</div>
+          </div>
+        </button>
+      </div>
+
+      <!-- Divider -->
+      <div class="border-t border-gray-100" />
+
+      <!-- Pricing Info (directly visible) -->
+      <div v-if="isModel && model" class="space-y-2">
+        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">定价信息</h4>
+        <div class="flex justify-between items-center">
+          <span class="text-xs text-gray-500">输入价格</span>
+          <span class="text-sm font-bold text-primary-600">{{ model.pricing.input }}</span>
+        </div>
+        <div class="flex justify-between items-center">
+          <span class="text-xs text-gray-500">输出价格</span>
+          <span class="text-sm font-bold text-primary-600">{{ model.pricing.output }}</span>
+        </div>
+      </div>
+
+      <!-- Divider (only if model has pricing) -->
+      <div v-if="isModel && model" class="border-t border-gray-100" />
+
+      <!-- Enterprise Batch Purchase (enterprise users only) -->
+      <div v-if="currentUser.isEnterprise">
+        <button
+          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-white hover:bg-primary-50/30 text-primary-700 transition-colors"
+          @click="emit('enterprisePurchase')"
+        >
+          <UIcon name="i-lucide-building-2" class="w-5 h-5 shrink-0" />
+          <div class="text-left">
+            <div class="text-sm font-semibold">企业批量采购</div>
+            <div class="text-[11px] text-primary-500">专属折扣+统一结算</div>
+          </div>
+        </button>
+      </div>
+
+      <!-- Divider (only if enterprise) -->
+      <div v-if="currentUser.isEnterprise" class="border-t border-gray-100" />
+
+      <!-- Tags and Related Info -->
+      <div class="space-y-2">
+        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">标签</h4>
+        <div class="flex flex-wrap gap-1.5">
+          <span
+            v-for="tag in capability.tags.slice(0, 4)"
+            :key="tag"
+            class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-600"
+          >
+            {{ tag }}
+          </span>
+        </div>
+      </div>
+
+      <!-- Model-specific info -->
+      <div v-if="isModel && model" class="space-y-2">
+        <div class="flex justify-between">
+          <span class="text-xs text-gray-500">参数规模</span>
+          <span class="text-xs font-semibold text-gray-700">{{ model.parameters }}</span>
+        </div>
+        <div class="flex justify-between">
+          <span class="text-xs text-gray-500">API端点</span>
+          <span class="text-xs font-mono text-gray-600 truncate ml-2">{{ model.apiEndpoint }}</span>
+        </div>
+      </div>
+    </div>
+  </div>
+</template>
diff --git a/app/pages/marketplace/[id].vue b/app/pages/marketplace/[id].vue
index 6a7a251..0679b07 100644
--- a/app/pages/marketplace/[id].vue
+++ b/app/pages/marketplace/[id].vue
@@ -1,17 +1,36 @@
 <script setup lang="ts">
-import { models, apps, getModelById, getAppById } from '~/data/mock'
+import type { Model, App } from '~/data/mock'
+import { models, apps, getModelById, getAppById, getDefaultTemplate, activities, chargingPacks, currentUser } from '~/data/mock'
 
 const route = useRoute()
 const id = computed(() => route.params.id as string)
 
 // Find the capability - check models first, then apps
 const modelData = computed(() => getModelById(id.value))
 const appData = computed(() => getAppById(id.value))
 
 const capability = computed(() => modelData.value || appData.value)
 const capabilityType = computed<'model' | 'app'>(() => modelData.value ? 'model' : 'app')
+const isModel = computed(() => capabilityType.value === 'model')
+const model = computed(() => isModel.value ? capability.value as Model : null)
+const app = computed(() => !isModel.value ? capability.value as App : null)
+
+// Get the template for this capability
+const pageTemplate = computed(() => {
+  if (!capability.value) return null
+  const appType = app.value?.type
+  return getDefaultTemplate(capabilityType.value, id.value, appType)
+})
+
+// Visible modules sorted by order
+const visibleModules = computed(() => {
+  if (!pageTemplate.value) return []
+  return pageTemplate.value.modules
+    .filter(m => m.visible !== false)
+    .sort((a, b) => a.order - b.order)
+})
 
 // Set page title
 useHead({
   title: capability.value ? `${capability.value.name} - 奇安信AI开放平台` : '能力详情 - 奇安信AI开放平台'
 })
@@ -28,10 +47,93 @@ const relatedCapabilities = computed(() => {
   return apps
     .filter(a => a.id !== id.value && a.type === appData.value?.type)
     .slice(0, 3)
     .map(a => ({ ...a, _type: 'app' as const }))
 })
+
+// Related promotions
+const relatedPromos = computed(() => {
+  return activities.filter(a => a.hot || a.new).slice(0, 2)
+})
+
+// Modal states
+const showChargingPackModal = ref(false)
+const showIntegrationModal = ref(false)
+const showEnterpriseModal = ref(false)
+const purchaseSuccess = ref(false)
+const enterpriseSuccess = ref(false)
+
+// Copy feedback
+const copiedStep = ref<number | null>(null)
+
+// Action: open playground/chat (for sidebar button)
+function handleTryNow() {
+  // In template-based rendering, the playground/chat module is already visible
+  // Scroll to the first interactive module
+  const el = document.querySelector('[data-module-type="playground"], [data-module-type="chat"], [data-module-type="demo"]')
+  if (el) {
+    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
+  }
+}
+
+// Action: open integration guide modal
+function handleIntegration() {
+  showIntegrationModal.value = true
+}
+
+// Action: open charging pack modal
+function handleBuyPack() {
+  showChargingPackModal.value = true
+  purchaseSuccess.value = false
+}
+
+// Action: purchase a specific pack
+function handlePurchasePack(packId: string) {
+  purchaseSuccess.value = true
+  setTimeout(() => {
+    purchaseSuccess.value = false
+    showChargingPackModal.value = false
+  }, 2000)
+}
+
+// Action: enterprise batch purchase
+function handleEnterpriseSubmit() {
+  enterpriseSuccess.value = true
+  setTimeout(() => {
+    enterpriseSuccess.value = false
+    showEnterpriseModal.value = false
+  }, 2000)
+}
+
+// Copy code to clipboard
+async function copyCode(step: number, code: string) {
+  try {
+    await navigator.clipboard.writeText(code)
+    copiedStep.value = step
+    setTimeout(() => { copiedStep.value = null }, 2000)
+  } catch {
+    // fallback: do nothing
+  }
+}
+
+// Integration code snippets
+const sdkInstallCode = 'pip install qax-ai-sdk'
+const apiCallCode = computed(() => {
+  const modelId = model.value?.id || app.value?.id || 'qax-security-llm'
+  return `from qax_ai import QAXClient
+
+client = QAXClient(api_key="your-api-key")
+
+response = client.chat(
+    model="${modelId}",
+    messages=[
+        {"role": "user", "content": "分析这段日志中的异常行为"}
+    ]
+)
+
+print(response.choices[0].message.content)`
+})
 </script>
 
 <template>
   <div>
     <div v-if="capability" class="max-w-7xl mx-auto px-6 py-8">
@@ -42,15 +144,97 @@ const relatedCapabilities = computed(() => {
         <NuxtLink to="/marketplace" class="hover:text-primary-600 transition-colors">能力市场</NuxtLink>
         <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
         <span class="text-gray-600">{{ capability.name }}</span>
       </div>
 
-      <!-- Detail Component -->
-      <CapabilityDetail
-        :capability="capability"
-        :capability-type="capabilityType"
-      />
+      <!-- Header -->
+      <div class="flex items-start gap-5 mb-6">
+        <div
+          class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
+          :class="isModel ? 'bg-primary-50' : 'bg-accent-50'"
+        >
+          <UIcon
+            :name="capability.icon"
+            class="w-8 h-8"
+            :class="isModel ? 'text-primary-600' : 'text-accent-600'"
+          />
+        </div>
+        <div class="flex-1 min-w-0">
+          <div class="flex items-center gap-2 mb-1">
+            <h1 class="text-2xl font-bold text-gray-900">{{ capability.name }}</h1>
+            <span
+              class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
+              :class="isModel ? 'bg-primary-100 text-primary-700' : 'bg-accent-100 text-accent-700'"
+            >
+              {{ isModel ? '模型' : app?.typeName }}
+            </span>
+            <span v-if="capability.hot" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">HOT</span>
+            <span v-if="capability.new" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-500 text-white">NEW</span>
+          </div>
+          <p class="text-sm text-gray-500 mb-3">{{ isModel ? model?.typeName : app?.typeName }}</p>
+          <div class="flex items-center gap-4">
+            <div class="flex items-center gap-1">
+              <UIcon name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
+              <span class="text-sm font-semibold text-gray-700">{{ capability.rating }}</span>
+            </div>
+            <div class="flex items-center gap-1">
+              <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-gray-400" />
+              <span class="text-sm text-gray-500">
+                {{ isModel ? model?.callCount + ' 调用' : app?.useCount + ' 用户' }}
+              </span>
+            </div>
+            <template v-if="isModel && model">
+              <div class="flex items-center gap-1">
+                <UIcon name="i-lucide-cpu" class="w-3.5 h-3.5 text-gray-400" />
+                <span class="text-sm text-gray-500">{{ model.parameters }} 参数</span>
+              </div>
+            </template>
+          </div>
+        </div>
+      </div>
+
+      <!-- Related Promotions -->
+      <div v-if="relatedPromos.length" class="flex gap-3 mb-6">
+        <div
+          v-for="promo in relatedPromos"
+          :key="promo.id"
+          class="flex items-center gap-3 px-4 py-2.5 rounded-xl"
+          :class="`bg-gradient-to-r ${promo.gradient}`"
+        >
+          <UIcon :name="promo.icon" class="w-4 h-4 text-white" />
+          <span class="text-white text-sm font-medium">{{ promo.title }}：{{ promo.discountText }}</span>
+          <NuxtLink to="/promotions" class="text-white/80 text-xs underline hover:text-white">了解详情</NuxtLink>
+        </div>
+      </div>
+
+      <!-- Two-column layout: modules + sidebar -->
+      <div class="flex gap-6">
+        <!-- Left column: module rendering -->
+        <div class="flex-1 min-w-0 space-y-6">
+          <ModuleRenderer
+            v-for="mod in visibleModules"
+            :key="mod.id"
+            :module="mod"
+            :capability="capability"
+            :capability-type="capabilityType"
+          />
+        </div>
+
+        <!-- Right column: sticky sidebar -->
+        <div class="w-80 shrink-0">
+          <div class="sticky top-8">
+            <CapabilitySidebar
+              :capability="capability"
+              :capability-type="capabilityType"
+              @try-now="handleTryNow"
+              @integration="handleIntegration"
+              @buy-pack="handleBuyPack"
+              @enterprise-purchase="showEnterpriseModal = true"
+            />
+          </div>
+        </div>
+      </div>
 
       <!-- Related Capabilities -->
       <div v-if="relatedCapabilities.length" class="mt-12">
         <h2 class="text-lg font-bold text-gray-900 mb-5">相关能力</h2>
         <div class="grid grid-cols-4 gap-4">
@@ -74,7 +258,261 @@ const relatedCapabilities = computed(() => {
         icon="i-lucide-arrow-left"
         color="primary"
         to="/marketplace"
       />
     </div>
+
+    <!-- ============================== -->
+    <!-- Modal: Charging Pack Selection -->
+    <!-- ============================== -->
+    <Teleport to="body">
+      <div
+        v-if="showChargingPackModal"
+        class="fixed inset-0 z-50 flex items-center justify-center"
+      >
+        <!-- Backdrop -->
+        <div class="absolute inset-0 bg-black/50" @click="showChargingPackModal = false" />
+
+        <!-- Modal Content -->
+        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
+          <!-- Header -->
+          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
+            <h2 class="text-lg font-bold text-gray-900">选择充能包</h2>
+            <button
+              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
+              @click="showChargingPackModal = false"
+            >
+              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
+            </button>
+          </div>
+
+          <!-- Success Alert -->
+          <div v-if="purchaseSuccess" class="mx-6 mt-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
+            <div class="flex items-center gap-2">
+              <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
+              <span class="text-sm font-medium text-green-700">购买成功！充能包已到账</span>
+            </div>
+          </div>
+
+          <!-- Pack Cards -->
+          <div class="p-6 space-y-4">
+            <div
+              v-for="pack in chargingPacks"
+              :key="pack.id"
+              class="relative rounded-xl border p-5 transition-all"
+              :class="pack.popular
+                ? 'border-primary-300 bg-primary-50/30 shadow-sm'
+                : 'border-gray-100 hover:border-gray-200'"
+            >
+              <!-- Popular Badge -->
+              <span
+                v-if="pack.popular"
+                class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-bold"
+              >
+                最受欢迎
+              </span>
+
+              <div class="flex items-start justify-between">
+                <div class="flex-1">
+                  <h3 class="text-base font-bold text-gray-900">{{ pack.name }}</h3>
+                  <p class="text-2xl font-bold text-primary-600 mt-1">
+                    {{ pack.price }}
+                    <span v-if="pack.originalPrice" class="text-sm font-normal text-gray-400 line-through ml-2">{{ pack.originalPrice }}</span>
+                  </p>
+                  <p class="text-sm text-gray-500 mt-1">{{ pack.tokens }}</p>
+                  <p class="text-xs text-gray-400 mt-0.5">{{ pack.unitPrice }}</p>
+                </div>
+                <UButton
+                  label="购买"
+                  :color="pack.popular ? 'primary' : 'neutral'"
+                  :variant="pack.popular ? 'solid' : 'outline'"
+                  size="sm"
+                  @click="handlePurchasePack(pack.id)"
+                />
+              </div>
+
+              <!-- Features -->
+              <div class="mt-3 flex flex-wrap gap-2">
+                <span
+                  v-for="feature in pack.features"
+                  :key="feature"
+                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-gray-50 text-gray-600"
+                >
+                  <UIcon name="i-lucide-check" class="w-3 h-3 text-green-500" />
+                  {{ feature }}
+                </span>
+              </div>
+            </div>
+          </div>
+        </div>
+      </div>
+    </Teleport>
+
+    <!-- ============================== -->
+    <!-- Modal: Integration Guide       -->
+    <!-- ============================== -->
+    <Teleport to="body">
+      <div
+        v-if="showIntegrationModal"
+        class="fixed inset-0 z-50 flex items-center justify-center"
+      >
+        <!-- Backdrop -->
+        <div class="absolute inset-0 bg-black/50" @click="showIntegrationModal = false" />
+
+        <!-- Modal Content -->
+        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
+          <!-- Header -->
+          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
+            <h2 class="text-lg font-bold text-gray-900">接入引导</h2>
+            <button
+              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
+              @click="showIntegrationModal = false"
+            >
+              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
+            </button>
+          </div>
+
+          <!-- Steps -->
+          <div class="p-6 space-y-6">
+            <!-- Step 1: Create API Key -->
+            <div class="space-y-3">
+              <div class="flex items-center gap-3">
+                <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
+                <h3 class="text-sm font-semibold text-gray-900">创建API Key</h3>
+              </div>
+              <p class="text-xs text-gray-500 pl-10">前往API Key管理页面创建您的专属密钥</p>
+              <div class="pl-10">
+                <NuxtLink
+                  to="/console/keys/create"
+                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
+                >
+                  <UIcon name="i-lucide-key" class="w-4 h-4" />
+                  前往创建
+                </NuxtLink>
+              </div>
+            </div>
+
+            <!-- Step 2: Install SDK -->
+            <div class="space-y-3">
+              <div class="flex items-center gap-3">
+                <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
+                <h3 class="text-sm font-semibold text-gray-900">安装SDK</h3>
+              </div>
+              <p class="text-xs text-gray-500 pl-10">通过pip快速安装奇安信AI SDK</p>
+              <div class="pl-10 relative">
+                <div class="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
+                  {{ sdkInstallCode }}
+                </div>
+                <button
+                  class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
+                  @click="copyCode(2, sdkInstallCode)"
+                >
+                  <UIcon
+                    :name="copiedStep === 2 ? 'i-lucide-check' : 'i-lucide-copy'"
+                    class="w-4 h-4"
+                    :class="copiedStep === 2 ? 'text-green-400' : 'text-gray-400'"
+                  />
+                </button>
+              </div>
+            </div>
+
+            <!-- Step 3: Call API -->
+            <div class="space-y-3">
+              <div class="flex items-center gap-3">
+                <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
+                <h3 class="text-sm font-semibold text-gray-900">调用API</h3>
+              </div>
+              <p class="text-xs text-gray-500 pl-10">使用以下代码快速调用{{ capability?.name }}</p>
+              <div class="pl-10 relative">
+                <div class="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto whitespace-pre">{{ apiCallCode }}</div>
+                <button
+                  class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
+                  @click="copyCode(3, apiCallCode)"
+                >
+                  <UIcon
+                    :name="copiedStep === 3 ? 'i-lucide-check' : 'i-lucide-copy'"
+                    class="w-4 h-4"
+                    :class="copiedStep === 3 ? 'text-green-400' : 'text-gray-400'"
+                  />
+                </button>
+              </div>
+            </div>
+          </div>
+        </div>
+      </div>
+    </Teleport>
+
+    <!-- ============================== -->
+    <!-- Modal: Enterprise Batch Purchase -->
+    <!-- ============================== -->
+    <Teleport to="body">
+      <div
+        v-if="showEnterpriseModal"
+        class="fixed inset-0 z-50 flex items-center justify-center"
+      >
+        <!-- Backdrop -->
+        <div class="absolute inset-0 bg-black/50" @click="showEnterpriseModal = false" />
+
+        <!-- Modal Content -->
+        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
+          <!-- Header -->
+          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
+            <h2 class="text-lg font-bold text-gray-900">企业批量采购</h2>
+            <button
+              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
+              @click="showEnterpriseModal = false"
+            >
+              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-400" />
+            </button>
+          </div>
+
+          <!-- Form -->
+          <div class="p-6 space-y-5">
+            <!-- Success Alert -->
+            <div v-if="enterpriseSuccess" class="px-4 py-3 rounded-xl bg-green-50 border border-green-200">
+              <div class="flex items-center gap-2">
+                <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
+                <span class="text-sm font-medium text-green-700">提交成功！我们将在1个工作日内联系您</span>
+              </div>
+            </div>
+
+            <div class="space-y-4">
+              <!-- Estimated Monthly Calls -->
+              <div class="space-y-1.5">
+                <label class="text-sm font-medium text-gray-700">预估月调用量</label>
+                <UInput
+                  placeholder="例如：100万次/月"
+                  size="md"
+                />
+              </div>
+
+              <!-- Contact Info -->
+              <div class="space-y-1.5">
+                <label class="text-sm font-medium text-gray-700">联系方式</label>
+                <UInput
+                  placeholder="手机号或邮箱"
+                  size="md"
+                />
+              </div>
+            </div>
+
+            <!-- Note -->
+            <div class="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
+              <UIcon name="i-lucide-info" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
+              <p class="text-xs text-amber-700 leading-relaxed">企业客户享受专属折扣，我们将在1个工作日内联系您</p>
+            </div>
+
+            <!-- Submit Button -->
+            <UButton
+              label="提交咨询"
+              icon="i-lucide-send"
+              color="primary"
+              block
+              size="lg"
+              @click="handleEnterpriseSubmit"
+            />
+          </div>
+        </div>
+      </div>
+    </Teleport>
   </div>
 </template>
