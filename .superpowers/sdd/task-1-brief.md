### Task 1: Install ECharts + markdown-it and create BaseChart component

**Files:**
- Modify: `package.json` (add dependencies)
- Create: `app/components/charts/BaseChart.vue`
- Create: `app/composables/useChartTheme.ts`

**Interfaces:**
- Produces: `BaseChart` component with props `{ option, height?, loading?, emptyText? }` and emit `drilldown`
- Produces: `useChartTheme()` composable returning ECharts theme option object

- [ ] **Step 1: Install dependencies**

```bash
npm install echarts vue-echarts markdown-it
```

- [ ] **Step 2: Create chart theme composable**

Create `app/composables/useChartTheme.ts`:

```ts
export function useChartTheme() {
  const colors = ['#7C3AED', '#A78BFA', '#C4B5FD', '#818CF8', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444']
  return {
    colors,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, system-ui, sans-serif', color: '#6B7280' },
    title: { textStyle: { color: '#111827', fontWeight: 600 } },
    legend: { textStyle: { color: '#6B7280' } },
    tooltip: { backgroundColor: '#fff', borderColor: '#E5E7EB', textStyle: { color: '#111827' } },
    grid: { containLabel: true }
  }
}
```

- [ ] **Step 3: Create BaseChart component**

Create `app/components/charts/BaseChart.vue`:

```vue
<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useChartTheme } from '~/composables/useChartTheme'

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent])

const props = withDefaults(defineProps<{
  option: Record<string, any>
  height?: string
  loading?: boolean
  emptyText?: string
}>(), {
  height: '300px',
  loading: false,
  emptyText: '暂无数据'
})

const emit = defineEmits<{
  drilldown: [data: { chartType: string; field: string; value: any }]
}>()

const theme = useChartTheme()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)

function handleClick(params: any) {
  if (params.componentType === 'series' && params.seriesType) {
    emit('drilldown', {
      chartType: params.seriesType,
      field: params.seriesName || params.name,
      value: params.name ?? params.value
    })
  }
}

onMounted(() => {
  if (chartRef.value) {
    chartRef.value.bind('click', handleClick)
  }
})

const mergedOption = computed(() => ({
  color: theme.colors,
  ...props.option
}))
</script>

<template>
  <div :style="{ height }" class="relative">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
      <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
    <VChart
      v-if="!loading && option"
      ref="chartRef"
      :option="mergedOption"
      autoresize
      class="w-full h-full"
    />
    <div v-if="!loading && !option" class="flex items-center justify-center h-full text-gray-400 text-sm">
      {{ emptyText }}
    </div>
  </div>
</template>
```

- [ ] **Step 4: Verify build**

```bash
npx nuxi build 2>&1 | tail -5
```

Expected: Build complete

- [ ] **Step 5: Commit**

```bash
git add package.json app/components/charts/ app/composables/useChartTheme.ts
git commit -m "feat: add ECharts + BaseChart component with drill-down support"
```
