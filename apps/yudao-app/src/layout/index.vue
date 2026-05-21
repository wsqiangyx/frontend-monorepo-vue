<template>
  <t-layout class="admin-layout">
    <t-aside :width="collapsed ? '64px' : '240px'" class="admin-aside">
      <div class="admin-logo">
        <img src="" alt="logo" class="admin-logo__img" />
        <span v-show="!collapsed" class="admin-logo__title">{{ VITE_APP_TITLE }}</span>
      </div>
      <SidebarMenu
        :collapsed="collapsed"
        :menus="menus"
        :active-key="activeMenu"
        @update:active-key="onMenuChange"
      />
    </t-aside>
    <t-layout>
      <t-header class="admin-header">
        <div class="admin-header__left">
          <t-button theme="default" variant="text" @click="appStore.toggleCollapsed()">
            <t-icon :name="collapsed ? 'menu-unfold' : 'menu-fold'" />
          </t-button>
          <Breadcrumb />
        </div>
        <div class="admin-header__right">
          <t-tooltip content="全屏">
            <t-button theme="default" variant="text" @click="toggleFullscreen">
              <t-icon name="fullscreen" />
            </t-button>
          </t-tooltip>
          <t-dropdown :options="langOptions" @click="onLangChange">
            <t-button theme="default" variant="text">
              <t-icon name="translate" />
            </t-button>
          </t-dropdown>
          <UserInfo />
        </div>
      </t-header>
      <TagsView />
      <t-content class="admin-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import SidebarMenu from './components/SidebarMenu.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import TagsView from './components/TagsView.vue'
import UserInfo from './components/UserInfo.vue'
import type { SidebarMenuItem } from '@repo/shared-ui'

defineOptions({ name: 'MainLayout' })

const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const appStore = useAppStore()

const collapsed = computed(() => appStore.collapsed)

const menus = computed<SidebarMenuItem[]>(() => [
  { value: '/home', label: '首页', icon: 'home' },
  {
    value: '/system',
    label: '系统管理',
    icon: 'setting',
    children: [
      { value: '/system/user', label: '用户管理', icon: 'user' },
      { value: '/system/role', label: '角色管理', icon: 'usergroup' },
      { value: '/system/menu', label: '菜单管理', icon: 'list' },
      { value: '/system/dept', label: '部门管理', icon: 'organization' },
      { value: '/system/post', label: '岗位管理', icon: 'bookmark' },
      { value: '/system/dict', label: '字典管理', icon: 'file' },
    ],
  },
])

const activeMenu = computed(() => route.path)

function onMenuChange(key: string) {
  router.push(key)
}

const langOptions = [
  { content: '中文', value: 'zh-CN' },
  { content: 'English', value: 'en-US' },
]

function onLangChange({ value }: { value: string }) {
  locale.value = value
  appStore.setLocale(value as 'zh-CN' | 'en-US')
  localStorage.setItem('repo-locale', value)
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.admin-aside {
  overflow-y: auto;
  border-right: 1px solid var(--component-border);
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  height: 56px;
  overflow: hidden;
}

.admin-logo__img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.admin-logo__title {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
  border-bottom: 1px solid var(--component-border);
}

.admin-header__left,
.admin-header__right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.admin-content {
  padding: 16px;
  overflow-y: auto;
  background: var(--color-bg-page);
}
</style>
