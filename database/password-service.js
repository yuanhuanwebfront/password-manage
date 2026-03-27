import {
  createPasswordItem,
  deletePasswordItem,
  getPasswordItemById,
  importPasswordItems,
  listPasswordItems,
  updatePasswordItem
} from './password-repository'
import { listCategories } from './category-repository'

// 首页列表组装：将分类名称映射到密码项，方便直接渲染
export async function getHomeList(filters = {}) {
  const [items, categories] = await Promise.all([listPasswordItems(filters), listCategories()])
  const categoryMap = new Map(categories.map((item) => [item.id, item.name]))
  return items.map((item) => ({
    ...item,
    categoryName: categoryMap.get(item.category_id) || '未分类'
  }))
}

export {
  createPasswordItem,
  updatePasswordItem,
  getPasswordItemById,
  deletePasswordItem,
  importPasswordItems
}
