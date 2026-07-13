# 奇安信 AI 开放平台

基于 Vue 3 + Nuxt 4 的 AI 安全能力开放平台前端项目，面向开发者和企业客户，提供模型能力、AI应用、优惠活动的一站式服务。

## 技术栈

- **框架**: Nuxt 4 + Vue 3
- **UI组件**: @nuxt/ui (基于 Reka UI / Radix Vue)
- **样式**: Tailwind CSS 4
- **图标**: Iconify (lucide)
- **图表**: ECharts 6 + vue-echarts
- **Markdown**: markdown-it
- **包管理**: pnpm

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式 (默认 localhost:3000)
pnpm dev

# 生产构建
pnpm build

# 预览生产构建
pnpm preview

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

## 项目结构

```
app/
├── components/
│   ├── admin/           # 运营后台专用组件
│   │   ├── AdminSidebar.vue       # 后台侧边栏
│   │   ├── IconPicker.vue         # 图标选择器
│   │   ├── ModuleEditor.vue       # 模块属性编辑器
│   │   └── TemplatePreview.vue    # 模板实时预览
│   ├── charts/          # ECharts图表组件
│   │   └── BaseChart.vue          # 通用图表基类(含主题/加载/空态/下钻)
│   ├── modules/         # 详情页模板模块组件(13种)
│   │   ├── ModuleBanner.vue       # 横幅
│   │   ├── ModuleHero.vue         # 英雄区
│   │   ├── ModuleIntro.vue        # 产品介绍
│   │   ├── ModuleFeatures.vue     # 核心特性
│   │   ├── ModuleAdvantages.vue   # 优势对比
│   │   ├── ModuleScenarios.vue    # 使用场景
│   │   ├── ModuleTabs.vue         # 标签页(可嵌套子模块)
│   │   ├── ModuleCarousel.vue     # 轮播图
│   │   ├── ModuleCards.vue        # 卡片组
│   │   ├── ModuleSteps.vue        # 步骤流程
│   │   ├── ModulePricing.vue      # 定价方案
│   │   ├── ModuleIntegration.vue  # 接入指南
│   │   ├── ModuleRelated.vue      # 相关推荐
│   │   └── ModuleRenderer.vue     # 模块分发器(动态渲染)
│   ├── CapabilitySidebar.vue      # 能力详情侧边栏
│   ├── PlanCard.vue               # 套餐卡片(充能包/模型套餐/应用套餐)
│   ├── PostPurchaseDialog.vue     # 购买后引导弹窗
│   └── QuickCreateKey.vue         # 全局FAB: 快速创建API Key
├── composables/
│   ├── useChartTheme.ts           # ECharts主题配置
│   ├── useFavorites.ts            # 收藏功能(localStorage)
│   └── useQuickCreateKey.ts       # 快速创建Key状态
├── data/
│   └── mock.ts                    # 全部模拟数据
├── pages/
│   ├── index.vue                  # 首页
│   ├── marketplace/
│   │   ├── index.vue              # 能力市场列表
│   │   └── [id].vue               # 能力详情(模型/应用通用)
│   ├── promotions/
│   │   ├── index.vue              # 优惠活动列表
│   │   └── [id].vue               # 活动详情
│   ├── console/                   # 用户控制台
│   │   ├── index.vue              # 使用看板
│   │   ├── keys/                  # API Key管理
│   │   ├── logs/                  # 调用日志
│   │   ├── stats/                 # 调用统计(ECharts)
│   │   ├── packs/                 # 充能包购买(三Tab)
│   │   ├── billing/               # 账单中心
│   │   ├── docs/                  # API文档
│   │   └── integrations/          # 应用集成
│   ├── enterprise/                # 企业空间
│   │   ├── index.vue              # 企业概览
│   │   ├── billing.vue            # 企业账单
│   │   ├── monitor.vue            # 调用监控(ECharts)
│   │   ├── logs.vue               # 调用日志
│   │   ├── members.vue            # 成员管理
│   │   ├── packs.vue              # 充能包管理
│   │   └── settings.vue           # 企业设置
│   └── admin/                     # 运营后台
│       ├── index.vue              # 数据看板
│       ├── models/                # 模型管理 + 模板配置
│       ├── apps/                  # 应用管理 + 模板配置
│       ├── activities/            # 活动管理 + 模板配置
│       ├── orders/                # 订单管理
│       ├── enterprises/           # 企业客户管理
│       └── templates/             # 模板配置总览
└── layouts/
    └── default.vue                # 默认布局(顶部导航栏)
```

## 页面路由

### 前台页面
| 路由 | 说明 |
|------|------|
| `/` | 首页(Hero动画+能力轮播+安全矩阵+企业区+定价Tab+快速接入) |
| `/marketplace` | 能力市场(模型+应用联合列表, 支持分类/搜索/筛选) |
| `/marketplace/:id` | 能力详情(模板化渲染, 模型/应用通用) |
| `/promotions` | 优惠活动列表(倒计时+筛选+标签) |
| `/promotions/:id` | 活动详情(关联能力+优惠套餐+FAQ) |
| `/console` | 用户控制台(看板+Key+日志+统计+充能包+账单) |
| `/enterprise` | 企业空间(概览+监控+账单+成员) |

