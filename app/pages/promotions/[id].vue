<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { activities, models, apps, modelPlans, appPlans } from '~/data/mock'

const route = useRoute()
const id = route.params.id as string

const activity = activities.find(a => a.id === id)

if (!activity) {
  throw createError({ statusCode: 404, statusMessage: '活动不存在' })
}

useHead({
  title: `${activity.title} - 奇安信AI开放平台`,
  meta: [
    { name: 'description', content: activity.description }
  ]
})

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

const renderedDetail = computed(() => {
  if (activity!.detailMd) {
    return md.render(activity!.detailMd)
  }
  return md.render(activity!.description)
})

// Related capabilities
const relatedCapabilities = computed(() => {
  if (!activity!.relatedCapabilityIds?.length) return []
  return activity!.relatedCapabilityIds.map(id => {
    const model = models.find(m => m.id === id)
    if (model) return { id: model.id, name: model.name, icon: model.icon, type: 'model' as const, typeName: model.typeName, typeColor: model.typeColor, pricing: model.pricing }
    const app = apps.find(a => a.id === id)
    if (app) return { id: app.id, name: app.name, icon: app.icon, type: 'app' as const, typeName: app.typeName, typeColor: app.typeColor, pricing: null }
    return null
  }).filter(Boolean)
})

// Discount plans
const discountPlanDetails = computed(() => {
  if (!activity!.discountPlans?.length) return []
  const allPlans = [...modelPlans, ...appPlans]
  return activity!.discountPlans.map(dp => {
    const plan = allPlans.find(p => p.id === dp.planId)
    if (!plan) return null
    return {
      ...plan,
      discountPrice: dp.discountPrice,
      savings: plan.price - dp.discountPrice
    }
  }).filter(Boolean)
})

// FAQ toggle
const openFaqIndex = ref<number | null>(null)
function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function formatPrice(price: number) {
  return `¥${price.toLocaleString()}`
}
</script>

