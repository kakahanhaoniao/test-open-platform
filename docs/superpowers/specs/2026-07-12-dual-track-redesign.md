# 奇安信AI开放平台 - 双轨分流架构重构设计

## 背景

当前平台存在5个结构性缺陷：

1. **入口混乱**：`/` 和 `/portal` 定位不清，内容重叠
2. **企业是二等公民**：企业功能是"个人功能的附加Tab"，右上角视角切换用户看不明白
3. **管理后台与企业无关**：Admin只管内容，不管企业客户
4. **下钻太深**：购买链路5层下钻（首页→市场→详情→定价Tab→充能包→购买）
5. **监控缺失**：没有调用日志、流量监控、实时告警——安全公司硬伤

本设计采用**双轨分流架构**：企业和个人走不同工作台，共享能力市场，从登录后即分流。

---

## 一、整体信息架构

```
Portal (/)                          → 引流落地页（未登录用户）
│   营销内容、能力预览、定价、企业专区、注册/登录入口
│
├── 登录后分流 ─────────────────────────────────────────
│
能力市场 (/marketplace)              → 共享，企业和个人都能访问
│   ├── 列表页：模型+应用统一展示，企业用户看到企业定价和批量入口
│   ├── 详情页：3按钮直购（体验/接入/购买），不需要跳转工作台
│   └── 活动页 (/promotions)：优惠活动
│
个人工作台 (/console)                → 个人用户默认落地页
│   ├── 使用看板 (/console)          API调用量、Token消耗、费用、配额
│   ├── API Key (/console/keys)      Key管理、创建
│   ├── 调用日志 (/console/logs)     个人调用日志、搜索、趋势图
│   ├── 充能包 (/console/packs)      个人充能包购买与管理
│   ├── 账单 (/console/billing)      个人账单、消费明细
│   └── 个人设置 (/console/settings) 账户、安全、通知
│
企业工作台 (/enterprise)             → 企业用户默认落地页
│   ├── 企业概览 (/enterprise)       企业信息、核心指标、成员活跃度
│   ├── 成员管理 (/enterprise/members) 邀请、角色、禁用、消耗查看
│   ├── 调用监控 (/enterprise/monitor) 全企业实时调用监控、流量图、异常告警
│   ├── 日志审计 (/enterprise/logs)   全企业调用日志、搜索、多维筛选、趋势图、导出
│   ├── 企业充能包 (/enterprise/packs) 企业充能包、成员消耗明细
│   ├── 企业账单 (/enterprise/billing) 企业统一账单、成员消耗分布
│   └── 企业设置 (/enterprise/settings) 企业信息、成员限额、告警阈值
│
运营后台 (/admin)                    → 平台运营人员
│   ├── 数据看板                     平台全局数据
│   ├── 企业客户管理 (/admin/enterprises)  企业列表、审核、详情
│   ├── 模型管理                     模型CRUD、模板配置
│   ├── 应用管理                     应用CRUD、模板配置
│   ├── 活动管理                     活动CRUD、模板配置
│   ├── 订单管理                     全平台订单
│   └── 模板配置                     页面模板管理
```

---

## 二、侧边栏设计

### 2.1 个人工作台侧边栏

用户信息放在顶部醒目位置，企业用户额外显示"企业空间"跳转入口。

```
┌─────────────────────────┐
│  👤 张明                 │  ← 顶部醒目位置
│     zhangming@qianxin   │
│  [企业空间 →]            │  ← 企业用户才显示
├─────────────────────────┤
│  ← 返回市场             │
├─────────────────────────┤
│  📊 使用看板             │
│  🔑 API Key             │
│  📋 调用日志             │  ← 新增
│  📦 充能包               │
├─────────────────────────┤
│  💰 账单                 │
│  ⚙️ 个人设置             │
├─────────────────────────┤
│  退出登录                │
└─────────────────────────┘
```

### 2.2 企业工作台侧边栏

企业名+角色放在顶部，底部有"个人空间"跳转。

```
┌─────────────────────────┐
│  🏢 奇安信安全团队       │  ← 顶部醒目位置
│     管理员 · 6名成员     │
│  [个人空间 →]            │
├─────────────────────────┤
│  ← 返回市场             │
├─────────────────────────┤
│  🏢 企业概览             │
│  👥 成员管理             │
│  📡 调用监控             │  ← 核心模块
│  📜 日志审计             │  ← 核心模块
├─────────────────────────┤
│  📦 企业充能包           │
│  💰 企业账单             │
│  ⚙️ 企业设置             │
├─────────────────────────┤
│  退出登录                │
└─────────────────────────┘
```

### 2.3 设计规范

- 两者均为浅色主题：白底 `bg-white` + 紫色选中态
- 选中态：左侧3px紫色竖条 + `bg-primary-50` + `text-primary-700`
- 未选中：`text-gray-600` hover变 `text-gray-900`
- 分组标题：`text-xs text-gray-400 uppercase`
- 顶部用户/企业区：头像 + 名称 + 身份标识 + 跳转入口

