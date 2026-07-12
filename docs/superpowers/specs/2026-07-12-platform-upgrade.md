# 奇安信AI开放平台 - 产品闭环全面升级设计

## 背景

当前平台存在6大产品缺陷：

1. **应用详情页模板单一**：所有应用详情用同一个硬编码Tab布局，无法展示产品Banner、使用场景、优势对比等差异化内容
2. **套餐体系不完整**：只有充能包（Token额度），缺少模型套餐和应用套餐，企业客户无法按需订阅
3. **数据可视化原始**：全部用纯CSS柱图，无法做实时流、折线趋势、交互钻取
4. **页面间零联动**：监控→日志→详情无下钻链路，活动→能力→购买无衔接，用户需手动跳转再搜索
5. **市场/首页/活动页视觉平庸**：能力市场无层次感、首页各section节奏平、活动页无详情页且CTA全跳充能包
6. **Admin模板配置简陋**：只有基础信息编辑，无模块化配置、无图标选择器、无图片上传

---

## 一、模块化模板系统

### 1.1 核心思路

应用详情页不再用统一的 `CapabilityDetail.vue` 硬编码布局，由Admin配置"模块列表"，前端根据配置动态渲染对应组件。

### 1.2 模块类型清单

| 模块类型 | 组件名 | 说明 | Admin配置项 |
|---------|--------|------|-----------|
| `banner` | `ModuleBanner` | 带渐变/图片的大图横幅 | 背景图上传、标题、副标题、徽章文字、CTA按钮(文字+链接+样式)、渐变色选择 |
| `hero` | `ModuleHero` | 居中标题+描述+按钮区 | 标题、描述(MD渲染)、按钮组配置(文字+链接+样式)、背景风格(light/dark/gradient) |
| `intro` | `ModuleIntro` | 产品介绍 | 标题、正文(MD渲染)、布局(左文右图/右文左图/居中)、配图上传 |
| `features` | `ModuleFeatures` | 特性展示 | 标题、布局(网格/列表)、特性列表(图标+标题+描述) |
| `advantages` | `ModuleAdvantages` | 优势对比 | 标题、对比项列表(我方优势+传统方式) |
| `scenarios` | `ModuleScenarios` | 使用场景 | 标题、布局(卡片/轮播)、场景列表(图标+标题+描述+配图) |
| `tabs` | `ModuleTabs` | Tab切换区 | 标题、Tab列表(名称+嵌套子模块) |
| `carousel` | `ModuleCarousel` | 轮播图 | 标题、自动播放开关、轮播项列表(图片上传+标题+描述+链接) |
| `cards` | `ModuleCards` | 卡片网格 | 标题、列数(2/3/4)、卡片列表(图片+标题+描述+链接) |
| `steps` | `ModuleSteps` | 步骤指引 | 标题、方向(横向/纵向)、步骤列表(图标+标题+描述) |
| `pricing` | `ModulePricing` | 定价信息 | 覆盖默认定价(开关)，默认自动从模型pricing字段读取展示；开启覆盖后可自定义套餐列表 |
| `integration` | `ModuleIntegration` | 接入指南 | 覆盖默认接入(开关)，默认自动从模型apiEndpoint生成3步接入指引；开启覆盖后可自定义步骤 |
| `related` | `ModuleRelated` | 关联能力 | 手动指定ID列表(开关)、最大显示数量 |

**通用配置**：每个模块都有标题、可见性开关、上下边距选择(xs/sm/md/lg)、背景色(白色/灰色/主题浅色)。

### 1.3 数据结构

```typescript
interface PageTemplate {
  id: string
  targetType: 'model' | 'app'
  targetId: string
  theme: {
    primaryColor?: string
    bgStyle?: 'light' | 'dark' | 'gradient'
  }
  modules: TemplateModule[]
}

interface TemplateModule {
  id: string
  type: ModuleType
  title?: string
  props: Record<string, any>   // 各类型专用配置
  visible: boolean
  order: number
  spacing: { top: 'xs'|'sm'|'md'|'lg'; bottom: 'xs'|'sm'|'md'|'lg' }
  background: 'white' | 'gray' | 'primary-light'
  children?: TemplateModule[]  // tabs嵌套用
}

type ModuleType = 'banner' | 'hero' | 'intro' | 'features' | 'advantages' |
  'scenarios' | 'tabs' | 'carousel' | 'cards' | 'steps' |
  'pricing' | 'integration' | 'related'
```

