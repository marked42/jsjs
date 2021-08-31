# Clox

[Github Repo](https://github.com/munificent/craftinginterpreters)

## 字节码格式

1. 指令占据一个字节（byte），表示具体的操作类型，一个指令后面跟若干个字节的内容作为操作数，操作数的具体含义与指令的定义相关。
1. 对于尺寸较小且大小固定的操作数，直接使用指令后紧跟的字节代表操作数值，这样的操作数成为立即数 immediate instruction
1. 常量操作数保存在常量池中，参考 Java 实现 [constant pool](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html#jvms-4.4)，指令中使用常量池中的常量时，通常使用常量在常量池中的下标位置标示。
   1. 指令 OP_CONSTANT 使用一个字节代表常量下标，最多标识 256 个常量，可以定义 OP_CONSTANT_LONG 使用 3 个字节代表常量下标。
1. 源码位置信息（行号） [run-length 编码](https://en.wikipedia.org/wiki/Run-length_encoding)

1. 内存管理，reallocate 使用了标准库函数 realloc，内部使用了 malloc 和 free，试着完全自己实现内存管理，初始状态可以向操作系统申请固定大小的内存，然后完全自己管理。
