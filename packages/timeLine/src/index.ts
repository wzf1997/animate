import { Easing } from './easing'
import { loop, now } from './util'

export { Easing } from './easing'

export interface TimeLineTask {
  duration: number
  delay?: number
  repeat?: number
  repeatDelay?: number
  onProgress?: (arg: number) => void
  easingFunc?: (amount: number) => number
  /**当前重复的callback */
  onRepeat: (arg: number) => void
  onFinsh?: (arg: TimeLine) => void
  onStart?: () => void
}

export class TimeLine {
  onUpdateHandler?: (arg?: any) => void
  onFinshHandler?: (arg?: any) => void
  private pauseTime: number | undefined
  private startTime: number | undefined
  private readonly tasks: TimeLineTask[]
  private isPaused: boolean | undefined
  private onStartCallbackFired: boolean
  private resolve?: (value: unknown) => void
  private repeat: number
  constructor() {
    this.tasks = []
    this.onStartCallbackFired = false
    this.repeat = 0
  }

  start(time = now()) {
    this.startTime = time
    this.update()
    return new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  addAnimate(task: TimeLineTask) {
    this.tasks.push(task)
    return this
  }

  update(time = now()) {
    // 暂停状态
    if (this.isPaused) {
      return
    }
    // 获取当前动画
    const curAnimate = this.tasks[0]
    const { onFinshHandler } = this
    if (!curAnimate) {
      // 时间线总的 完成回调
      onFinshHandler?.()
      this.resolve?.(void 0)
      return
    }

    const {
      duration,
      onProgress,
      easingFunc = Easing.Linear.None,
      onFinsh,
      delay = 0,
      onStart,
      repeat,
      repeatDelay,
      onRepeat,
    } = curAnimate
    if (!this.onStartCallbackFired) {
      onStart?.()
      this.repeat = repeat ?? 0
      this.onStartCallbackFired = true
    }

    let elapsed = (time - (this.startTime ?? now()) - delay) / duration
    elapsed = duration === 0 || elapsed > 1 ? 1 : elapsed

    if (elapsed > 0) {
      const value = easingFunc(elapsed)
      onProgress?.(value)
    }

    if (elapsed >= 1) {
      if (this.repeat === 0) {
        this.onStartCallbackFired = false
        // 移除当前任务 同时结束
        onFinsh?.(this)
        this.tasks.shift()
      } else {
        // 判断是不是 有限数字
        if (isFinite(this.repeat)) {
          this.repeat--
        }
        onRepeat?.(this.repeat)
      }
      this.startTime = now() + (repeatDelay ?? 0)
    }

    loop(this.update.bind(this))
  }

  onUpdate(updateFunc: (arg: any) => void) {
    this.onUpdateHandler = updateFunc
    return this
  }

  onFinsh(onFinshFunc: (obj: any) => void) {
    this.onFinshHandler = onFinshFunc
    return this
  }

  // 动画暂停
  pause(time = now()) {
    this.pauseTime = time
    this.isPaused = true
    return this
  }

  // 动画恢复
  resume(time = now()) {
    this.isPaused = false
    this.startTime! += time - this.pauseTime!
    this.update()
    return this
  }
}

export class TimeLineManager {
  private onFinshHandler?: (obj: any) => void
  private readonly timeLines: TimeLine[]
  constructor(timeLines?: TimeLine[]) {
    this.timeLines = timeLines ?? []
  }

  start() {
    const arrs = this.timeLines.map((item) => item.start())
    void Promise.all(arrs).then(() => {
      this.onFinshHandler?.(this)
    })
  }

  addTimeLine(timeLine: TimeLine | TimeLine[]) {
    if (Array.isArray(timeLine)) {
      this.timeLines.push(...timeLine)
      return this
    }
    this.timeLines.push(timeLine)
    return this
  }

  // 动画暂停
  pause() {
    this.timeLines.forEach((item) => item.pause())
    return this
  }

  // 动画恢复
  resume() {
    this.timeLines.forEach((item) => item.resume())
    return this
  }

  onFinsh(onFinshFunc: (obj: any) => void) {
    this.onFinshHandler = onFinshFunc
    return this
  }
}

export const timeLine = () => {
  return new TimeLine()
}
