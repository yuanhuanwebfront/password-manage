<template>
  <scroll-view scroll-y class="page">
    <view v-if="detail" class="card">
      <view class="header">
        <text class="icon">{{ detail.icon || '🔐' }}</text>
        <view class="title-group">
          <text class="name">{{ detail.name }}</text>
          <text class="account">{{ detail.account }}</text>
        </view>
      </view>

      <view class="line">
        <text class="key">账号</text>
        <view class="value-row">
          <text class="value">{{ detail.account }}</text>
          <t-button size="extra-small" class="text-action-btn" variant="text" theme="primary" @tap="copyText(detail.account)">复制</t-button>
        </view>
      </view>

      <view class="line">
        <text class="key">密码</text>
        <view class="value-row">
          <text class="value">{{ showPassword ? detail.password : '••••••••' }}</text>
          <t-button size="extra-small" class="text-action-btn" variant="text" theme="primary" @tap="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </t-button>
          <t-button size="extra-small" class="text-action-btn" variant="text" theme="primary" @tap="copyText(detail.password)">复制</t-button>
        </view>
      </view>

      <view class="line">
        <text class="key">URL</text>
        <text class="link" @tap="openUrl(detail.url)">{{ detail.url || '-' }}</text>
      </view>

      <view class="line">
        <text class="key">标签</text>
        <view class="tag-list">
          <text v-for="tag in detail.tags" :key="tag" class="tag">{{ tag }}</text>
          <text v-if="!detail.tags.length" class="value">-</text>
        </view>
      </view>

      <view class="line">
        <text class="key">备注</text>
        <text class="value note">{{ detail.note || '-' }}</text>
      </view>

      <view class="line">
        <text class="key">创建时间</text>
        <text class="value">{{ formatDateTime(detail.created_at) }}</text>
      </view>

      <view class="line">
        <text class="key">更新时间</text>
        <text class="value">{{ formatDateTime(detail.updated_at) }}</text>
      </view>

      <view class="footer">
        <t-button theme="primary" @tap="goEdit">编辑</t-button>
        <t-button theme="danger" variant="outline" @tap="confirmDelete">删除</t-button>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { deletePasswordItem, getPasswordItemById } from '@/database/password-service'
import { formatDateTime } from '@/utils/time'

const itemId = ref(0)
const detail = ref(null)
const showPassword = ref(false)

async function loadDetail() {
  detail.value = await getPasswordItemById(itemId.value)
}

function copyText(text) {
  uni.setClipboardData({ data: String(text || '') })
}

function goEdit() {
  uni.navigateTo({ url: `/pages/edit-page/edit-page?id=${itemId.value}` })
}

function openUrl(url) {
  if (!url) {
    return
  }
  if (typeof plus !== 'undefined' && plus.runtime) {
    plus.runtime.openURL(url)
    return
  }
  uni.setClipboardData({ data: url })
  uni.showToast({ title: '已复制URL', icon: 'none' })
}

function confirmDelete() {
  uni.showModal({
    title: '删除确认',
    content: '删除后不可恢复，确认删除吗？',
    success: async (result) => {
      if (!result.confirm) {
        return
      }
      await deletePasswordItem(itemId.value)
      uni.showToast({ title: '删除成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 300)
    }
  })
}

onLoad((query) => {
  itemId.value = Number(query?.id || 0)
})

onShow(() => {
  if (!itemId.value) {
    return
  }
  loadDetail()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3f4f6;
}

.card {
  margin: 16px;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 18rpx;
}

.icon {
  font-size: 46rpx;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
}

.account {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.line {
  margin-bottom: 20rpx;
  padding: 18rpx 0;
  border-bottom: 1px solid #eef2f7;
}

.line:last-of-type {
  border-bottom: 0;
}

.key {
  display: block;
  margin-bottom: 8rpx;
  color: #374151;
  font-size: 32rpx;
  font-weight: 700;
}

.value-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.value {
  font-size: 26rpx;
  color: #111827;
}

.link {
  color: #2563eb;
  word-break: break-all;
  font-size: 26rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.tag {
  font-size: 20rpx;
  color: #0f766e;
  background: #ccfbf1;
  border-radius: 999rpx;
  padding: 4rpx 10rpx;
}

.note {
  white-space: pre-wrap;
}

.footer {
  margin-top: 18rpx;
  display: flex;
  justify-content: flex-start;
}

.text-action-btn {
  --td-button-extra-small-padding-horizontal: 4rpx;
  --td-button-extra-small-height: 48rpx;
  margin: 0;
  padding: 0;
  font-size: 30rpx;
  margin-left: 24rpx;
}
</style>
