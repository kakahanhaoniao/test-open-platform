# 奇安信AI开放平台 - 统一控制台与企业化重构设计

## 背景

当前平台已实现方案B（统一能力市场）的24页Demo，但存在以下核心缺陷：
1. 纯个人用户模型，无企业接入
2. 缺少用户使用看板（实时监控、费用追踪、配额管理）
3. 开发者控制台视觉风格与"浅色背景+科技紫"不一致
4. 缺少账户体系（个人设置、账单中心、支付管理）
5. 跨系统导航不完整

本设计在现有方案B基础上补全，将 `/dev` 升级为 `/console` 统一用户控制台，新增企业空间、使用看板、账单中心等模块，修复视觉风格，闭环个人+企业双场景。

---

## 一、用户模型

### 1.1 用户类型

| 类型 | 场景 | 核心诉求 |
|------|------|----------|
| 个人开发者 | 独立使用AI能力 | 快速接入、按量付费、使用透明 |
| 企业管理员 | 管理企业团队 | 统一采购、成员管理、费用管控 |
| 企业成员 | 被授权使用企业资源 | 无感使用、配额可见、专注开发 |

### 1.2 企业模型

```
企业(Organization)
├── 信息：名称、行业、规模、认证状态
├── 成员(Member)
│   ├── 角色：管理员 / 开发者 / 财务 / 只读
│   └── 状态：已激活 / 待邀请 / 已禁用
├── 资源(Resource)
│   ├── 充能包（企业统一购买，成员共享）
│   ├── API Key（成员创建，消耗走企业账户）
│   └── 应用授权（企业购买的应用，成员可使用）
└── 账单(Billing)
    ├── 企业统一结算
    ├── 管理员看全量
    └── 成员看自己消耗占比
```

### 1.3 计费模型

- **个人用户**：自己购买充能包，自己消费，个人账单
- **企业用户**：企业管理员购买充能包，成员API调用消耗走企业充能包，企业统一结算
- **企业成员无个人账单**：所有消费归企业，成员只看自己的消耗明细（不涉及付款）

---

## 二、系统架构（补全后）

```
Portal (/portal/*)        → 营销引流（不变）
Market (/, /marketplace/*, /promotions) → C端市场（不变）
Console (/console/*)      → 统一用户控制台（升级原/dev）
Admin (/admin/*)          → 运营后台（不变）
```

### 2.1 Console 统一控制台模块

**侧边栏（浅色主题）：**

```
核心功能
├── 📊 使用看板      /console
├── 🔑 API Key       /console/keys
│                   /console/keys/create
├── 📈 调用统计      /console/stats      ← 深度技术分析
└── 📦 充能包        /console/packs

账户管理
├── 💰 账单中心      /console/billing
├── 🏢 企业空间      /console/workspace      ← 仅企业用户可见
│   ├── 成员管理      /console/workspace/members
│   ├── 企业充能包    /console/workspace/packs
│   └── 企业设置      /console/workspace/settings
└── ⚙️ 个人设置      /console/settings

开发资源
├── 📖 API文档       /console/docs
└── 🔌 应用集成      /console/integrations
```

**个人 vs 企业侧边栏差异：**
- 个人用户：不显示"企业空间"模块
- 企业成员：显示"企业空间"，但"企业设置"仅管理员可见
- 企业管理员：完整企业空间

### 2.2 视觉风格统一

| 系统 | 导航组件 | 风格 |
|------|----------|------|
| Portal | PortalNav | 浅色顶栏（不变） |
| Market | TopNav | 浅色顶栏（不变） |
| Console | ConsoleSidebar | **浅色侧边栏**（白底+紫色选中态） |
| Admin | AdminSidebar | **深色侧边栏**（#0C0A1A，管理后台区分） |

Console侧边栏设计：
- 背景：白色 `bg-white`
- 选中态：左侧3px紫色竖条 + `bg-primary-50` 浅紫背景 + `text-primary-700`
- 未选中：`text-gray-600` hover变 `text-gray-900`
- 分组标题：`text-xs text-gray-400 uppercase` 灰色小字
- Logo区：紫色图标 + "奇安信AI" + "用户控制台"副标题
- 底部：用户头像 + 名称 + 企业标识（企业用户显示企业名）

### 2.3 跨系统导航完善

**Console侧边栏顶部：**
- "返回市场"链接 → `/`

**Console侧边栏底部用户区：**
- 用户头像下拉：个人设置、运营后台（仅管理员角色可见）、退出

**Market TopNav用户下拉：**
- "用户控制台" → `/console`（替代原"开发者控制台"）
- "运营后台" → `/admin`
- "Portal首页" → `/portal`

**Admin侧边栏：**
- "返回前台" → `/`

**Portal：**
- PortalNav增加"进入控制台"按钮 → `/console`

---

## 三、使用看板设计

**路由：`/console`**（控制台首页）

### 3.1 页面结构

**顶部欢迎区（浅色，非deep-block）：**
- 左：欢迎回来 + 用户名 + 企业名（企业用户）+ 服务状态
- 右：视角切换下拉（个人/企业，企业用户可见）

**4项核心指标卡片：**
1. API调用总量（今日/本月）+ 同比变化
2. Token消耗（今日/本月）+ 同比变化
3. 本月费用（¥）+ 同比变化
4. 充能包余额（Token）+ 使用率进度条

**调用趋势图（7天/30天/90天切换）：**
- 面积图：调用量 + 费用双Y轴
- 悬浮显示每日详情

