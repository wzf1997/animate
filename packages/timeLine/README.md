<h1 align="center">Welcome to  fly-timeline ð</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/wzf1997/animate/tree/main#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/wzf1997/animate/tree/main/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/wzf1997/animate/tree/main/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/wzf1997/ åºäºæ¶é´çº¿çè½»éçº§ å¨ç»sdk" />
  </a>
</p>


>   åºäºæ¶é´çº¿çè½»éçº§ å¨ç»sdk , æ¯æå¨ç»çä¸²è åå¹¶èï¼ çº¯js æ§è¡å¨ç» 

### ð  [Homepage](https://github.com/wzf1997/animate/tree/main)

## Install

```tsx
pnpm install  fly-timeline
```

ð Usage

# è®¾è®¡ç¯

è®¾æ³ä¸ä¸ªç®åç å¨ç»ï¼ ä»æåªäºçå½å¨æãå¦å¾æç¤º

<img src="https://ztifly.oss-cn-hangzhou.aliyuncs.com/image-20230219220527828.png" alt="image-20230219220527828" style="zoom:50%;" />

æä»¬åè®¾ååä¸ä¸ªåç´   ä» A ä½ç½®åæ¢ å° Bä½ç½®  ç»åäº  duration   ç¶å å¨A åB ä¹é´çä½ç½® åºè¯¥é½æ¯å±äºä¸­é´æï¼ ä¸­é´æå¯ä»¥æ¿å°å½åå¨ç»çè¿åº¦ï¼  å»åä¸äºæ´æ°ã  è®¾è®¡ä¸è¥¿ï¼ ä¸å®è¦èèå®éçä¸å¡åºæ¯ã  æ¯å¦æä»¬å¨å¼å§è¿ä¸ªå¨ç»ä¹åï¼ ä¼åä¸äºæä½ï¼ æ¯å¦è®©é¡µé¢éæ­¢ï¼ æèå¥çä¸äºæä½ï¼ ææèæ²¡æï¼ä½æ¯è®¾è®¡çä¸å®è¦æ´é²å¥½hook ç»ä½¿ç¨èï¼ ä¸­é´çè¿åº¦callback  èªç¶ä¹ä¸ç¨è¯´äºã æåå°±æ¯å¨ç»ç»æäºï¼ æä»¬è¦åäºä»ä¹ã

æä»¥æä»¬å°±å¯ä»¥å¾å° æ¯ä¸ä¸ªæ¶é´çº¿å¯¹åºç åæ°

```tsx
onStart  å¼å§çä¹ååè°
onProgress è¿ç¨ä¸­çåè°
onFinsh  å¨ç»ç»æåçåè° 
onRepeat æ¯ä¸æ¬¡éå¤çåè° 
easingFunc ç¼å¨å½æ°
```



![image-20230223210846015](https://ztifly.oss-cn-hangzhou.aliyuncs.com/image-20230223210846015.png)



## **åºç¡ç¨æ³**

```tsx
import { timeLine, TimeLineManager } from 'fly-timeline'

const timeLineInstance  = timeLine().addAnimate({
  duration: 1000,
  repeat: Infinity,
  onRepeat: () => {},
  easingFunc: Easing.Cubic.In,
})

// å¼å§å¨ç»
timeLineInstance.start()  // è¿åçæ¯ä¸ä¸ªpromise  è¿éçå¼å§æ¯ææå¨ä¸²èçå¨ç»å¼å§ 


timeLineInstance.pause()  // æåå½åå¨ç» 


timeLineInstance.resume()   // æ¢å¤å½åå¨ç»


// ç»æå¨ç» æä¸¤ç§æ¹å¼

// promise çæ¹å¼
1.  await timeLineInstance.start()

// éè¿æ³¨åçæ¹å¼
2.  timeLineInstance.onFinsh(()=> {
     console.error('å®æçåè°')
   })

```

## demo1

ä¸é¢æä»¥demo çæ¹å¼å»å±ç¤ºä¸ è§é¢ä¸æ¹å¨ç»ï¼ div1 å¨ç»ç»æå div2 æå¼å§

![base ](https://ztifly.oss-cn-hangzhou.aliyuncs.com/base%20.gif)

ä»£ç å¦ä¸ï¼ 

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
        ç¬¬ä¸ä¸ª
      </div>
      <div
        style={{
          width: '100px',
          height: '100px',
          background: 'green',
          transform: `translateX(${x2}px)`,
        }}
      >
        ç¬¬äºä¸ª
      </div>
    </div>
  )
}