### 1.4 默认模板

**模型默认模板**：Banner → 产品介绍 → 特性展示 → 使用场景 → 定价 → 接入指南 → 相关能力

**应用默认模板**（按类型）：
- Chat型：Banner → 产品介绍 → 对话体验 → 接入指南 → 定价
- Tool型：Banner → 产品介绍 → 使用步骤 → 输入输出说明 → 定价 → 接入
- Showcase型：Banner → 产品演示(轮播图) → 优势展示 → 客户案例(卡片) → 接入
- External-link型：Banner → 产品介绍 → 功能亮点(卡片) → 跳转按钮

### 1.5 详情页布局

```
┌─────────────────────────────────────────────────┐
│  面包屑导航                                       │
├──────────────────────────┬──────────────────────┤
│                          │  固定信息栏(sticky)   │
│  模块化内容区             │  - 能力名称/图标/评分  │
│  (根据模板配置渲染)       │  - 3按钮(体验/接入/购买)│
│                          │  - 定价摘要            │
│                          │  - 标签               │
│                          │  - 企业批量购买(条件)  │
├──────────────────────────┴──────────────────────┤
│  相关能力                                         │
└─────────────────────────────────────────────────┘
```

右侧固定信息栏随页面滚动sticky，3按钮触发弹窗逻辑保持不变。

---

## 二、三层套餐体系

### 2.1 套餐类型

| 类型 | 说明 | 计费方式 | 示例 |
|------|------|---------|------|
| 充能包 | Token额度，所有模型/应用通用 | 一次性购买 | 体验包¥99/100万Token, 专业包¥399/500万Token |
| 模型套餐 | 指定模型的月度/年度订阅 | 月付/年付 | 安全大模型专业版¥999/月(含200万Token+优先响应) |
| 应用套餐 | 指定应用的月度/年度订阅 | 月付/年付 | 威胁检测助手¥299/月(含5000次调用+7天数据留存) |

### 2.2 数据结构

```typescript
interface Plan {
  id: string
  type: 'pack' | 'model-plan' | 'app-plan'
  targetId?: string           // model-plan/app-plan关联的模型/应用ID
  name: string
  description: string
  billingCycle: 'one-time' | 'monthly' | 'annual'
  price: number
  originalPrice?: number
  includedTokens?: number     // 充能包/模型套餐的Token额度
  includedCalls?: number      // 应用套餐的调用次数
  features: string[]
  popular: boolean
  icon: string
  gradient?: string           // 卡片渐变背景色
  badge?: string              // 角标文字如"限时8折"
}
```

### 2.3 购买入口

| 入口 | 展示内容 |
|------|---------|
| 能力详情页右侧"购买套餐"按钮 | 该能力的模型套餐/应用套餐 + 通用充能包 |
| `/console/packs` 页面 | 三Tab切换：充能包 / 模型套餐 / 应用套餐 |
| `/enterprise/packs` 页面 | 企业版三Tab，增加批量购买/成员分配 |
| Portal首页定价区 | 三类套餐精选，Tab切换展示 |
| 活动详情页 | 活动关联套餐 + 折扣价 |

### 2.4 联动行为

- 购买模型套餐成功 → 自动弹出接入引导（创建Key + SDK代码）
- 购买应用套餐成功 → 自动弹出接入步骤（Webhook/SDK/iframe配置）
- 购买充能包成功 → 显示余额 + 推荐下一步（接入模型/查看用量）
- 套餐到期前7天/3天/1天 → 告警通知

### 2.5 Mock数据

