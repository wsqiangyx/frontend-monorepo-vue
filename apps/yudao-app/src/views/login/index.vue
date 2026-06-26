<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-left__content">
        <h1 class="login-left__title">{{ VITE_APP_TITLE }}</h1>
        <p class="login-left__desc">芋道 Vue3 管理后台迁移版</p>
      </div>
    </div>
    <div class="login-right">
      <div class="login-card">
        <h2 class="login-card__title">账号登录</h2>
        <t-form
          ref="formRef"
          :data="formData"
          :rules="rules"
          label-width="0"
          @submit="handleLogin"
        >
          <t-form-item name="username">
            <t-input
              v-model="formData.username"
              placeholder="请输入用户名"
              size="large"
              clearable
            >
              <template #prefix-icon>
                <t-icon name="user" />
              </template>
            </t-input>
          </t-form-item>
          <t-form-item name="password">
            <t-input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              size="large"
            >
              <template #prefix-icon>
                <t-icon name="lock-on" />
              </template>
              <template #suffix>
                <t-icon
                  :name="showPassword ? 'browse' : 'browse-off'"
                  class="login-password-toggle"
                  @click="showPassword = !showPassword"
                />
              </template>
            </t-input>
          </t-form-item>
          <t-form-item>
            <div class="login-options">
              <t-checkbox v-model="rememberMe">记住密码</t-checkbox>
              <t-link theme="primary" hover="color">忘记密码？</t-link>
            </div>
          </t-form-item>
          <t-form-item>
            <t-button
              theme="primary"
              size="large"
              block
              :loading="loading"
              type="submit"
            >
              登录
            </t-button>
          </t-form-item>
        </t-form>
        <div class="login-other">
          <t-divider align="center">
            <span class="login-other__text">其他登录方式</span>
          </t-divider>
          <div class="login-other__icons">
            <t-button theme="default" variant="text" shape="circle">
              <t-icon name="logo-github" size="20px" />
            </t-button>
            <t-button theme="default" variant="text" shape="circle">
              <t-icon name="logo-wechat" size="20px" />
            </t-button>
            <t-button theme="default" variant="text" shape="circle">
              <t-icon name="logo-qq" size="20px" />
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'LoginPage' })

const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(true)

const formData = reactive({
  username: 'admin',
  password: 'admin123',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, message: '密码至少5个字符', trigger: 'blur' },
  ],
}

onMounted(() => {
  // 从缓存恢复记住的登录信息
  const saved = localStorage.getItem('login_remember')
  if (saved) {
    try {
      const { username, password } = JSON.parse(saved)
      formData.username = username || 'admin'
      formData.password = password || 'admin123'
    } catch {}
  }
})

async function handleLogin({ validateResult }: { validateResult: boolean }) {
  if (!validateResult) return

  loading.value = true
  try {
    await userStore.login(formData)

    if (rememberMe.value) {
      localStorage.setItem(
        'login_remember',
        JSON.stringify({ username: formData.username, password: formData.password }),
      )
    } else {
      localStorage.removeItem('login_remember')
    }

    ElMessage.success('登录成功')
    router.push('/')
  } catch {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
}

.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-hover) 100%);
  color: #fff;
}

.login-left__content {
  text-align: center;
}

.login-left__title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
}

.login-left__desc {
  font-size: 16px;
  opacity: 0.85;
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 480px;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 360px;
}

.login-card__title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.login-password-toggle {
  cursor: pointer;
}

.login-other {
  margin-top: 24px;
}

.login-other__text {
  font-size: 12px;
  color: var(--color-text-placeholder);
}

.login-other__icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .login-left {
    display: none;
  }
  .login-right {
    width: 100%;
  }
}
</style>
