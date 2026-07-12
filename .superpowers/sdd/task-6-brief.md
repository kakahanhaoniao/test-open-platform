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
