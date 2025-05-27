<template>
  <div class="stat-card" @click="handleClick" :class="{ clickable: clickable }">
    <div class="card-body">
      <div class="card-header">
        <div class="icon-wrapper" v-if="icon">
          <i :class="icon" class="stat-icon"></i>
        </div>
        <span v-if="trend" :class="trendClass" class="trend-badge">{{
          trend
        }}</span>
      </div>
      <h6 class="card-subtitle">{{ title }}</h6>
      <h3 class="stat-value">{{ formattedValue }}</h3>
      <div v-if="subtitle" class="subtitle-container">
        <small class="subtitle-text">{{ subtitle }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  value: [String, Number],
  trend: String,
  subtitle: String,
  icon: String,
  type: {
    type: String,
    default: "default",
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const trendClass = computed(() => {
  if (!props.trend) return "";
  return props.trend.startsWith("+") ? "trend-positive" : "trend-negative";
});

const formattedValue = computed(() => {
  if (typeof props.value === "number") {
    if (props.type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(props.value);
    }
    return props.value.toLocaleString();
  }
  return props.value;
});

const handleClick = () => {
  if (props.clickable) {
    emit("click");
  }
};
</script>

<style lang="scss" scoped>
$primary-dark: #0056b3;
$success-color: #28a745;
$danger-color: #dc3545;
$light-gray: #f8f9fa;
$border-color: #e9ecef;
$text-muted: #6c757d;

.stat-card {
  background: white;
  border-radius: 12px;
  border: 1px solid $border-color;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  padding: 1.5rem;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $primary-color, $primary-dark);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.clickable {
    cursor: pointer;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: $color-primary;

    &:before {
      opacity: 1;
    }

    .icon-wrapper {
      transform: scale(1.05);
    }

    .stat-value {
      color: $color-primary;
    }
  }

  .card-body {
    padding: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, $primary-color, $primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;

    .stat-icon {
      color: white;
      font-size: 20px;
    }
  }

  .trend-badge {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
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

  .card-subtitle {
    color: $text-muted;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    transition: color 0.3s ease;
  }

  .subtitle-container {
    .subtitle-text {
      color: $text-muted;
      font-size: 0.75rem;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .stat-card {
    padding: 1rem;

    .stat-value {
      font-size: 1.75rem;
    }

    .icon-wrapper {
      width: 40px;
      height: 40px;

      .stat-icon {
        font-size: 18px;
      }
    }
  }
}
</style>
