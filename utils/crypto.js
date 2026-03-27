const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

// 将字符串编码为 UTF-8，确保中文等字符可正确参与 Base64 编码
function utf8Encode(input) {
  return unescape(encodeURIComponent(input))
}

// 轻量 Base64 编码实现，用于本地启动密码的简单混淆
function base64Encode(str) {
  let output = ''
  let i = 0
  const source = utf8Encode(str)
  while (i < source.length) {
    const chr1 = source.charCodeAt(i++)
    const chr2 = source.charCodeAt(i++)
    const chr3 = source.charCodeAt(i++)
    const enc1 = chr1 >> 2
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    let enc4 = chr3 & 63

    if (Number.isNaN(chr2)) {
      enc3 = 64
      enc4 = 64
    } else if (Number.isNaN(chr3)) {
      enc4 = 64
    }

    output += BASE64_CHARS.charAt(enc1)
    output += BASE64_CHARS.charAt(enc2)
    output += enc3 === 64 ? '=' : BASE64_CHARS.charAt(enc3)
    output += enc4 === 64 ? '=' : BASE64_CHARS.charAt(enc4)
  }
  return output
}

// 统一生成启动密码的本地存储值
export function encodeLockPassword(rawPassword) {
  const safeValue = String(rawPassword || '').trim()
  return base64Encode(`local-lock:${safeValue}`)
}
