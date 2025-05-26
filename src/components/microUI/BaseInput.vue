<template>
  <div class="base-input-group">
    <label v-if="label" class="base-label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $attrs.type === 'number' ? Number($event.target.value) : $event.target.value)"
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
defineEmits(['update:modelValue']);
</script>

<style scoped>
.base-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.base-label {
  font-weight: 500;
  font-size: 0.95rem;
  color: #2c3e50;
}

.base-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  width: 100%;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.base-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}
</style>