<template>
  <view class="card" @tap="emit('click', item)">
    <view class="header">
      <view class="left">
        <text class="icon">{{ item.icon || '🔐' }}</text>
        <view class="meta">
          <text class="name">{{ item.name }}</text>
          <text class="account">{{ item.account }}</text>
        </view>
      </view>
      <text class="favorite">{{ item.is_favorite ? '★' : '☆' }}</text>
    </view>
    <view class="footer">
      <text class="category">{{ item.categoryName || '未分类' }}</text>
      <view class="tags">
        <text
          v-for="tag in (item.tags || []).slice(0, 3)"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16px;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.icon {
  font-size: 40rpx;
}

.meta {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 600;
}

.account {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.favorite {
  font-size: 34rpx;
  color: #f59e0b;
}

.footer {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category {
  font-size: 22rpx;
  color: #3b82f6;
}

.tags {
  display: flex;
  gap: 10rpx;
}

.tag {
  font-size: 20rpx;
  color: #0f766e;
  background-color: #ccfbf1;
  border-radius: 999rpx;
  padding: 4rpx 14rpx;
}
</style>
