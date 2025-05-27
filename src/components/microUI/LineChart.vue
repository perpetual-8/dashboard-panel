<template>
  <div class="chart-container">
    <div class="chart-header">
      <h6 class="chart-title">{{ title }}</h6>
      <div class="chart-controls">
        <span :class="trendClass" class="trend-indicator">{{ trend }}</span>
        <div class="time-filter-buttons" v-if="showTimeFilters">
          <button
            v-for="period in timePeriods"
            :key="period"
            @click="setTimePeriod(period)"
            :class="['filter-btn', { active: selectedPeriod === period }]"
          >
            {{ period }}
          </button>
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <Line :data="filteredChartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const props = defineProps({
  title: String,
  trend: String,
  showTimeFilters: {
    type: Boolean,
    default: true,
  },
  chartType: {
    type: String,
    default: "default",
  },
});

const selectedPeriod = ref("Monthly");
const timePeriods = ["Daily", "Weekly", "Monthly", "Annually"];

const trendClass = computed(() =>
  props.trend?.startsWith("+") ? "trend-positive" : "trend-negative"
);

// Sample data for different time periods
const chartDataSets = {
  Daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [45, 52, 48, 61, 58, 65, 72],
  },
  Weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [320, 380, 350, 420],
  },
  Monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    data: [30, 50, 40, 60, 80, 70, 90],
  },
  Annually: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    data: [2800, 3200, 2900, 3800, 4200],
  },
};

const getChartColor = () => {
  switch (props.chartType) {
    case "revenue":
      return { border: "#28a745", bg: "rgba(40, 167, 69, 0.1)" };
    case "orders":
      return { border: "#007bff", bg: "rgba(0, 123, 255, 0.1)" };
    case "inventory":
      return { border: "#ffc107", bg: "rgba(255, 193, 7, 0.1)" };
    default:
      return { border: "#4CAF50", bg: "rgba(76, 175, 80, 0.1)" };
  }
};

const filteredChartData = computed(() => {
  const periodData = chartDataSets[selectedPeriod.value];
  const colors = getChartColor();

  return {
    labels: periodData.labels,
    datasets: [
      {
        label: props.title,
        data: periodData.data,
        borderColor: colors.border,
        backgroundColor: colors.bg,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.border,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#4CAF50",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: function (context) {
          return `${selectedPeriod.value}: ${context[0].label}`;
        },
        label: function (context) {
          const value =
            typeof context.parsed.y === "number"
              ? context.parsed.y.toLocaleString()
              : context.parsed.y;
          return `${props.title}: ${value}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        color: "#6c757d",
        font: { size: 12 },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        color: "#6c757d",
        font: { size: 12 },
        callback: function (value) {
          return typeof value === "number" ? value.toLocaleString() : value;
        },
      },
    },
  },
};

const setTimePeriod = (period) => {
  selectedPeriod.value = period;
};
</script>

<style lang="scss" scoped>
$success-color: #28a745;
$danger-color: #dc3545;
$light-gray: #f8f9fa;
$border-color: #e9ecef;
$text-muted: #6c757d;

$radius: 0.375rem;
$font-weight-semibold: 600;

$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;

$box-shadow-hover: 0 4px 15px rgba(0, 0, 0, 0.1);
$box-shadow-active: 0 2px 4px rgba($primary-color, 0.3);

.chart-container {
  background: #fff;
  border-radius: 12px;
  border: 1px solid $border-color;
  padding: $spacing-lg;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: $box-shadow-hover;
    border-color: $color-primary;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;
    flex-wrap: wrap;
    gap: $spacing-md;

    .chart-title {
      font-size: 1.1rem;
      font-weight: $font-weight-semibold;
      color: #2c3e50;
      margin: 0;
    }

    .chart-controls {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      flex-wrap: wrap;
    }

    .trend-indicator {
      font-size: 0.875rem;
      font-weight: $font-weight-semibold;
      padding: $spacing-xs $spacing-sm;
      border-radius: 20px;

      &.trend-positive {
        color: $success-color;
        background-color: rgba($success-color, 0.1);
      }

      &.trend-negative {
        color: $danger-color;
        background-color: rgba($danger-color, 0.1);
      }
    }

    .time-filter-buttons {
      display: flex;
      gap: $spacing-xs;
      background: $light-gray;
      padding: $spacing-xs;
      border-radius: 8px;

      .filter-btn {
        background: transparent;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
        color: $text-muted;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #fff;
          color: $color-primary;
        }

        &.active {
          background: $color-primary;
          color: #fff;
          box-shadow: $box-shadow-active;
        }
      }
    }
  }

  .chart-wrapper {
    height: 250px;
    position: relative;
  }

  @include respond-below(md) {
    padding: $spacing-md;

    .chart-header {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-sm;

      .chart-controls {
        width: 100%;
        justify-content: space-between;
      }

      .time-filter-buttons {
        .filter-btn {
          padding: 0.4rem 0.75rem;
          font-size: 0.7rem;
        }
      }
    }

    .chart-wrapper {
      height: 200px;
    }
  }
}
</style>
