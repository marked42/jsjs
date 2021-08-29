# 模块依赖树构建

## 参考

1. 分析 webpack 的实现
1. 分析 typescript 的实现
1. ES Module 导入导出语法的 AST

## 实现功能

从导入模块的标识符(ModuleSpecifier)确定模块

1. 绝对路径标识符，从当前文件夹开始，递归向上地在文件夹的 node_modules 子文件夹寻找
1. 包含后缀名的是文件模块
1. 不包含后缀名
   1. 尝试补全后缀名.js/.jsx/.ts/.tsx 等，如何支持动态添加支持的后缀名？
   1. 如果模块名称指向文件夹
      1. 尝试文件夹下的 index 文件
      1. 尝试 package.json 指定的入口文件

导入语句的形式

```js
import 'a'
import a from 'a'
import { a1 as b1 } from 'a'
import * as a2 from 'a'

import a3, { a4 } from 'a'
import a5, * as b3 from 'a'
```

1. 命名导入单个名称，命名空间导入将所有名称统一导入，不能同时使用
1. 默认导入是特殊导入形式，可以与命名导入或者命名空间导入同时使用
1. 命名导入，名称列表最后的逗号可以省略也可以出现

```js
import [default,] [Named | Namespace] from 'mod'
```

导出语句形式
