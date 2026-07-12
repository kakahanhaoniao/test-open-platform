<script setup lang="ts">
import type { Model, App, Plan } from '~/data/mock'
import { getPlansForCapability, currentUser } from '~/data/mock'

const props = defineProps<{
  capability: Model | App
  capabilityType: 'model' | 'app'
}>()

const emit = defineEmits<{
  tryNow: []
  integration: []
  enterprisePurchase: []
}>()

const isModel = computed(() => props.capabilityType === 'model')
const model = computed(() => isModel.value ? props.capability as Model : null)
const app = computed(() => !isModel.value ? props.capability as App : null)

// Purchase modal state
const showPurchaseModal = ref(false)
const purchaseTab = ref('model-plans')
const purchasedPlan = ref<Plan | null>(null)
const showPostPurchase = ref(false)

// Get plans for this capability
const capabilityPlans = computed(() => getPlansForCapability(props.capability.id))

const purchaseTabs = computed(() => {
  const tabs = []
  if (capabilityPlans.value.modelPlans.length > 0) {
    tabs.push({ value: 'model-plans', label: '模型套餐', icon: 'i-lucide-brain' })
  }
  if (capabilityPlans.value.appPlans.length > 0) {
    tabs.push({ value: 'app-plans', label: '应用套餐', icon: 'i-lucide-puzzle' })
  }
  tabs.push({ value: 'packs', label: '充能包', icon: 'i-lucide-coins' })
  return tabs
})

// Set default tab to first available
watch(purchaseTabs, (tabs) => {
  if (tabs.length > 0 && !tabs.find(t => t.value === purchaseTab.value)) {
    purchaseTab.value = tabs[0]!.value
  }
}, { immediate: true })

function openPurchaseModal() {
  showPurchaseModal.value = true
}

function handleBuyPlan(plan: Plan) {
  showPurchaseModal.value = false
  purchasedPlan.value = plan
  showPostPurchase.value = true
}
</script>

<template>
  <div class="space-y-4">
    <!-- Capability Info Card -->
    <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
      <!-- Name + Rating + Call Count -->
      <div class="space-y-2">
        <h3 class="text-base font-bold text-gray-900">{{ capability.name }}</h3>
        <div class="flex items-center gap-3">
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
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100" />

      <!-- 3 Action Buttons -->
      <div class="space-y-3">
        <!-- Button 1: Online Experience -->
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
          @click="emit('tryNow')"
        >
          <UIcon name="i-lucide-play" class="w-5 h-5 shrink-0" />
          <div class="text-left">
            <div class="text-sm font-semibold">在线体验</div>
            <div class="text-[11px] text-green-100">打开Playground</div>
          </div>
        </button>

        <!-- Button 2: Integration -->
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          @click="emit('integration')"
        >
          <UIcon name="i-lucide-key" class="w-5 h-5 shrink-0" />
          <div class="text-left">
            <div class="text-sm font-semibold">立即接入</div>
            <div class="text-[11px] text-primary-200">获取API Key+SDK</div>
          </div>
        </button>

        <!-- Button 3: Buy Plan (opens modal with all plan types) -->
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-primary-50/50 hover:bg-primary-50 text-primary-700 transition-colors"
          @click="openPurchaseModal"
        >
          <UIcon name="i-lucide-package" class="w-5 h-5 shrink-0" />
          <div class="text-left">
            <div class="text-sm font-semibold">购买套餐</div>
            <div class="text-[11px] text-primary-500">充能包/模型套餐/应用套餐</div>
          </div>
        </button>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100" />

      <!-- Pricing Info (directly visible) -->
      <div v-if="isModel && model" class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">定价信息</h4>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500">输入价格</span>
          <span class="text-sm font-bold text-primary-600">{{ model.pricing.input }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500">输出价格</span>
          <span class="text-sm font-bold text-primary-600">{{ model.pricing.output }}</span>
        </div>
      </div>

      <!-- Divider (only if model has pricing) -->
      <div v-if="isModel && model" class="border-t border-gray-100" />

      <!-- Enterprise Batch Purchase (enterprise users only) -->
      <div v-if="currentUser.isEnterprise">
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-200 hover:border-primary-300 bg-white hover:bg-primary-50/30 text-primary-700 transition-colors"
          @click="emit('enterprisePurchase')"
        >
          <UIcon name="i-lucide-building-2" class="w-5 h-5 shrink-0" />
          <div class="text-left">
            <div class="text-sm font-semibold">企业批量采购</div>
            <div class="text-[11px] text-primary-500">专属折扣+统一结算</div>
          </div>
        </button>
      </div>

      <!-- Divider (only if enterprise) -->
      <div v-if="currentUser.isEnterprise" class="border-t border-gray-100" />

      <!-- Tags and Related Info -->
      <div class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">标签</h4>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in capability.tags.slice(0, 4)"
            :key="tag"
            class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-600"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Model-specific info -->
      <div v-if="isModel && model" class="space-y-2">
        <div class="flex justify-between">
          <span class="text-xs text-gray-500">参数规模</span>
          <span class="text-xs font-semibold text-gray-700">{{ model.parameters }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-xs text-gray-500">API端点</span>
          <span class="text-xs font-mono text-gray-600 truncate ml-2">{{ model.apiEndpoint }}</span>
        </div>
      </div>
    </div>

    <!-- Purchase Modal -->
    <UModal v-model:open="showPurchaseModal" :ui="{ content: 'sm:max-w-2xl' }">
      <template #content>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900">购买套餐 - {{ capability.name }}</h3>
          </div>

          <UTabs
            v-model="purchaseTab"
            :items="purchaseTabs"
            color="primary"
            variant="pill"
            :content="false"
            class="mb-4"
          />

          <!-- Model Plans -->
          <div v-if="purchaseTab === 'model-plans'" class="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            <PlanCard
              v-for="plan in capabilityPlans.modelPlans"
              :key="plan.id"
              :plan="plan"
              @buy="handleBuyPlan"
            />
          </div>

          <!-- App Plans -->
          <div v-if="purchaseTab === 'app-plans'" class="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            <PlanCard
              v-for="plan in capabilityPlans.appPlans"
              :key="plan.id"
              :plan="plan"
              @buy="handleBuyPlan"
            />
          </div>

          <!-- Packs -->
          <div v-if="purchaseTab === 'packs'" class="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            <PlanCard
              v-for="plan in capabilityPlans.packs"
              :key="plan.id"
              :plan="plan"
              @buy="handleBuyPlan"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Post-purchase guidance dialog -->
    <PostPurchaseDialog
      v-if="purchasedPlan"
      :plan="purchasedPlan"
      :open="showPostPurchase"
      @close="showPostPurchase = false"
    />
  </div>
</template>
