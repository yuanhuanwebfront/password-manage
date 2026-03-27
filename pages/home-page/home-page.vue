<template>
  <view class="page">
    <view class="toolbar">
      <input
        v-model="keyword"
        class="search-input"
        placeholder="搜索名称或账号"
        confirm-type="search"
        @confirm="loadData"
      />
      <view class="sort-box">
        <picker :range="sortOptions" range-key="label" :value="sortIndex" @change="handleSortChange">
          <view class="sort-trigger">{{ sortOptions[sortIndex].label }}</view>
        </picker>
      </view>
    </view>

    <category-tabs v-model="activeCategoryId" :tabs="categoryTabs" />

    <view class="actions">
      <t-button size="small" variant="outline" @tap="goSettings">设置</t-button>
      <t-button size="small" theme="primary" @tap="goAddPage">新增</t-button>
    </view>

    <scroll-view scroll-y class="list-area">
      <password-card
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="goDetail(item.id)"
      />
      <view v-if="!items.length" class="empty">暂无数据，点击右上角新增</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CategoryTabs from '@/components/category-tabs.vue'
import PasswordCard from '@/components/password-card.vue'
import { listCategories } from '@/database/category-repository'
import { getHomeList } from '@/database/password-service'
import { useLockStore } from '@/store/lock-store'

const keyword = ref('')
const activeCategoryId = ref(0)
const categories = ref([])
const items = ref([])
const lockStore = useLockStore()

const sortOptions = [
  { label: '按创建时间', value: 'created_at' },
  { label: '按名称', value: 'name' }
]
const sortIndex = ref(0)

const categoryTabs = computed(() => [{ id: 0, name: '全部' }, ...categories.value])

async function loadCategories() {
  categories.value = await listCategories()
}

async function loadData() {
  items.value = await getHomeList({
    keyword: keyword.value,
    categoryId: activeCategoryId.value,
    sortBy: sortOptions[sortIndex.value].value
  })
}

function handleSortChange(event) {
  sortIndex.value = Number(event.detail.value || 0)
  loadData()
}

function goAddPage() {
  uni.navigateTo({ url: '/pages/edit-page/edit-page' })
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/detail-page/detail-page?id=${id}` })
}

function goSettings() {
  uni.navigateTo({ url: '/pages/settings-page/settings-page' })
}

watch([activeCategoryId, keyword], () => {
  loadData()
})

onShow(async () => {
  if (!lockStore.state.unlocked) {
    uni.reLaunch({ url: '/pages/lock-page/lock-page' })
    return
  }
  await loadCategories()
  await loadData()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 16px;
  box-sizing: border-box;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.search-input {
  flex: 1;
  background: #ffffff;
  border-radius: 12rpx;
  padding: 14rpx 16rpx;
  font-size: 26rpx;
}

.sort-box {
  width: 180rpx;
}

.sort-trigger {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 14rpx 12rpx;
  text-align: center;
  font-size: 24rpx;
  color: #374151;
}

.actions {
  margin: 8px 0 12px;
  display: flex;
  justify-content: flex-end;
  gap: 12rpx;
}

.list-area {
  height: calc(100vh - 220rpx);
}

.empty {
  margin-top: 100rpx;
  text-align: center;
  color: #9ca3af;
  font-size: 26rpx;
}
</style>
