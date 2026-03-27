import { executeSql, selectSql } from './sqlite'

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((item) => String(item || '').trim())
      .filter((item) => item.length > 0)
  }
  return []
}

function now() {
  return new Date().toISOString()
}

export async function listPasswordItems(options = {}) {
  const keyword = String(options.keyword || '').trim()
  const categoryId = Number(options.categoryId || 0)
  const sortBy = options.sortBy === 'name' ? 'name' : 'created_at'
  const orderBy = sortBy === 'name' ? 'name COLLATE NOCASE ASC' : 'created_at DESC'

  const whereParts = []
  const params = []

  if (keyword) {
    whereParts.push('(name LIKE ? OR account LIKE ?)')
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  if (categoryId > 0) {
    whereParts.push('category_id = ?')
    params.push(categoryId)
  }

  const whereSql = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''
  const rows = await selectSql(
    `SELECT * FROM password_items ${whereSql} ORDER BY ${orderBy}`,
    params
  )

  return rows.map((row) => ({
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : []
  }))
}

export async function getPasswordItemById(id) {
  const rows = await selectSql('SELECT * FROM password_items WHERE id = ? LIMIT 1', [id])
  if (!rows.length) {
    return null
  }
  const row = rows[0]
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : []
  }
}

export async function createPasswordItem(payload) {
  const currentTime = now()
  const tags = normalizeTags(payload.tags)
  await executeSql(
    `INSERT INTO password_items 
      (name, account, password, url, note, icon, category_id, tags, is_favorite, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.name,
      payload.account,
      payload.password,
      payload.url || '',
      payload.note || '',
      payload.icon || '',
      Number(payload.categoryId || 0),
      JSON.stringify(tags),
      Number(payload.isFavorite || 0),
      currentTime,
      currentTime
    ]
  )
}

export async function updatePasswordItem(id, payload) {
  const tags = normalizeTags(payload.tags)
  await executeSql(
    `UPDATE password_items SET
      name = ?,
      account = ?,
      password = ?,
      url = ?,
      note = ?,
      icon = ?,
      category_id = ?,
      tags = ?,
      is_favorite = ?,
      updated_at = ?
      WHERE id = ?`,
    [
      payload.name,
      payload.account,
      payload.password,
      payload.url || '',
      payload.note || '',
      payload.icon || '',
      Number(payload.categoryId || 0),
      JSON.stringify(tags),
      Number(payload.isFavorite || 0),
      now(),
      id
    ]
  )
}

export async function deletePasswordItem(id) {
  await executeSql('DELETE FROM password_items WHERE id = ?', [id])
}

export async function importPasswordItems(items = []) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]
    const currentTime = now()
    await executeSql(
      `INSERT INTO password_items
        (name, account, password, url, note, icon, category_id, tags, is_favorite, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.name,
        item.account,
        item.password,
        item.url || '',
        item.note || '',
        item.icon || '',
        Number(item.categoryId || 0),
        JSON.stringify(normalizeTags(item.tags)),
        Number(item.isFavorite || 0),
        item.createdAt || currentTime,
        item.updatedAt || currentTime
      ]
    )
  }
}
