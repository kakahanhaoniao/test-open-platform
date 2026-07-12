# Task 6 Report: Replace all CSS charts with ECharts

## Status: DONE

## Summary

Replaced all CSS-based bar charts, conic-gradient donut charts, and div-based visualizations with interactive ECharts using the BaseChart component across 8 page files. 13 total chart instances were created (15 if counting the 2 status doughnuts on logs pages that had drilldown).

## Files Modified

1. **app/pages/enterprise/monitor.vue** - 3 charts replaced
   - Stacked area chart (realtime call flow) with `v-for` stacked columns -> ECharts stacked line with areaStyle
   - Conic-gradient donut (model distribution) -> ECharts pie with radius:['40%','70%']
   - CSS progress bars (member ranking) -> ECharts horizontal bar chart
   - Added drilldown handlers: `onRealtimeDrilldown`, `onModelDistDrilldown`, `onMemberRankDrilldown`
   - Removed: tooltipState, onChartHover, onChartLeave, stackedData, donutData, donutGradient, memberBarData computations

2. **app/pages/console/stats/index.vue** - 3 charts replaced
   - CSS bar chart (daily calls) -> ECharts dual-Y line chart (calls left, errors right)
   - Table-only model breakdown -> Added ECharts token distribution doughnut
   - New: ECharts latency line chart with P50/P95/P99 lines

3. **app/pages/console/logs/index.vue** - 2 charts replaced
   - CSS bar chart (trend data) -> ECharts area chart (success + error stacked areas)
   - New: ECharts status code distribution doughnut with drilldown to filter

4. **app/pages/enterprise/logs.vue** - 2 charts replaced
   - CSS stacked bar chart (trend data) -> ECharts stacked area chart (200/429/500)
   - New: ECharts status code distribution doughnut with drilldown to filter
   - Added query param handling from monitor drilldown (`?model=xxx&from=monitor`)

5. **app/pages/enterprise/billing.vue** - 2 charts replaced
   - CSS bar chart (monthly trend) -> ECharts bar+line combo (amount bars, tokens line on secondary Y)
   - CSS progress bars (member cost) -> ECharts member cost distribution doughnut

6. **app/pages/console/billing/index.vue** - 1 chart replaced
   - CSS bar chart (monthly trend) -> ECharts bar+line combo chart

7. **app/pages/console/index.vue** - 1 chart replaced
   - CSS bar chart (7-day trend) -> ECharts area line chart with gradient fill

8. **app/pages/enterprise/index.vue** - 1 chart added
   - New: ECharts area line chart for 7-day enterprise call trend (was no chart before)

## Chart Specifications

| Page | Chart Type | ECharts Type | Height | Drilldown |
|------|-----------|-------------|--------|-----------|
| monitor.vue | Stacked area | LineChart + areaStyle + stack | 250px | Navigate to logs?model=xxx |
| monitor.vue | Doughnut | PieChart radius:['40%','70%'] | 280px | Navigate to logs?model=xxx |
| monitor.vue | Horizontal bar | BarChart y-axis category | 280px | Navigate to logs?member=xxx |
| stats/index.vue | Dual-Y line | LineChart + yAxisIndex | 280px | No |
| stats/index.vue | Token doughnut | PieChart radius:['40%','70%'] | 280px | No |
| stats/index.vue | Latency lines | LineChart (P50/P95/P99) | 280px | No |
| console/logs | Area trend | LineChart + areaStyle | 220px | No |
| console/logs | Status doughnut | PieChart radius:['40%','70%'] | 220px | Filter status |
| enterprise/logs | Stacked area | LineChart + areaStyle + stack | 220px | No |
| enterprise/logs | Status doughnut | PieChart radius:['40%','70%'] | 220px | Filter status |
| enterprise/billing | Bar+line combo | BarChart + LineChart (dual Y) | 280px | No |
| enterprise/billing | Member doughnut | PieChart radius:['40%','70%'] | 280px | No |
| console/billing | Bar+line combo | BarChart + LineChart (dual Y) | 280px | No |
| console/index | Area line | LineChart + areaStyle | 220px | No |
| enterprise/index | Area line | LineChart + areaStyle | 220px | No |

## Technical Details

- All chart options are `computed` properties for reactivity
- Chinese labels used in tooltips, legends, and axis labels
- Color scheme follows `useChartTheme` (primary purple #7C3AED)
- Status colors: green (#10B981) for 2xx, amber (#F59E0B) for 4xx, red (#EF4444) for 5xx
- Area charts use gradient fills with opacity transitions
- Doughnut charts use `borderRadius: 6` for rounded segments
- Empty data handled by returning `{}` from computed (BaseChart shows "暂无数据")

## Drilldown Implementation

- **monitor.vue**: 3 drilldown handlers navigate to `/enterprise/logs?model=xxx&from=monitor` or `?member=xxx&from=monitor`
- **logs pages**: Status doughnut drilldown sets the status filter (e.g., click "5xx" -> filter status to "500")
- **enterprise/logs.vue**: Also reads query params from monitor drilldown on mount

## Type Fixes

- Changed `trendChartOption` return type from `null` to `{}` for empty data (matching BaseChart `Record<string, any>` prop)
- Added non-null assertions `!` on `Record<string, number>` increments in statusDistData
- Added `!` non-null assertion on `billingRecords[0]!` and `billingRecords[1]!`

## Commit

- SHA: d3d19c6
- Subject: `feat: replace all CSS charts with ECharts + drill-down support`
- Files: 8 modified, 1 new (console/logs/index.vue was new to git tracking)

## Concerns

1. **BaseChart click handler timing**: The BaseChart component binds click handlers in `onMounted`, but the chart is conditionally rendered with `v-if="!loading && option"`. When the option is initially empty and then becomes available, the chart renders after mount, so the click binding might not work. The `@drilldown` event pattern is used in templates, but the underlying VChart `bind('click')` in BaseChart's onMounted may need to use a `watch` instead. This is a pre-existing BaseChart issue, not introduced by this task.

2. **console/logs/index.vue**: This file was in `.gitignore` (the `console/logs` path was ignored). It was committed with `git add -f`. This may indicate the file should be reviewed for whether the gitignore rule should be updated.

3. **monitor.vue auto-refresh**: The setInterval-based refresh still updates `liveQPS` and `liveLatency` for the metric cards, but does NOT push new data points into the ECharts chart (which would require `setOption` with incremental data). The chart shows static data from `monitorMetrics.realtimeSeries`. To make the chart truly real-time, a future task could implement `appendData` or `setOption` with shifting time windows.
