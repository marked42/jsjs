# ANTLR

## 安装使用

1. 命令 antlr4, 下载 JAR 包

```bash
# 1. 安装JDK
https://adoptopenjdk.net/

# 下载 AR包
curl -O http://www.antlr.org/download/antlr-4.9.2-complete.jar
sudo cp antlr-4.9.2-complete.jar /usr/local/lib
```

使用

```bash
java -jar /usr/local/lib/antlr-4.0-complete.jar

# shell中配置命令别名antlr4
alias antlr4='java -jar /usr/local/lib/antlr-4.0-complete.jar'
```

或者配置 Java 类路径后，通过指定类名启动工具

```bash
export CLASSPATH=".:/usr/local/lib/antlr-4.0-complete.jar:$CLASSPATH"
java org.antlr.v4.Tool
```

测试命令工具

```bash
java org.antlr.v4.gui.TestRig

alias grun='java org.antlr.v4.gui.TestRig'
grun Hello（语法文件名称） r(parser rule) -tokens (option)
```

使用命令时必须将 Hello 语法文件编译成 Java 源代码，然后编译成 class 文件，并且保证 class 文件在 CLASSPATH 中。
这样命令执行的时候才能加载到类`HelloParser.class`。编译语法文件使用的版本必须和运行类文件的 antlr 版本一致，否则会报错，在使用编辑器插件自动编译时可能出现这种情况，插件使用的 ANTLR 版本和运行使用的版本不一致。

```bash
# 从文件data.csv获取输入，不指定的话会读取标准输入
grun CSV file -gui data.csv
```

1.  -tokens 输出 token 流，
1.  -tree 将解析树输出，类似 LISP 的语法，操作符在前边。
1.  -gui 图形化界面

编译 target，目标语言的运行时库。

VSCode 编辑器插件

## 语法

1. 小写字母开头是 parser 的规则
1. 大写字母开头是 Token，通常使用全部大写的形式例如 INT
1. fragment INT: 是 token 的匹配片段，但是不作为独立的规则，不输出对应解析函数，只能在其他 token 规则中使用。

1. 优先级顺序，按照规则的前后顺序来，排在前边的规则优先级高。

例子 arithmetic expression

1. 使用 visitor 模式完成表达式求值 EvalVisitor
1. 使用 Listener 和 TokenStreamWriter 重新改写 Token 输入流。
   1. 使用 Listener 模式与直接将代码嵌入到语法中的方式对比。
   1. 使用栈和 Listener 实现求值
   1. 在 Node 节点上保存状态
1. pushMode/popMode
1. hiddenChannel 将空白发送到另外的 channel，忽略但是又不删除。

## 语言模式

ANTLR 语法提供的功能

1. Sequence Sequence With Terminator/Sequence With Separator
1. Choice
1. Token Dependence
1. Nested Phrase

常见的词法结构

1. Identifier
1. Number
1. String
1. Comments
1. Whitespace
1. Keyword
1. Punctuation

需要做思维导图概括 ANTLR 的功能

典型问题

1. 遍历语法树，JSON 转换为 XML。
