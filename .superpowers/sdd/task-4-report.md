# Task 4 Report: Enterprise Call Monitoring Page

## Status: DONE

## What was implemented

Created the enterprise call monitoring page (`/enterprise/monitor`) -- the most important page for enterprise admins at a security company.

### Files Created

1. **`/Users/xiaoshao/Downloads/ai-platform/app/pages/enterprise/monitor.vue`** -- The main monitoring page
2. **`/Users/xiaoshao/Downloads/ai-platform/app/components/EnterpriseSidebar.vue`** -- Enterprise workspace sidebar (required by the page)

### Files Modified

1. **`/Users/xiaoshao/Downloads/ai-platform/app/app.vue`** -- Added `/enterprise` route to `isFullWidthRoute` computed property so enterprise pages render with their own layout (sidebar managed by each page)

---

## Page Structure

The page follows the established pattern: `<EnterpriseSidebar />` + content area with `ml-60`.

### 1. Four Real-time Metric Cards (grid grid-cols-4)

| Card | Value | Change | Icon | Background |
|------|-------|--------|------|------------|
| 今日调用 | 47,236 | +12% vs昨日 | i-lucide-activity | bg-blue-50 |
| 实时QPS | 347/s | 当前峰值 | i-lucide-gauge | bg-purple-50 |
| 错误率 | 0.3% | -0.1% | i-lucide-alert-triangle | bg-amber-50 |
| 平均延迟 | 128ms | -5ms | i-lucide-clock | bg-green-50 |

Each card has: icon in colored background, value in bold mono font, change indicator with trend icon (up/down), and hover lift effect via `card-hover` class.

### 2. Real-time Call Flow Chart (the hero section)

- Title "实时调用流量" with LIVE pulse indicator (green dot with `animate-pulse`)
- Refresh rate selector: 3 buttons (5s / 30s / 1min) with active state styling
- **CSS-based stacked area chart** rendering `monitorMetrics.realtimeSeries` (60 data points):
  - Each time point rendered as a vertical column div
  - Calls distributed proportionally across models using `modelDistribution` ratios
  - Each model segment gets its own color from the distribution data
  - Columns are flush (no gap) for area chart effect
  - Y-axis labels (max, half, 0) on the left
  - X-axis time labels every 10 points
  - Grid lines for visual reference
  - Hover: crosshair cursor, vertical highlight line, tooltip showing time + calls + errors
  - Chart legend below with color dots + model names
- Tooltip: dark background, shows time (mono), calls count, error count (red)

### 3. Dual-column Layout (grid grid-cols-2)

**Left: 模型调用分布 (Donut/Ring Chart)**
- CSS `conic-gradient` on a circular div (w-44 h-44)
- White center circle (w-28 h-28) showing total call count
- Legend below: color dot + model name + call count for each model
- Uses `monitorMetrics.modelDistribution` data with colors: #7C3AED, #EF4444, #3B82F6, #6366F1, #10B981

**Right: 成员调用排行 (Horizontal Bar Chart)**
- Top 6 members from `monitorMetrics.memberRanking`
- Each entry: rank badge (top 3 highlighted) + name + call count
- Horizontal bar with width proportional to max calls
- Gradient colors: primary-500/400/300/200 for rank
- Link to /enterprise/members

### 4. Anomaly Alerts Section

- Title "异常告警" with red badge showing severe alert count
- 5 alerts matching the console dashboard alerts data:
  - 1 red (500 error), 2 amber (429 rate limits), 2 green (service recovered)
- Each alert: severity icon + message + time + "查看详情" link to /enterprise/logs
- Color-coded left borders: red-500, amber-500, green-500
- Background colors: red-50, amber-50, green-50

### EnterpriseSidebar Component

Created as a prerequisite since no enterprise sidebar existed. Follows the spec (Section 2.2):
- White background with purple active state
- Top: "返回市场" link + logo area ("奇安信AI / 企业工作台")
- Navigation groups: "核心功能" (概览/成员/监控/日志) + "资源与财务" (充能包/账单/设置)
- Active indicator: 3px purple left bar + bg-primary-50 + text-primary-700
- Bottom: user dropdown with "个人空间" link (to /console), "企业设置", "退出登录"
- Uses `currentUser` and `organization` from mock data

### Data Sources

All data imported from `~/data/mock`:
- `monitorMetrics` -- realtimeSeries, modelDistribution, memberRanking, todayCalls, realtimeQPS, errorRate, avgLatency
- `models` -- imported for context (available for future enhancements)
- `members` -- imported for context (available for future enhancements)

### Animations & Interactions

- LIVE pulse indicator: green dot with Tailwind `animate-pulse`
- "实时监控中" badge with pulsing green dot
- Metric cards: hover lift via `card-hover` class (translateY -2px + shadow)
- Chart columns: hover highlight with vertical line + subtle background
- Tooltip: fade transition (100ms enter, 75ms leave)
- Bar chart: `transition-all duration-500` for width animation
- User dropdown: scale + opacity transition

### Page Title

`useHead({ title: '调用监控 - 奇安信AI开放平台' })` as specified.
