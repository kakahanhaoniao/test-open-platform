# Task 11 Completion Report: Cross-Page Drill-Down Linking

## Summary

Implemented cross-page navigation via URL query parameters enabling users to drill down from charts/monitoring pages to logs pages to model detail pages. The flow: monitor/stats chart click -> logs page (auto-filtered) -> model detail page.

## Changes Made

### 1. enterprise/monitor.vue -- Already had drilldown handlers
The page already had `useRouter()`, `onRealtimeDrilldown`, `onModelDistDrilldown`, and `onMemberRankDrilldown` handlers with `@drilldown` events bound to all three charts. No changes needed.

### 2. enterprise/logs.vue -- Added back link + model name links
- Added `fromMonitor` ref, set to `true` when `route.query.from === 'monitor'`
- Added "返回监控" (Back to Monitor) NuxtLink next to page title, shown only when `fromMonitor` is true
- Changed model name column from plain text to `<NuxtLink :to="/marketplace/${log.model}">` with `@click.stop` to prevent row toggle

### 3. console/logs/index.vue -- Added route query reading + back link + model name links
- Added `useRoute()` and `fromStats` ref
- Added `onMounted` handler that reads `route.query.model` and applies it to `modelFilter`, and sets `fromStats` when `route.query.from === 'stats'`
- Merged existing `onMounted` (document click listener) into the new one
- Added "返回统计" (Back to Stats) NuxtLink next to page title, shown only when `fromStats` is true
- Changed model name column from plain text to `<NuxtLink :to="/marketplace/${log.model}">` with `@click.stop`

### 4. console/stats/index.vue -- Added drilldown handlers + model name links
- Added `useRouter()`
- Added `onCallTrendDrilldown` handler: navigates to `/console/logs?model=xxx&from=stats`
- Added `onTokenDistDrilldown` handler: navigates to `/console/logs?model=xxx&from=stats`
- Bound `@drilldown` events to call trend chart and token distribution chart
- Added `modelId` field to `modelBreakdown` and `errorLog` data arrays
- Changed model name in breakdown table to `<NuxtLink :to="/marketplace/${item.modelId}">`
- Changed model name in error log table to `<NuxtLink :to="/marketplace/${err.modelId}">`

### 5. console/index.vue -- Added model ranking click links
- Added `models` to import from `~/data/mock`
- Added `modelId` field to each `modelRanking` entry
- Changed model name in ranking list to `<NuxtLink :to="/marketplace/${item.modelId}">` (with fallback to plain text for "其他模型" which has no modelId)

## Navigation Flow

```
enterprise/monitor (chart click)
  -> /enterprise/logs?model=xxx&from=monitor  (auto-filtered, "返回监控" link)
    -> /marketplace/[modelId]  (model detail)

console/stats (chart click)
  -> /console/logs?model=xxx&from=stats  (auto-filtered, "返回统计" link)
    -> /marketplace/[modelId]  (model detail)

console/index (model ranking click)
  -> /marketplace/[modelId]  (model detail)
```

## Build Verification

Build completed successfully with no errors.

## Commit

`4626f00` feat: cross-page drill-down linking for monitor->logs->detail flow

## Concerns

- The `modelFilter` in console/logs uses `modelName` (display name) for filtering, but the drilldown from stats passes the chart series name which is also the display name. This works correctly for the current data but would need adjustment if model names change or if the filter should use model IDs instead.
- The "其他模型" entry in console/index model ranking has no modelId, so it renders as plain text rather than a link, which is the correct behavior.
- The `@click.stop` on NuxtLink elements in log tables prevents the row expand toggle from firing when clicking the model name link, which is the desired UX.