```typescript
// 模型套餐
const modelPlans: Plan[] = [
  { id: 'mp-security-pro', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型专业版', description: '包含200万Token/月，优先响应速度', billingCycle: 'monthly', price: 999, includedTokens: 2000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持'], popular: true, icon: 'i-lucide-brain' },
  { id: 'mp-security-annual', type: 'model-plan', targetId: 'qax-security-llm', name: '安全大模型年度版', description: '年付享8折优惠', billingCycle: 'annual', price: 9590, originalPrice: 11988, includedTokens: 24000000, features: ['200万Token/月', '优先响应速度', '1对1技术支持', '专属模型实例'], popular: false, icon: 'i-lucide-brain' },
  { id: 'mp-threat-pro', type: 'model-plan', targetId: 'threat-detect-v3', name: '威胁检测专业版', billingCycle: 'monthly', price: 599, includedTokens: 1000000, features: ['100万Token/月', '实时威胁推送'], popular: false, icon: 'i-lucide-shield-alert' },
]

// 应用套餐
const appPlans: Plan[] = [
  { id: 'ap-threat-assistant', type: 'app-plan', targetId: 'app-threat-assistant', name: '威胁检测助手专业版', description: '5000次调用/月+7天数据留存', billingCycle: 'monthly', price: 299, includedCalls: 5000, features: ['5000次调用/月', '7天数据留存', '实时告警'], popular: true, icon: 'i-lucide-radar' },
  { id: 'ap-code-scan', type: 'app-plan', targetId: 'app-code-scan', name: '代码安全扫描专业版', billingCycle: 'monthly', price: 199, includedCalls: 3000, features: ['3000次扫描/月', 'CI/CD集成', '漏洞报告导出'], popular: false, icon: 'i-lucide-code-2' },
]
```

---

## 三、ECharts实时图表体系

### 3.1 技术方案

