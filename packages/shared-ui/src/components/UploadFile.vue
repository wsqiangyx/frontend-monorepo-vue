<template>
  <t-upload
    :action="action"
    :headers="headers"
    :multiple="multiple"
    :max="max"
    :size-limit="sizeLimit"
    :accept="accept"
    :theme="theme"
    :disabled="disabled"
    :auto-upload="autoUpload"
    :files="modelValue"
    @change="onChange"
    @success="onSuccess"
    @fail="onFail"
  >
    <slot>
      <t-button theme="default" :disabled="disabled">
        <t-icon name="upload" />
        {{ buttonText }}
      </t-button>
    </slot>
  </t-upload>
</template>

<script setup lang="ts">
import type { UploadFile } from 'tdesign-vue-next'

defineOptions({ name: 'UploadFile' })

withDefaults(
  defineProps<{
    modelValue?: UploadFile[]
    action?: string
    headers?: Record<string, string>
    multiple?: boolean
    max?: number
    sizeLimit?: number | { size: number; unit: string }
    accept?: string
    theme?: 'file' | 'image' | 'custom'
    disabled?: boolean
    autoUpload?: boolean
    buttonText?: string
  }>(),
  {
    modelValue: () => [],
    multiple: false,
    max: 5,
    theme: 'file',
    disabled: false,
    autoUpload: true,
    buttonText: '上传文件',
  },
)

const emit = defineEmits<{
  'update:model-value': [files: UploadFile[]]
  success: [response: unknown]
  fail: [error: unknown]
}>()

function onChange(files: UploadFile[]) {
  emit('update:model-value', files)
}

function onSuccess(response: unknown) {
  emit('success', response)
}

function onFail(error: unknown) {
  emit('fail', error)
}
</script>
