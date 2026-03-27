import { executeSql, selectSql } from './sqlite'

// 获取分类列表，按排序值和主键升序返回
export async function listCategories() {
  return selectSql('SELECT * FROM categories ORDER BY sort_order ASC, id ASC')
}

// 新增分类并自动追加到排序末尾
export async function addCategory(name) {
  const safeName = String(name || '').trim()
  if (!safeName) {
    throw new Error('分类名称不能为空')
  }
  const maxSort = await selectSql('SELECT MAX(sort_order) AS maxSort FROM categories')
  const sortOrder = Number(maxSort?.[0]?.maxSort || 0) + 1
  await executeSql('INSERT INTO categories (name, sort_order) VALUES (?, ?)', [safeName, sortOrder])
}

// 删除分类前，将关联密码项回落到未分类
export async function deleteCategory(categoryId) {
  await executeSql('UPDATE password_items SET category_id = 0 WHERE category_id = ?', [categoryId])
  await executeSql('DELETE FROM categories WHERE id = ?', [categoryId])
}

// 按传入顺序批量更新分类排序
export async function updateCategorySort(categoryIds = []) {
  for (let i = 0; i < categoryIds.length; i += 1) {
    await executeSql('UPDATE categories SET sort_order = ? WHERE id = ?', [i + 1, categoryIds[i]])
  }
}
