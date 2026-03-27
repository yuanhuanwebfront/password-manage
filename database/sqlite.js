const DB_NAME = 'password_manage.db'
const DB_PATH = '_doc/password_manage.db'

let opened = false

function escapeSqlValue(value) {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'NULL'
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0'
  }
  const text = String(value).replace(/'/g, "''")
  return `'${text}'`
}

function compileSql(sql, params = []) {
  if (!Array.isArray(params) || params.length === 0) {
    return sql
  }
  let index = 0
  return String(sql).replace(/\?/g, () => {
    const current = index < params.length ? params[index] : null
    index += 1
    return escapeSqlValue(current)
  })
}

function assertSqliteAvailable() {
  if (typeof plus === 'undefined' || !plus.sqlite) {
    throw new Error('当前环境不支持 SQLite，请在 uni-app App 端运行。')
  }
}

export async function openDatabase() {
  if (opened) {
    return
  }
  assertSqliteAvailable()
  const isOpen = plus.sqlite.isOpenDatabase({
    name: DB_NAME,
    path: DB_PATH
  })
  if (!isOpen) {
    await new Promise((resolve, reject) => {
      plus.sqlite.openDatabase({
        name: DB_NAME,
        path: DB_PATH,
        success: () => resolve(),
        fail: (error) => reject(error)
      })
    })
  }
  opened = true
}

export async function closeDatabase() {
  if (!opened) {
    return
  }
  await new Promise((resolve, reject) => {
    plus.sqlite.closeDatabase({
      name: DB_NAME,
      success: () => resolve(),
      fail: (error) => reject(error)
    })
  })
  opened = false
}

export async function executeSql(sql, params = []) {
  await openDatabase()
  const finalSql = compileSql(sql, params)
  return new Promise((resolve, reject) => {
    plus.sqlite.executeSql({
      name: DB_NAME,
      sql: finalSql,
      success: () => resolve(),
      fail: (error) => reject(error)
    })
  })
}

export async function selectSql(sql, params = []) {
  await openDatabase()
  const finalSql = compileSql(sql, params)
  return new Promise((resolve, reject) => {
    plus.sqlite.selectSql({
      name: DB_NAME,
      sql: finalSql,
      success: (data) => resolve(data || []),
      fail: (error) => reject(error)
    })
  })
}