### 后台页面
| 路由 | 说明 |
|------|------|
| `/admin` | 数据看板(统计+图表+动态+订单) |
| `/admin/models` | 模型管理(10条数据) |
| `/admin/apps` | 应用管理(8条数据) |
| `/admin/activities` | 活动管理(6条数据) |
| `/admin/orders` | 订单管理(12条数据) |
| `/admin/enterprises` | 企业客户(8条数据) |
| `/admin/templates` | 模板配置总览(24个模板) |
| `/admin/models/:id/template` | 模型模板编辑器(三栏: 列表+预览+编辑) |
| `/admin/apps/:id/template` | 应用模板编辑器 |
| `/admin/activities/:id/template` | 活动模板编辑器 |

## 核心功能

### 1. 模板化详情页
- 13种模块类型可自由组合: banner/hero/intro/features/advantages/scenarios/tabs/carousel/cards/steps/pricing/integration/related
- 每个模型/应用/活动可独立配置模板
- 后台可视化编辑器支持: 模块增删/排序/隐藏/属性编辑/实时预览

### 2. 三级套餐体系
- **充能包** (Token包): 体验包/专业包/企业包/无限包
- **模型套餐** (月付/年付): 含Token额度+响应速度+技术支持
- **应用套餐** (月付/年付): 含调用额度+功能权限

### 3. ECharts交互图表
- 统一主题(`useChartTheme`)
- 通用基类(`BaseChart`): 自动处理加载态/空态/下钻事件
- 覆盖: 调用趋势/模型消耗/调用日志/企业监控/统计报表

### 4. 跨页下钻
- URL query参数驱动: `?category=xxx`, `?type=model`, `?highlight=xxx`
- 能力市场→详情页→控制台→企业空间的完整链路

### 5. 收藏功能
- `useFavorites` composable, localStorage持久化
- 能力卡片上的收藏按钮

## 产品设计

### 用户角色

| 角色 | 核心诉求 | 对应区域 |
|------|----------|----------|
| 开发者 | 快速找到合适的AI能力、低成本接入、调试 | 首页 → 能力市场 → 详情页 → 控制台 |
| 企业采购 | 批量采购折扣、统一管理、SLA保障 | 首页企业区 → 套餐页 → 企业空间 |
| 运营人员 | 上下线管理、活动配置、数据监控 | 运营后台(模型/应用/活动/订单/模板) |

### 用户旅程

**开发者接入流程**:
1. 首页了解平台能力 → 能力市场浏览/搜索
2. 进入能力详情页 → 查看特性/场景/定价
3. 点击「在线体验」试用 → 点击「立即接入」获取引导
4. 控制台创建 API Key → 安装 SDK → 调用 API
5. 购买充能包/套餐 → 查看调用统计/日志

**企业采购流程**:
1. 首页企业区了解方案 → 点击「企业批量采购」
2. 企业空间查看用量/账单 → 管理成员/权限
3. 活动页获取优惠 → 下单购买

**运营管理流程**:
1. 后台数据看板了解全局
2. 模型/应用管理：上下线、审核
3. 模板配置：定制详情页模块和内容
4. 活动管理：创建/配置优惠活动
5. 订单管理：查看/处理订单

### 信息架构

```
奇安信 AI 开放平台
├── 门户 (Portal)
│   ├── 首页 — 平台入口，核心能力展示与转化引导
│   ├── 能力市场 — 模型+应用统一浏览与检索
│   ├── 能力详情 — 模板化内容展示，支持体验/接入/购买
│   └── 优惠活动 — 营销活动展示与转化
├── 用户控制台 (Console)
│   ├── 使用看板 — 调用量/Token/费用概览
│   ├── API Key — 密钥生命周期管理
│   ├── 调用日志 — 请求记录与异常排查
│   ├── 调用统计 — ECharts 可视化分析
│   ├── 充能包/套餐 — 三级套餐购买与管理
│   └── 账单/设置 — 费用明细与个人配置
├── 企业空间 (Enterprise)
│   ├── 企业概览 — 组织级用量与成员概览
│   ├── 调用监控 — 实时图表与告警
│   ├── 账单/日志 — 企业级费用与调用追踪
│   └── 成员/设置 — 团队管理与权限配置
└── 运营后台 (Admin)
    ├── 数据看板 — 平台级运营指标
    ├── 模型/应用管理 — 上下线与审核
    ├── 模板配置 — 详情页可视化编辑
    ├── 活动/订单管理 — 营销与交易管理
    └── 企业客户 — 认证审核与用量监控
```

## 设计原则

### 1. 安全行业的专业感

