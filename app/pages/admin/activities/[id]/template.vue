<script setup lang="ts">
import { activities, models, apps } from '~/data/mock'

const route = useRoute()
const activityId = route.params.id as string
const activity = activities.find(a => a.id === activityId)

useHead({ title: `${activity?.title || '活动'} 模板配置 - 奇安信AI运营后台` })

const gradientPresets = [
  { label: '紫蓝渐变', value: 'from-primary-700 via-primary-600 to-accent-500', colors: ['#6D28D9', '#7C3AED', '#14B8A6'] },
  { label: '深紫渐变', value: 'from-deep-800 via-primary-800 to-primary-600', colors: ['#563C71', '#5B21B6', '#7C3AED'] },
  { label: '红紫渐变', value: 'from-red-700 via-red-600 to-primary-500', colors: ['#B91C1C', '#DC2626', '#8B5CF6'] },
  { label: '青紫渐变', value: 'from-accent-700 via-accent-600 to-primary-500', colors: ['#0F766E', '#0D9488', '#8B5CF6'] },
  { label: '蓝紫渐变', value: 'from-blue-700 via-blue-600 to-primary-500', colors: ['#1D4ED8', '#2563EB', '#8B5CF6'] },
  { label: '橙紫渐变', value: 'from-orange-700 via-orange-600 to-primary-500', colors: ['#C2410C', '#EA580C', '#8B5CF6'] }
]

const bgPatterns = [
  { label: '无', value: 'none' },
  { label: '网格', value: 'grid' },
  { label: '圆点', value: 'dots' },
  { label: '波纹', value: 'waves' }
]

const discountTypes = [
  { value: 'discount', label: '折扣' },
  { value: 'free', label: '免费' },
  { value: 'bonus', label: '奖金' }
]

const form = reactive({
  name: activity?.title || '',
  subtitle: activity?.subtitle || '',
  description: activity?.description || '',
  icon: activity?.icon || 'i-lucide-gift',
  // 优惠配置
  discountType: 'discount',
  discountValue: activity?.discount || '',
  // 视觉配置
  gradient: activity?.gradient || 'from-primary-700 via-primary-600 to-accent-500',
  bgPattern: 'none',
  // 关联内容
  relatedModels: [models[0]?.id || ''],
  relatedApps: [apps[0]?.id || ''],
  // 活动规则
  rules: activity?.rules ? [...activity.rules] : [''],
  // 活动权益
  benefits: activity?.benefits ? [...activity.benefits] : [''],
  // CTA配置
  ctaText: activity?.ctaText || '立即参与',
  ctaLink: ''
})

function addRule() {
  form.rules.push('')
}

function removeRule(index: number) {
  form.rules.splice(index, 1)
}

function addBenefit() {
  form.benefits.push('')
}

