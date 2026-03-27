<template>
  <view class="page">
    <view class="content">
      <text class="brand-text">密码管理器</text>
      <view class="panel">
        <text class="welcome">请先设置密码！</text>

        <view class="form-item" v-if="mode === 'verify'">
          <text class="label">邮箱</text>
          <t-input class="input input-muted" value="joedoe75@gmail.com" disabled />
        </view>

        <view class="form-item">
          <text class="label">{{ mode === 'set' ? '设置密码' : '密码' }}</text>
          <t-input
          :value="password"
            class="input"
            type="number"
            :maxlength="6"
            clearable
            placeholder="请输入4-6位数字密码"
          @change="handlePasswordChange"
          />
        </view>

        <view v-if="mode === 'set'" class="form-item">
          <text class="label">确认密码</text>
          <t-input
          :value="confirmPassword"
            class="input"
            type="number"
            :maxlength="6"
            clearable
            placeholder="请再次输入密码"
          @change="handleConfirmPasswordChange"
          />
        </view>

        <view class="assist-row">
          <view class="remember" @tap="rememberMe = !rememberMe">
            <view class="check-box" :class="{ checked: rememberMe }">v</view>
            <text class="assist-text">记住我</text>
          </view>
          <text class="forgot">忘记密码？</text>
        </view>

        <text v-if="errorMessage" class="error">{{ errorMessage }}</text>

        <t-button class="login-btn" theme="primary" block @tap="submitLockPassword">
          {{ mode === 'set' ? '确认' : '登录' }}
        </t-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { initDatabase } from '@/database/init'
import { hasLockPassword, setSetting, verifyLockPassword } from '@/database/settings-repository'
import { useLockStore } from '@/store/lock-store'
import { encodeLockPassword } from '@/utils/crypto'
import { validateLockPassword } from '@/utils/validator'

const mode = ref('verify')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const rememberMe = ref(true)
const lockStore = useLockStore()
let previousBodyOverflow = ''
let previousHtmlOverflow = ''

async function loadLockMode() {
  try {
    await initDatabase()
    const hasPassword = await hasLockPassword()
    mode.value = hasPassword ? 'verify' : 'set'
  } catch (error) {
    errorMessage.value = error?.message || '数据库初始化失败'
  }
}

function clearForm() {
  password.value = ''
  confirmPassword.value = ''
}

function handlePasswordChange(context) {
  password.value = String(context?.detail?.value ?? context?.value ?? '')
}

function handleConfirmPasswordChange(context) {
  confirmPassword.value = String(context?.detail?.value ?? context?.value ?? '')
}

async function submitLockPassword() {
  errorMessage.value = ''
  const lockError = validateLockPassword(password.value)
  if (lockError) {
    errorMessage.value = lockError
    return
  }

  if (mode.value === 'set') {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }

    await setSetting('lock_password', encodeLockPassword(password.value))
    lockStore.setUnlocked(true)
    uni.reLaunch({ url: '/pages/home-page/home-page' })
    return
  }

  const verified = await verifyLockPassword(encodeLockPassword(password.value))
  if (!verified) {
    errorMessage.value = '密码错误，请重试'
    clearForm()
    return
  }

  lockStore.setUnlocked(true)
  uni.reLaunch({ url: '/pages/home-page/home-page' })
}

loadLockMode()

onMounted(() => {
  if (typeof document !== 'undefined') {
    previousBodyOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousHtmlOverflow
  }
})
</script>

<style scoped>
.page {
  height: 100dvh;
  background: #eceef2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.content {
  width: 100%;
  max-width: 640rpx;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-text {
  margin-bottom: 56rpx;
  color: #2f7cec;
  font-size: 54rpx;
  font-weight: 700;
  letter-spacing: 0.5rpx;
}

.panel {
  width: 100%;
  background: #f8f8f8;
  border-radius: 46rpx;
  padding: 52rpx 40rpx 42rpx;
  box-sizing: border-box;
}

.welcome {
  display: block;
  font-size: 50rpx;
  line-height: 1.3;
  color: #171717;
  text-align: center;
  font-weight: 700;
  white-space: pre-line;
  margin-bottom: 42rpx;
}

.form-item {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  color: #282828;
  font-size: 24rpx;
  margin-bottom: 12rpx;
}

.input {
  --td-input-bg-color: #f0f1f4;
  --td-input-border-color: transparent;
  --td-input-placeholder-text-color: #bec3cc;
  --td-input-text-color: #6d7480;
  --td-input-vertical-padding: 16rpx;
  --td-input-horizontal-padding: 22rpx;
  --td-input-font-size: 24rpx;
}

.input :deep(.t-input) {
  border-radius: 999rpx;
}

.input-muted {
  --td-input-text-color: #c5cad2;
}

.assist-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rpx;
  margin-bottom: 26rpx;
}

.remember {
  display: flex;
  align-items: center;
}

.check-box {
  width: 24rpx;
  height: 24rpx;
  border-radius: 6rpx;
  background: #d8dde6;
  color: #fff;
  font-size: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
}

.check-box.checked {
  background: #3f83f8;
}

.assist-text {
  color: #b2b7c1;
  font-size: 24rpx;
}

.forgot {
  color: #80aef4;
  font-size: 24rpx;
}

.error {
  display: block;
  color: #d73b3b;
  font-size: 22rpx;
  margin-bottom: 16rpx;
}

.login-btn {
  --td-button-primary-bg-color: #3f83f8;
  --td-button-primary-border-color: #3f83f8;
  --td-button-primary-active-bg-color: #2f74ee;
  --td-button-primary-active-border-color: #2f74ee;
  --td-button-default-height: 72rpx;
  --td-button-default-font-size: 28rpx;
  border-radius: 999rpx;
  overflow: hidden;
}

.divider-text {
  display: block;
  text-align: center;
  color: #b2b7c1;
  font-size: 24rpx;
  margin: 34rpx 0 24rpx;
}

.social-row {
  display: flex;
  justify-content: center;
  gap: 20rpx;
}

.social-item {
  width: 76rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: #f1f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-text {
  font-size: 36rpx;
  color: #3a3d43;
  font-weight: 600;
}
</style>

<style>
page {
  height: 100%;
  overflow: hidden;
}
</style>
