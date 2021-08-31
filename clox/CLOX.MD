# Clox

[Github Repo](https://github.com/munificent/craftinginterpreters)

## 字节码格式

1. 指令占据一个字节（byte），表示具体的操作类型，一个指令后面跟若干个字节的内容作为操作数，操作数的具体含义与指令的定义相关。
1. 对于尺寸较小且大小固定的操作数，直接使用指令后紧跟的字节代表操作数值，这样的操作数成为立即数 immediate instruction
1. 常量操作数保存在常量池中，参考 Java 实现 [constant pool](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html#jvms-4.4)，指令中使用常量池中的常量时，通常使用常量在常量池中的下标位置标示。
   1. 指令 OP_CONSTANT 使用一个字节代表常量下标，最多标识 256 个常量，可以定义 OP_CONSTANT_LONG 使用 3 个字节代表常量下标。
1. 源码位置信息（行号） [run-length 编码](https://en.wikipedia.org/wiki/Run-length_encoding)

1. 内存管理，reallocate 使用了标准库函数 realloc，内部使用了 malloc 和 free，试着完全自己实现内存管理，初始状态可以向操作系统申请固定大小的内存，然后完全自己管理。

## Stack base VM

1. bytecode 的顺序是，逆波兰表达式
1. Evaluation Order 规定从左到右，或者不规定（实现决定，存在优化空间）
1. 设计栈有最大层数，超出时出现经典的 stack overflow 错误，如果 stack 设计成可以自动扩容可以避免 stack overflow，但是对应的代价是什么？
1. 设计最小指令集 OP_NEGATE 和 OP_SUBTRACT 可以只保留一个
1. 指定实现优化，OP_NEGATE 实现为出栈、取负值、入栈三个操作，也可以实现为直接将栈顶元素去负值。单个指令实现的优化。
1. Stack based VM
1. Register Base VM https://craftinginterpreters.com/a-virtual-machine.html#design-note
1. https://en.wikipedia.org/wiki/Just-in-time_compilation
1. [The Implementation of Lua 5.0](https://www.lua.org/doc/jucs05.pdf)