```



## demo2

æä»¬å å¤§äºé¾åº¦  ç¬¬ä¸ä¸ªå¨ç»  éå¤å æ¬¡ æ¬¡ ç¶ååç­ ç­å¾å ç§ä¸­ å¨è¿è¡æ­æ¾å¨ç»2ï¼ å¨ç»çç¼å¨å½æ° åç½®äºä¸äº

å¦è§é¢æç¤ºï¼



![éå¤](/Users/admin/Desktop/éå¤ + å»¶è¿.gif)



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
          console.error('æèµ°ç»æäº')
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

æ¯å¦æå¨ç»åæ¶è¿è¡çï¼ä¹å°±æ¯åå¹¶åå¨ç»ï¼ æå ä¸ä¸ª div3  å¨ç»  è®©ä»å 12  ä¸èµ·å¼å§ï¼ åèªååèªçäºï¼ å½ç¨å°å¹¶è¡ å¨ç»ç å¶å®å°±æ¯ å¤æ¡timeLine, ææä¾äºä¸ä¸ª timeLine Manager å»åç®¡çï¼ å¼å§ ä»¥åæ´ä½å¨ç» ç»æçåè°ï¼ timeLine  Manageré½å¯ä»¥åå°ã

![å¹¶åå¨ç»](https://ztifly.oss-cn-hangzhou.aliyuncs.com/%E5%B9%B6%E5%8F%91%E5%8A%A8%E7%94%BB.gif)

ä»£ç å¦ä¸ï¼ 

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
            console.error('æèµ°ç»æäº')
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

ææ¸¡å¨ç»ï¼ éå¤å æ¬¡çææ¸¡å¨ç» æä»¬çä¸ ä»£ç å¦ä½å»åã åçä¸è§é¢ï¼ 

![sign](https://ztifly.oss-cn-hangzhou.aliyuncs.com/sign.gif)



è¿éå°±ç¨å°äº onRepeat è¿ä¸ªåè° ï¼ åè°ä¼ç»ä½ å½å éå¤çæ¬¡æ°æå¤å°, å ä¸º onProgress åªä¼ç»ä½  å½å 0-1 çè¿åº¦ï¼ æä»¥ æç ä¼åçåå

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

æ éå¾ªç¯æ­æ¾ä¹æ¯æä»¬éè¦èèçï¼ 

åªéè¦å° repeat çæ¬¡æ°  æ¹ä¸º  **Infinity**

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

å¨ç»çæå å æ¢å¤ 



![æååæ¢å¤](https://ztifly.oss-cn-hangzhou.aliyuncs.com/%E6%9A%82%E5%81%9C%E5%92%8C%E6%81%A2%E5%A4%8D.gif)



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
        å¼å§
      </button>
      <button
        onClick={() => {
          timeLineManagerRef.current?.pause()
        }}
      >
        æå
      </button>

      <button
        onClick={() => {
          timeLineManagerRef.current?.resume()
        }}
      >
        æ¢å¤
      </button>
    </div>
  )
}

```

## Author

ð¤ **wzf1997**

* Website: https://juejin.cn/user/2805609406402798
* Github: [@wzf1997](https://github.com/wzf1997)

## Show your support

Give a â­ï¸ if this project helped you!

## ð License

Copyright Â© 2023 [wzf1997](https://github.com/wzf1997).<br />
This project is [ISC](https://github.com/wzf1997/animate/tree/main/blob/master/LICENSE) licensed.

***

_This README was generated with â¤ï¸ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_