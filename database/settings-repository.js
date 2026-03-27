import { executeSql, selectSql } from './sqlite'

// 读取指定键对应的配置值，不存在时返回空字符串
export async function getSetting(key) {
  const rows = await selectSql(
    'SELECT setting_value FROM app_settings WHERE setting_key = ? LIMIT 1',
    [key]
  )
  return rows.length ? rows[0].setting_value : ''
}

// 写入配置项，存在同键则覆盖
export async function setSetting(key, value) {
  await executeSql('INSERT OR REPLACE INTO app_settings (setting_key, setting_value) VALUES (?, ?)', [
    key,
    String(value)
  ])
}

// 判断是否已设置启动密码
export async function hasLockPassword() {
  const value = await getSetting('lock_password')
  return !!value
}

// 校验输入的加密密码是否与本地配置一致
export async function verifyLockPassword(encodedPassword) {
  const current = await getSetting('lock_password')
  if (!current) {
    return false
  }
  return current === encodedPassword
}
