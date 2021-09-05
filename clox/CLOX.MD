# Clox

[Github Repo](https://github.com/munificent/craftinginterpreters)

## 问题

1. C语言的switch case中不能直接声明变量，需要包裹在显式的块中？

## 字节码格式

1. 指令占据一个字节（byte），表示具体的操作类型，一个指令后面跟若干个字节的内容作为操作数，操作数的具体含义与指令的定义相关。
1. 对于尺寸较小且大小固定的操作数，直接使用指令后紧跟的字节代表操作数值，这样的操作数成为立即数 immediate instruction
1. 常量操作数保存在常量池中，参考 Java 实现 [constant pool](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html#jvms-4.4)，指令中使用常量池中的常量时，通常使用常量在常量池中的下标位置标示。
   1. 指令 OP_CONSTANT 使用一个字节代表常量下标，最多标识 256 个常量，可以定义 OP_CONSTANT_LONG 使用 3 个字节代表常量下标。
1. 源码位置信息（行号） [run-length 编码](https://en.wikipedia.org/wiki/Run-length_encoding)

1. 内存管理，reallocate 使用了标准库函数 realloc，内部使用了 malloc 和 free，试着完全自己实现内存管理，初始状态可以向操作系统申请固定大小的内存，然后完全自己管理。

## Virtual Machine

1. bytecode 的顺序是，逆波兰表达式
1. Evaluation Order 规定从左到右，或者不规定（实现决定，存在优化空间）
1. 设计栈有最大层数，超出时出现经典的 stack overflow 错误，如果 stack 设计成可以自动扩容可以避免 stack overflow，但是对应的代价是什么？
1. 设计最小指令集 OP_NEGATE 和 OP_SUBTRACT 可以只保留一个
1. 指定实现优化，OP_NEGATE 实现为出栈、取负值、入栈三个操作，也可以实现为直接将栈顶元素去负值。单个指令实现的优化。
1. Stack based VM
1. https://en.wikipedia.org/wiki/Just-in-time_compilation
1. Register Based VM
   1. Register Base VM https://craftinginterpreters.com/a-virtual-machine.html#design-note
   1. [The Implementation of Lua 5.0](https://www.lua.org/doc/jucs05.pdf)
   1. Register Allocation https://en.wikipedia.org/wiki/Register_allocation

## Scanner

1. 区分关键字和标识符，使用 Trie 树， [v8](https://github.com/v8/v8/blob/e77eebfe3b747fb315bd3baad09bec0953e53e68/src/parsing/scanner.cc#L1643)
1. string interpolation 的实现
1. C++中 '>>'符号的解析问题
1. contextual keywords 上下文相关的关键字，C#中 await 关键字在 async 函数中是关键字，其他函数中可以作为普通标识符。

## 数据类型

数据类型的表示，基础类型number/boolean/nil，对象类型Obj。基础类型与对象类型的区分在于基础类型的大小固定且较小，可以直接有结构体表示，方便在栈上分配。
对象类型大小不确定且无长度限制，需要在运行时分配，适合分配在堆内存中。

宏参数需要用括号括起来，防止与其他语法冲突，如果宏参数被多次使用，且被展开的宏参数有副作用的话会造成多次副作用，下面例子中的宏使用函数实现，避免这个问题。

```c
#define IS_STRING(value) isObjType(value, OBJ_STRING)

static inline bool isObjType(Value value, ObjType type) {
return IS_OBJ(value) && AS_OBJ(value)->type == type;
}
```

使用C语言struct结构体模拟类继承效果，`ObjString`的第一个成员是基类`Obj`类型，这样任何`ObjString*`类型可以被安全的转换为基类指针类型`Obj*`。
C语言规定结构体中字段在内存中的顺序和成员声明顺序一致，允许其中因为内存对其有padding，成员数据之间在内存上不连续，但是第一个成员之前不能有padding。
这样结构体的指针可以安全的转换为第一个成员类型的指针。

```c
typedef struct {
    ObjType type;
} Obj;

typedef struct {
    Obj obj;
} ObjString;

```