<template>
  <scroll-view scroll-y class="page">
    <view class="card">
      <text class="section-title">修改启动密码</text>
      <view class="field">
        <text class="label">当前密码</text>
        <input v-model="passwordForm.oldPassword" class="input" type="number" password maxlength="6" />
      </view>
      <view class="field">
        <text class="label">新密码</text>
        <input v-model="passwordForm.newPassword" class="input" type="number" password maxlength="6" />
      </view>
      <view class="field">
        <text class="label">确认新密码</text>
        <input v-model="passwordForm.confirmPassword" class="input" type="number" password maxlength="6" />
      </view>
      <t-button theme="primary" block @tap="changeLockPassword">更新启动密码</t-button>
    </view>

    <view class="card">
      <text class="section-title">分类管理</text>
      <view class="row">
        <input v-model="newCategoryName" class="input flex" placeholder="输入新分类名称" />
        <t-button size="small" theme="primary" @tap="createCategory">新增</t-button>
      </view>
      <view v-for="(item, index) in categories" :key="item.id" class="category-row">
        <text class="category-name">{{ item.name }}</text>
        <view class="row">
          <t-button size="small" variant="outline" @tap="moveUp(index)">上移</t-button>
          <t-button size="small" variant="outline" @tap="moveDown(index)">下移</t-button>
          <t-button size="small" theme="danger" variant="outline" @tap="removeCategory(item.id)">删除</t-button>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="section-title">数据导入（JSON数组）</text>
      <textarea
        v-model="importText"
        class="textarea"
        placeholder='示例：[{"name":"GitHub","account":"a@b.com","password":"123456","tags":["工作"]}]'
      ></textarea>
      <t-button theme="primary" block @tap="importJsonData">导入数据</t-button>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { addCategory, deleteCategory, listCategories, updateCategorySort } from '@/database/category-repository'
import { importPasswordItems } from '@/database/password-service'
import { setSetting, verifyLockPassword } from '@/database/settings-repository'
import { encodeLockPassword } from '@/utils/crypto'
import { validateImportJson, validateLockPassword } from '@/utils/validator'

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const categories = ref([])
const newCategoryName = ref('')
const importText = ref('')

async function loadCategories() {
  categories.value = await listCategories()
}

function resetPasswordForm() {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

async function changeLockPassword() {
  const oldValid = validateLockPassword(passwordForm.value.oldPassword)
  if (oldValid) {
    uni.showToast({ title: oldValid, icon: 'none' })
    return
  }
  const newValid = validateLockPassword(passwordForm.value.newPassword)
  if (newValid) {
    uni.showToast({ title: newValid, icon: 'none' })
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    uni.showToast({ title: '两次新密码不一致', icon: 'none' })
    return
  }
  const verified = await verifyLockPassword(encodeLockPassword(passwordForm.value.oldPassword))
  if (!verified) {
    uni.showToast({ title: '当前密码错误', icon: 'none' })
    return
  }
  await setSetting('lock_password', encodeLockPassword(passwordForm.value.newPassword))
  resetPasswordForm()
  uni.showToast({ title: '修改成功', icon: 'success' })
}

async function createCategory() {
  if (!newCategoryName.value.trim()) {
    uni.showToast({ title: '请输入分类名称', icon: 'none' })
    return
  }
  await addCategory(newCategoryName.value)
  newCategoryName.value = ''
  await loadCategories()
}

async function removeCategory(id) {
  await deleteCategory(id)
  await loadCategories()
}

async function saveCategorySort() {
  await updateCategorySort(categories.value.map((item) => item.id))
}

async function moveUp(index) {
  if (index <= 0) {
    return
  }
  const list = [...categories.value]
  const temp = list[index]
  list[index] = list[index - 1]
  list[index - 1] = temp
  categories.value = list
  await saveCategorySort()
}

async function moveDown(index) {
  if (index >= categories.value.length - 1) {
    return
  }
  const list = [...categories.value]
  const temp = list[index]
  list[index] = list[index + 1]
  list[index + 1] = temp
  categories.value = list
  await saveCategorySort()
}

async function importJsonData() {
  if (!importText.value.trim()) {
    uni.showToast({ title: '请先粘贴JSON数据', icon: 'none' })
    return
  }
  try {
    const parsed = JSON.parse(importText.value)
    validateImportJson(parsed)
    await importPasswordItems(parsed)
    importText.value = ''
    uni.showToast({ title: '导入成功', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: error?.message || '导入失败', icon: 'none' })
  }
}

onShow(() => {
  loadCategories()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3f4f6;
  padding-bottom: 20px;
}

.card {
  margin: 16px;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.section-title {
  display: block;
  margin-bottom: 14rpx;
  font-size: 30rpx;
  color: #111827;
  font-weight: 600;
}

.field {
  margin-bottom: 14rpx;
}

.label {
  display: block;
  margin-bottom: 8rpx;
  font-size: 24rpx;
  color: #374151;
}

.input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12rpx;
  padding: 14rpx;
  box-sizing: border-box;
  font-size: 26rpx;
}

.textarea {
  width: 100%;
  min-height: 200rpx;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12rpx;
  padding: 14rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  margin-bottom: 14rpx;
}

.row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.flex {
  flex: 1;
}

.category-row {
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-name {
  font-size: 26rpx;
  color: #111827;
}
</style>
