<template>
  <t-dialog v-model:visible="visible" header="代码预览" width="80%" :footer="false">
    <div v-loading="loading" class="flex gap-4" style="min-height: 400px">
      <!-- 文件目录树 -->
      <t-card class="w-1/3" :bordered="false" style="overflow: auto; max-height: 600px">
        <t-tree
          :data="fileTree"
          :expand-all="true"
          :activable="true"
          :hover="true"
          @click="handleNodeClick"
        />
      </t-card>
      <!-- 代码内容 -->
      <t-card class="w-2/3" :bordered="false" style="overflow: auto; max-height: 600px">
        <t-tabs v-model="activeName">
          <t-tab-panel
            v-for="item in previewList"
            :key="item.filePath"
            :value="item.filePath"
            :label="item.filePath.split('/').pop()"
          >
            <div class="mt-2">
              <t-button class="mb-2" size="small" variant="text" theme="primary" @click="copyCode(item.code)">
                复制
              </t-button>
              <pre class="overflow-auto" style="max-height: 500px; background: #f5f5f5; padding: 16px; border-radius: 4px"><code>{{ item.code }}</code></pre>
            </div>
          </t-tab-panel>
        </t-tabs>
      </t-card>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const visible = ref(false)
const loading = ref(false)
const activeName = ref('')
const previewList = ref<Array<{ filePath: string; code: string }>>([])
const fileTree = ref<Array<Record<string, unknown>>>([])

interface FileNode {
  label: string
  value: string
  children?: FileNode[]
}

function buildFileTree(files: Array<{ filePath: string; code: string }>): FileNode[] {
  const root: FileNode[] = []
  const map = new Map<string, FileNode>()

  for (const file of files) {
    const parts = file.filePath.split('/')
    let currentPath = ''
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (!map.has(currentPath)) {
        const node: FileNode = { label: part, value: currentPath }
        map.set(currentPath, node)
        if (i === 0) {
          root.push(node)
        } else {
          const parent = map.get(parentPath)
          if (parent) {
            if (!parent.children) parent.children = []
            parent.children.push(node)
          }
        }
      }
    }
  }

  return root
}

async function open(id: number) {
  visible.value = true
  loading.value = true
  try {
    const res = await fetch(`/api/infra/codegen/preview?tableId=${id}`)
    const json = await res.json()
    if (json.success) {
      previewList.value = json.data ?? []
      fileTree.value = buildFileTree(previewList.value)
      if (previewList.value.length > 0) {
        activeName.value = previewList.value[0].filePath
      }
    }
  } catch {
    MessagePlugin.error('加载预览失败')
  } finally {
    loading.value = false
  }
}

function handleNodeClick(node: { value: string; isLeaf?: boolean }) {
  const match = previewList.value.find((p) => p.filePath === node.value)
  if (match) {
    activeName.value = match.filePath
  }
}

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    MessagePlugin.success('复制成功')
  } catch {
    MessagePlugin.error('复制失败')
  }
}

defineExpose({ open })
</script>
