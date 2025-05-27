<template>
  <div class="base-input-group">
    <label v-if="label" class="base-label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="
        $emit(
          'update:modelValue',
          $attrs.type === 'number'
            ? Number($event.target.value)
            : $event.target.value
        )
      "
      class="base-input"
      :class="{ 'is-invalid': invalid }"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  invalid: Boolean,
  modelValue: [String, Number], // Support both String and Number
});
defineEmits(["update:modelValue"]);
</script>
<style scoped lang="scss">
$color-text: #2c3e50;

.base-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.base-label {
  font-weight: 500;
  font-size: $font-size-label;
  color: $text-color;
}

.base-input {
  padding: 0.4rem 0.75rem;
  border: 1px solid $color-border;
  border-radius: $border-radius;
  width: 100%;
  font-size: $font-size-base;
  background-color: $color-bg;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: $color-focus;
    box-shadow: 0 0 0 2px rgba($color-focus, 0.25);
  }

  &.is-invalid {
    border-color: $color-error;
  }
}
</style>
