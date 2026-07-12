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
    const chartInstance = (chartRef.value as any).chart || chartRef.value
    if (chartInstance && typeof chartInstance.bind === 'function') {
      chartInstance.bind('click', handleClick)
    }
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
