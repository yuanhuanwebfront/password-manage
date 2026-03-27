<template>
  <scroll-view scroll-y class="page">
    <view class="card">
      <view class="field">
        <text class="label">名称 *</text>
        <input v-model="form.name" class="input" placeholder="如：GitHub" />
        <text v-if="errors.name" class="error">{{ errors.name }}</text>
      </view>

      <view class="field">
        <text class="label">账号 *</text>
        <view class="row">
          <input v-model="form.account" class="input flex" placeholder="账号" />
          <t-button size="extra-small" class="text-action-btn" variant="text" theme="primary" @tap="copyText(form.account)">复制</t-button>
        </view>
        <text v-if="errors.account" class="error">{{ errors.account }}</text>
      </view>

      <view class="field">
        <text class="label">密码 *</text>
        <view class="row">
          <input
            v-model="form.password"
            class="input flex"
            :password="!showPassword"
            placeholder="密码"
          />
          <t-button size="extra-small" class="text-action-btn" variant="text" theme="primary" @tap="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </t-button>
          <t-button size="extra-small" class="text-action-btn" variant="text" theme="primary" @tap="copyText(form.password)">复制</t-button>
        </view>
        <text v-if="errors.password" class="error">{{ errors.password }}</text>
      </view>

      <view class="field">
        <text class="label">网站地址</text>
        <input v-model="form.url" class="input" placeholder="https://example.com" />
      </view>

      <view class="field">
        <text class="label">图标</text>
        <input v-model="form.icon" class="input" placeholder="例如：🔒" />
      </view>

      <view class="field">
        <text class="label">分类</text>
        <picker :range="categoryOptions" range-key="name" :value="categoryIndex" @change="handleCategoryChange">
          <view class="picker">{{ categoryOptions[categoryIndex]?.name || '请选择分类' }}</view>
        </picker>
      </view>

      <view class="field">
        <text class="label">备注</text>
        <textarea v-model="form.note" class="textarea" placeholder="补充信息"></textarea>
      </view>

      <t-button theme="primary" block @tap="submitForm">{{ isEdit ? '保存修改' : '创建记录' }}</t-button>
    </view>
  </scroll-view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createPasswordItem, getPasswordItemById, updatePasswordItem } from '@/database/password-service'
import { listCategories } from '@/database/category-repository'
import { validatePasswordItemForm } from '@/utils/validator'

const itemId = ref(0)
const categoryOptions = ref([{ id: 0, name: '未分类' }])
const categoryIndex = ref(0)
const showPassword = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  account: '',
  password: '',
  url: '',
  note: '',
  icon: '🔐',
  categoryId: 0,
  tags: []
})

const isEdit = computed(() => itemId.value > 0)

async function loadCategories() {
  const categories = await listCategories()
  categoryOptions.value = [{ id: 0, name: '未分类' }, ...categories]
}

function syncCategoryIndex() {
  const index = categoryOptions.value.findIndex((item) => Number(item.id) === Number(form.value.categoryId))
  categoryIndex.value = index < 0 ? 0 : index
}

function handleCategoryChange(event) {
  categoryIndex.value = Number(event.detail.value || 0)
  form.value.categoryId = categoryOptions.value[categoryIndex.value].id
}

function copyText(content) {
  uni.setClipboardData({ data: String(content || '') })
}

async function loadDetail(id) {
  const detail = await getPasswordItemById(id)
  if (!detail) {
    uni.showToast({ title: '数据不存在', icon: 'none' })
    uni.navigateBack()
    return
  }
  form.value = {
    name: detail.name || '',
    account: detail.account || '',
    password: detail.password || '',
    url: detail.url || '',
    note: detail.note || '',
    icon: detail.icon || '🔐',
    categoryId: Number(detail.category_id || 0),
    tags: Array.isArray(detail.tags) ? detail.tags : []
  }
  syncCategoryIndex()
}

async function submitForm() {
  form.value.tags = []
  const newErrors = validatePasswordItemForm(form.value)
  errors.value = newErrors
  if (Object.keys(newErrors).length) {
    return
  }
  if (isEdit.value) {
    await updatePasswordItem(itemId.value, form.value)
  } else {
    await createPasswordItem(form.value)
  }
  uni.showToast({ title: '保存成功', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}

onLoad(async (query) => {
  await loadCategories()
  if (query?.id) {
    itemId.value = Number(query.id)
    await loadDetail(itemId.value)
  } else {
    syncCategoryIndex()
  }
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

.field {
  margin-bottom: 18rpx;
}

.label {
  display: block;
  margin-bottom: 18rpx;
  font-size: 32rpx;
  color: #374151;
}

.input,
.picker {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12rpx;
  min-height: 88rpx;
  height: 88rpx;
  padding: 0 18rpx;
  line-height: 88rpx;
  box-sizing: border-box;
  font-size: 26rpx;
  display: flex;
  align-items: center;
}

.textarea {
  width: 100%;
  min-height: 112rpx;
  height: 112rpx;
  line-height: 1.4;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12rpx;
  padding: 14rpx;
  box-sizing: border-box;
  font-size: 26rpx;
}

.row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.flex {
  flex: 1;
  min-width: 0;
}

.error {
  margin-top: 6rpx;
  color: #dc2626;
  font-size: 22rpx;
}

.text-action-btn {
  --td-button-extra-small-padding-horizontal: 8rpx;
}
</style>
