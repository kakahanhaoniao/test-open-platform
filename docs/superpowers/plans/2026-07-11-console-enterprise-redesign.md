# 统一控制台与企业化重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/dev` 升级为 `/console` 统一用户控制台，新增企业空间、使用看板、账单中心、个人设置，修复视觉风格，闭环个人+企业双场景。

**Architecture:** 在现有方案B基础上，迁移 `/dev/*` 页面到 `/console/*`，创建浅色ConsoleSidebar替代深色DevSidebar，新增企业相关mock数据和6个新页面。所有页面使用frontend-design skill实现高质量UI。

**Tech Stack:** Nuxt 4, Vue 3, @nuxt/ui, Tailwind CSS 4, Iconify (lucide)

## Global Constraints

- 品牌色：primary-600 (#7C3AED) 科技紫
- Console侧边栏：浅色主题（白底+紫色选中态），Admin侧边栏保持深色(#0C0A1A)
- 内容区背景：`bg-[#FAFAFA]`
- 企业统一结算：成员消费走企业账户，无个人账单
- 所有页面使用 `useHead` 设置中文标题
- 使用 `frontend-design` skill 实现每个页面UI
- Mock数据从 `~/data/mock` 导入

---

### Task 1: 扩展Mock数据 - 企业类型与模拟数据

**Files:**
- Modify: `app/data/mock.ts`

**Interfaces:**
- Produces: `Organization`, `Member`, `BillingRecord` 类型, `organization`, `members`, `billingRecords`, `currentUser` 数据, `getOrganization()`, `getBillingRecords()` 函数

- [ ] **Step 1: 在mock.ts末尾、helper函数之前，添加新类型定义**

在 `export const appTypes = [...]` 之后、`export function getModelById` 之前添加：

```typescript
export interface Organization {
  id: string
  name: string
  industry: string
  scale: string
  verified: boolean
  createdAt: string
  memberCount: number
  activeKeyCount: number
  monthlyCost: number
  packBalance: number
  packTotal: number
}

export interface Member {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'developer' | 'finance' | 'readonly'
  roleLabel: string
  keyCount: number
  monthlyTokens: number
  monthlyCost: number
  status: 'active' | 'pending' | 'disabled'
  joinedAt: string
}

export interface BillingRecord {
  id: string
  month: string
  amount: number
  tokens: number
  status: 'paid' | 'pending'
  items: { name: string; amount: number; tokens: number }[]
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  avatar: string
  isEnterprise: boolean
  organizationId: string | null
  role: 'admin' | 'developer' | 'finance' | 'readonly' | null
}
```

- [ ] **Step 2: 添加模拟数据**

在类型定义之后、`getModelById` 之前添加：

```typescript
export const currentUser: CurrentUser = {
  id: 'user-zhangming',
  name: '张明',
  email: 'zhangming@qianxin.com',
  avatar: '',
  isEnterprise: true,
  organizationId: 'org-qianxin-security',
  role: 'admin'
}

export const organization: Organization = {
  id: 'org-qianxin-security',
  name: '奇安信安全团队',
  industry: '网络安全',
  scale: '200-500人',
  verified: true,
  createdAt: '2025-08-15',
  memberCount: 6,
  activeKeyCount: 12,
  monthlyCost: 12860,
  packBalance: 18500000,
  packTotal: 50000000
}

export const members: Member[] = [
  { id: 'm1', name: '张明', email: 'zhangming@qianxin.com', avatar: '', role: 'admin', roleLabel: '管理员', keyCount: 3, monthlyTokens: 5200000, monthlyCost: 4780, status: 'active', joinedAt: '2025-08-15' },
  { id: 'm2', name: '李芳', email: 'lifang@qianxin.com', avatar: '', role: 'developer', roleLabel: '开发者', keyCount: 2, monthlyTokens: 3800000, monthlyCost: 3240, status: 'active', joinedAt: '2025-09-01' },
  { id: 'm3', name: '王磊', email: 'wanglei@qianxin.com', avatar: '', role: 'developer', roleLabel: '开发者', keyCount: 2, monthlyTokens: 2900000, monthlyCost: 2580, status: 'active', joinedAt: '2025-10-12' },
  { id: 'm4', name: '陈静', email: 'chenjing@qianxin.com', avatar: '', role: 'finance', roleLabel: '财务', keyCount: 0, monthlyTokens: 0, monthlyCost: 0, status: 'active', joinedAt: '2025-11-03' },
  { id: 'm5', name: '赵伟', email: 'zhaowei@qianxin.com', avatar: '', role: 'readonly', roleLabel: '只读', keyCount: 1, monthlyTokens: 420000, monthlyCost: 380, status: 'active', joinedAt: '2026-01-20' },
  { id: 'm6', name: '孙丽', email: 'sunli@qianxin.com', avatar: '', role: 'developer', roleLabel: '开发者', keyCount: 1, monthlyTokens: 1680000, monthlyCost: 1880, status: 'pending', joinedAt: '2026-07-05' }
]

export const billingRecords: BillingRecord[] = [
  { id: 'bill-202607', month: '2026年7月', amount: 12860, tokens: 18500000, status: 'pending', items: [{ name: '安全大模型', amount: 5780, tokens: 8200000 }, { name: '威胁检测模型', amount: 3240, tokens: 4800000 }, { name: '代码安全扫描', amount: 2580, tokens: 3500000 }, { name: '其他模型', amount: 1260, tokens: 2000000 }] },
  { id: 'bill-202606', month: '2026年6月', amount: 11240, tokens: 16200000, status: 'paid', items: [{ name: '安全大模型', amount: 5120, tokens: 7200000 }, { name: '威胁检测模型', amount: 2860, tokens: 4200000 }, { name: '漏洞分析专家', amount: 1980, tokens: 2800000 }, { name: '其他模型', amount: 1280, tokens: 2000000 }] },
  { id: 'bill-202605', month: '2026年5月', amount: 9860, tokens: 14200000, status: 'paid', items: [{ name: '安全大模型', amount: 4560, tokens: 6400000 }, { name: '威胁检测模型', amount: 2480, tokens: 3600000 }, { name: '代码安全扫描', amount: 1860, tokens: 2600000 }, { name: '其他模型', amount: 960, tokens: 1600000 }] },
  { id: 'bill-202604', month: '2026年4月', amount: 8520, tokens: 12300000, status: 'paid', items: [{ name: '安全大模型', amount: 3980, tokens: 5600000 }, { name: '威胁检测模型', amount: 2240, tokens: 3200000 }, { name: '其他模型', amount: 2300, tokens: 3500000 }] },
  { id: 'bill-202603', month: '2026年3月', amount: 7680, tokens: 11000000, status: 'paid', items: [{ name: '安全大模型', amount: 3560, tokens: 5000000 }, { name: '威胁检测模型', amount: 2120, tokens: 3000000 }, { name: '其他模型', amount: 2000, tokens: 3000000 }] },
  { id: 'bill-202602', month: '2026年2月', amount: 6240, tokens: 9000000, status: 'paid', items: [{ name: '安全大模型', amount: 2980, tokens: 4200000 }, { name: '其他模型', amount: 3260, tokens: 4800000 }] }
]
```

- [ ] **Step 3: 添加helper函数**

在文件末尾添加：

```typescript
export function getOrganization(): Organization | undefined {
  return organization
}

export function getMembers(): Member[] {
  return members
}
```

- [ ] **Step 4: 验证dev server正常**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/`
Expected: 200

---

### Task 2: 创建ConsoleSidebar浅色侧边栏

**Files:**
- Create: `app/components/console/ConsoleSidebar.vue`

**Interfaces:**
- Consumes: `currentUser`, `organization` from `~/data/mock`
- Produces: ConsoleSidebar组件，所有 `/console/*` 页面使用

- [ ] **Step 1: 创建ConsoleSidebar组件**

```vue
<script setup lang="ts">
import { currentUser, organization } from '~/data/mock'

const route = useRoute()

const coreNav = [
  { label: '使用看板', icon: 'i-lucide-layout-dashboard', to: '/console' },
  { label: 'API Key', icon: 'i-lucide-key', to: '/console/keys' },
  { label: '调用统计', icon: 'i-lucide-bar-chart-3', to: '/console/stats' },
  { label: '充能包', icon: 'i-lucide-coins', to: '/console/packs' }
]

const accountNav = computed(() => {
  const items = [
    { label: '账单中心', icon: 'i-lucide-receipt', to: '/console/billing' }
  ]
  if (currentUser.isEnterprise) {
    items.push({ label: '企业空间', icon: 'i-lucide-building-2', to: '/console/workspace' })
  }
  items.push({ label: '个人设置', icon: 'i-lucide-settings', to: '/console/settings' })
  return items
})

const devNav = [
  { label: 'API文档', icon: 'i-lucide-book-open', to: '/console/docs' },
  { label: '应用集成', icon: 'i-lucide-puzzle', to: '/console/integrations' }
]

function isActive(to: string) {
  if (to === '/console') return route.path === '/console'
  return route.path.startsWith(to)
}

const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

function onDocumentClick(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <aside class="fixed left-0 top-0 h-full z-[60] flex flex-col w-60 bg-white border-r border-gray-100">
    <!-- Back to market -->
    <div class="px-3 pt-4 pb-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-sm"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        <span>返回市场</span>
      </NuxtLink>
    </div>

    <!-- Logo -->
    <div class="flex items-center h-14 px-4 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-terminal" class="text-white w-5 h-5" />
        </div>
        <div class="overflow-hidden">
          <p class="text-gray-900 font-bold text-sm whitespace-nowrap">奇安信AI</p>
          <p class="text-primary-500 text-[10px] whitespace-nowrap">用户控制台</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <!-- Core -->
      <div class="px-4 mb-2">
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">核心功能</p>
      </div>
      <div class="px-2 space-y-0.5 mb-6">
        <NuxtLink
          v-for="item in coreNav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative"
          :class="isActive(item.to)
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          <div
            v-if="isActive(item.to)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-600 rounded-r-full"
          />
          <UIcon :name="item.icon" class="w-[18px] h-[18px] shrink-0" />
          <span class="text-sm whitespace-nowrap">{{ item.label }}</span>
        </NuxtLink>
      </div>

      <!-- Account -->
      <div class="px-4 mb-2">
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">账户管理</p>
      </div>
      <div class="px-2 space-y-0.5 mb-6">
        <NuxtLink
          v-for="item in accountNav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative"
          :class="isActive(item.to)
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          <div
            v-if="isActive(item.to)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-600 rounded-r-full"
          />
          <UIcon :name="item.icon" class="w-[18px] h-[18px] shrink-0" />
          <span class="text-sm whitespace-nowrap">{{ item.label }}</span>
        </NuxtLink>
      </div>

      <!-- Dev Resources -->
      <div class="px-4 mb-2">
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">开发资源</p>
      </div>
      <div class="px-2 space-y-0.5">
        <NuxtLink
          v-for="item in devNav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative"
          :class="isActive(item.to)
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          <div
            v-if="isActive(item.to)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-600 rounded-r-full"
          />
          <UIcon :name="item.icon" class="w-[18px] h-[18px] shrink-0" />
          <span class="text-sm whitespace-nowrap">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- User area -->
    <div class="p-3 border-t border-gray-100">
      <div ref="userMenuRef" class="relative">
        <button
          class="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          @click="userMenuOpen = !userMenuOpen"
        >
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-primary-600" />
          </div>
          <div class="flex-1 text-left overflow-hidden">
            <p class="text-gray-900 text-sm truncate">{{ currentUser.name }}</p>
            <p v-if="currentUser.isEnterprise" class="text-primary-500 text-[10px] truncate">{{ organization?.name }}</p>
            <p v-else class="text-gray-400 text-[10px] truncate">个人用户</p>
          </div>
          <UIcon name="i-lucide-chevron-up-down" class="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="userMenuOpen"
            class="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 py-1.5 z-50"
          >
            <NuxtLink
              to="/console/settings"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="userMenuOpen = false"
            >
              <UIcon name="i-lucide-settings" class="w-4 h-4 text-gray-400" />
              个人设置
            </NuxtLink>
            <NuxtLink
              to="/admin"
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="userMenuOpen = false"
            >
              <UIcon name="i-lucide-settings" class="w-4 h-4 text-gray-400" />
              运营后台
            </NuxtLink>
            <div class="border-t border-gray-50 mt-1 pt-1">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                @click="userMenuOpen = false"
              >
                <UIcon name="i-lucide-log-out" class="w-4 h-4" />
                退出登录
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>
```

- [ ] **Step 2: 验证组件无语法错误**

Run: `npx vue-tsc --noEmit --pretty 2>&1 | head -20` 或直接在浏览器检查

---

### Task 3: 迁移dev页面到console + 更新路由检测

**Files:**
- Move: `app/pages/dev/index.vue` → `app/pages/console/index.vue` (新建，内容重写为使用看板)
- Move: `app/pages/dev/keys/index.vue` → `app/pages/console/keys/index.vue`
- Move: `app/pages/dev/keys/create.vue` → `app/pages/console/keys/create.vue`
- Move: `app/pages/dev/stats/index.vue` → `app/pages/console/stats/index.vue`
- Move: `app/pages/dev/packs/index.vue` → `app/pages/console/packs/index.vue`
- Move: `app/pages/dev/docs/index.vue` → `app/pages/console/docs/index.vue`
- Move: `app/pages/dev/integrations/index.vue` → `app/pages/console/integrations/index.vue`
- Modify: `app/app.vue` — 更新路由检测

- [ ] **Step 1: 复制dev页面到console目录**

Run:
```bash
mkdir -p app/pages/console/keys
cp app/pages/dev/keys/index.vue app/pages/console/keys/index.vue
cp app/pages/dev/keys/create.vue app/pages/console/keys/create.vue
mkdir -p app/pages/console/stats
cp app/pages/dev/stats/index.vue app/pages/console/stats/index.vue
mkdir -p app/pages/console/packs
cp app/pages/dev/packs/index.vue app/pages/console/packs/index.vue
mkdir -p app/pages/console/docs
cp app/pages/dev/docs/index.vue app/pages/console/docs/index.vue
mkdir -p app/pages/console/integrations
cp app/pages/dev/integrations/index.vue app/pages/console/integrations/index.vue
```

- [ ] **Step 2: 批量替换console页面中的DevSidebar → ConsoleSidebar和引用**

在每个复制的console页面文件中：
- 将 `DevSidebar` 替换为 `ConsoleSidebar`
- 将 `import` 语句（如有）中的 `dev/DevSidebar` 替换为 `console/ConsoleSidebar`

Run:
```bash
sed -i '' 's/DevSidebar/ConsoleSidebar/g' app/pages/console/keys/index.vue app/pages/console/keys/create.vue app/pages/console/stats/index.vue app/pages/console/packs/index.vue app/pages/console/docs/index.vue app/pages/console/integrations/index.vue
```

- [ ] **Step 3: 更新app.vue路由检测**

将 `isFullWidthRoute` computed中的 `/dev` 替换为 `/console`：

```javascript
const isFullWidthRoute = computed(() => {
  const path = route.path
  return path.startsWith('/portal') ||
         path.startsWith('/admin') ||
         path.startsWith('/console') ||
         path.startsWith('/b')
})
```

同时注释说明更新：`/console/* → console handles its own layout`

- [ ] **Step 4: 创建console首页占位（使用看板，Task 4会完整实现）**

创建 `app/pages/console/index.vue` 最小占位：

```vue
<script setup lang="ts">
useHead({ title: '使用看板 - 奇安信AI开放平台' })
</script>

<template>
  <div>
    <ConsoleSidebar />
    <div class="ml-60 p-8">
      <h1 class="text-2xl font-bold text-gray-900">使用看板</h1>
      <p class="text-gray-500 mt-1">加载中...</p>
    </div>
  </div>
</template>
```

- [ ] **Step 5: 验证/console路由可访问**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/console`
Expected: 200

---

### Task 4: 使用看板页面

**Files:**
- Rewrite: `app/pages/console/index.vue`

**Interfaces:**
- Consumes: `currentUser`, `organization`, `models` from `~/data/mock`

使用 `frontend-design` skill 实现完整使用看板页面。

- [ ] **Step 1: 实现使用看板页面**

页面结构：
- 顶部：欢迎区（浅色）+ 视角切换下拉（个人/企业，仅企业用户可见）
- 4项核心指标：API调用总量、Token消耗、本月费用、充能包余额（含同比变化+进度条）
- 调用趋势：7天/30天/90天 tab切换 + CSS面积图（调用量+费用双轴）
- 双栏：左-模型消耗排行Top5（百分比条），右-异常告警（最近5条）
- 配额进度：充能包进度条（>80%橙、>95%红）、API频率限制
- 快速操作：创建API Key、购买充能包、查看文档、调用统计

每个Console页面必须包含 `<ConsoleSidebar />` 和 `<div class="ml-60 ...">` 内容包裹。

企业视角切换逻辑：`const viewMode = ref<'personal' | 'enterprise'>('personal')`，切换后统计数据显示对应维度数据。企业视角额外显示"成员消耗排行"。

- [ ] **Step 2: 验证页面渲染**

Run: 浏览器访问 `http://localhost:3000/console`，确认4项指标、图表、排行、告警均正常显示

---

### Task 5: 账单中心页面

**Files:**
- Create: `app/pages/console/billing/index.vue`

**Interfaces:**
- Consumes: `currentUser`, `organization`, `billingRecords`, `members` from `~/data/mock`

- [ ] **Step 1: 实现账单中心**

页面结构：
- 个人用户：账单概览（本月/上月/同比）+ 消费趋势月度柱状图 + 账单列表表格（月份、金额、Token、状态、下载按钮）+ 充值记录
- 企业用户：视角切换tab（企业账单/我的消耗）
  - 企业账单：总消费、成员消耗分布（横向百分比条代替饼图）、月度趋势、账单列表
  - 我的消耗：个人在企业中的消耗明细、占比

- [ ] **Step 2: 验证页面渲染**

---

### Task 6: 企业空间概览 + 成员管理

**Files:**
- Create: `app/pages/console/workspace/index.vue`
- Create: `app/pages/console/workspace/members.vue`

**Interfaces:**
- Consumes: `currentUser`, `organization`, `members` from `~/data/mock`

- [ ] **Step 1: 实现企业空间概览 `/console/workspace`**

页面结构：
- 企业信息卡片：名称、行业、规模、认证状态（绿色徽章）、创建时间
- 4项统计卡片：成员数、活跃Key数、本月消耗(¥)、充能包余额(Token)
- 快速操作：邀请成员、购买充能包、管理成员
- 成员预览：最近5个成员列表 + "查看全部"链接

- [ ] **Step 2: 实现成员管理 `/console/workspace/members`**

页面结构：
- 顶部：标题 + "邀请成员"按钮
- 邀请对话框（点击按钮展开）：邮箱输入 + 角色选择下拉 + 生成邀请链接
- 成员列表表格：头像、姓名、邮箱、角色（彩色标签）、API Key数、本月消耗、状态（active/pending/disabled徽章）、操作（修改角色/禁用/移除）
- 角色说明面板：4种角色的权限对比

- [ ] **Step 3: 验证两个页面渲染**

---

### Task 7: 企业充能包 + 企业设置

**Files:**
- Create: `app/pages/console/workspace/packs.vue`
- Create: `app/pages/console/workspace/settings.vue`

**Interfaces:**
- Consumes: `currentUser`, `organization`, `members`, `chargingPacks` from `~/data/mock`

- [ ] **Step 1: 实现企业充能包 `/console/workspace/packs`**

页面结构：
- 企业充能包余额卡片（deep-block风格，大号显示余额+进度条）
- 购买充能包：展示4个充能包商品卡片（复用个人充能包数据），按钮文字"企业购买"
- 成员消耗明细：按成员分组的Token消耗表格（成员名、本月Token、本月费用、占比条）

- [ ] **Step 2: 实现企业设置 `/console/workspace/settings`**（仅管理员可见，页面内检查role）

页面结构：
- 企业基本信息编辑：名称、行业、规模（只读展示+编辑按钮）
- 默认成员角色：新成员默认角色选择
- API调用限额：每人每日/每月调用量限制
- 通知设置：余额不足告警阈值（Token数量输入）
- 企业认证：认证状态、认证信息

- [ ] **Step 3: 验证两个页面渲染**

---

### Task 8: 个人设置页面

**Files:**
- Create: `app/pages/console/settings.vue`

**Interfaces:**
- Consumes: `currentUser`, `organization` from `~/data/mock`

- [ ] **Step 1: 实现个人设置**

页面结构（左右布局或单栏分区）：
- 个人信息区：头像（占位圆+编辑图标）、姓名、邮箱、手机号 + 保存按钮
- 安全设置区：修改密码（当前密码+新密码+确认）、两步验证开关、登录设备列表（3个模拟设备）
- 通知偏好区：邮件通知开关、余额告警开关、API异常告警开关
- API偏好区：默认模型下拉、默认温度滑块
- 关联企业区（仅企业用户）：企业名称、角色、加入时间、退出企业按钮（红色）

- [ ] **Step 2: 验证页面渲染**

---

### Task 9: 更新跨系统导航链接

**Files:**
- Modify: `app/components/TopNav.vue`
- Modify: `app/components/portal/PortalNav.vue`
- Modify: `app/components/TopNav.vue` 中的用户下拉菜单

- [ ] **Step 1: 更新TopNav**

- "开发者控制台"按钮文字改为"用户控制台"，链接从 `/dev` 改为 `/console`
- 用户下拉菜单中"开发者控制台"改为"用户控制台"，链接改为 `/console`

- [ ] **Step 2: 更新PortalNav**

在右侧按钮区增加"进入控制台"按钮：

在"登录"按钮之前添加：
```vue
<UButton
  label="进入控制台"
  icon="i-lucide-layout-dashboard"
  variant="ghost"
  color="primary"
  size="sm"
  to="/console"
/>
```

- [ ] **Step 3: 验证跨系统导航**

浏览器验证：
1. Market首页 → 用户下拉 → "用户控制台" → 到达 `/console`
2. Portal首页 → "进入控制台" → 到达 `/console`
3. Console侧边栏 → "返回市场" → 到达 `/`

---

### Task 10: 最终验证与清理

**Files:**
- Review all console pages

- [ ] **Step 1: 浏览器全页面验证**

逐一访问验证：
- `/console` — 使用看板
- `/console/keys` — API Key
- `/console/keys/create` — 创建Key
- `/console/stats` — 调用统计
- `/console/packs` — 充能包
- `/console/billing` — 账单中心
- `/console/workspace` — 企业空间
- `/console/workspace/members` — 成员管理
- `/console/workspace/packs` — 企业充能包
- `/console/workspace/settings` — 企业设置
- `/console/settings` — 个人设置
- `/console/docs` — API文档
- `/console/integrations` — 应用集成

- [ ] **Step 2: 检查侧边栏浅色主题**

所有console页面侧边栏应为白色背景+紫色选中态，与Admin深色侧边栏形成区分。

- [ ] **Step 3: 检查企业/个人差异**

- 验证 `currentUser.isEnterprise = true` 时侧边栏显示"企业空间"
- 验证企业视角切换在看板和账单页正常工作
- 临时将 `isEnterprise` 改为 `false` 验证"企业空间"消失

---

## Self-Review

**1. Spec coverage:**
- ✅ 用户模型（个人+企业+成员）→ Task 1 (mock数据) + Task 2 (sidebar条件显示) + Task 4 (视角切换)
- ✅ 使用看板 → Task 4
- ✅ 账单中心 → Task 5
- ✅ 企业空间概览 → Task 6
- ✅ 成员管理 → Task 6
- ✅ 企业充能包 → Task 7
- ✅ 企业设置 → Task 7
- ✅ 个人设置 → Task 8
- ✅ 视觉风格（浅色侧边栏）→ Task 2
- ✅ 跨系统导航 → Task 9
- ✅ /dev → /console迁移 → Task 3

**2. Placeholder scan:** 无TBD/TODO。所有步骤有具体代码或操作。

**3. Type consistency:** `Organization`, `Member`, `BillingRecord`, `CurrentUser` 在Task 1定义，后续Task引用一致。`ConsoleSidebar` 在Task 2创建，后续所有console页面引用一致。
