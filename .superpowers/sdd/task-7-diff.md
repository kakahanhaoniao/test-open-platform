diff --git a/app/components/CapabilitySidebar.vue b/app/components/CapabilitySidebar.vue
index 2253141..f621a23 100644
--- a/app/components/CapabilitySidebar.vue
+++ b/app/components/CapabilitySidebar.vue
@@ -1,24 +1,61 @@
 <script setup lang="ts">
-import type { Model, App } from '~/data/mock'
-import { chargingPacks, currentUser } from '~/data/mock'
+import type { Model, App, Plan } from '~/data/mock'
+import { getPlansForCapability, currentUser } from '~/data/mock'
 
 const props = defineProps<{
   capability: Model | App
   capabilityType: 'model' | 'app'
 }>()
 
 const emit = defineEmits<{
   tryNow: []
   integration: []
-  buyPack: []
   enterprisePurchase: []
 }>()
 
 const isModel = computed(() => props.capabilityType === 'model')
 const model = computed(() => isModel.value ? props.capability as Model : null)
 const app = computed(() => !isModel.value ? props.capability as App : null)
+
+// Purchase modal state
+const showPurchaseModal = ref(false)
+const purchaseTab = ref('model-plans')
+const purchasedPlan = ref<Plan | null>(null)
+const showPostPurchase = ref(false)
+
+// Get plans for this capability
+const capabilityPlans = computed(() => getPlansForCapability(props.capability.id))
+
+const purchaseTabs = computed(() => {
+  const tabs = []
+  if (capabilityPlans.value.modelPlans.length > 0) {
+    tabs.push({ value: 'model-plans', label: '模型套餐', icon: 'i-lucide-brain' })
+  }
+  if (capabilityPlans.value.appPlans.length > 0) {
+    tabs.push({ value: 'app-plans', label: '应用套餐', icon: 'i-lucide-puzzle' })
+  }
+  tabs.push({ value: 'packs', label: '充能包', icon: 'i-lucide-coins' })
+  return tabs
+})
+
+// Set default tab to first available
+watch(purchaseTabs, (tabs) => {
+  if (tabs.length > 0 && !tabs.find(t => t.value === purchaseTab.value)) {
+    purchaseTab.value = tabs[0]!.value
+  }
+}, { immediate: true })
+
+function openPurchaseModal() {
+  showPurchaseModal.value = true
+}
+
+function handleBuyPlan(plan: Plan) {
+  showPurchaseModal.value = false
+  purchasedPlan.value = plan
+  showPostPurchase.value = true
+}
 </script>
 
 <template>
   <div class="space-y-4">
     <!-- Capability Info Card -->
@@ -67,19 +104,19 @@ const app = computed(() => !isModel.value ? props.capability as App : null)
             <div class="text-sm font-semibold">立即接入</div>
             <div class="text-[11px] text-primary-200">获取API Key+SDK</div>
           </div>
         </button>
 
-        <!-- Button 3: Buy Charging Pack -->
+        <!-- Button 3: Buy Plan (opens modal with all plan types) -->
         <button
           class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-primary-50/50 hover:bg-primary-50 text-primary-700 transition-colors"
-          @click="emit('buyPack')"
+          @click="openPurchaseModal"
         >
           <UIcon name="i-lucide-package" class="w-5 h-5 shrink-0" />
           <div class="text-left">
-            <div class="text-sm font-semibold">购买充能包</div>
-            <div class="text-[11px] text-primary-500">体验包 ¥99 起</div>
+            <div class="text-sm font-semibold">购买套餐</div>
+            <div class="text-[11px] text-primary-500">充能包/模型套餐/应用套餐</div>
           </div>
         </button>
       </div>
 
       <!-- Divider -->
@@ -142,7 +179,65 @@ const app = computed(() => !isModel.value ? props.capability as App : null)
           <span class="text-xs text-gray-500">API端点</span>
           <span class="text-xs font-mono text-gray-600 truncate ml-2">{{ model.apiEndpoint }}</span>
         </div>
       </div>
     </div>
