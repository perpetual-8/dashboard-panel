<template>
  <div class="base-select-group">
    <label v-if="label" class="base-label">{{ label }}</label>
    <div class="select-wrapper" :class="{ 'is-invalid': invalid }">
      <select
        v-bind="$attrs"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="base-select"
      >
        <slot />
      </select>
      <span class="arrow"></span>
    </div>
  </div>
</template>


<script setup>
defineProps({
  label: String,
  invalid: Boolean,
  modelValue: [String, Number], 
});
defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
$color-text: #2c3e50; //dif

.base-select-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.base-label {
  font-weight: 500;
  font-size: 0.95rem;
  color: $color-text;
}

.select-wrapper {
  position: relative;
  display: inline-block;

  &.is-invalid select {
    border-color: $color-error;
  }

  .arrow {
    content: "";
    position: absolute;
    top: 50%;
    right: 0.75rem;
    pointer-events: none;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid $color-text;
    transform: translateY(-50%);
    transition: transform 0.3s ease;
  }

  select:focus + .arrow {
    transform: translateY(-50%) rotate(180deg);
  }
}

.base-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid $color-border;
  border-radius: $border-radius;
  width: 100%;
  font-size: $font-size-base;
  background-color: $color-bg;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: $color-focus;
    box-shadow: 0 0 0 2px rgba($color-focus, 0.25);
  }
}

</style>
