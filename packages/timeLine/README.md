<h1 align="center">Welcome to  fly-timeline 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/wzf1997/animate/tree/main#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/wzf1997/animate/tree/main/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/wzf1997/animate/tree/main/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/wzf1997/ 基于时间线的轻量级 动画sdk" />
  </a>
</p>


>   基于时间线的轻量级 动画sdk , 支持动画的串联 和并联， 纯js 执行动画 

### 🏠 [Homepage](https://github.com/wzf1997/animate/tree/main)

## Install

```tsx
pnpm install  fly-timeline
```

📖 Usage

# 设计篇

设想一个简单的 动画， 他有哪些生命周期。如图所示

<img src="https://ztifly.oss-cn-hangzhou.aliyuncs.com/image-20230219220527828.png" alt="image-20230219220527828" style="zoom:50%;" />

我们假设变化一个元素  从 A 位置变换 到 B位置  经历了  duration   然后 在A 和B 之间的位置 应该都是属于中间态， 中间态可以拿到当前动画的进度，  去做一些更新。  设计东西， 一定要考虑实际的业务场景。  比如我们在开始这个动画之前， 会做一些操作， 比如让页面静止， 或者啥的一些操作， 有或者没有，但是设计的一定要暴露好hook 给使用者， 中间的进度callback  自然也不用说了。 最后就是动画结束了， 我们要做些什么。

所以我们就可以得到 每一个时间线对应的 参数

```tsx
onStart  开始的之前回调
onProgress 过程中的回调
onFinsh  动画结束后的回调 
onRepeat 每一次重复的回调 
easingFunc 缓动函数
```



