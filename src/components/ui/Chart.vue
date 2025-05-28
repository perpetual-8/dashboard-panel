 <template>
  <div class="chart-container">
    <div class="chart-header d-flex justify-content-between align-items-center mb-3">
      <div>
        <h6 class="chart-title mb-1">{{ title }}</h6>
        <small class="text-muted">{{ subtitle }}</small>
      </div>
      <div class="chart-trend" :class="trendClass">
        <i :class="trendIcon"></i>
        {{ trend }}
      </div>
    </div>
    <div class="chart-wrapper">
      <select v-model="timeRange" class="form-select mb-3" style="width: 150px;">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <div class="canvas-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  title: String,
  subtitle: String,
  trend: String,
  data: Array,
  chartType: {
    type: String,
    default: 'line',
    validator: value => ['line', 'bar', 'area'].includes(value)
  },
  analysisType: {
    type: String,
    required: true,
    validator: value => ['revenue', 'orders', 'profit', 'expenses'].includes(value)
  },
  height: {
    type: Number,
    default: 300
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  colors: {
    type: Array,
    default: () => [
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)'
    ]
  }
})

const chartCanvas = ref(null)
let chartInstance = null
const timeRange = ref('monthly')

const trendClass = computed(() => {
  if (!props.trend) return ''
  const isPositive = props.trend.includes('+')
  return isPositive ? 'text-success' : 'text-danger'
})

const trendIcon = computed(() => {
  if (!props.trend) return ''
  const isPositive = props.trend.includes('+')
  return isPositive ? 'bi bi-arrow-up' : 'bi bi-arrow-down'
})

const processedData = computed(() => {
  if (!props.data || props.data.length === 0) return null
  const categories = props.data.map(item => item.category)
  const datasets = categories.map((category, index) => {
    const categoryData = props.data[index].data
    const filteredData = categoryData.filter(item => {
      if (timeRange.value === 'daily') return item.period.match(/^\d{4}-\d{2}-\d{2}$/)
      if (timeRange.value === 'weekly') return item.period.includes('Week')
      if (timeRange.value === 'monthly') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].includes(item.period)
      return false
    })
    let values = []
    switch (props.analysisType) {
      case 'revenue': values = filteredData.map(item => item.revenue); break
      case 'orders': values = filteredData.map(item => item.receivedOrders); break
      case 'profit': values = filteredData.map(item => item.profit); break
      case 'expenses': values = filteredData.map(item => item.expenses); break
      default: values = filteredData.map(item => item.revenue)
    }
    const color = props.colors[index % props.colors.length]
    return {
      label: category,
      data: values,
      borderColor: color,
      backgroundColor: props.chartType === 'area' ? color.replace('0.8', '0.2') : color,
      fill: props.chartType === 'area',
      tension: 0.4,
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  })
  const periods = props.data[0]?.data
    ?.filter(item => {
      if (timeRange.value === 'daily') return item.period.match(/^\d{4}-\d{2}-\d{2}$/)
      if (timeRange.value === 'weekly') return item.period.includes('Week')
      if (timeRange.value === 'monthly') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].includes(item.period)
      return false
    })
    .map(item => item.period) || []
  return { labels: periods, datasets }
})

const chartConfig = computed(() => ({
  type: props.chartType === 'area' ? 'line' : props.chartType,
  data: processedData.value,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: props.showLegend,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            const prefix = ['revenue', 'profit', 'expenses'].includes(props.analysisType) ? '$' : ''
            return `${label}: ${prefix}${value.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time Period',
          font: { weight: 'bold' }
        },
        grid: { display: false }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: getYAxisLabel(),
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        ticks: {
          callback: function (value) {
            const prefix = ['revenue', 'profit', 'expenses'].includes(props.analysisType) ? '$' : ''
            return `${prefix}${value.toLocaleString()}`
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: { hoverRadius: 8 }
    }
  }
}))

function getYAxisLabel() {
  switch (props.analysisType) {
    case 'revenue': return 'Revenue ($)'
    case 'orders': return 'Number of Orders'
    case 'profit': return 'Profit ($)'
    case 'expenses': return 'Expenses ($)'
    default: return 'Value'
  }
}

function createChart() {
  if (chartInstance) chartInstance.destroy()
  if (chartCanvas.value && processedData.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, chartConfig.value)
  }
}

function updateChart() {
  if (chartInstance && processedData.value) {
    chartInstance.data = processedData.value
    chartInstance.options = chartConfig.value.options
    chartInstance.update('active')
  }
}

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})

watch(
  [() => props.data, () => props.analysisType, () => props.chartType],
  () => updateChart(),
  { deep: true }
)

watch(() => timeRange.value, () => updateChart())
</script>

<style lang="scss" scoped>
.chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.chart-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.chart-trend {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;

  &.text-success {
    background-color: rgba(40, 167, 69, 0.1);
  }

  &.text-danger {
    background-color: rgba(220, 53, 69, 0.1);
  }
}

.chart-wrapper {
  width: 100%;
  max-width: 100%;
  margin-top: 15px;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: v-bind('`${height}px`');
  max-width: 100%;
  overflow: hidden;

  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
    width: 100% !important;
    height: 100% !important;
  }
}

// Utility classes
.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-muted {
  color: #6c757d !important;
}

.d-flex {
  display: flex !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.align-items-center {
  align-items: center !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.form-select {
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  appearance: none;
}
</style>
