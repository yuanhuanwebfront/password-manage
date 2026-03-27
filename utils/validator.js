// 校验启动密码规则：仅允许4位或6位数字
export function validateLockPassword(password) {
  const safeValue = String(password || '').trim()
  if (![4, 6].includes(safeValue.length)) {
    return '启动密码必须是4位或6位'
  }
  if (!/^\d+$/.test(safeValue)) {
    return '启动密码必须是纯数字'
  }
  return ''
}

// 校验新增/编辑密码项表单必填字段
export function validatePasswordItemForm(form) {
  const errors = {}
  if (!String(form.name || '').trim()) {
    errors.name = '名称必填'
  }
  if (!String(form.account || '').trim()) {
    errors.account = '账号必填'
  }
  if (!String(form.password || '').trim()) {
    errors.password = '密码必填'
  }
  return errors
}

// 校验导入JSON结构是否符合密码项数据要求
export function validateImportJson(data) {
  if (!Array.isArray(data)) {
    throw new Error('导入数据必须是数组')
  }
  data.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`第 ${index + 1} 条不是对象`)
    }
    if (!item.name || !item.account || !item.password) {
      throw new Error(`第 ${index + 1} 条缺少必填字段 name/account/password`)
    }
    if (item.tags && !Array.isArray(item.tags)) {
      throw new Error(`第 ${index + 1} 条 tags 必须是数组`)
    }
  })
  return true
}
