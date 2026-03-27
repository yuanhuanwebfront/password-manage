<template>
  <scroll-view scroll-x class="tabs-scroll">
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: Number(modelValue) === Number(tab.id) }"
        @tap="emit('update:modelValue', Number(tab.id))"
      >
        {{ tab.name }}
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs-scroll {
  width: 100%;
  white-space: nowrap;
}

.tabs {
  display: inline-flex;
  align-items: center;
  padding: 8rpx 0 20rpx;
}

.tab-item {
  margin-right: 16rpx;
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: #374151;
  background-color: #f3f4f6;
}

.tab-item.active {
  color: #ffffff;
  background-color: #2563eb;
}
</style>