function removeBenefit(index: number) {
  form.benefits.splice(index, 1)
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

        <!-- Two-column layout -->
        <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <!-- Left: Live Preview -->
          <div class="xl:col-span-2">
            <div class="bg-white rounded-xl border border-gray-100 p-4 sticky top-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-semibold text-gray-700">实时预览</h2>
                <span class="text-xs text-gray-400">活动卡片 + 详情页效果</span>
              </div>
              <!-- Activity card preview -->
              <div class="rounded-xl overflow-hidden mb-4">
                <div :class="['bg-gradient-to-r p-5 text-white', form.gradient]">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon :name="form.icon" class="w-5 h-5" />
                    <span class="text-sm font-bold">{{ form.name || '活动名称' }}</span>
                  </div>
                  <p class="text-white/80 text-xs mb-3">{{ form.subtitle || '活动副标题' }}</p>
                  <div class="flex items-center justify-between">
                    <span class="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">{{ form.discountValue || '优惠' }}</span>
                    <span class="text-xs text-white/70">{{ form.ctaText }}</span>
                  </div>
                </div>
              </div>
              <!-- Activity detail preview -->
              <div class="border border-gray-200 rounded-lg overflow-hidden bg-[#FAFAFA]">
                <div :class="['bg-gradient-to-r p-4 text-white', form.gradient]">
                  <div class="flex items-center gap-2 mb-1">
                    <UIcon :name="form.icon" class="w-4 h-4" />
                    <span class="text-sm font-bold">{{ form.name || '活动名称' }}</span>
                  </div>
                  <p class="text-white/80 text-xs">{{ form.subtitle }}</p>
                </div>
                <div class="p-3 space-y-3">
                  <div>
                    <h4 class="text-xs font-semibold text-gray-700 mb-1">活动描述</h4>
                    <p class="text-xs text-gray-500 line-clamp-2">{{ form.description || '暂无描述' }}</p>
                  </div>
                  <div>
                    <h4 class="text-xs font-semibold text-gray-700 mb-1">活动权益</h4>
                    <div class="space-y-0.5">
                      <div
                        v-for="(b, i) in form.benefits.filter(Boolean).slice(0, 3)"
                        :key="i"
                        class="flex items-center gap-1.5"
                      >
                        <UIcon name="i-lucide-gift" class="w-3 h-3 text-primary-500" />
                        <span class="text-xs text-gray-600">{{ b }}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-xs font-semibold text-gray-700 mb-1">活动规则</h4>
                    <div class="space-y-0.5">
                      <div
                        v-for="(r, i) in form.rules.filter(Boolean).slice(0, 2)"
                        :key="i"
                        class="flex items-center gap-1.5"
                      >
                        <UIcon name="i-lucide-info" class="w-3 h-3 text-gray-400" />
                        <span class="text-xs text-gray-500">{{ r }}</span>
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
              <p class="text-xs text-gray-400 mb-5">配置活动的基本展示信息</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                  <input
                    v-model="form.subtitle"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">图标</label>
                  <input
                    v-model="form.icon"
                    type="text"
                    placeholder="i-lucide-gift"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
              </div>
            </div>

            <!-- 优惠配置 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">优惠配置</h2>
              <p class="text-xs text-gray-400 mb-5">设置活动优惠类型与折扣值</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">折扣类型</label>
                  <div class="flex gap-3">
                    <label
                      v-for="dt in discountTypes"
                      :key="dt.value"
                      class="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all"
                      :class="form.discountType === dt.value ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                    >
                      <input
                        v-model="form.discountType"
                        type="radio"
                        :value="dt.value"
                        class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      >
                      <span class="text-sm">{{ dt.label }}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">折扣值</label>
                  <input
                    v-model="form.discountValue"
                    type="text"
                    placeholder="如: 5折, 免费, ¥10万"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
              </div>
            </div>

            <!-- 视觉配置 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">视觉配置</h2>
              <p class="text-xs text-gray-400 mb-5">配置活动卡片的视觉风格</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">渐变色选择</label>
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      v-for="preset in gradientPresets"
                      :key="preset.value"
                      class="rounded-lg p-3 border-2 transition-all text-left"
                      :class="form.gradient === preset.value ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-100 hover:border-gray-200'"
                      @click="form.gradient = preset.value"
                    >
                      <div :class="['h-6 rounded bg-gradient-to-r mb-2', preset.value]" />
                      <p class="text-xs text-gray-600">{{ preset.label }}</p>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">背景图案</label>
                  <div class="flex gap-3">
                    <button
                      v-for="pattern in bgPatterns"
                      :key="pattern.value"
                      class="px-4 py-2 rounded-lg border text-sm transition-all"
                      :class="form.bgPattern === pattern.value ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                      @click="form.bgPattern = pattern.value"
                    >
                      {{ pattern.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 关联内容 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">关联内容</h2>
              <p class="text-xs text-gray-400 mb-5">选择活动关联的模型与应用</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">关联模型</label>
                  <div class="space-y-2 max-h-40 overflow-y-auto">
                    <label
                      v-for="m in models"
                      :key="m.id"
                      class="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-primary-200 transition-all cursor-pointer"
                    >
                      <input
                        v-model="form.relatedModels"
                        type="checkbox"
                        :value="m.id"
                        class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      >
                      <span class="text-sm text-gray-700">{{ m.name }}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">关联应用</label>
                  <div class="space-y-2 max-h-40 overflow-y-auto">
                    <label
                      v-for="a in apps"
                      :key="a.id"
                      class="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-primary-200 transition-all cursor-pointer"
                    >
                      <input
                        v-model="form.relatedApps"
                        type="checkbox"
                        :value="a.id"
                        class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      >
                      <span class="text-sm text-gray-700">{{ a.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 活动规则 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-base font-semibold text-gray-900">活动规则</h2>
                <button
                  class="flex items-center gap-1 px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  @click="addRule"
                >
                  <UIcon name="i-lucide-plus" class="w-3 h-3" />
                  添加规则
                </button>
              </div>
              <p class="text-xs text-gray-400 mb-5">配置活动参与规则说明</p>
              <div class="space-y-2">
                <div
                  v-for="(rule, index) in form.rules"
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <span class="text-xs text-gray-400 w-6 shrink-0">{{ index + 1 }}.</span>
                  <input
                    v-model="form.rules[index]"
                    type="text"
                    class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                    :placeholder="`规则 ${index + 1}`"
                  >
                  <button
                    class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    @click="removeRule(index)"
                  >
                    <UIcon name="i-lucide-x" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 活动权益 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-base font-semibold text-gray-900">活动权益</h2>
                <button
                  class="flex items-center gap-1 px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  @click="addBenefit"
                >
                  <UIcon name="i-lucide-plus" class="w-3 h-3" />
                  添加权益
                </button>
              </div>
              <p class="text-xs text-gray-400 mb-5">配置活动可享受的权益列表</p>
              <div class="space-y-2">
                <div
                  v-for="(benefit, index) in form.benefits"
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <UIcon name="i-lucide-gift" class="w-4 h-4 text-primary-400 shrink-0" />
                  <input
                    v-model="form.benefits[index]"
                    type="text"
                    class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                    :placeholder="`权益 ${index + 1}`"
                  >
                  <button
                    class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    @click="removeBenefit(index)"
                  >
                    <UIcon name="i-lucide-x" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- CTA配置 -->
            <div class="bg-white rounded-xl border border-gray-100 p-6">
              <h2 class="text-base font-semibold text-gray-900 mb-1">CTA配置</h2>
              <p class="text-xs text-gray-400 mb-5">配置活动行动号召按钮</p>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">按钮文字</label>
                  <input
                    v-model="form.ctaText"
                    type="text"
                    placeholder="立即参与"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">跳转链接</label>
                  <input
                    v-model="form.ctaLink"
                    type="text"
                    placeholder="/market/xxx"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  >
                </div>
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
