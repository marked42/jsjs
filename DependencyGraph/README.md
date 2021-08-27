# 模块依赖树构建

## 参考

1. 分析 webpack 的实现
1. 分析 typescript 的实现
1. ES Module 导入导出语法的 AST

## 实现功能

1. 模块解析需要支持.js/.jsx/.ts/.tsx 和机制支持其他任何格式的模块
1. 支持文件模块和文件夹模块 package.json 来解析
1. 收集 import export 的信息
