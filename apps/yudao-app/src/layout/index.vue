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
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
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
      { value: '/system/notice', label: '通知公告', icon: 'notification' },
      { value: '/system/error-code', label: '错误码管理', icon: 'error-circle' },
      { value: '/system/tenant', label: '租户管理', icon: 'cloud' },
      { value: '/system/tenant-package', label: '租户套餐', icon: 'package' },
      { value: '/system/sms/channel', label: '短信渠道', icon: 'chat' },
      { value: '/system/sms/template', label: '短信模板', icon: 'edit' },
      { value: '/system/sms/log', label: '短信日志', icon: 'time' },
      { value: '/system/mail/account', label: '邮箱账号', icon: 'mail' },
      { value: '/system/mail/template', label: '邮件模板', icon: 'edit' },
      { value: '/system/mail/log', label: '邮件日志', icon: 'time' },
      { value: '/system/operate-log', label: '操作日志', icon: 'browse' },
      { value: '/system/login-log', label: '登录日志', icon: 'login' },
      { value: '/system/oauth2', label: '应用管理', icon: 'app' },
      { value: '/system/online-user', label: '在线用户', icon: 'desktop' },
    ],
  },
  {
    value: '/infra',
    label: '基础设施',
    icon: 'server',
    children: [
      { value: '/infra/codegen', label: '代码生成', icon: 'code' },
      { value: '/infra/file', label: '文件管理', icon: 'folder' },
      { value: '/infra/file-config', label: '文件配置', icon: 'setting' },
      { value: '/infra/job', label: '定时任务', icon: 'time' },
      { value: '/infra/config', label: '配置管理', icon: 'list' },
      { value: '/infra/redis', label: 'Redis 监控', icon: 'chart' },
      { value: '/infra/api-access-log', label: '访问日志', icon: 'browse' },
      { value: '/infra/api-error-log', label: '错误日志', icon: 'error-circle' },
      { value: '/infra/db-doc', label: '数据库文档', icon: 'file' },
      { value: '/infra/swagger', label: '系统接口', icon: 'link' },
    ],
  },
  {
    value: '/bpm',
    label: '工作流',
    icon: 'flow',
    children: [
      { value: '/bpm/model', label: '流程模型', icon: 'chart' },
      { value: '/bpm/form', label: '流程表单', icon: 'file' },
      { value: '/bpm/process-instance', label: '流程实例', icon: 'list' },
      { value: '/bpm/task/todo', label: '我的待办', icon: 'time' },
      { value: '/bpm/task/done', label: '我的已办', icon: 'check-circle' },
      { value: '/bpm/task/manager', label: '全部任务', icon: 'list' },
      { value: '/bpm/category', label: '流程分类', icon: 'folder' },
      { value: '/bpm/user-group', label: '用户分组', icon: 'usergroup' },
      { value: '/bpm/process-listener', label: '流程监听器', icon: 'notification' },
      { value: '/bpm/process-expression', label: '流程表达式', icon: 'code' },
    ],
  },
  {
    value: '/pay',
    label: '支付管理',
    icon: 'money-circle',
    children: [
      { value: '/pay/app', label: '支付应用', icon: 'app' },
      { value: '/pay/channel', label: '支付渠道', icon: 'link' },
      { value: '/pay/order', label: '支付订单', icon: 'order' },
      { value: '/pay/refund', label: '退款订单', icon: 'rollback' },
      { value: '/pay/notify', label: '支付通知', icon: 'notification' },
      { value: '/pay/wallet', label: '钱包管理', icon: 'wallet' },
    ],
  },
  {
    value: '/report',
    label: '数据报表',
    icon: 'chart',
    children: [
      { value: '/report/goview', label: '大屏设计器', icon: 'dashboard' },
      { value: '/report/jmreport', label: '报表设计器', icon: 'file-chart' },
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