<template>
  <div>
    <!-- Top Banner -->
    <section class="relative overflow-hidden">
      <div
        class="relative px-6 py-16"
        :class="`bg-gradient-to-br ${activity.gradient}`"
      >
        <!-- Decorative -->
        <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
        <div class="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/5" />
        <div class="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-white/5" />

        <div class="max-w-7xl mx-auto relative z-10">
          <div class="flex items-center gap-2 mb-4">
            <NuxtLink to="/promotions" class="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors">
              <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
              返回活动列表
            </NuxtLink>
          </div>

          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <UIcon :name="activity.icon" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h1 class="text-white font-bold text-3xl">{{ activity.title }}</h1>
                    <span v-if="activity.hot" class="px-2 py-0.5 rounded text-xs font-bold bg-white/20 text-white">HOT</span>
                    <span v-if="activity.new" class="px-2 py-0.5 rounded text-xs font-bold bg-white/20 text-white">NEW</span>
                  </div>
                  <p class="text-white/70 text-sm">{{ activity.subtitle }}</p>
                </div>
              </div>

              <div class="flex items-center gap-4 mb-6">
                <span class="px-4 py-2 rounded-lg bg-white/20 text-white text-lg font-bold">
                  {{ activity.discountText }}
                </span>
                <div class="flex items-center gap-1.5 text-white/60 text-sm">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                  {{ formatDate(activity.startDate) }} - {{ formatDate(activity.endDate) }}
                </div>
              </div>

              <p class="text-white/80 text-base leading-relaxed max-w-2xl">
                {{ activity.description }}
              </p>
            </div>

            <!-- CTA -->
            <div class="flex flex-col gap-3 ml-8">
              <UButton
                :label="activity.category === '免费体验' || activity.category === '新客专享' ? '立即领取' : '购买优惠套餐'"
                icon="i-lucide-gift"
                color="white"
                size="xl"
              />
              <UButton
                label="咨询客服"
                icon="i-lucide-message-circle"
                color="white"
                variant="outline"
                size="md"
                class="border-white/30 text-white hover:bg-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="col-span-2 space-y-8">
          <!-- Activity Description (Markdown) -->
          <section class="bg-white rounded-xl border border-gray-100 p-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-file-text" class="w-5 h-5 text-primary-500" />
              活动详情
            </h2>
            <div class="prose prose-sm max-w-none text-gray-600" v-html="renderedDetail" />
          </section>

          <!-- Related Capabilities -->
          <section v-if="relatedCapabilities.length" class="bg-white rounded-xl border border-gray-100 p-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-cpu" class="w-5 h-5 text-primary-500" />
              关联能力
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <NuxtLink
                v-for="cap in relatedCapabilities"
                :key="cap!.id"
                :to="cap!.type === 'model' ? `/marketplace/models/${cap!.id}` : `/marketplace/apps/${cap!.id}`"
                class="group flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all"
              >
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  :style="{ backgroundColor: cap!.typeColor + '15' }"
                >
                  <UIcon :name="cap!.icon" class="w-5 h-5" :style="{ color: cap!.typeColor }" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{{ cap!.name }}</h4>
                    <span
                      class="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      :style="{ backgroundColor: cap!.typeColor + '10', color: cap!.typeColor }"
                    >
                      {{ cap!.typeName }}
                    </span>
                  </div>
                  <div v-if="cap!.pricing" class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">{{ cap!.pricing.input }}</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600">活动优惠</span>
                  </div>
                  <div v-else class="text-xs text-gray-400">应用</div>
                </div>
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors mt-2" />
              </NuxtLink>
            </div>
          </section>

          <!-- Discount Plans -->
          <section v-if="discountPlanDetails.length" class="bg-white rounded-xl border border-gray-100 p-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-tag" class="w-5 h-5 text-primary-500" />
              优惠套餐
            </h2>
            <div class="space-y-4">
              <div
                v-for="plan in discountPlanDetails"
                :key="plan!.id"
                class="flex items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <UIcon :name="plan!.icon" class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">{{ plan!.name }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ plan!.description }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        v-for="feature in plan!.features.slice(0, 3)"
                        :key="feature"
                        class="text-[10px] text-gray-400"
                      >{{ feature }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-primary-600">{{ formatPrice(plan!.discountPrice) }}</span>
                    <span class="text-sm text-gray-400 line-through">{{ formatPrice(plan!.price) }}</span>
                  </div>
                  <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 mt-1">
                    省{{ formatPrice(plan!.savings) }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Info -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">活动信息</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">活动类型</span>
                <span class="px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-700">{{ activity.category }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">优惠力度</span>
                <span class="text-sm font-bold text-red-600">{{ activity.discountText }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">开始时间</span>
                <span class="text-xs text-gray-700">{{ formatDate(activity.startDate) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">结束时间</span>
                <span class="text-xs text-gray-700">{{ formatDate(activity.endDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Rules -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-scroll-text" class="w-4 h-4 text-primary-500" />
              活动规则
            </h3>
            <ul class="space-y-2">
              <li
                v-for="rule in activity.rules"
                :key="rule"
                class="text-xs text-gray-500 flex items-start gap-2"
              >
                <span class="w-1 h-1 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                {{ rule }}
              </li>
            </ul>
          </div>

          <!-- FAQ -->
          <div v-if="activity.faq?.length" class="bg-white rounded-xl border border-gray-100 p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-help-circle" class="w-4 h-4 text-primary-500" />
              常见问题
            </h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in activity.faq"
                :key="index"
                class="border-b border-gray-50 last:border-0 pb-3 last:pb-0"
              >
                <button
                  class="w-full text-left flex items-start justify-between gap-2"
                  @click="toggleFaq(index)"
                >
                  <span class="text-xs font-medium text-gray-700">{{ item.question }}</span>
                  <UIcon
                    :name="openFaqIndex === index ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                    class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5"
                  />
                </button>
                <div v-if="openFaqIndex === index" class="mt-2">
                  <p class="text-xs text-gray-500 leading-relaxed">{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Sidebar -->
          <div class="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-center">
            <UIcon :name="activity.icon" class="w-8 h-8 text-white/80 mx-auto mb-3" />
            <h3 class="text-white font-bold text-base mb-1">{{ activity.title }}</h3>
            <p class="text-white/60 text-xs mb-4">{{ activity.discountText }}</p>
            <UButton
              :label="activity.category === '免费体验' || activity.category === '新客专享' ? '立即领取' : '购买优惠套餐'"
              icon="i-lucide-gift"
              color="white"
              block
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(h2) {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.prose :deep(h3) {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.prose :deep(p) {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.625;
  margin-bottom: 0.75rem;
}
.prose :deep(ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}
.prose :deep(li) {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}
.prose :deep(table) {
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
  margin-bottom: 0.75rem;
}
.prose :deep(th) {
  background-color: #f9fafb;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  border: 1px solid #f3f4f6;
}
.prose :deep(td) {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #4b5563;
  border: 1px solid #f3f4f6;
}
.prose :deep(strong) {
  font-weight: 700;
  color: #1f2937;
}
</style>