平台服务于网络安全行业，视觉语言需传递**专业、可信、严谨**的品牌调性：
- 品牌色为科技紫 (#7C3AED)，区别于互联网常见的蓝/绿，体现安全领域的技术深度
- 浅色底为主，避免过度暗黑风格，保持企业级产品的可读性
- 图标和插图使用 Lucide 线性风格，克制而不花哨
- 数据展示注重精确性：调用量精确到万位、Token 消耗实时可见、费用展示完整

### 2. 面向开发者的效率优先

开发者是核心用户，设计需减少摩擦、加速决策：
- 详情页侧边栏始终可见：体验/接入/购买三个核心操作一键可达
- 接入引导三步完成：创建 Key → 安装 SDK → 调用 API，每步可复制代码
- 快速创建 Key 的全局 FAB 按钮，任何页面都可一键创建
- 搜索和筛选联动：能力市场支持类型/分类/搜索三维过滤
- 代码片段带一键复制，减少手动输入

### 3. 模板化而非脸谱化

不同能力应有不同的展示方式，避免千篇一律：
- 13 种模块类型可自由组合，每个能力独立配置模板
- 对话型应用突出在线体验入口，工具型应用突出功能特性
- 外链型应用直接跳转，展示型应用以大屏/图表为主
- 后台编辑器实时预览，运营可直观看到配置效果

### 4. 数据驱动的决策支持

图表不只是装饰，而是帮助用户做出购买/使用决策的工具：
- ECharts 统一主题，视觉一致且交互丰富（悬停提示、下钻点击）
- BaseChart 封装加载态/空态/下钻事件，避免裸图表
- 调用趋势支持 7天/30天/90天切换，适应不同分析周期
- 图表点击可下钻到对应能力的详情页或日志页

### 5. 营销与转化的自然融合

优惠活动是重要的商业转化手段，但需融入体验而非干扰：
- 活动横幅出现在能力详情页顶部，不遮挡主内容
- 活动详情页包含关联能力、优惠套餐、FAQ，信息完整促转化
- 倒计时营造紧迫感但不过度，标签体系(HOT/NEW/限时)一目了然
- 三级套餐（充能包/模型套餐/应用套餐）Tab 切换，不堆砌

### 6. 渐进式信息披露

信息按用户需求层级呈现，避免一屏过载：
- 列表页展示名称/类型/评分/调用量，足够做初步筛选
- 详情页通过模板模块逐步展开：Banner吸引 → 特性说明 → 场景代入 → 定价决策 → 接入行动
- 侧边栏固定核心操作和定价信息，滚动时不丢失关键入口
- FAQ 折叠展示，按需展开

### 7. 跨页面一致性

四个区域（门户/控制台/企业空间/后台）共享设计语言：
- 统一色彩体系：primary-600 为主操作色，gray 系为内容色
- 统一间距系统：页面内间距 px-6 py-8，卡片内间距 p-6/p-8
- 统一圆角：卡片 rounded-xl，按钮 rounded-lg，标签 rounded-full
- 统一导航模式：前台顶部导航 + 侧边区域切换（控制台/企业/后台）

## 组件设计规范

### 色彩

| 用途 | Token | 值 |
|------|-------|-----|
| 品牌主色 | primary-600 | #7C3AED |
| 品牌浅色 | primary-50 | 10% 透明度背景 |
| 危险/折扣 | red-600 | 优惠价、HOT标签 |
| 成功/在线 | green-600 | 上线状态、服务正常 |
| 警告/审核 | amber-600 | 审核中、待处理 |
| 中性/下线 | gray-500 | 下线状态、次要信息 |

### 间距模块系统

每个模块组件接受 `spacing` 和 `background` 配置：

```ts
spacing: { top: 'md' | 'sm' | 'xs' | 'lg', bottom: 'md' | ... }
background: 'white' | 'gray' | 'primary-light'
```

映射关系：
- `xs` → `py-2`, `sm` → `py-4`, `md` → `py-8`, `lg` → `py-12`

### 动态组件渲染

模块通过 `ModuleRenderer` 动态渲染。**重要**：由于 Nuxt 自动导入的组件无法通过字符串名在 `<component :is="">` 中解析，`ModuleRenderer` 和 `TemplatePreview` 使用显式 import + 组件对象引用：

```vue
// ✅ 正确：显式 import
import ModuleBanner from './ModuleBanner.vue'
const componentMap = { banner: ModuleBanner }
<component :is="componentMap[module.type]" />

// ❌ 错误：字符串名无法解析
const componentMap = { banner: 'ModulesModuleBanner' }
<component :is="componentMap[module.type]" />
```

### SSR 兼容

`v-html`（markdown-it 渲染）和 Canvas 元素需包裹 `<ClientOnly>` 避免 hydration mismatch：

```vue
<ClientOnly>
  <div v-html="md.render(content)" />
</ClientOnly>
```

## 模拟数据

所有数据位于 `app/data/mock.ts`，包含:
- 10个AI模型 + 8个AI应用
- 6个优惠活动
- 5个充能包 + 2个模型套餐 + 2个应用套餐
- 8个企业客户 + 12条订单 + 50条调用日志
- 默认页面模板(模型/应用/活动各一套)

接入真实后端时，替换 mock.ts 中的数据源即可。
