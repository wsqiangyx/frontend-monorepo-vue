<template>
  <div class="tags-view">
    <div class="tags-view__scroll" ref="scrollContainer">
      <t-tag
        v-for="tag in visitedViews"
        :key="tag.path"
        :theme="isActive(tag) ? 'primary' : 'default'"
        :closable="!tag.affix"
        class="tags-view__item"
        @click="toTag(tag)"
        @close="closeTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
      </t-tag>
    </div>
    <t-dropdown
      v-model:visible="menuVisible"
      :options="menuOptions"
      :popup-props="{ overlayInnerStyle: { padding: '4px 0' } }"
      @click="onMenuClick"
    >
      <div
        v-show="menuVisible"
        class="tags-view__context-menu"
        :style="{ left: menuLeft + 'px', top: menuTop + 'px' }"
      />
    </t-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'TagsView' })

interface TagView {
  path: string
  title: string
  affix?: boolean
}

const route = useRoute()
const router = useRouter()

const visitedViews = ref<TagView[]>([
  { path: '/', title: '首页', affix: true },
])

const menuVisible = ref(false)
const menuLeft = ref(0)
const menuTop = ref(0)
const selectedTag = ref<TagView | null>(null)

const menuOptions = [
  { content: '刷新当前页', value: 'refresh' },
  { content: '关闭当前', value: 'close' },
  { content: '关闭其他', value: 'closeOthers' },
  { content: '关闭所有', value: 'closeAll' },
]

function isActive(tag: TagView): boolean {
  return tag.path === route.path
}

function toTag(tag: TagView) {
  router.push(tag.path)
}

function addView() {
  const { path, meta } = route
  if (!path || path === '/login') return
  const exists = visitedViews.value.some((v) => v.path === path)
  if (!exists) {
    visitedViews.value.push({
      path,
      title: (meta?.title as string) || '未命名',
      affix: meta?.affix as boolean,
    })
  }
}

function closeTag(tag: TagView) {
  if (tag.affix) return
  const index = visitedViews.value.findIndex((v) => v.path === tag.path)
  if (index === -1) return
  visitedViews.value.splice(index, 1)
  if (isActive(tag)) {
    const last = visitedViews.value[visitedViews.value.length - 1]
    if (last) {
      router.push(last.path)
    } else {
      router.push('/')
    }
  }
}

function openMenu(tag: TagView, e: MouseEvent) {
  menuLeft.value = e.clientX
  menuTop.value = e.clientY
  selectedTag.value = tag
  menuVisible.value = true
}

function onMenuClick({ value }: { value: string }) {
  if (!selectedTag.value) return
  switch (value) {
    case 'refresh':
      router.replace({ path: '/redirect' + selectedTag.value.path })
      break
    case 'close':
      closeTag(selectedTag.value)
      break
    case 'closeOthers':
      visitedViews.value = visitedViews.value.filter(
        (v) => v.affix || v.path === selectedTag.value!.path,
      )
      if (!isActive(selectedTag.value)) {
        router.push(selectedTag.value.path)
      }
      break
    case 'closeAll':
      visitedViews.value = visitedViews.value.filter((v) => v.affix)
      router.push('/')
      break
  }
  menuVisible.value = false
}

watch(
  () => route.path,
  () => {
    nextTick(addView)
  },
  { immediate: true },
)

// 点击其他区域关闭右键菜单
document.addEventListener('click', () => {
  menuVisible.value = false
})
</script>

<style scoped>
.tags-view {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 36px;
  border-bottom: 1px solid var(--component-border);
  background: var(--color-bg-container);
}

.tags-view__scroll {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  flex: 1;
}

.tags-view__item {
  cursor: pointer;
  flex-shrink: 0;
}

.tags-view__context-menu {
  position: fixed;
  z-index: 3000;
}

.tags-view__scroll::-webkit-scrollbar {
  display: none;
}
</style>
