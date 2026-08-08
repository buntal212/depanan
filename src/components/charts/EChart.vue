<template>
  <div class="echart-container">
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import { useQuasar } from 'quasar'

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
])

const props = defineProps({
  title: {
    type: String,
    default: 'ECharts Demo',
  },
  xAxisData: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  series: {
    type: Array,
    default: () => [
      {
        name: 'Data 1',
        type: 'bar',
        data: [40, 20, 12, 39, 10, 40],
      },
    ],
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
  dark: {
    type: Boolean,
    default: false,
  },
})

const $q = useQuasar()

const palette = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#22d3ee']

// Determine if we're using a pie chart
const isPieChart = computed(() => {
  return props.series.length > 0 && props.series[0].type === 'pie'
})

// Chart options
const chartOption = computed(() => {
  const isDark = props.dark || $q.dark.isActive
  const textColor = isDark ? '#e5e7eb' : '#334155'
  const mutedColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(100, 116, 139, 0.16)'

  // Base configuration
  const baseConfig = {
    color: palette,
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        color: textColor,
        fontSize: 17,
        fontWeight: 700,
      },
    },
    tooltip: {
      trigger: isPieChart.value ? 'item' : 'axis',
      backgroundColor: isDark ? '#172033' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      textStyle: { color: textColor },
    },
    legend: {
      top: '34px',
      textStyle: { color: mutedColor },
    },
  }

  // For pie charts
  if (isPieChart.value) {
    return {
      ...baseConfig,
      series: props.series.map((item) => ({
        ...item,
        label: {
          color: textColor,
          ...item.label,
        },
      })),
    }
  }

  // For horizontal bar charts
  if (props.horizontal && !isPieChart.value) {
    return {
      ...baseConfig,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: {
        type: 'category',
        data: props.xAxisData,
        axisLabel: {
          color: mutedColor,
          width: 120,
          overflow: 'truncate',
          interval: 0,
        },
        axisLine: { lineStyle: { color: gridColor } },
        axisTick: { show: false },
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: mutedColor },
        splitLine: { lineStyle: { color: gridColor } },
      },
      series: props.series.map((item) => ({
        ...item,
        type: 'bar',
      })),
    }
  }

  // For regular bar/line charts
  return {
    ...baseConfig,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData,
      axisLabel: { color: mutedColor },
      axisLine: { lineStyle: { color: gridColor } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: mutedColor },
      splitLine: { lineStyle: { color: gridColor } },
    },
    series: props.series,
  }
})
</script>

<style scoped>
.echart-container {
  height: 350px;
  width: 100%;
}
.chart {
  height: 100%;
  width: 100%;
}
</style>
