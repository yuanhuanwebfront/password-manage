import { executeSql } from './sqlite'

const CREATE_PASSWORD_ITEMS_SQL = `
CREATE TABLE IF NOT EXISTS password_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  account TEXT NOT NULL,
  password TEXT NOT NULL,
  url TEXT DEFAULT '',
  note TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  category_id INTEGER DEFAULT 0,
  tags TEXT DEFAULT '[]',
  is_favorite INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
`

const CREATE_CATEGORIES_SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
)
`

const CREATE_SETTINGS_SQL = `
CREATE TABLE IF NOT EXISTS app_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL
)
`

const DEFAULT_CATEGORIES = ['社交', '工作', '银行', '其他']

export async function initDatabase() {
  await executeSql(CREATE_PASSWORD_ITEMS_SQL)
  await executeSql(CREATE_CATEGORIES_SQL)
  await executeSql(CREATE_SETTINGS_SQL)
  for (let i = 0; i < DEFAULT_CATEGORIES.length; i += 1) {
    await executeSql(
      'INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, ?)',
      [DEFAULT_CATEGORIES[i], i + 1]
    )
  }
}

export function getCreateTableSql() {
  return {
    passwordItems: CREATE_PASSWORD_ITEMS_SQL.trim(),
    categories: CREATE_CATEGORIES_SQL.trim(),
    settings: CREATE_SETTINGS_SQL.trim()
  }
}
