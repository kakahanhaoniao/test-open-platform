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

## 模拟数据

所有数据位于 `app/data/mock.ts`，包含:
- 10个AI模型 + 8个AI应用
- 6个优惠活动
- 5个充能包 + 2个模型套餐 + 2个应用套餐
- 8个企业客户 + 12条订单 + 50条调用日志
- 默认页面模板(模型/应用/活动各一套)

接入真实后端时，替换 mock.ts 中的数据源即可。