- 安装 `echarts` + `vue-echarts`
- 封装 `components/charts/BaseChart.vue`：统一处理resize、主题（light）、loading态、空数据态
- 监控页用 `setInterval` + ECharts `setOption` 增量更新（不销毁重建图表），模拟实时推送
- 所有图表支持点击事件 → `emit('drilldown', { type, value })` → 父组件处理下钻跳转
- 主题配色使用primary-600(#7C3AED)为主色，辅助色从Tailwind调色板选取

### 3.2 图表规格

#### 监控页 (`/enterprise/monitor`)

| 图表 | ECharts类型 | 交互 |
|------|------------|------|
| 实时调用流量 | 堆叠面积折线图，按模型分色，5s/30s/1min自动刷新 | 悬浮显示调用数+错误数，点击某模型下钻到该模型日志 |
| 模型调用分布 | 环形图(doughnut) | 点击扇区下钻到该模型详情 |
| 成员调用排行 | 横向柱图(bar) | 点击成员下钻到该成员日志 |

#### 调用统计 (`/console/stats`)

| 图表 | ECharts类型 | 交互 |
|------|------------|------|
| 日/周/月调用趋势 | 折线图(line)，调用数+错误数双Y轴 | 时间范围切换，悬浮显示详情 |
| 模型Token消耗分布 | 环形图(doughnut) | 点击扇区跳转模型详情 |
| 延迟分布 | 折线图(line)，P50/P95/P99 | 悬浮显示百分位数值 |

#### 日志页 (`/console/logs` + `/enterprise/logs`)

| 图表 | ECharts类型 | 交互 |
|------|------------|------|
| 调用量趋势 | 折线面积图(area)，随筛选条件动态更新 | 拖选时间范围自动筛选日志列表 |
| 状态码分布 | 环形图(doughnut) | 点击某个状态码筛选日志 |

#### 账单页 (`/enterprise/billing` + `/console/billing`)

| 图表 | ECharts类型 | 交互 |
|------|------------|------|
| 月度消费趋势 | 柱图+折线组合(金额柱+Token折线) | 悬浮显示双轴数据 |
| 成员消耗分布 | 环形图(doughnut) | 点击成员跳转成员详情 |

#### 控制台首页 (`/console`)

| 图表 | ECharts类型 | 交互 |
|------|------------|------|
| 调用趋势 | 面积折线图(line) | 悬浮显示数值 |

#### 企业概览 (`/enterprise`)

| 图表 | ECharts类型 | 交互 |
|------|------------|------|
| 7天调用趋势 | 面积折线图(line) | 悬浮显示数值 |

### 3.3 BaseChart组件接口

```vue
<script setup lang="ts">
interface Props {
  option: Record<string, any>
  height?: string        // default '300px'
  loading?: boolean
  emptyText?: string
}

interface Emits {
  (e: 'drilldown', data: { chartType: string; field: string; value: any }): void
}
</script>
```

---

## 四、全局联动下钻体系

### 4.1 市场→详情→购买（优化）

- 列表卡片增加"快速预览"按钮 → 右侧USlideover展示详情摘要+3按钮
- 列表卡片增加"收藏"图标 → 收藏的能力在控制台首页"我的收藏"中展示
- 详情页购买弹窗展示该能力的模型套餐/应用套餐（不只是充能包）

### 4.2 监控→日志→详情（新增）

| 来源 | 操作 | 目标 |
|------|------|------|
| 监控折线图点击某时间点 | 跳转 | `/enterprise/logs?time=14:30-14:35&from=monitor` |
| 监控环形图点击某模型 | 跳转 | `/enterprise/logs?model=threat-detect-v3&from=monitor` |
| 监控成员排行点击某成员 | 跳转 | `/enterprise/logs?member=m2&from=monitor` |
| 日志列表点击模型名 | 跳转 | `/marketplace/threat-detect-v3` |

### 4.3 活动→能力→购买（新增）

- 活动卡片增加"关联能力"标签 → 点击跳转对应能力详情
- 活动CTA改为"领取优惠"/"购买套餐" → 弹窗展示关联能力的套餐+优惠价
- 新增活动详情页 `/promotions/[id]`：活动介绍+关联能力列表+优惠套餐+规则说明

### 4.4 统计→日志→详情（新增）

| 来源 | 操作 | 目标 |
|------|------|------|
| stats图表点击 | 跳转 | `/console/logs?model=xxx&from=stats` |
| 控制台首页模型排行点击 | 跳转 | `/marketplace/xxx` |

### 4.5 全局快速创建Key（新增）

- 工作台页面(`/console/*`和`/enterprise/*`)显示悬浮"快速创建API Key"按钮（右下角FAB样式）
- 点击弹出精简创建对话框(名称+权限选择)
- 创建后显示Key+一键复制，不必跳转Key管理页
- 使用UTeleport挂载，避免每个页面重复代码

### 4.6 套餐→能力→接入（新增）

| 购买类型 | 成功后行为 |
|---------|----------|
| 模型套餐 | 自动弹出接入引导（创建Key+SDK代码+API端点） |
| 应用套餐 | 自动弹出接入步骤（Webhook URL/SDK安装/iframe嵌入代码） |
| 充能包 | 显示余额+推荐下一步（接入模型/查看用量/购买套餐） |

### 4.7 技术实现

- 页面间跳转通过URL query参数传递筛选条件
- 快速预览用 `USlideover`
- 全局创建Key用 `UTeleport` + composable `useQuickCreateKey()`
- 日志页 `onMounted` 读取 `route.query` 自动应用筛选

---

## 五、能力广场/Portal/活动页视觉升级

### 5.1 能力市场升级 (`/marketplace`)

**当前问题**：纯列表无层次感，筛选在左侧占空间，卡片样式单一。

**升级方案**：

```
┌───────────────────────────────────────────────────┐
│  🔍 搜索"安全大模型、威胁检测、代码安全..."         │
│  热门: [安全大模型] [威胁检测] [代码安全] [漏洞分析]  │
├───────────────────────────────────────────────────┤
│  [全部] [模型] [应用]    安全·威胁·漏洞·合规·代码... │
├───────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐         │
│  │  精选推荐: 安全大模型 │  │  精选推荐: 威胁检测  │         │
│  │  ★4.9 · 1280万调用 │  │  ★4.7 · 860万调用  │         │
│  │  [快速接入]       │  │  [快速接入]       │         │
│  └─────────────────┘  └─────────────────┘         │
├───────────────────────────────────────────────────┤
│  排序: [热门] [最新] [价格]     共18个能力           │
├───────────────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐                             │
│  │卡片1│ │卡片2│ │卡片3│  ← 升级卡片：价格标签       │
│  └────┘ └────┘ └────┘     调用数微标签、收藏图标     │
│  ┌────┐ ┌────┐ ┌────┐     快速预览按钮              │
│  │卡片4│ │卡片5│ │卡片6│     hover上浮+快捷操作栏     │
│  └────┘ └────┘ └────┘                             │
├───────────────────────────────────────────────────┤
│  ← 1 2 3 →                                        │
└───────────────────────────────────────────────────┘
```

- **搜索英雄区**：大搜索框+热门标签，替代当前简单标题
- **分类胶囊标签**：全部/模型/应用 横向胶囊，下方二级分类横向滚动
- **精选推荐区**：2个大的特色推荐卡片（渐变背景+模型介绍+快速接入按钮）
- **卡片升级**：增加价格标签、最近调用数微标签、收藏图标、快速预览按钮；hover上浮+快捷操作栏
- **筛选改为顶部横条**：不再用左侧边栏，节省横向空间
- **分页器**：每页12个

### 5.2 Portal首页升级 (`/`)

- **Hero区增强**：加入Canvas粒子/安全节点连线动画背景，标题排版更有冲击力
- **能力预览改为横向轮播**：3-4个热门能力自动轮播，展示模型截图+核心参数+快速体验按钮
- **新增"安全能力矩阵"区**：2x3网格展示6大安全领域（网络安全/威胁检测/漏洞分析/合规审计/代码安全/应急响应），每个领域卡片展示领域图标+能力数量+代表模型名
- **企业专区改版**：白色+紫色渐变边框高端卡片风格，4个feature用图标+数字+描述
- **定价区升级**：Tab切换（充能包/模型套餐/应用套餐），每个Tab展示精选2-3个套餐
- **新增"快速接入"区**：3步流程图（注册→获取Key→调用API）+ 代码片段预览

### 5.3 优惠活动页升级 (`/promotions` + `/promotions/[id]`)

**列表页升级**：
- 顶部增加"限时特惠"倒计时横幅条（最热活动）
- 卡片增加"关联能力"标签+倒计时
- 增加分类筛选：全部/限时折扣/免费体验/新客专享/企业优惠

**新增活动详情页** `/promotions/[id]`：
```
┌─────────────────────────────────────┐
│  顶部大Banner（渐变/图片）           │
├─────────────────────────────────────┤
│  活动介绍（MD渲染）                  │
├─────────────────────────────────────┤
│  关联能力列表                        │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │能力1│ │能力2│ │能力3│ ← 优惠价标签 │
│  └────┘ └────┘ └────┘              │
├─────────────────────────────────────┤
│  优惠套餐区                          │
│  ┌────────┐ ┌────────┐             │
│  │套餐1-折后│ │套餐2-折后│             │
│  └────────┘ └────────┘             │
├─────────────────────────────────────┤
│  活动规则 + FAQ                      │
├─────────────────────────────────────┤
│  [立即领取] [购买优惠套餐]            │
└─────────────────────────────────────┘
```

### 5.4 详情页升级 (`/marketplace/[id]`)

基于模板系统的模块化渲染，替代当前硬编码Tab布局。右侧固定信息栏保留（3按钮+定价+标签），随页面滚动sticky。

---

## 六、Admin模板配置页升级

### 6.1 模板编辑器布局

三栏结构：

```
┌────────┬──────────────────┬──────────┐
│ 模块列表 │   实时预览区      │ 属性编辑  │
│ (240px) │   (flex-1)       │ (320px)  │
│         │                  │          │
│ ☰ Banner│  ┌────────────┐  │ 标题:    │
│ ☰ Intro │  │  模块渲染    │  │ [____]  │
│ ☰ Feat  │  │  (高亮当前)  │  │ 描述:    │
│ ☰ Scene │  │             │  │ [____]  │
│ ☰ Price │  └────────────┘  │ 图标:    │
│ ☰ Integ │                  │ [🔍选择] │
│ ☰ Relat │                  │          │
│         │                  │ [保存]   │
└────────┴──────────────────┴──────────┘
```

- **左栏**：模块列表，拖拽排序、开关可见性、点击选中编辑
- **中栏**：实时预览，渲染真实模块组件，当前编辑模块用虚线框标注
- **右栏**：属性编辑面板，根据选中模块类型显示对应配置表单

### 6.2 各模块配置表单

参见1.2节"模块类型清单"的Admin配置项列。

### 6.3 图标选择器

新增 `components/admin/IconPicker.vue`：
- 从Lucide图标库搜索选择
- 支持分类浏览（安全/通用/操作/数据等）+搜索过滤
- 选中后返回图标名如 `i-lucide-shield-check`
- 网格布局展示图标预览

### 6.4 图片上传

Mock阶段方案：
- 本地文件选择 → `URL.createObjectURL()` 预览
- 存储为base64在模板配置的props中
- 后续可替换为真实OSS上传接口

### 6.5 活动模板增强

活动模板额外支持：
- 关联能力选择：从模型+应用列表勾选
- 优惠套餐配置：选择套餐+设置折扣价
- 倒计时组件配置：开关+结束时间
- 视觉配置扩展：6种渐变预设 + 自定义主色 + 背景装饰模式(圆点/线条/网格/无)

---

## 七、页面清单

### 7.1 新增页面

| 路由 | 页面 | 说明 |
|------|------|------|
| `/promotions/[id]` | 活动详情页 | 活动Banner+介绍+关联能力+优惠套餐+规则 |

### 7.2 重构页面

| 文件 | 修改内容 |
|------|---------|
| `pages/marketplace/index.vue` | 搜索英雄区+胶囊标签+精选推荐+卡片升级+横条筛选+分页 |
| `pages/marketplace/[id].vue` | 基于模板模块化渲染，右侧sticky信息栏 |
| `pages/index.vue` | Hero动画+能力轮播+安全矩阵+企业区改版+定价Tab+快速接入区 |
| `pages/promotions/index.vue` | 倒计时横幅+关联能力标签+分类筛选+卡片升级 |
| `pages/console/index.vue` | ECharts调用趋势图 |
| `pages/console/stats/index.vue` | ECharts折线+环形+延迟分布 |
| `pages/console/packs/index.vue` | 三Tab切换(充能包/模型套餐/应用套餐) |
| `pages/console/logs/index.vue` | ECharts趋势+状态码分布 |
| `pages/console/billing/index.vue` | ECharts消费趋势 |
| `pages/enterprise/monitor.vue` | ECharts实时流+环形+横向柱图，点击下钻 |
| `pages/enterprise/logs.vue` | ECharts趋势+状态码分布，query参数筛选 |
| `pages/enterprise/packs.vue` | 三Tab切换 |
| `pages/enterprise/billing.vue` | ECharts消费趋势+成员分布 |
| `pages/enterprise/index.vue` | ECharts 7天趋势 |
| `pages/admin/models/[id]/template.vue` | 三栏模块化编辑器 |
| `pages/admin/apps/[id]/template.vue` | 三栏模块化编辑器 |
| `pages/admin/activities/[id]/template.vue` | 三栏编辑器+关联能力+优惠套餐+倒计时 |

### 7.3 新增组件

| 组件 | 说明 |
|------|------|
| `components/charts/BaseChart.vue` | ECharts封装，统一resize/主题/loading/空数据/下钻事件 |
| `components/modules/ModuleBanner.vue` | Banner模块渲染 |
| `components/modules/ModuleHero.vue` | Hero模块渲染 |
| `components/modules/ModuleIntro.vue` | 产品介绍模块渲染 |
| `components/modules/ModuleFeatures.vue` | 特性展示模块渲染 |
| `components/modules/ModuleAdvantages.vue` | 优势对比模块渲染 |
| `components/modules/ModuleScenarios.vue` | 使用场景模块渲染 |
| `components/modules/ModuleTabs.vue` | Tab切换模块渲染 |
| `components/modules/ModuleCarousel.vue` | 轮播图模块渲染 |
| `components/modules/ModuleCards.vue` | 卡片网格模块渲染 |
| `components/modules/ModuleSteps.vue` | 步骤指引模块渲染 |
| `components/modules/ModulePricing.vue` | 定价模块渲染 |
| `components/modules/ModuleIntegration.vue` | 接入指南模块渲染 |
| `components/modules/ModuleRelated.vue` | 关联能力模块渲染 |
| `components/admin/IconPicker.vue` | Lucide图标选择器 |
| `components/admin/ModuleEditor.vue` | 通用模块配置表单 |
| `components/admin/TemplatePreview.vue` | 模板实时预览 |
| `components/QuickCreateKey.vue` | 全局快速创建API Key FAB |

### 7.4 保留不变

- `/console/keys`、`/console/keys/create` — Key管理页
- `/console/docs`、`/console/settings`、`/console/integrations` — 功能页
- `/enterprise/members`、`/enterprise/settings` — 企业管理页
- `/admin` 看板、`/admin/enterprises`、`/admin/orders` — Admin功能页
- 4个Sidebar组件、TopNav、PortalNav — 布局组件

---

## 八、实现优先级

1. **P0 - 基础设施**：ECharts引入+BaseChart组件、模板数据结构+mock数据、套餐数据结构+mock数据
2. **P1 - 核心产品**：模块化模板系统（13个模块组件+详情页渲染）、三层套餐体系（购买入口+弹窗联动）
3. **P2 - 图表升级**：监控页ECharts替换、统计页ECharts替换、日志/账单/首页ECharts替换
4. **P3 - 页面升级**：能力市场重构、Portal首页升级、活动页升级+活动详情页
5. **P4 - 全局联动**：快速预览、收藏、下钻跳转、全局创建Key、套餐购买后引导
6. **P5 - Admin增强**：三栏模板编辑器、图标选择器、图片上传、活动模板增强
