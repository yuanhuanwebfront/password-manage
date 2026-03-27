import { reactive } from 'vue'

// 锁屏全局状态，控制应用是否已解锁
const state = reactive({
  unlocked: false
})

export function useLockStore() {
  // 更新解锁状态，统一转成布尔值
  function setUnlocked(value) {
    state.unlocked = !!value
  }

  return {
    state,
    setUnlocked
  }
}
