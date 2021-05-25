# jsjs

a javascript compiler in javascript

## 源代码

Javascript 代码是 Unicode Point 的字符流 U+0000 ~ U+10FFFF，底层用什么编码储存字符是实现细节，规范并不关心。

对于多个连续 Code Point 结合在一起表示的组合字符（combining character），处理源码时接受到的输入时单个的 Code Point，而不是一个结合字符。

在字符串字面量、正则表达式字面量、模板字符串字面量和标识符中，可以包含任何使用 Unicode 转义字符串表示的 Code Point

注释中 Unicode 转义字符串被忽略，不认为其代表了对应的 Code Point，而是

```js
// 下面注释的内容是字符串 'test \\n'
// 不是 'test \n'
// test \n
```

换行符 Line Terminator

### 源码类型

1. global code
1. eval code
1. function code
1. module code

### 严格模式

这是个递归的定义

1. 全局代码包含 'use strict'
1. 模块代码
1. ClassDeclaration/Class Expression
1. eval 处于严格模式中或者执行语句包含'use strict' eval('use strict; ...') `use strict; eval('...')`
1. 函数代码处于严格模式中，如果对应的 FunctionDeclaration/FunctionExpression/GeneratorDeclaration/GeneratorExpression/MethodDefinition/ArrowFunction 在严格模式中或者其代码包含了`use strict';
1. new Function('a', 'b', 'use strict;a + b;')
   new GeneratorFunction('a', 'b', 'use strict;yield a + b;')

## 词法

goal symbol

1. InputElementRegExpOrTemplateTail 接受 RegularExpressionLiteral/TemplateMiddle/TemplateTail
1. InputElementRegExp 接受 RegularExpressionLiteral
1. InputElementTemplateTail 接受 TemplateMiddle/TemplateTail
1. InputElementDiv

InputElementDiv :: WhiteSpace
LineTerminator Comment CommonToken DivPunctuator RightBracePunctuator

InputElementRegExp :: WhiteSpace
LineTerminator Comment
CommonToken RightBracePunctuator RegularExpressionLiteral

InputElementRegExpOrTemplateTail :: WhiteSpace
LineTerminator Comment
CommonToken RegularExpressionLiteral TemplateSubstitutionTail

InputElementTemplateTail :: WhiteSpace
11.1
LineTerminator Comment CommonToken DivPunctuator TemplateSubstitutionTail
