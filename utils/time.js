// 将 ISO 时间文本格式化为 YYYY-MM-DD HH:mm:ss
export function formatDateTime(isoText) {
  if (!isoText) {
    return ''
  }
  const date = new Date(isoText)
  if (Number.isNaN(date.getTime())) {
    return String(isoText)
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