![image-20230223210846015](https://ztifly.oss-cn-hangzhou.aliyuncs.com/image-20230223210846015.png)



## **基础用法**

```tsx
import { timeLine, TimeLineManager } from 'fly-timeline'

const timeLineInstance  = timeLine().addAnimate({
  duration: 1000,
  repeat: Infinity,
  onRepeat: () => {},
  easingFunc: Easing.Cubic.In,
})

// 开始动画
timeLineInstance.start()  // 返回的是一个promise  这里的开始是所有在串联的动画开始 


timeLineInstance.pause()  // 暂停当前动画 


timeLineInstance.resume()   // 恢复当前动画


// 结束动画 有两种方式

// promise 的方式
1.  await timeLineInstance.start()

// 通过注册的方式
2.  timeLineInstance.onFinsh(()=> {
     console.error('完成的回调')
   })

```

## demo1

下面我以demo 的方式去展示下 视频下方动画， div1 动画结束后 div2 才开始

![base ](https://ztifly.oss-cn-hangzhou.aliyuncs.com/base%20.gif)

代码如下： 

```tsx
import { timeLine, TimeLineManager } from 'fly-timeline'

import { useLayoutEffect, useRef, useState } from 'react'

export const Time = () => {
  const [x1, setX1] = useState(0)

  const [x2, setX2] = useState(0)

  const timeLineRef = useRef()

  useLayoutEffect(() => {
    timeLineRef.current = timeLine()
      .addAnimate({
        duration: 1000,
        onProgress: (value) => {
          setX1(100 * value)
        },
      })
      .addAnimate({
        duration: 1000,
        onProgress: (value) => {
          setX2(100 * value)
        },
      })
  }, [])

  return (
    <div>
      <div
        style={{
          width: '100px',
          height: '100px',
          background: 'red',
          transform: `translateX(${x1}px)`,
        }}
        onClick={() => {
          timeLineRef.current?.start()
        }}
      >
        第一个
      </div>
      <div
        style={{
          width: '100px',
          height: '100px',
          background: 'green',
          transform: `translateX(${x2}px)`,
        }}
      >
        第二个
      </div>
    </div>
  )
}

```



## demo2

我们加大些难度  第一个动画  重复几次 次 然后再等 等待几秒中 在进行播放动画2， 动画的缓动函数 内置了一些

如视频所示：



![重复](/Users/admin/Desktop/重复 + 延迟.gif)



```tsx
import { timeLine, TimeLine, Easing } from 'timeline'

useLayoutEffect(() => {
    timeLineRef.current = timeLine()
      .addAnimate({
        duration: 1000,
        repeat: 2,
        easingFunc: Easing.Cubic.In,
        onProgress: (value) => {
          setX1(100 * value)
        },
        onFinsh: () => {
          console.error('我走结束了')
        },
      })
      .addAnimate({
        delay: 1000,
        duration: 1000,
        onProgress: (value) => {
          setX2(100 * value)
        },
      })
  }, [])
```

## demo3 

比如有动画同时进行的，也就是做并发动画， 我加一个 div3  动画  让他和 12  一起开始， 各自做各自的事， 当用到并行 动画的 其实就是 多条timeLine, 我提供了一个 timeLine Manager 去做管理， 开始 以及整体动画 结束的回调， timeLine  Manager都可以做到。

![并发动画](https://ztifly.oss-cn-hangzhou.aliyuncs.com/%E5%B9%B6%E5%8F%91%E5%8A%A8%E7%94%BB.gif)

代码如下： 

```tsx
  useLayoutEffect(() => {
    timeLineManagerRef.current = new TimeLineManager([
      timeLine()
        .addAnimate({
          duration: 1000,
          repeat: 2,
          easingFunc: Easing.Cubic.In,
          onProgress: (value) => {
            setX1(100 * value)
          },
          onFinsh: () => {
            console.error('我走结束了')
          },
        })
        .addAnimate({
          delay: 1000,
          duration: 1000,
          onProgress: (value) => {
            setX2(100 * value)
          },
        }),
      timeLine().addAnimate({
        duration: 500,
        repeat: 3,
        easingFunc: Easing.Cubic.In,
        onProgress: (value) => {
          setX3(100 * value)
        },
      }),
    ]).start()
  }, [])
```



# demo4 

摆渡动画， 重复几次的摆渡动画 我们看下 代码如何去写。 先看下视频： 

![sign](https://ztifly.oss-cn-hangzhou.aliyuncs.com/sign.gif)



这里就用到了 onRepeat 这个回调 ， 回调会给你当前 重复的次数有多少, 因为 onProgress 只会给你 当前 0-1 的进度， 所以 斜率 会发生变化

```tsx
useLayoutEffect(() => {
    let start = 0
    let k = 1
    const end = 100
    timeLine.current =  timeLine().addAnimate({
        duration: 1000,
        repeat: 2,
        onRepeat: (repeat: number) => {
          if (repeat % 2 !== 0) {
            k = -1
            start = end
          } else {
            k = 1
            start = 0
          }
        },
        easingFunc: Easing.Cubic.In,
        onProgress: (value) => {
          setX1(start + k * end * value)
        },
      })
  }, [])
```





# demo5

无限循环播放也是我们需要考虑的： 

只需要将 repeat 的次数  改为  **Infinity**

```tsx
 useLayoutEffect(() => {
    let start = 0
    let k = 1
    const end = 100
    timeLineManagerRef.current = new TimeLineManager([
      timeLine().addAnimate({
        duration: 1000,
        repeat: Infinity,
        easingFunc: Easing.Cubic.In,
        onProgress: (value) => {
          setX1(start + k * end * value)
        },
      }),
    ])
  }, [])
```



## demo6

动画的暂停 和 恢复 



![暂停和恢复](https://ztifly.oss-cn-hangzhou.aliyuncs.com/%E6%9A%82%E5%81%9C%E5%92%8C%E6%81%A2%E5%A4%8D.gif)



```tsx
import { timeLine, TimeLine, Easing, TimeLineManager } from 'fly-timeline'
import { useLayoutEffect, useRef, useState } from 'react'

export const Time = () => {
  const [x1, setX1] = useState(0)

  const timeLineManagerRef = useRef<TimeLineManager | undefined>()

  useLayoutEffect(() => {
    const start = 0
    const k = 1
    const end = 100
    timeLineManagerRef.current = new TimeLineManager([
      timeLine().addAnimate({
        duration: 1000,
        repeat: Infinity,
        onRepeat: () => {},
        easingFunc: Easing.Cubic.In,
        onProgress: (value) => {
          setX1(start + k * end * value)
        },
      }),
    ])
  }, [])

  return (
    <div>
      <div
        style={{
          width: '100px',
          height: '100px',
          background: 'red',
          transform: `translateX(${x1}px)`,
        }}
      />

      <button
        onClick={() => {
          timeLineManagerRef.current?.start()
        }}
      >
        开始
      </button>
      <button
        onClick={() => {
          timeLineManagerRef.current?.pause()
        }}
      >
        暂停
      </button>

      <button
        onClick={() => {
          timeLineManagerRef.current?.resume()
        }}
      >
        恢复
      </button>
    </div>
  )
}

```

## Author

👤 **wzf1997**

* Website: https://juejin.cn/user/2805609406402798
* Github: [@wzf1997](https://github.com/wzf1997)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [wzf1997](https://github.com/wzf1997).<br />
This project is [ISC](https://github.com/wzf1997/animate/tree/main/blob/master/LICENSE) licensed.

***

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_