+
+    <!-- Purchase Modal -->
+    <UModal v-model:open="showPurchaseModal" :ui="{ content: 'sm:max-w-2xl' }">
+      <template #content>
+        <div class="p-6">
+          <div class="flex items-center justify-between mb-4">
+            <h3 class="font-bold text-gray-900">购买套餐 - {{ capability.name }}</h3>
+          </div>
+
+          <UTabs
+            v-model="purchaseTab"
+            :items="purchaseTabs"
+            color="primary"
+            variant="pill"
+            :content="false"
+            class="mb-4"
+          />
+
+          <!-- Model Plans -->
+          <div v-if="purchaseTab === 'model-plans'" class="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
+            <PlanCard
+              v-for="plan in capabilityPlans.modelPlans"
+              :key="plan.id"
+              :plan="plan"
+              @buy="handleBuyPlan"
+            />
+          </div>
+
+          <!-- App Plans -->
+          <div v-if="purchaseTab === 'app-plans'" class="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
+            <PlanCard
+              v-for="plan in capabilityPlans.appPlans"
+              :key="plan.id"
+              :plan="plan"
+              @buy="handleBuyPlan"
+            />
+          </div>
+
+          <!-- Packs -->
+          <div v-if="purchaseTab === 'packs'" class="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
+            <PlanCard
+              v-for="plan in capabilityPlans.packs"
+              :key="plan.id"
+              :plan="plan"
+              @buy="handleBuyPlan"
+            />
+          </div>
+        </div>
+      </template>
+    </UModal>
+
+    <!-- Post-purchase guidance dialog -->
+    <PostPurchaseDialog
+      v-if="purchasedPlan"
+      :plan="purchasedPlan"
+      :open="showPostPurchase"
+      @close="showPostPurchase = false"
+    />
   </div>
 </template>
