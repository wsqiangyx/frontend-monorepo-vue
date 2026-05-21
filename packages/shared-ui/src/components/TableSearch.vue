<template>
  <t-form
    ref="formRef"
    :data="modelValue"
    :label-width="labelWidth"
    class="table-search"
    @submit="onSearch"
  >
    <t-row :gutter="16">
      <t-col v-for="item in items" :key="item.field" :span="item.span ?? 6">
        <t-form-item :label="item.label" :name="item.field">
          <t-input
            v-if="item.type === 'input' || !item.type"
            :model-value="modelValue[item.field] as string"
            :placeholder="item.placeholder ?? `请输入${item.label}`"
            clearable
            @update:model-value="(v: string) => onFieldChange(item.field, v)"
          />
          <t-select
            v-else-if="item.type === 'select'"
            :model-value="modelValue[item.field] as string"
            :placeholder="item.placeholder ?? `请选择${item.label}`"
            :options="item.options"
            clearable
            @update:model-value="(v: string) => onFieldChange(item.field, v)"
          />
          <t-date-picker
            v-else-if="item.type === 'date'"
            :model-value="modelValue[item.field] as string"
            clearable
            @update:model-value="(v: string) => onFieldChange(item.field, v)"
          />
          <t-date-range-picker
            v-else-if="item.type === 'daterange'"
            :model-value="modelValue[item.field] as string[]"
            clearable
            @update:model-value="(v: string[]) => onFieldChange(item.field, v)"
          />
        </t-form-item>
      </t-col>
      <t-col :span="6">
        <t-form-item class="table-search__actions">
          <t-button theme="primary" type="submit">搜索</t-button>
          <t-button theme="default" @click="onReset">重置</t-button>
          <slot name="actions" />
        </t-form-item>
      </t-col>
    </t-row>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SelectOption } from 'tdesign-vue-next'

export interface SearchItem {
  field: string
  label: string
  type?: 'input' | 'select' | 'date' | 'daterange'
  placeholder?: string
  options?: SelectOption[]
  span?: number
}

defineOptions({ name: 'TableSearch' })

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, unknown>
    items: SearchItem[]
    labelWidth?: number
  }>(),
  {
    labelWidth: 80,
  },
)

const emit = defineEmits<{
  'update:model-value': [value: Record<string, unknown>]
  search: [value: Record<string, unknown>]
  reset: []
}>()

const formRef = ref()

function onFieldChange(field: string, value: unknown) {
  emit('update:model-value', { ...props.modelValue, [field]: value })
}

function onSearch() {
  emit('search', { ...props.modelValue })
}

function onReset() {
  const resetData: Record<string, unknown> = {}
  for (const item of props.items) {
    resetData[item.field] = undefined
  }
  emit('update:model-value', resetData)
  emit('reset')
}
</script>

<style scoped>
.table-search__actions {
  display: flex;
  gap: 8px;
}
</style>
