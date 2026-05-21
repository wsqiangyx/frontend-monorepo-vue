import type { RouteRecordRaw } from 'vue-router'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    component: () => import('../layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页', icon: 'home', affix: true },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/profile/index.vue'),
        meta: { title: '个人中心', hidden: true },
      },
    ],
  },
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: () => import('../layout/index.vue'),
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('../views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'user' },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('../views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'usergroup' },
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('../views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'list' },
      },
      {
        path: 'dept',
        name: 'SystemDept',
        component: () => import('../views/system/dept/index.vue'),
        meta: { title: '部门管理', icon: 'organization' },
      },
      {
        path: 'post',
        name: 'SystemPost',
        component: () => import('../views/system/post/index.vue'),
        meta: { title: '岗位管理', icon: 'bookmark' },
      },
      {
        path: 'dict',
        name: 'SystemDict',
        component: () => import('../views/system/dict/index.vue'),
        meta: { title: '字典管理', icon: 'file' },
      },
      {
        path: 'notice',
        name: 'SystemNotice',
        component: () => import('../views/system/notice/index.vue'),
        meta: { title: '通知公告', icon: 'notification' },
      },
      {
        path: 'error-code',
        name: 'SystemErrorCode',
        component: () => import('../views/system/errorCode/index.vue'),
        meta: { title: '错误码管理', icon: 'error-circle' },
      },
      {
        path: 'tenant',
        name: 'SystemTenant',
        component: () => import('../views/system/tenant/index.vue'),
        meta: { title: '租户管理', icon: 'cloud' },
      },
      {
        path: 'tenant-package',
        name: 'SystemTenantPackage',
        component: () => import('../views/system/tenantPackage/index.vue'),
        meta: { title: '租户套餐', icon: 'package' },
      },
      {
        path: 'sms/channel',
        name: 'SmsChannel',
        component: () => import('../views/system/sms/channel/index.vue'),
        meta: { title: '短信渠道', icon: 'chat' },
      },
      {
        path: 'sms/template',
        name: 'SmsTemplate',
        component: () => import('../views/system/sms/template/index.vue'),
        meta: { title: '短信模板', icon: 'edit' },
      },
      {
        path: 'sms/log',
        name: 'SmsLog',
        component: () => import('../views/system/sms/log/index.vue'),
        meta: { title: '短信日志', icon: 'time' },
      },
      {
        path: 'mail/account',
        name: 'MailAccount',
        component: () => import('../views/system/mail/account/index.vue'),
        meta: { title: '邮箱账号', icon: 'mail' },
      },
      {
        path: 'mail/template',
        name: 'MailTemplate',
        component: () => import('../views/system/mail/template/index.vue'),
        meta: { title: '邮件模板', icon: 'edit' },
      },
      {
        path: 'mail/log',
        name: 'MailLog',
        component: () => import('../views/system/mail/log/index.vue'),
        meta: { title: '邮件日志', icon: 'time' },
      },
      {
        path: 'operate-log',
        name: 'OperateLog',
        component: () => import('../views/system/operateLog/index.vue'),
        meta: { title: '操作日志', icon: 'browse' },
      },
      {
        path: 'login-log',
        name: 'LoginLog',
        component: () => import('../views/system/loginLog/index.vue'),
        meta: { title: '登录日志', icon: 'login' },
      },
      {
        path: 'oauth2',
        name: 'SystemOAuth2',
        component: () => import('../views/system/oauth2/index.vue'),
        meta: { title: '应用管理', icon: 'app' },
      },
      {
        path: 'online-user',
        name: 'OnlineUser',
        component: () => import('../views/system/onlineUser/index.vue'),
        meta: { title: '在线用户', icon: 'desktop' },
      },
    ],
  },
]
