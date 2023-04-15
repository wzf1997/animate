# **esbuild 编译 tsx 支持组件的按需加载**

## 如何使用

## 安装

```
npm i esbuild-import-loader

yarn add esbuild-import-loader
```

# 配置

```jsx
 {
    // 同时认识ts jsx js tsx 文件
    test: /\.(t|j)sx?$/,
    exclude: /node_modules/,
    use: [
        {
        loader: 'esbuild-import-loader',
        options: {
            loader: 'tsx',
            target: 'esnext',
        },
        },
    ],
},
```

### Loader

支持所有可选项来自于[esbuild](https://github.com/evanw/esbuild/blob/88821b7e7d46737f633120f91c65f662eace0bcf/lib/shared/types.ts#L158-L172) , 不过最主要解决的问题还是使用 esbuild 去编译 tsx 或者 jsx, 同时支持按需加载 ，方便 tree-shaking

### 组件按需加载

| 参数                            |
| ------------------------------- |
| libraryName 仓库名 如 antd      |
| customName 自定义转换格式       |
| customStyle 自定义 css 生成样式 |

```
{
    // 同时认识ts jsx js tsx 文件
    test: /\.(t|j)sx?$/,
    exclude: /node_modules/,
    use: [
        {
        loader: 'esbuild-import-loader',
        options: {
            loader: 'tsx',
            target: 'esnext',
            libraryName: 'antd',
            customName: (name) => {
              return `antd/lib/${name}`
            },
            customStyle: (name) => {
               return `antd/lib/${name}/style/index.css`
            },
        },
        },
    ],
},
```

会生成 如下：

```
import { Button } from 'antd';

// 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 //

import 'antd/lib/button/style/css';
import Button from 'antd/lib/button';
```