diff --git a/app/components/PlanCard.vue b/app/components/PlanCard.vue
new file mode 100644
index 0000000..45d5d80
--- /dev/null
+++ b/app/components/PlanCard.vue
@@ -0,0 +1,137 @@
+<script setup lang="ts">
+import type { Plan } from '~/data/mock'
+
+const props = defineProps<{
+  plan: Plan
+}>()
+
+const emit = defineEmits<{
+  buy: [plan: Plan]
+}>()
+
+function formatTokens(tokens: number): string {
+  if (tokens < 0) return '无限'
+  if (tokens >= 100000000) return (tokens / 100000000).toFixed(0) + '亿'
+  if (tokens >= 10000) return (tokens / 10000).toFixed(0) + '万'
+  return tokens.toLocaleString()
+}
+
+function formatCalls(calls: number): string {
+  if (calls >= 10000) return (calls / 10000).toFixed(0) + '万'
+  return calls.toLocaleString()
+}
+
+const billingCycleLabel = computed(() => {
+  switch (props.plan.billingCycle) {
+    case 'monthly': return '/月'
+    case 'annual': return '/年'
+    case 'one-time': return ''
+    default: return ''
+  }
+})
+
+const includedLabel = computed(() => {
+  if (props.plan.type === 'pack' && props.plan.includedTokens) {
+    return `${formatTokens(props.plan.includedTokens)}Token`
+  }
+  if (props.plan.type === 'model-plan' && props.plan.includedTokens) {
+    return `${formatTokens(props.plan.includedTokens)}Token/月`
+  }
+  if (props.plan.type === 'app-plan' && props.plan.includedCalls) {
+    return `${formatCalls(props.plan.includedCalls)}次调用/月`
+  }
+  return ''
+})
+
+const displayBadge = computed(() => {
+  if (props.plan.badge) return props.plan.badge
+  if (props.plan.popular) return '推荐'
+  return ''
+})
+
+const gradientBg = computed(() => {
+  if (props.plan.gradient) return `bg-gradient-to-br ${props.plan.gradient}`
+  return ''
+})
+</script>
+
+<template>
+  <div
+    class="rounded-xl border p-5 card-hover relative overflow-hidden"
+    :class="[
+      gradientBg ? `${gradientBg} border-transparent` : 'bg-white border-gray-100',
+      plan.popular && !gradientBg ? 'border-primary-300 ring-1 ring-primary-100' : ''
+    ]"
+  >
+    <!-- Badge -->
+    <div
+      v-if="displayBadge"
+      class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-white text-[10px] font-medium"
+      :class="gradientBg ? 'bg-white/20' : 'bg-primary-600'"
+    >
+      {{ displayBadge }}
+    </div>
+
+    <!-- Icon + Name -->
+    <div class="flex items-start gap-3 mb-3">
+      <div
+        class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
+        :class="gradientBg ? 'bg-white/20' : 'bg-primary-50'"
+      >
+        <UIcon :name="plan.icon" class="w-5 h-5" :class="gradientBg ? 'text-white' : 'text-primary-600'" />
+      </div>
+      <div class="flex-1 min-w-0">
+        <p class="font-bold text-lg truncate" :class="gradientBg ? 'text-white' : 'text-gray-900'">{{ plan.name }}</p>
+        <p v-if="plan.description" class="text-xs mt-0.5 truncate" :class="gradientBg ? 'text-white/70' : 'text-gray-400'">{{ plan.description }}</p>
+      </div>
+    </div>
+
+    <!-- Included amount -->
+    <div v-if="includedLabel" class="mb-3">
+      <span
+        class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
+        :class="gradientBg ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700'"
+      >
+        {{ includedLabel }}
+      </span>
+    </div>
+
+    <!-- Price -->
+    <div class="mb-3">
+      <div class="flex items-baseline gap-1">
+        <span class="text-sm" :class="gradientBg ? 'text-white/60' : 'text-gray-400'">¥</span>
+        <span class="text-2xl font-bold" :class="gradientBg ? 'text-white' : 'gradient-text'">{{ plan.price.toLocaleString() }}</span>
+        <span class="text-xs" :class="gradientBg ? 'text-white/60' : 'text-gray-400'">{{ billingCycleLabel }}</span>
+      </div>
+      <div v-if="plan.originalPrice" class="mt-0.5">
+        <span class="text-xs line-through" :class="gradientBg ? 'text-white/40' : 'text-gray-400'">¥{{ plan.originalPrice.toLocaleString() }}</span>
+      </div>
+    </div>
+
+    <!-- Features -->
+    <div class="space-y-1.5 mb-4">
+      <div
+        v-for="feature in plan.features"
+        :key="feature"
+        class="flex items-center gap-2 text-xs"
+        :class="gradientBg ? 'text-white/80' : 'text-gray-500'"
+      >
+        <UIcon name="i-lucide-check" class="w-3.5 h-3.5 shrink-0" :class="gradientBg ? 'text-white/60' : 'text-green-500'" />
+        {{ feature }}
+      </div>
+    </div>
+
+    <!-- Buy button -->
+    <button
+      class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200"
+      :class="gradientBg
+        ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
+        : plan.popular
+          ? 'bg-primary-600 hover:bg-primary-700 text-white'
+          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'"
+      @click="emit('buy', plan)"
+    >
+      购买
+    </button>
+  </div>
+</template>
diff --git a/app/components/PostPurchaseDialog.vue b/app/components/PostPurchaseDialog.vue
new file mode 100644
index 0000000..87b05b9
--- /dev/null
+++ b/app/components/PostPurchaseDialog.vue
@@ -0,0 +1,150 @@
+<script setup lang="ts">
+import type { Plan } from '~/data/mock'
+
+const props = defineProps<{
+  plan: Plan
+  open: boolean
+}>()
+
+const emit = defineEmits<{
+  close: []
+}>()
+
+const isPack = computed(() => props.plan.type === 'pack')
+const isModelPlan = computed(() => props.plan.type === 'model-plan')
+const isAppPlan = computed(() => props.plan.type === 'app-plan')
+
+const dialogTitle = computed(() => {
+  if (isModelPlan.value) return '接入指南 - 模型API'
+  if (isAppPlan.value) return '接入指南 - 应用服务'
+  return '购买成功'
+})
+
+const dialogIcon = computed(() => {
+  if (isModelPlan.value) return 'i-lucide-code-2'
+  if (isAppPlan.value) return 'i-lucide-puzzle'
+  return 'i-lucide-check-circle'
+})
+</script>
+
+<template>
+  <UModal :open="open" @update:open="emit('close')">
+    <template #content>
+      <div class="p-6">
+        <!-- Header -->
+        <div class="flex items-center gap-3 mb-5">
+          <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
+            <UIcon :name="dialogIcon" class="w-5 h-5 text-green-600" />
+          </div>
+          <div>
+            <h3 class="font-bold text-gray-900">{{ dialogTitle }}</h3>
+            <p class="text-xs text-gray-400">{{ plan.name }} 已开通</p>
+          </div>
+        </div>
+
+        <!-- Model Plan: API integration guide -->
+        <div v-if="isModelPlan" class="space-y-4">
+          <div class="bg-gray-50 rounded-lg p-4">
+            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 1: 创建 API Key</h4>
+            <p class="text-xs text-gray-500 mb-2">前往控制台 > API Key管理，创建新的密钥</p>
+            <div class="bg-white rounded border px-3 py-2 font-mono text-xs text-gray-600">
+              sk-qax-xxxxxxxxxxxx
+            </div>
+          </div>
+          <div class="bg-gray-50 rounded-lg p-4">
+            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 2: SDK 调用示例</h4>
+            <div class="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
+              <pre>import qax from '@qax/sdk'
+
+const client = qax.init({
+  apiKey: 'sk-qax-xxx',
+  model: '{{ plan.targetId }}'
+})
+
+const resp = await client.chat({
+  messages: [{ role: 'user', content: 'Hello' }]
+})</pre>
+            </div>
+          </div>
+          <div class="bg-gray-50 rounded-lg p-4">
+            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 3: API 端点</h4>
+            <div class="bg-white rounded border px-3 py-2 font-mono text-xs text-gray-600">
+              POST https://api.qax.ai{{ plan.targetId ? '/v1/chat/completions' : '/v1/inference' }}
+            </div>
+          </div>
+        </div>
+
+        <!-- App Plan: Webhook/SDK/iFrame steps -->
+        <div v-if="isAppPlan" class="space-y-4">
+          <div class="bg-gray-50 rounded-lg p-4">
+            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 1: 配置 Webhook 回调</h4>
+            <p class="text-xs text-gray-500 mb-2">在应用设置中添加您的回调地址，接收事件通知</p>
+            <div class="bg-white rounded border px-3 py-2 font-mono text-xs text-gray-600">
+              https://your-domain.com/webhook/qax
+            </div>
+          </div>
+          <div class="bg-gray-50 rounded-lg p-4">
+            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 2: SDK 集成</h4>
+            <div class="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
+              <pre>import { AppClient } from '@qax/sdk'
+
+const app = new AppClient({
+  appId: '{{ plan.targetId }}',
+  apiKey: 'sk-qax-xxx'
+})
+
+const result = await app.execute({
+  input: 'your input data'
+})</pre>
+            </div>
+          </div>
+          <div class="bg-gray-50 rounded-lg p-4">
+            <h4 class="text-sm font-semibold text-gray-700 mb-2">Step 3: iFrame 嵌入（可选）</h4>
+            <div class="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
+              <pre>&lt;iframe
+  src="https://app.qax.ai/{{ plan.targetId }}?key=sk-qax-xxx"
+  width="100%" height="600"
+&gt;&lt;/iframe&gt;</pre>
+            </div>
+          </div>
+        </div>
+
+        <!-- Pack: Balance info + next steps -->
+        <div v-if="isPack" class="space-y-4">
+          <div class="bg-green-50 rounded-lg p-4">
+            <div class="flex items-center gap-2 mb-2">
+              <UIcon name="i-lucide-wallet" class="w-4 h-4 text-green-600" />
+              <span class="text-sm font-semibold text-green-700">余额已到账</span>
+            </div>
+            <p class="text-xs text-green-600">充能包Token已添加至您的账户余额，可立即使用。</p>
+          </div>
+          <div class="bg-gray-50 rounded-lg p-4">
+            <h4 class="text-sm font-semibold text-gray-700 mb-3">推荐下一步</h4>
+            <div class="space-y-2">
+              <div class="flex items-center gap-2 text-xs text-gray-600">
+                <UIcon name="i-lucide-key" class="w-3.5 h-3.5 text-primary-500 shrink-0" />
+                创建 API Key 开始调用模型
+              </div>
+              <div class="flex items-center gap-2 text-xs text-gray-600">
+                <UIcon name="i-lucide-book-open" class="w-3.5 h-3.5 text-primary-500 shrink-0" />
+                查看API文档了解调用方式
+              </div>
+              <div class="flex items-center gap-2 text-xs text-gray-600">
+                <UIcon name="i-lucide-play" class="w-3.5 h-3.5 text-primary-500 shrink-0" />
+                在Playground中在线体验
+              </div>
+            </div>
+          </div>
+        </div>
+
+        <!-- Footer -->
+        <div class="flex justify-end gap-3 mt-6">
+          <UButton variant="ghost" color="neutral" @click="emit('close')">关闭</UButton>
+          <UButton color="primary" @click="emit('close')">
+            {{ isPack ? '前往控制台' : '查看文档' }}
+          </UButton>
+        </div>
+      </div>
+    </template>
+  </UModal>
+</template>
diff --git a/app/pages/console/packs/index.vue b/app/pages/console/packs/index.vue
index 8613ae5..afa7b7b 100644
--- a/app/pages/console/packs/index.vue
+++ b/app/pages/console/packs/index.vue
@@ -1,14 +1,54 @@
 <script setup lang="ts">