**双栏布局：**
- 左：模型/应用消耗排行（Top 5，带百分比条）
- 右：异常告警列表（最近5条，按严重程度排序）

**配额使用进度：**
- 充能包：已用/总量 + 进度条（>80%变橙色，>95%变红色）
- API频率限制：当前/上限

**快速操作入口：**
- 创建API Key、购买充能包、查看文档、应用集成

### 3.2 企业视角

切换到企业视角后：
- 4项指标变为企业整体数据
- 趋势图显示企业总调用
- 消耗排行显示企业Top模型
- 配额显示企业充能包总量
- 新增"成员消耗排行"（谁用最多）

---

## 四、账单中心设计

**路由：`/console/billing`**

### 4.1 个人用户账单

- 账单概览：本月消费、上月消费、同比
- 消费趋势图（月度柱状图）
- 账单列表：月份、消费金额、Token消耗、状态（已支付/待支付）、下载
- 充值记录：充能包购买历史

### 4.2 企业用户账单

- 视角切换：企业账单 / 我的消耗
- 企业账单（管理员可见）：企业总消费、成员消耗分布饼图、月度趋势
- 我的消耗：自己在企业中的消耗明细、占比
- 企业充值记录：企业充能包购买历史

---

## 五、企业空间设计

**路由：`/console/workspace`**

### 5.1 企业概览页 `/console/workspace`

- 企业信息卡片：名称、行业、规模、认证状态、创建时间
- 统计卡片：成员数、活跃Key数、本月消耗、充能包余额
- 快速操作：邀请成员、购买充能包、管理成员

### 5.2 成员管理 `/console/workspace/members`

- 成员列表表格：头像、姓名、邮箱、角色、API Key数、本月消耗、状态
- 角色说明：
  - 管理员：全部权限（成员管理、企业设置、账单查看、充能包购买）
  - 开发者：创建API Key、使用模型/应用、查看自己消耗
  - 财务：查看账单、购买充能包、无技术操作权限
  - 只读：查看企业信息、查看自己消耗
- 邀请成员：邮箱邀请 + 角色选择 + 邀请链接
- 操作：修改角色、禁用成员、移除成员

### 5.3 企业充能包 `/console/workspace/packs`

- 企业充能包余额卡片（大号，deep-block风格）
- 企业充能包购买（与个人充能包相同商品，但走企业结算）
- 成员消耗明细：谁用了多少Token，按成员分组

### 5.4 企业设置 `/console/workspace/settings`（仅管理员）

- 企业基本信息编辑
- 默认成员角色设置
- API调用限额设置（按成员）
- 通知设置（余额不足告警阈值）
- 企业认证信息

---

## 六、个人设置设计

**路由：`/console/settings`**

- 个人信息：头像、姓名、邮箱、手机号
- 安全设置：修改密码、两步验证、登录设备管理
- 通知偏好：邮件通知、余额告警、API异常告警
- API偏好：默认模型、默认参数
- 关联企业：查看自己所属的企业列表、退出企业

---

## 七、页面清单（新增+修改）

### 7.1 新增页面（10页）

| 路由 | 页面 | 说明 |
|------|------|------|
| `/console` | 使用看板 | 替代原/dev概览，完整看板 |
| `/console/billing` | 账单中心 | 个人/企业账单 |
| `/console/workspace` | 企业空间概览 | 企业信息+统计 |
| `/console/workspace/members` | 成员管理 | 邀请+角色+列表 |
| `/console/workspace/packs` | 企业充能包 | 企业购买+成员消耗 |
| `/console/workspace/settings` | 企业设置 | 管理员专属 |
| `/console/settings` | 个人设置 | 账户+安全+通知 |
| `/console/stats` | 调用统计 | 保留原/dev/stats，深度技术分析（错误日志、延迟分布、按Key细分），与看板互补 |
| `/console/keys` | API Key管理 | 保留，路由更新 |
| `/console/keys/create` | 创建Key | 保留，路由更新 |

### 7.2 修改页面（6页）

| 文件 | 修改内容 |
|------|----------|
| `components/dev/DevSidebar.vue` | 重命名为ConsoleSidebar，浅色主题，新增模块 |
| `pages/dev/*` | 迁移到 `pages/console/*`，更新引用 |
| `app.vue` | 路由检测 `/dev/*` → `/console/*` |
| `components/TopNav.vue` | "开发者控制台"→"用户控制台"，链接更新 |
| `components/portal/PortalNav.vue` | 增加"进入控制台"按钮 |
| `data/mock.ts` | 新增Organization、Member类型和模拟数据 |

### 7.3 保留不变（14页）

Portal 4页、Market 4页、Admin 9页、Variant A 6页、Variant B 4页均不变。

---

## 八、Mock数据扩展

### 8.1 新增类型

```typescript
interface Organization {
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
}

interface Member {
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

interface BillingRecord {
  id: string
  month: string
  amount: number
  tokens: number
  status: 'paid' | 'pending'
  items: { name: string; amount: number; tokens: number }[]
}
```

### 8.2 模拟数据

- 1个企业组织：奇安信安全团队
- 6个企业成员：覆盖4种角色
- 6个月账单记录
- 当前用户"张明"同时是个人用户和企业管理员

---

## 九、实现优先级

1. **P0 - 核心闭环**：ConsoleSidebar浅色重构 + 使用看板 + 企业空间概览 + 成员管理
2. **P1 - 账户体系**：账单中心 + 个人设置 + 企业充能包
3. **P2 - 体验完善**：企业设置 + 跨系统导航完善 + 视角切换交互
