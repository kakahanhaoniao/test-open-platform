# 产品闭环全面升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the AI Open Platform with modular template system, three-tier plan system, ECharts real-time charts, cross-page drill-down linking, and visual upgrades across marketplace/portal/promotions pages.

**Architecture:** Module-based template rendering replaces hardcoded CapabilityDetail tabs. ECharts replaces all CSS bar charts. Three-tier plan system (pack/model-plan/app-plan) extends beyond charging packs. Cross-page linking via URL query params and global composables.

**Tech Stack:** Vue 3 + Nuxt 4 + @nuxt/ui + Tailwind CSS 4 + ECharts 5 + vue-echarts + Iconify (lucide) + markdown-it

## Global Constraints

- All new components use `<script setup lang="ts">` and Composition API
- Tailwind utility classes only — no inline styles for colors/spacing (except dynamic chart heights)
- Primary color: primary-600 (#7C3AED range) from existing Tailwind config
- ECharts theme: light, primary color #7C3AED, auxiliary colors from Tailwind palette
- Mock data only — no real API calls, but structure must support future API swap
- All chart drill-down events emit `{ chartType: string; field: string; value: any }`
- Markdown rendering via `markdown-it` (lightweight, no editor)
- Image upload mock: `URL.createObjectURL()` + base64 storage in template props
- Existing sidebar/nav components remain unchanged
- Chinese UI text throughout

---

### Task 1: Install ECharts + markdown-it and create BaseChart component

**Files:**
- Modify: `package.json` (add dependencies)
- Create: `app/components/charts/BaseChart.vue`
- Create: `app/composables/useChartTheme.ts`

**Interfaces:**
- Produces: `BaseChart` component with props `{ option, height?, loading?, emptyText? }` and emit `drilldown`
- Produces: `useChartTheme()` composable returning ECharts theme option object

- [ ] **Step 1: Install dependencies**

```bash
npm install echarts vue-echarts markdown-it
```

- [ ] **Step 2: Create chart theme composable**

Create `app/composables/useChartTheme.ts`:

```ts
export function useChartTheme() {
  const colors = ['#7C3AED', '#A78BFA', '#C4B5FD', '#818CF8', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444']
  return {
    colors,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, system-ui, sans-serif', color: '#6B7280' },
    title: { textStyle: { color: '#111827', fontWeight: 600 } },
    legend: { textStyle: { color: '#6B7280' } },
    tooltip: { backgroundColor: '#fff', borderColor: '#E5E7EB', textStyle: { color: '#111827' } },
    grid: { containLabel: true }
  }
}
```

- [ ] **Step 3: Create BaseChart component**

Create `app/components/charts/BaseChart.vue`:

```vue
<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useChartTheme } from '~/composables/useChartTheme'

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent])

const props = withDefaults(defineProps<{
  option: Record<string, any>
  height?: string
  loading?: boolean
  emptyText?: string
}>(), {
  height: '300px',
  loading: false,
  emptyText: '暂无数据'
})

const emit = defineEmits<{
  drilldown: [data: { chartType: string; field: string; value: any }]
}>()

const theme = useChartTheme()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)

function handleClick(params: any) {
  if (params.componentType === 'series' && params.seriesType) {
    emit('drilldown', {
      chartType: params.seriesType,
      field: params.seriesName || params.name,
      value: params.name ?? params.value
    })
  }
}

onMounted(() => {
  if (chartRef.value) {
    chartRef.value.bind('click', handleClick)
  }
})

const mergedOption = computed(() => ({
  color: theme.colors,
  ...props.option
}))
</script>

<template>
  <div :style="{ height }" class="relative">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
      <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
    <VChart
      v-if="!loading && option"
      ref="chartRef"
      :option="mergedOption"
      autoresize
      class="w-full h-full"
    />
    <div v-if="!loading && !option" class="flex items-center justify-center h-full text-gray-400 text-sm">
      {{ emptyText }}
    </div>
  </div>
</template>
```

- [ ] **Step 4: Verify build**

```bash
npx nuxi build 2>&1 | tail -5
```

Expected: Build complete

- [ ] **Step 5: Commit**

```bash
git add package.json app/components/charts/ app/composables/useChartTheme.ts
git commit -m "feat: add ECharts + BaseChart component with drill-down support"
```

---

### Task 2: Add Plan interface + mock data for three-tier plan system

**Files:**
- Modify: `app/data/mock.ts` (add Plan interface, modelPlans, appPlans exports)

**Interfaces:**
- Consumes: existing `models` and `apps` arrays for targetId references
- Produces: `Plan` interface, `modelPlans: Plan[]`, `appPlans: Plan[]`, updated `chargingPacks` to include `type: 'pack'`

- [ ] **Step 1: Add Plan interface after ChargingPack interface (around line 70)**

```ts
export interface Plan {
  id: string
  type: 'pack' | 'model-plan' | 'app-plan'
  targetId?: string
  name: string
  description: string
  billingCycle: 'one-time' | 'monthly' | 'annual'
  price: number
  originalPrice?: number
  includedTokens?: number
  includedCalls?: number
  features: string[]
  popular: boolean
  icon: string
  gradient?: string
  badge?: string
}
```

- [ ] **Step 2: Add `type: 'pack'` field to existing ChargingPack data (4 entries)**

Add `type: 'pack' as const` to each charging pack object.

- [ ] **Step 3: Add modelPlans and appPlans data after chargingPacks**

```ts
export const modelPlans: Plan[] = [
  { id: 'mp-security-pro', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型专业版', description: '包含200万Token/月，优先响应速度', billingCycle: 'monthly', price: 999, includedTokens: 2000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持'], popular: true, icon: 'i-lucide-brain', gradient: 'from-primary-600 to-primary-400' },
  { id: 'mp-security-annual', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型年度版', description: '年付享8折优惠', billingCycle: 'annual', price: 9590, originalPrice: 11988, includedTokens: 24000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持', '专属模型实例'], popular: false, icon: 'i-lucide-brain' },
  { id: 'mp-threat-pro', type: 'model-plan', targetId: 'threat-detect-v3', name: '威胁检测专业版', description: '100万Token/月+实时威胁推送', billingCycle: 'monthly', price: 599, includedTokens: 1000000, features: ['100万Token/月', '实时威胁推送', '优先响应'], popular: false, icon: 'i-lucide-shield-alert' },
  { id: 'mp-code-pro', type: 'model-plan', targetId: 'code-security-scan', name: '代码安全扫描专业版', description: '150万Token/月+CI/CD集成', billingCycle: 'monthly', price: 399, includedTokens: 1500000, features: ['150万Token/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' }
]

export const appPlans: Plan[] = [
  { id: 'ap-threat-assistant', type: 'app-plan', targetId: 'app-threat-assistant', name: '威胁检测助手专业版', description: '5000次调用/月+7天数据留存', billingCycle: 'monthly', price: 299, includedCalls: 5000, features: ['5000次调用/月', '7天数据留存', '实时告警'], popular: true, icon: 'i-lucide-radar', gradient: 'from-red-500 to-amber-500' },
  { id: 'ap-code-scan', type: 'app-plan', targetId: 'app-code-scan', name: '代码安全扫描专业版', description: '3000次扫描/月+CI/CD集成', billingCycle: 'monthly', price: 199, includedCalls: 3000, features: ['3000次扫描/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' },
  { id: 'ap-compliance', type: 'app-plan', targetId: 'app-compliance', name: '合规审计助手专业版', description: '2000次审计/月+合规报告', billingCycle: 'monthly', price: 249, includedCalls: 2000, features: ['2000次审计/月', '合规报告生成', '多标准支持'], popular: false, icon: 'i-lucide-scale' }
]
```

- [ ] **Step 4: Create helper function to get plans for a capability**

```ts
export function getPlansForCapability(capabilityId: string): { packs: Plan[]; modelPlans: Plan[]; appPlans: Plan[] } {
  return {
    packs: chargingPacks.map(p => ({ ...p, type: 'pack' as const })),
    modelPlans: modelPlans.filter(p => p.targetId === capabilityId),
    appPlans: appPlans.filter(p => p.targetId === capabilityId)
  }
}
```

- [ ] **Step 5: Verify build and commit**

```bash
npx nuxi build 2>&1 | tail -5
git add app/data/mock.ts
git commit -m "feat: add Plan interface + model/app plan mock data for three-tier plan system"
```

---

### Task 3: Add PageTemplate + TemplateModule interfaces and default template data

**Files:**
- Modify: `app/data/mock.ts` (add PageTemplate, TemplateModule interfaces, defaultTemplates, getDefaultTemplate helper)

**Interfaces:**
- Consumes: `models` and `apps` arrays for targetId
- Produces: `PageTemplate`, `TemplateModule`, `ModuleType` types; `defaultTemplates` array; `getDefaultTemplate(targetType, targetId)` function

- [ ] **Step 1: Add template interfaces after Plan interface**

```ts
export type ModuleType = 'banner' | 'hero' | 'intro' | 'features' | 'advantages' |
  'scenarios' | 'tabs' | 'carousel' | 'cards' | 'steps' |
  'pricing' | 'integration' | 'related'

export interface TemplateModule {
  id: string
  type: ModuleType
  title?: string
  props: Record<string, any>
  visible: boolean
  order: number
  spacing: { top: 'xs' | 'sm' | 'md' | 'lg'; bottom: 'xs' | 'sm' | 'md' | 'lg' }
  background: 'white' | 'gray' | 'primary-light'
  children?: TemplateModule[]
}

export interface PageTemplate {
  id: string
  targetType: 'model' | 'app'
  targetId: string
  theme: { primaryColor?: string; bgStyle?: 'light' | 'dark' | 'gradient' }
  modules: TemplateModule[]
}
```

- [ ] **Step 2: Add default template generator function**

```ts
export function getDefaultTemplate(targetType: 'model' | 'app', targetId: string, appType?: string): PageTemplate {
  const base: PageTemplate = {
    id: `tpl-${targetId}`,
    targetType,
    targetId,
    theme: { bgStyle: 'light' },
    modules: []
  }

  const mkModule = (type: ModuleType, order: number, props: Record<string, any> = {}): TemplateModule => ({
    id: `mod-${type}-${order}`,
    type,
    visible: true,
    order,
    props,
    spacing: { top: 'md', bottom: 'md' },
    background: 'white'
  })

  if (targetType === 'model') {
    base.modules = [
      mkModule('banner', 1, { gradient: 'from-primary-600 to-primary-400' }),
      mkModule('intro', 2),
      mkModule('features', 3, { layout: 'grid' }),
      mkModule('scenarios', 4, { layout: 'cards' }),
      mkModule('pricing', 5, { useDefault: true }),
      mkModule('integration', 6, { useDefault: true }),
      mkModule('related', 7, { maxCount: 4 })
    ]
  } else {
    switch (appType) {
      case 'chat':
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('features', 3, { layout: 'grid' }),
          mkModule('integration', 4, { useDefault: true }),
          mkModule('pricing', 5, { useDefault: true })
        ]
        break
      case 'tool':
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('steps', 3, { direction: 'vertical' }),
          mkModule('pricing', 4, { useDefault: true }),
          mkModule('integration', 5, { useDefault: true })
        ]
        break
      case 'showcase':
        base.modules = [
          mkModule('banner', 1),
          mkModule('carousel', 2, { autoplay: true }),
          mkModule('advantages', 3),
          mkModule('cards', 4, { columns: 3 }),
          mkModule('integration', 5, { useDefault: true })
        ]
        break
      default: // external-link
        base.modules = [
          mkModule('banner', 1),
          mkModule('intro', 2),
          mkModule('cards', 3, { columns: 3 }),
        ]
    }
  }
  return base
}
```

- [ ] **Step 3: Add defaultTemplates array for the first 3 models and 2 apps**

Generate default templates using the function and export as `defaultTemplates`.

- [ ] **Step 4: Verify build and commit**

```bash
npx nuxi build 2>&1 | tail -5
git add app/data/mock.ts
git commit -m "feat: add PageTemplate/TemplateModule interfaces + default template generator"
```

---

### Task 4: Create 13 module rendering components

**Files:**
- Create: `app/components/modules/ModuleBanner.vue`
- Create: `app/components/modules/ModuleHero.vue`
- Create: `app/components/modules/ModuleIntro.vue`
- Create: `app/components/modules/ModuleFeatures.vue`
- Create: `app/components/modules/ModuleAdvantages.vue`
- Create: `app/components/modules/ModuleScenarios.vue`
- Create: `app/components/modules/ModuleTabs.vue`
- Create: `app/components/modules/ModuleCarousel.vue`
- Create: `app/components/modules/ModuleCards.vue`
- Create: `app/components/modules/ModuleSteps.vue`
- Create: `app/components/modules/ModulePricing.vue`
- Create: `app/components/modules/ModuleIntegration.vue`
- Create: `app/components/modules/ModuleRelated.vue`

**Interfaces:**
- Consumes: `TemplateModule` type from mock.ts, `models`/`apps`/`chargingPacks`/`modelPlans`/`appPlans` for pricing/integration/related
- Produces: 13 module components each accepting `props: { module: TemplateModule; capability: Model | App; capabilityType: 'model' | 'app' }`

Each component renders its module type based on `module.props`. Key details:

- **ModuleBanner**: Gradient or image background, title, subtitle, badge, CTA button. Uses `module.props.gradient` for background.
- **ModuleHero**: Centered title + MD description + button group. Uses `markdown-it` for description rendering.
- **ModuleIntro**: Title + MD body + optional image. Layout from `module.props.layout` (left-right/center).
- **ModuleFeatures**: Feature list with icons. Layout from `module.props.layout` (grid/list).
- **ModuleAdvantages**: Comparison items (our advantage vs traditional).
- **ModuleScenarios**: Scenario cards. Layout from `module.props.layout` (cards/carousel).
- **ModuleTabs**: Tab headers + recursive module rendering for each tab's children.
- **ModuleCarousel**: Image carousel with auto-play. Use CSS scroll-snap for lightweight implementation.
- **ModuleCards**: Card grid with configurable columns (2/3/4).
- **ModuleSteps**: Step list with direction (horizontal/vertical).
- **ModulePricing**: If `module.props.useDefault` is true, render pricing from capability data. Otherwise render custom plans from `module.props.plans`.
- **ModuleIntegration**: If `module.props.useDefault` is true, render 3-step integration guide from capability data. Otherwise render custom steps.
- **ModuleRelated**: Auto-match by tags or use `module.props.ids`. Max count from `module.props.maxCount`.

Each component applies `module.spacing` and `module.background` as wrapper classes.

- [ ] **Step 1: Create all 13 module components** (implement each with full template+script)

- [ ] **Step 2: Verify build**

```bash
npx nuxi build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add app/components/modules/
git commit -m "feat: add 13 module rendering components for template system"
```

---

### Task 5: Refactor marketplace detail page to use template rendering

**Files:**
- Modify: `app/pages/marketplace/[id].vue` (replace CapabilityDetail with template-based rendering)
- Modify: `app/components/CapabilityDetail.vue` (extract right sidebar into separate component)

**Interfaces:**
- Consumes: `getDefaultTemplate()` from mock.ts, all 13 Module* components
- Produces: Template-based detail page with sticky right sidebar

- [ ] **Step 1: Create `app/components/CapabilitySidebar.vue`** — extract the sticky right info panel from CapabilityDetail (name, icon, rating, 3 action buttons, pricing summary, tags, enterprise batch purchase)

- [ ] **Step 2: Rewrite `app/pages/marketplace/[id].vue`** to:
  1. Look up capability and template (`getDefaultTemplate`)
  2. Render breadcrumb
  3. Two-column layout: left = module renderer loop, right = CapabilitySidebar (sticky)
  4. Module renderer iterates `template.modules.filter(m => m.visible)` sorted by `order`, renders `<component :is="moduleComponentMap[module.type]" :module="module" :capability="capability" :capability-type="capabilityType" />`
  5. Bottom: related capabilities section

- [ ] **Step 3: Verify detail page renders correctly for a model and an app**

- [ ] **Step 4: Commit**

```bash
git add app/pages/marketplace/ app/components/CapabilitySidebar.vue
git commit -m "feat: refactor detail page to template-based module rendering"
```

---

### Task 6: Replace all CSS charts with ECharts (monitor + stats + logs + billing + dashboards)

**Files:**
- Modify: `app/pages/enterprise/monitor.vue` (replace CSS charts with BaseChart)
- Modify: `app/pages/console/stats/index.vue` (replace CSS charts with BaseChart)
- Modify: `app/pages/console/logs/index.vue` (add ECharts trend + status distribution)
- Modify: `app/pages/enterprise/logs.vue` (add ECharts trend + status distribution)
- Modify: `app/pages/console/index.vue` (replace CSS bar chart with ECharts area)
- Modify: `app/pages/enterprise/index.vue` (replace CSS chart with ECharts area)
- Modify: `app/pages/enterprise/billing.vue` (replace CSS bar chart with ECharts combo)
- Modify: `app/pages/console/billing/index.vue` (add ECharts trend)

**Interfaces:**
- Consumes: `BaseChart` component, `useChartTheme` composable, `monitorMetrics`/`callLogs`/`billingRecords` data
- Produces: All pages with ECharts replacing CSS div charts, drill-down emit handlers

Key replacements per page:

**monitor.vue**: Stacked area chart for realtime series (with auto-refresh via setOption), doughnut for model distribution, horizontal bar for member ranking. Click handlers navigate to `/enterprise/logs?model=xxx` or `?member=xxx`.

**stats/index.vue**: Line chart (calls + errors dual Y), doughnut for token distribution, line chart for latency P50/P95/P99.

**logs pages**: Area chart for call volume trend, doughnut for status code distribution. Both update when filters change.

**billing pages**: Bar+line combo chart (amount bars + token line), doughnut for member cost distribution.

**console/index.vue + enterprise/index.vue**: Area line chart for 7-day call trend.

- [ ] **Step 1: Replace monitor.vue charts** (3 charts: stacked area, doughnut, horizontal bar)

- [ ] **Step 2: Replace stats/index.vue charts** (3 charts: dual-Y line, doughnut, latency line)

- [ ] **Step 3: Replace logs pages charts** (2 charts each: area trend, status doughnut)

- [ ] **Step 4: Replace billing pages charts** (2 charts each: bar+line combo, member doughnut)

- [ ] **Step 5: Replace dashboard charts** (console/index.vue + enterprise/index.vue: area line)

- [ ] **Step 6: Verify all pages render correctly**

- [ ] **Step 7: Commit**

```bash
git add app/pages/enterprise/monitor.vue app/pages/console/stats/ app/pages/console/logs/ app/pages/enterprise/logs.vue app/pages/console/index.vue app/pages/enterprise/index.vue app/pages/enterprise/billing.vue app/pages/console/billing/
git commit -m "feat: replace all CSS charts with ECharts + drill-down support"
```

---

### Task 7: Upgrade packs pages with three-tab plan system

**Files:**
- Modify: `app/pages/console/packs/index.vue` (add model-plan + app-plan tabs)
- Modify: `app/pages/enterprise/packs.vue` (add model-plan + app-plan tabs)
- Modify: `app/components/CapabilityDetail.vue` or `CapabilitySidebar.vue` (update purchase modal to show all plan types)

**Interfaces:**
- Consumes: `Plan` interface, `chargingPacks`, `modelPlans`, `appPlans`, `getPlansForCapability()` from mock.ts
- Produces: Three-tab packs pages, updated purchase modal with plan type selection

- [ ] **Step 1: Rewrite console/packs with three tabs** — Tab bar: 充能包 | 模型套餐 | 应用套餐. Each tab renders plan cards with appropriate fields (tokens vs calls, billing cycle badge, features list, buy button).

- [ ] **Step 2: Rewrite enterprise/packs with three tabs** — Same structure plus enterprise-specific features (member allocation, batch purchase).

- [ ] **Step 3: Update purchase modal in CapabilitySidebar** — When clicking "购买套餐", show all available plans for this capability: model-plans first, then app-plans, then charging packs. Each with buy button.

- [ ] **Step 4: Add post-purchase guidance** — After buying a model-plan, show integration guide modal. After buying an app-plan, show webhook/SDK steps. After buying a pack, show balance + next steps.

- [ ] **Step 5: Verify and commit**

```bash
git add app/pages/console/packs/ app/pages/enterprise/packs.vue app/components/CapabilitySidebar.vue
git commit -m "feat: three-tab plan system on packs pages + updated purchase modal"
```

---

### Task 8: Upgrade marketplace listing page

**Files:**
- Modify: `app/pages/marketplace/index.vue` (search hero + capsule tabs + featured cards + upgraded cards + horizontal filters + pagination)
- Modify: `app/components/CapabilityCard.vue` (add price tag, call count badge, favorite icon, quick preview button, hover actions)

**Interfaces:**
- Consumes: `models`, `apps`, `chargingPacks`, `modelPlans`, `appPlans` for price tags
- Produces: Redesigned marketplace with search hero, featured section, upgraded cards, pagination

- [ ] **Step 1: Rewrite marketplace/index.vue** with: search hero section (large search + hot tags), capsule type tabs + subcategory scroll, 2 featured recommendation cards, horizontal filter bar (replacing left sidebar), upgraded CapabilityCard grid, pagination (12 per page)

- [ ] **Step 2: Upgrade CapabilityCard.vue** with: price tag (from pricing or plans), call count micro-badge, favorite heart icon, quick preview button (eye icon), hover: card lifts + show action bar

- [ ] **Step 3: Add quick preview USlideover** — clicking quick preview opens a side panel showing capability summary + 3 action buttons

- [ ] **Step 4: Verify and commit**

```bash
git add app/pages/marketplace/ app/components/CapabilityCard.vue
git commit -m "feat: upgrade marketplace with search hero, featured cards, upgraded cards, pagination"
```

---

### Task 9: Upgrade Portal homepage

**Files:**
- Modify: `app/pages/index.vue` (Hero canvas animation + capability carousel + security matrix + enterprise section redesign + pricing tabs + quick start section)

**Interfaces:**
- Consumes: `models`, `apps`, `chargingPacks`, `modelPlans`, `appPlans` for pricing tabs
- Produces: Redesigned homepage with 6 upgraded/new sections

- [ ] **Step 1: Add Canvas particle/node animation to Hero** — lightweight Canvas animation showing security nodes connecting, rendered behind the hero text

- [ ] **Step 2: Replace capability preview with horizontal carousel** — auto-rotating cards showing 3-4 hot capabilities with core params + "快速体验" button

- [ ] **Step 3: Add "安全能力矩阵" section** — 2x3 grid of security domains (网络安全/威胁检测/漏洞分析/合规审计/代码安全/应急响应), each with icon + capability count + representative model name, linking to marketplace with category filter

- [ ] **Step 4: Redesign enterprise section** — white cards with purple gradient border instead of dark bg, feature cards with icon + number + description

- [ ] **Step 5: Upgrade pricing section** — Tab switcher (充能包/模型套餐/应用套餐), each tab shows 2-3 featured plans

- [ ] **Step 6: Add "快速接入" section** — 3-step flow (注册→获取Key→调用API) with code snippet preview

- [ ] **Step 7: Verify and commit**

```bash
git add app/pages/index.vue
git commit -m "feat: upgrade Portal homepage with animation, carousel, matrix, pricing tabs, quick start"
```

---

### Task 10: Upgrade promotions page + add activity detail page

**Files:**
- Modify: `app/pages/promotions/index.vue` (countdown banner + related capability tags + category filter + card upgrades)
- Create: `app/pages/promotions/[id].vue` (activity detail page)

**Interfaces:**
- Consumes: `activities`, `models`, `apps`, `modelPlans`, `appPlans` from mock.ts
- Produces: Upgraded promotions list + new activity detail page at `/promotions/[id]`

- [ ] **Step 1: Upgrade promotions/index.vue** — Add countdown banner for hottest activity at top, add "关联能力" tags on cards, add category filter (全部/限时折扣/免费体验/新客专享/企业优惠), update CTA to "领取优惠"/"购买套餐"

- [ ] **Step 2: Create promotions/[id].vue** — Activity detail page with: top banner (gradient/image from activity data), activity description (MD rendered), related capabilities section (capability cards with discount price tags), discount plans section (plans with discounted prices), rules + FAQ, CTA buttons (立即领取 / 购买优惠套餐)

- [ ] **Step 3: Update Activity interface** — Add `relatedCapabilityIds?: string[]` and `discountPlans?: { planId: string; discountPrice: number }[]` fields to mock data

- [ ] **Step 4: Verify and commit**

```bash
git add app/pages/promotions/ app/data/mock.ts
git commit -m "feat: upgrade promotions page + add activity detail page with related capabilities"
```

---

### Task 11: Add cross-page drill-down linking

**Files:**
- Modify: `app/pages/enterprise/monitor.vue` (add drilldown handlers on chart click)
- Modify: `app/pages/enterprise/logs.vue` (read route.query for auto-filter, add model name links)
- Modify: `app/pages/console/logs/index.vue` (read route.query for auto-filter)
- Modify: `app/pages/console/stats/index.vue` (add drilldown handlers)
- Modify: `app/pages/console/index.vue` (add click handler on model ranking)

**Interfaces:**
- Consumes: `useRouter()`, `useRoute()` from Vue Router
- Produces: All chart clicks navigate to target pages with query params; target pages read query params on mount and auto-apply filters

- [ ] **Step 1: Add drilldown handlers to monitor.vue** — On area chart click: navigate to `/enterprise/logs?time=xxx&from=monitor`. On doughnut click: navigate to `/enterprise/logs?model=xxx&from=monitor`. On bar click: navigate to `/enterprise/logs?member=xxx&from=monitor`.

- [ ] **Step 2: Add query param auto-filter to enterprise/logs.vue** — On mount, read `route.query.model`, `route.query.member`, `route.query.time` and auto-apply to filter state.

- [ ] **Step 3: Add query param auto-filter to console/logs/index.vue** — Same pattern.

- [ ] **Step 4: Add model name links in log tables** — Make model name in each log row a clickable NuxtLink to `/marketplace/[modelId]`.

- [ ] **Step 5: Add drilldown to console/stats** — Chart clicks navigate to `/console/logs?model=xxx&from=stats`.

- [ ] **Step 6: Add click handler on console dashboard model ranking** — Click model name navigates to `/marketplace/[modelId]`.

- [ ] **Step 7: Verify and commit**

```bash
git add app/pages/enterprise/monitor.vue app/pages/enterprise/logs.vue app/pages/console/logs/ app/pages/console/stats/ app/pages/console/index.vue
git commit -m "feat: cross-page drill-down linking for monitor→logs→detail flow"
```

---

### Task 12: Add global QuickCreateKey FAB + favorites system

**Files:**
- Create: `app/components/QuickCreateKey.vue`
- Create: `app/composables/useFavorites.ts`
- Modify: `app/pages/console/index.vue` (add "我的收藏" section)
- Modify: `app/app.vue` (mount QuickCreateKey for console/enterprise routes)

**Interfaces:**
- Produces: `QuickCreateKey` component (FAB + dialog), `useFavorites()` composable (add/remove/check/list)

- [ ] **Step 1: Create useFavorites composable** — localStorage-based favorites store. Functions: `toggleFavorite(id)`, `isFavorite(id)`, `getFavorites(): string[]`. Reactive state.

- [ ] **Step 2: Create QuickCreateKey.vue** — Floating action button (bottom-right, purple, key icon). On click: dialog with name input + permission select + create button. On create: show generated key + copy button. Uses UTeleport.

- [ ] **Step 3: Mount QuickCreateKey in app.vue** — Only show when route starts with `/console` or `/enterprise`.

- [ ] **Step 4: Add "我的收藏" section to console/index.vue** — Show favorited capabilities as small cards with link to detail.

- [ ] **Step 5: Wire favorite icon in CapabilityCard** — Heart icon calls `useFavorites().toggleFavorite(id)`, filled when favorited.

- [ ] **Step 6: Verify and commit**

```bash
git add app/components/QuickCreateKey.vue app/composables/useFavorites.ts app/pages/console/index.vue app/app.vue app/components/CapabilityCard.vue
git commit -m "feat: global QuickCreateKey FAB + favorites system with localStorage"
```

---

### Task 13: Create IconPicker component

**Files:**
- Create: `app/components/admin/IconPicker.vue`

**Interfaces:**
- Produces: `IconPicker` component with props `{ modelValue: string }` and emit `update:modelValue`, showing lucide icon grid with search

- [ ] **Step 1: Create IconPicker.vue** — Grid of ~80 common lucide icons organized by category (安全: shield-check/shield-alert/lock/scan-eye, 通用: brain/cpu/zap/globe, 操作: key/plus/arrow-right/copy, 数据: bar-chart-3/activity/trending-up/gauge). Search input filters by name. Click selects and emits icon name like `i-lucide-shield-check`. Selected icon highlighted with primary border.

- [ ] **Step 2: Verify and commit**

```bash
git add app/components/admin/IconPicker.vue
git commit -m "feat: add IconPicker component for template configuration"
```

---

### Task 14: Rebuild Admin template editors with three-column layout

**Files:**
- Modify: `app/pages/admin/models/[id]/template.vue` (three-column layout with module list + preview + props editor)
- Modify: `app/pages/admin/apps/[id]/template.vue` (same)
- Modify: `app/pages/admin/activities/[id]/template.vue` (same + activity-specific fields)
- Create: `app/components/admin/ModuleEditor.vue` (dynamic props form based on module type)
- Create: `app/components/admin/TemplatePreview.vue` (renders template modules in preview mode)

**Interfaces:**
- Consumes: `PageTemplate`, `TemplateModule`, `ModuleType` from mock.ts, all 13 Module* components, `IconPicker`
- Produces: Three-column template editors with drag-sort module list, live preview, and type-specific property editors

- [ ] **Step 1: Create TemplatePreview.vue** — Renders a template's modules using the same Module* components but in a preview container with highlight border on the selected module.

- [ ] **Step 2: Create ModuleEditor.vue** — Dynamic form that switches based on `module.type`. Each type shows its specific config fields (text inputs, icon pickers, image uploads, toggle switches, list editors). Uses `v-model` to update module.props reactively.

- [ ] **Step 3: Rewrite models/[id]/template.vue** — Three-column layout: left=module list (drag-sort via CSS, toggle visibility, click to select), center=TemplatePreview, right=ModuleEditor. Save button persists to localStorage (mock). Add module button with type selector dropdown.

- [ ] **Step 4: Rewrite apps/[id]/template.vue** — Same structure, with app-type-specific default modules.

- [ ] **Step 5: Rewrite activities/[id]/template.vue** — Same structure plus activity-specific fields: related capability selector (checkboxes from models+apps), discount plan config (plan selector + discount price), countdown toggle, visual config (gradient presets + custom color + decoration mode).

- [ ] **Step 6: Verify and commit**

```bash
git add app/pages/admin/ app/components/admin/ModuleEditor.vue app/components/admin/TemplatePreview.vue
git commit -m "feat: three-column template editor with live preview and module configuration"
```

---

### Task 15: Final integration verification + cleanup

**Files:**
- All modified files (verification pass)

- [ ] **Step 1: Run full build**

```bash
npx nuxi build 2>&1 | tail -10
```

Expected: Build complete with no errors

- [ ] **Step 2: Verify all key pages load in browser** — Check: `/`, `/marketplace`, `/marketplace/model-1`, `/console`, `/console/packs`, `/console/stats`, `/console/logs`, `/enterprise`, `/enterprise/monitor`, `/enterprise/logs`, `/enterprise/packs`, `/enterprise/billing`, `/promotions`, `/admin/models/model-1/template`, `/admin/apps/app-1/template`

- [ ] **Step 3: Verify drill-down links work** — Click monitor chart → lands on logs with filter. Click log model name → lands on detail page.

- [ ] **Step 4: Verify template rendering** — Model detail page shows banner+intro+features+scenarios+pricing+integration+related modules. App detail page shows type-appropriate modules.

- [ ] **Step 5: Verify three-tab plans** — Console packs page shows 充能包/模型套餐/应用套餐 tabs with correct data.

- [ ] **Step 6: Verify ECharts** — All chart pages render ECharts instead of CSS divs. Charts are interactive (hover tooltips, click drill-down).

- [ ] **Step 7: Commit final state**

```bash
git add -A
git commit -m "feat: complete platform upgrade - templates, plans, echarts, drill-down, visual upgrades"
```