-import { chargingPacks } from '~/data/mock'
+import type { Plan } from '~/data/mock'
+import { chargingPacks, modelPlans, appPlans } from '~/data/mock'
+
+useHead({ title: '套餐管理 - 奇安信AI开放平台' })
+
+const activeTab = ref('packs')
+
+const tabs = [
+  { value: 'packs', label: '充能包', icon: 'i-lucide-coins' },
+  { value: 'model-plans', label: '模型套餐', icon: 'i-lucide-brain' },
+  { value: 'app-plans', label: '应用套餐', icon: 'i-lucide-puzzle' }
+]
+
+// Convert ChargingPack[] to Plan[] for unified rendering
+const packPlans: Plan[] = chargingPacks.map(pack => ({
+  id: pack.id,
+  type: 'pack' as const,
+  name: pack.name,
+  description: pack.tokens,
+  billingCycle: 'one-time' as const,
+  price: parsePriceValue(pack.price),
+  originalPrice: pack.originalPrice ? parsePriceValue(pack.originalPrice) : undefined,
+  includedTokens: parseTokensValue(pack.tokens),
+  features: pack.features,
+  popular: pack.popular,
+  icon: 'i-lucide-coins',
+  badge: pack.originalPrice ? '限时优惠' : undefined
+}))
+
+function parsePriceValue(priceStr: string): number {
+  const cleaned = priceStr.replace(/[¥,]/g, '').replace(/\/月$/, '')
+  const num = Number(cleaned)
+  return isNaN(num) ? 0 : num
+}
+
+function parseTokensValue(tokensStr: string): number {
+  if (tokensStr.includes('无限')) return -1
+  const wanMatch = tokensStr.match(/([\d.]+)万/)
+  if (wanMatch) return Math.round(Number(wanMatch[1]) * 10000)
+  return 0
+}
 
 const purchaseHistory = [
-  { time: '2026-07-08 14:30', packName: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
-  { time: '2026-06-15 10:20', packName: '体验包', tokens: '100万Token', amount: '¥99', status: 'success' as const },
-  { time: '2026-05-22 09:15', packName: '企业包', tokens: '2000万Token', amount: '¥1,499', status: 'success' as const },
-  { time: '2026-04-10 16:45', packName: '专业包', tokens: '500万Token', amount: '¥399', status: 'success' as const },
-  { time: '2026-03-01 11:30', packName: '体验包', tokens: '100万Token', amount: '¥99', status: 'expired' as const }
+  { time: '2026-07-08 14:30', planName: '专业包', detail: '500万Token', amount: '¥399', status: 'success' as const },
+  { time: '2026-06-15 10:20', planName: '体验包', detail: '100万Token', amount: '¥99', status: 'success' as const },
+  { time: '2026-05-22 09:15', planName: '安全大模型专业版', detail: '月度订阅', amount: '¥999', status: 'success' as const },
+  { time: '2026-04-10 16:45', planName: '威胁检测助手专业版', detail: '月度订阅', amount: '¥299', status: 'success' as const },
+  { time: '2026-03-01 11:30', planName: '体验包', detail: '100万Token', amount: '¥99', status: 'expired' as const }
 ]
 
 const usageTrend = [
   { month: '2月', used: 180 },
   { month: '3月', used: 320 },
@@ -17,20 +57,29 @@ const usageTrend = [
   { month: '6月', used: 680 },
   { month: '7月', used: 550 }
 ]
 
 const maxUsage = Math.max(...usageTrend.map(d => d.used))
+
+// Post-purchase dialog
+const purchasedPlan = ref<Plan | null>(null)
+const showPostPurchase = ref(false)
+
+function handleBuy(plan: Plan) {
+  purchasedPlan.value = plan
+  showPostPurchase.value = true
+}
 </script>
 
 <template>
   <div>
     <ConsoleSidebar />
     <div class="ml-60 p-8">
       <!-- Header -->
       <div class="mb-8">
-        <h1 class="text-xl font-bold text-gray-900">充能包管理</h1>
-        <p class="text-sm text-gray-400 mt-1">管理Token余额，购买充能包，查看使用记录</p>
+        <h1 class="text-xl font-bold text-gray-900">套餐管理</h1>
+        <p class="text-sm text-gray-400 mt-1">管理Token余额，购买套餐，查看使用记录</p>
       </div>
 
       <!-- Balance Card -->
       <div class="deep-block rounded-xl p-6 mb-6 relative overflow-hidden">
         <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
@@ -65,11 +114,11 @@ const maxUsage = Math.max(...usageTrend.map(d => d.used))
             </div>
           </div>
         </div>
       </div>
 
-      <!-- Usage Trend + Purchase -->
+      <!-- Usage Trend + Tabs -->
       <div class="grid grid-cols-3 gap-6 mb-6">
         <!-- Usage Trend Chart -->
         <div class="col-span-1 bg-white rounded-xl border border-gray-100 p-6">
           <h3 class="font-semibold text-gray-900 mb-1">使用趋势</h3>
           <p class="text-xs text-gray-400 mb-6">近6月Token消耗(万)</p>
@@ -87,65 +136,59 @@ const maxUsage = Math.max(...usageTrend.map(d => d.used))
               <span class="text-xs text-gray-400">{{ item.month }}</span>
             </div>
           </div>
         </div>
 
-        <!-- Purchase Section -->
+        <!-- Three-tab Plan Section -->
         <div class="col-span-2">
-          <div class="flex items-center justify-between mb-4">
-            <h3 class="font-semibold text-gray-900">购买充能包</h3>
-          </div>
-          <div class="grid grid-cols-2 gap-4">
-            <div
-              v-for="pack in chargingPacks"
-              :key="pack.id"
-              class="bg-white rounded-xl border p-5 card-hover relative"
-              :class="pack.popular ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-100'"
-            >
-              <!-- Popular badge -->
-              <div
-                v-if="pack.popular"
-                class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-medium"
-              >
-                最受欢迎
-              </div>
-
-              <div class="flex items-start justify-between mb-3">
-                <div>
-                  <p class="font-bold text-gray-900 text-lg">{{ pack.name }}</p>
-                  <p class="text-xs text-gray-400 mt-0.5">{{ pack.tokens }}</p>
-                </div>
-                <div class="text-right">
-                  <p class="text-2xl font-bold gradient-text">{{ pack.price }}</p>
-                  <p class="text-xs text-gray-400 mt-0.5">{{ pack.unitPrice }}</p>
-                </div>
-              </div>
+          <UTabs
+            v-model="activeTab"
+            :items="tabs"
+            color="primary"
+            variant="pill"
+            :content="false"
+            class="mb-4"
+          />
 
-              <div v-if="pack.originalPrice" class="mb-3">
-                <span class="text-xs text-gray-400 line-through">{{ pack.originalPrice }}</span>
-              </div>
+          <!-- Packs Tab -->
+          <div v-if="activeTab === 'packs'" class="grid grid-cols-2 gap-4">
+            <PlanCard
+              v-for="plan in packPlans"
+              :key="plan.id"
+              :plan="plan"
+              @buy="handleBuy"
+            />
+          </div>
 
-              <div class="space-y-1.5 mb-4">
-                <div
-                  v-for="feature in pack.features"
-                  :key="feature"
-                  class="flex items-center gap-2 text-xs text-gray-500"
-                >
-                  <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-500 shrink-0" />
-                  {{ feature }}
-                </div>
-              </div>
+          <!-- Model Plans Tab -->
+          <div v-if="activeTab === 'model-plans'" class="grid grid-cols-2 gap-4">
+            <div v-if="modelPlans.length === 0" class="col-span-2 py-12 text-center">
+              <UIcon name="i-lucide-package-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
+              <p class="text-sm text-gray-400">暂无模型套餐</p>
+              <p class="text-xs text-gray-300 mt-1">请先选择具体模型查看可用套餐</p>
+            </div>
+            <PlanCard
+              v-for="plan in modelPlans"
+              :key="plan.id"
+              :plan="plan"
+              @buy="handleBuy"
+            />
+          </div>
 
-              <button
-                class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200"
-                :class="pack.popular
-                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
-                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'"
-              >
-                购买
-              </button>
+          <!-- App Plans Tab -->
+          <div v-if="activeTab === 'app-plans'" class="grid grid-cols-2 gap-4">
+            <div v-if="appPlans.length === 0" class="col-span-2 py-12 text-center">
+              <UIcon name="i-lucide-package-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
+              <p class="text-sm text-gray-400">暂无应用套餐</p>
+              <p class="text-xs text-gray-300 mt-1">请先选择具体应用查看可用套餐</p>
             </div>
+            <PlanCard
+              v-for="plan in appPlans"
+              :key="plan.id"
+              :plan="plan"
+              @buy="handleBuy"
+            />
           </div>
         </div>
       </div>
 
       <!-- Purchase History -->
@@ -153,12 +196,12 @@ const maxUsage = Math.max(...usageTrend.map(d => d.used))
         <h3 class="font-semibold text-gray-900 mb-5">购买记录</h3>
         <table class="w-full">
           <thead>
             <tr class="text-xs text-gray-400 border-b border-gray-100">
               <th class="text-left py-3 font-medium">时间</th>
-              <th class="text-left py-3 font-medium">充能包类型</th>
-              <th class="text-left py-3 font-medium">Token数</th>
+              <th class="text-left py-3 font-medium">套餐类型</th>
+              <th class="text-left py-3 font-medium">详情</th>
               <th class="text-left py-3 font-medium">金额</th>
               <th class="text-left py-3 font-medium">状态</th>
             </tr>
           </thead>
           <tbody>
@@ -166,12 +209,12 @@ const maxUsage = Math.max(...usageTrend.map(d => d.used))
               v-for="(record, idx) in purchaseHistory"
               :key="idx"
               class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
             >
               <td class="py-3 text-xs font-mono text-gray-500">{{ record.time }}</td>
-              <td class="py-3 text-sm font-medium text-gray-900">{{ record.packName }}</td>
-              <td class="py-3 text-sm font-mono text-gray-600">{{ record.tokens }}</td>
+              <td class="py-3 text-sm font-medium text-gray-900">{{ record.planName }}</td>
+              <td class="py-3 text-sm font-mono text-gray-600">{{ record.detail }}</td>
               <td class="py-3 text-sm font-mono text-gray-900 font-medium">{{ record.amount }}</td>
               <td class="py-3">
                 <span
                   class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                   :class="record.status === 'success'
@@ -184,7 +227,15 @@ const maxUsage = Math.max(...usageTrend.map(d => d.used))
             </tr>
           </tbody>
         </table>
       </div>
     </div>
+
+    <!-- Post-purchase guidance dialog -->
+    <PostPurchaseDialog
+      v-if="purchasedPlan"
+      :plan="purchasedPlan"
+      :open="showPostPurchase"
+      @close="showPostPurchase = false"
+    />
   </div>
 </template>
diff --git a/app/pages/enterprise/packs.vue b/app/pages/enterprise/packs.vue
index ba9dcd8..b844b8f 100644
--- a/app/pages/enterprise/packs.vue
+++ b/app/pages/enterprise/packs.vue
@@ -1,9 +1,47 @@
 <script setup lang="ts">
-import { chargingPacks, organization, members } from '~/data/mock'
+import type { Plan } from '~/data/mock'
+import { chargingPacks, modelPlans, appPlans, organization, members } from '~/data/mock'
 
-useHead({ title: '企业充能包 - 奇安信AI开放平台' })
+useHead({ title: '企业套餐管理 - 奇安信AI开放平台' })
+
+const activeTab = ref('packs')
+
+const tabs = [
+  { value: 'packs', label: '充能包', icon: 'i-lucide-coins' },
+  { value: 'model-plans', label: '模型套餐', icon: 'i-lucide-brain' },
+  { value: 'app-plans', label: '应用套餐', icon: 'i-lucide-puzzle' }
+]
+
+// Convert ChargingPack[] to Plan[] for unified rendering
+const packPlans: Plan[] = chargingPacks.map(pack => ({
+  id: pack.id,
+  type: 'pack' as const,
+  name: pack.name,
+  description: pack.tokens,
+  billingCycle: 'one-time' as const,
+  price: parsePriceValue(pack.price),
+  originalPrice: pack.originalPrice ? parsePriceValue(pack.originalPrice) : undefined,
+  includedTokens: parseTokensValue(pack.tokens),
+  features: pack.features,
+  popular: pack.popular,
+  icon: 'i-lucide-coins',
+  badge: pack.originalPrice ? '限时优惠' : undefined
+}))
+
+function parsePriceValue(priceStr: string): number {
+  const cleaned = priceStr.replace(/[¥,]/g, '').replace(/\/月$/, '')
+  const num = Number(cleaned)
+  return isNaN(num) ? 0 : num
+}
+
+function parseTokensValue(tokensStr: string): number {
+  if (tokensStr.includes('无限')) return -1
+  const wanMatch = tokensStr.match(/([\d.]+)万/)
+  if (wanMatch) return Math.round(Number(wanMatch[1]) * 10000)
+  return 0
+}
 
 const balanceWan = Math.floor(organization.packBalance / 10000)
 const totalWan = Math.floor(organization.packTotal / 10000)
 const usedWan = totalWan - balanceWan
 const usageRatio = ((usedWan / totalWan) * 100).toFixed(1)
@@ -35,27 +73,28 @@ const progressBgColor = computed(() => {
   if (ratio > 95) return 'bg-red-500/10'
   if (ratio > 80) return 'bg-amber-500/10'
   return 'bg-primary-500/10'
 })
 
-// Pack gradient backgrounds
-const packGradients: Record<string, string> = {
-  'pack-starter': 'from-blue-50 to-indigo-50',
-  'pack-pro': 'from-primary-50 to-violet-50',
-  'pack-enterprise': 'from-amber-50 to-orange-50',
-  'pack-unlimited': 'from-emerald-50 to-teal-50'
+// Post-purchase dialog
+const purchasedPlan = ref<Plan | null>(null)
+const showPostPurchase = ref(false)
+
+function handleBuy(plan: Plan) {
+  purchasedPlan.value = plan
+  showPostPurchase.value = true
 }
 </script>
 
 <template>
   <div>
     <EnterpriseSidebar />
     <div class="ml-60 p-8 min-h-screen bg-[#FAFAFA]">
       <!-- Header -->
       <div class="mb-8">
-        <h1 class="text-xl font-bold text-gray-900">企业充能包</h1>
-        <p class="text-sm text-gray-400 mt-1">管理企业Token余额，购买充能包，查看成员消耗</p>
+        <h1 class="text-xl font-bold text-gray-900">企业套餐管理</h1>
+        <p class="text-sm text-gray-400 mt-1">管理企业Token余额，购买套餐，查看成员消耗</p>
       </div>
 
       <!-- Balance Card -->
       <div class="deep-block rounded-xl p-6 mb-6 relative overflow-hidden">
         <div class="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" :class="progressBgColor" />
@@ -94,63 +133,68 @@ const packGradients: Record<string, string> = {
             </div>
           </div>
         </div>
       </div>
 
-      <!-- Purchase Section -->
+      <!-- Three-tab Purchase Section -->
       <div class="mb-6">
-        <h3 class="font-semibold text-gray-900 mb-4">购买企业充能包</h3>
-        <div class="grid grid-cols-4 gap-4">
-          <div
-            v-for="pack in chargingPacks"
-            :key="pack.id"
-            class="bg-gradient-to-br rounded-xl border p-5 card-hover relative"
-            :class="[
-              packGradients[pack.id] || 'from-gray-50 to-gray-50',
-              pack.popular ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-100'
-            ]"
-          >
-            <!-- Popular badge -->
-            <div
-              v-if="pack.popular"
-              class="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-medium"
-            >
-              最受欢迎
-            </div>
+        <div class="flex items-center justify-between mb-4">
+          <h3 class="font-semibold text-gray-900">购买企业套餐</h3>
+          <!-- Enterprise batch purchase -->
+          <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors">
+            <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5" />
+            批量采购
+          </button>
+        </div>
 
-            <div class="flex items-start justify-between mb-3">
-              <div>
-                <p class="font-bold text-gray-900 text-lg">{{ pack.name }}</p>
-                <p class="text-xs text-gray-400 mt-0.5">{{ pack.tokens }}</p>
-              </div>
-              <div class="text-right">
-                <p class="text-2xl font-bold gradient-text">{{ pack.price }}</p>
-                <p class="text-xs text-gray-400 mt-0.5">{{ pack.unitPrice }}</p>
-              </div>
-            </div>
+        <UTabs
+          v-model="activeTab"
+          :items="tabs"
+          color="primary"
+          variant="pill"
+          :content="false"
+          class="mb-4"
+        />
 
-            <div v-if="pack.originalPrice" class="mb-3">
-              <span class="text-xs text-gray-400 line-through">{{ pack.originalPrice }}</span>
-            </div>
+        <!-- Packs Tab -->
+        <div v-if="activeTab === 'packs'" class="grid grid-cols-4 gap-4">
+          <PlanCard
+            v-for="plan in packPlans"
+            :key="plan.id"
+            :plan="plan"
+            @buy="handleBuy"
+          />
+        </div>
 
-            <div class="space-y-1.5 mb-4">
-              <div
-                v-for="feature in pack.features"
-                :key="feature"
-                class="flex items-center gap-2 text-xs text-gray-500"
-              >
-                <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-500 shrink-0" />
-                {{ feature }}
-              </div>
-            </div>
+        <!-- Model Plans Tab -->
+        <div v-if="activeTab === 'model-plans'" class="grid grid-cols-4 gap-4">
+          <div v-if="modelPlans.length === 0" class="col-span-4 py-12 text-center">
+            <UIcon name="i-lucide-package-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
+            <p class="text-sm text-gray-400">暂无模型套餐</p>
+            <p class="text-xs text-gray-300 mt-1">请先选择具体模型查看可用套餐</p>
+          </div>
+          <PlanCard
+            v-for="plan in modelPlans"
+            :key="plan.id"
+            :plan="plan"
+            @buy="handleBuy"
+          />
+        </div>
 
-            <button
-              class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary-600 hover:bg-primary-700 text-white"
-            >
-              购买
-            </button>
+        <!-- App Plans Tab -->
+        <div v-if="activeTab === 'app-plans'" class="grid grid-cols-4 gap-4">
+          <div v-if="appPlans.length === 0" class="col-span-4 py-12 text-center">
+            <UIcon name="i-lucide-package-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
+            <p class="text-sm text-gray-400">暂无应用套餐</p>
+            <p class="text-xs text-gray-300 mt-1">请先选择具体应用查看可用套餐</p>
           </div>
+          <PlanCard
+            v-for="plan in appPlans"
+            :key="plan.id"
+            :plan="plan"
+            @buy="handleBuy"
+          />
         </div>
       </div>
 
       <!-- Member Usage Breakdown -->
       <div class="bg-white rounded-xl border border-gray-100 p-6">
@@ -208,7 +252,15 @@ const packGradients: Record<string, string> = {
             </tr>
           </tbody>
         </table>
       </div>
     </div>
+
+    <!-- Post-purchase guidance dialog -->
+    <PostPurchaseDialog
+      v-if="purchasedPlan"
+      :plan="purchasedPlan"
+      :open="showPostPurchase"
+      @close="showPostPurchase = false"
+    />
   </div>
 </template>