---

## 三、能力市场直购链路

### 3.1 当前问题

购买链路5层下钻：首页→能力市场→详情→定价Tab→充能包→购买

### 3.2 重构后链路

```
Portal首页 → 能力市场 → 详情页 → 右侧3按钮直接操作
```

### 3.3 详情页右侧信息栏

```
┌──────────────────────┐
│  奇安信安全大模型      │
│  ★ 4.8  ·  1.2万调用  │
│                      │
│  ┌──────────────────┐│
│  │ 🟢 在线体验       ││
│  │  打开Playground   ││
│  └──────────────────┘│
│                      │
│  ┌──────────────────┐│
│  │ 🔑 立即接入       ││
│  │  获取API Key+SDK  ││
│  └──────────────────┘│
│                      │
│  ┌──────────────────┐│
│  │ 📦 购买充能包     ││
│  │  体验包 ¥99 起    ││
│  └──────────────────┘│
│                      │
│  定价信息             │
│  输入: ¥0.02/千Token │
│  输出: ¥0.06/千Token │
│                      │
│  企业用户额外显示：    │
│  ┌──────────────────┐│
│  │ 🏢 企业批量采购   ││
│  │  专属折扣+统一结算 ││
│  └──────────────────┘│
│                      │
│  标签、关联模型等      │
└──────────────────────┘
```

**交互**：
- 点击"购买充能包" → 弹出充能包选择弹窗，直接购买
- 点击"立即接入" → 弹出接入引导（创建Key或复制SDK代码）
- 点击"在线体验" → 页面内展开Playground
- 定价信息直接展示在右侧，不再需要单独Tab

---

## 四、企业工作台核心页面

### 4.1 调用监控 `/enterprise/monitor`

**4个实时指标卡片**：
- 今日调用（同比变化）
- 实时QPS
- 错误率（同比变化）
- 平均延迟（同比变化）

**实时调用流量图**：
- 自动刷新，支持5s/30s/1min切换
- 按模型分色堆叠
- 悬浮显示详情

**双栏布局**：
- 左：模型调用分布（环形图）
- 右：成员调用排行（柱状图 Top 10）

**异常告警列表**：
- 按严重程度排序（红/黄/绿）
- 点击可跳转日志详情

### 4.2 日志审计 `/enterprise/logs`

**搜索栏**：支持关键词、API Key、模型名、成员名搜索

**多维筛选**：时间范围、模型、成员、状态码、Key

**调用量趋势图**：
- 随筛选条件动态更新
- 按小时/天/周聚合切换

**日志列表**：
- 列：时间 | 成员 | 模型 | Key | 状态 | 延迟 | Token
- 点击行展开：请求体/响应体/错误信息
- 分页

**导出**：CSV/JSON格式

### 4.3 个人调用日志 `/console/logs`

结构类似企业日志审计，但：
- 只看自己的调用记录
- 筛选维度少（没有"成员"筛选）
- 趋势图只展示个人数据
- 同样支持搜索和趋势图

---

## 五、Admin企业客户管理

### 5.1 企业客户列表 `/admin/enterprises`

**统计卡片**：企业总数、已认证、本月新增、待审核

**搜索+筛选**：企业名/行业/联系人搜索，认证状态/行业/规模/注册时间筛选

**企业列表表格**：企业名称 | 行业 | 规模 | 成员数 | 月消耗 | 状态

### 5.2 企业详情 `/admin/enterprises/[id]`

**双栏顶部**：
- 左：企业信息（名称、行业、规模、认证状态、注册时间、联系人）+ 操作按钮（编辑/禁用）
- 右：用量概览（本月调用、Token消耗、本月费用、充能包余额）+ 7天调用趋势图

**成员列表**：姓名 | 邮箱 | 角色 | Key数 | 月消耗 | 状态

**充能包记录**：类型 | Token量 | 金额 | 购买时间 | 状态

**账单记录**：月份 | 金额 | Token | 状态

---

## 六、Portal首页重构

### 6.1 定位

Portal首页 `/` = 引流落地页，未登录用户看。与能力市场 `/marketplace` 明确区分：
- Portal是"看"的，引流为主，不需要登录
- 能力市场是"用"的，需要登录，有购买/接入操作

### 6.2 页面结构

- Hero区：标题 + 副标题 + [探索能力市场] [企业咨询] 两个CTA
- 核心数据：18+能力 · 1亿+调用 · 5000+企业
- 能力预览：3-4个热门模型/应用卡片
- 企业专区："企业专属方案" — 统一采购·成员管理·用量管控·专属折扣
- 客户案例/信任背书
- 定价预览 + [查看完整定价]
- Footer

### 6.3 路由合并

- `/portal/*` 路由重定向到 `/`
- Portal内容合并到 `pages/index.vue`
- PortalNav组件保留用于首页导航栏

