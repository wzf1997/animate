// 获取当前时间
export const now = () => {
  return performance.now() ?? Date.now()
}

export const loop = (update: (...args) => void) => {
  if (typeof window !== 'undefined') {
    return requestAnimationFrame(update)
  }
  return setTimeout(update, 16)
}
