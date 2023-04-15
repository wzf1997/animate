# count-component-plugin

统计项目中一个组件引用次数的 webpack 插件

# 组件引用次数插件

主要是用来统计项目中某个组件 引用的次数 ， 项目对于 公共组件库的引用次数的统计

其实或者也可以 统计 引入某个 某个包的 函数引用次数

![image-20220313113103198](https://ztifly.oss-cn-hangzhou.aliyuncs.com/image-20220313113103198.png)

# 如何使用

```js
npm i count-component-plugin
```

然后再 webpack 的 plugin 配置如下：

![js](https://ztifly.oss-cn-hangzhou.aliyuncs.com/image-20220313113623645.png)

| 参数          | 类型    |
| ------------- | ------- |
| pathname      | Boolean |
| startCount    | Boolean |
| isExportExcel | Boolean |

然后直接 webpack 直接 run 就好了

![最后出现这样的结果](https://ztifly.oss-cn-hangzhou.aliyuncs.com/image-20220313114016192.png)