---

## 七、页面清单

### 7.1 新增页面（10页）

| 路由 | 页面 | 说明 |
|------|------|------|
| `/enterprise` | 企业概览 | 企业信息、核心指标、成员活跃度、快捷操作 |
| `/enterprise/monitor` | 调用监控 | 实时流量图、QPS、错误率、延迟、模型分布、成员排行、异常告警 |
| `/enterprise/logs` | 日志审计 | 搜索+多维筛选、调用量趋势图、日志列表(可展开详情)、导出 |
| `/enterprise/members` | 成员管理 | 邀请、角色管理、成员消耗查看 |
| `/enterprise/packs` | 企业充能包 | 余额、购买、成员消耗明细 |
| `/enterprise/billing` | 企业账单 | 企业统一账单、成员消耗分布 |
| `/enterprise/settings` | 企业设置 | 企业信息、成员限额、告警阈值 |
| `/console/logs` | 个人调用日志 | 个人调用日志、搜索、趋势图 |
| `/admin/enterprises/index.vue` | 企业客户管理 | 企业列表、搜索筛选、统计 |
| `/admin/enterprises/[id].vue` | 企业详情 | 信息+用量+成员+充能包+账单 |

### 7.2 修改页面（7页）

| 文件 | 修改内容 |
|------|----------|
| `pages/index.vue` | 合并Portal，改为引流落地页，增加企业专区 |
| `pages/marketplace/[id].vue` | 详情页右侧改为3按钮直购（体验/接入/购买），企业用户显示批量采购 |
| `components/TopNav.vue` | 未登录显示登录/注册，已登录显示用户名+工作台入口 |
| `components/console/ConsoleSidebar.vue` | 用户信息移顶部，新增调用日志，底部企业空间入口 |
| `components/admin/AdminSidebar.vue` | 新增"企业客户"导航项 |
| `app.vue` | 路由检测增加 `/enterprise` 分支 |
| `data/mock.ts` | 新增调用日志、监控数据、企业客户列表等mock数据 |

### 7.3 删除/合并

| 变更 | 说明 |
|------|------|
| `pages/portal/*` | Portal内容合并到 `/`，`/portal` 路由重定向到 `/` |
| `pages/console/workspace/*` | 企业空间从console移到独立的 `/enterprise` |
| `pages/console/billing/index.vue` | 简化为纯个人账单，企业账单移到 `/enterprise/billing` |

### 7.4 保留不变

- `/console/keys`、`/console/keys/create`、`/console/stats`、`/console/packs`、`/console/docs`、`/console/integrations` — 个人工作台页面保留
- `/admin/models`、`/admin/apps`、`/admin/activities`、`/admin/orders`、`/admin/templates` — Admin内容管理保留
- `/marketplace`、`/promotions` — 能力市场保留

---

## 八、Mock数据扩展

### 8.1 调用日志

```typescript
interface CallLog {
  id: string
  timestamp: string          // '2026-07-11 14:32:15'
  memberName: string
  memberId: string
  model: string
  modelName: string
  apiKey: string             // 'sk-qax-***3a7f'
  status: number             // 200 | 400 | 429 | 500
  latency: number            // ms
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number               // ¥
  errorMessage?: string
  requestId: string
}
```

- 50条日志，覆盖不同成员、模型、状态码
- 包含5条错误日志（500/429），用于告警展示

### 8.2 监控数据

```typescript
interface MonitorMetrics {
  todayCalls: number
  realtimeQPS: number
  errorRate: number
  avgLatency: number
  realtimeSeries: { time: string; calls: number; errors: number }[]
  modelDistribution: { name: string; calls: number; color: string }[]
  memberRanking: { name: string; calls: number; tokens: number }[]
}
```

### 8.3 Admin企业客户数据

```typescript
interface AdminEnterprise {
  id: string
  name: string
  industry: string
  scale: string
  memberCount: number
  monthlyCost: number
  monthlyCalls: number
  monthlyTokens: number
  packBalance: number
  verified: boolean
  createdAt: string
  contactName: string
  contactEmail: string
  status: 'active' | 'pending' | 'disabled'
}
```

- 8个企业客户，覆盖不同行业和规模

### 8.4 现有数据调整

- `Organization` 增加 `contactName`、`contactEmail`、`monthlyCalls` 字段
- `CurrentUser` 保持 `isEnterprise` + `role`，用于路由分流

---

## 九、实现优先级

1. **P0 - 架构重构**：Portal合并、企业工作台独立路由、侧边栏重构、app.vue路由分流
2. **P1 - 企业核心**：调用监控、日志审计、企业概览、成员管理
3. **P2 - 直购链路**：详情页3按钮重构、充能包弹窗、接入引导弹窗
4. **P3 - Admin企业**：企业客户管理、企业详情
5. **P4 - 清理**：Portal路由重定向、console/workspace删除、billing简化
