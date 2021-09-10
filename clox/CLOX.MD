# Clox

[Github Repo](https://github.com/munificent/craftinginterpreters)

## 问题

1. C 语言的 switch case 中不能直接声明变量，需要包裹在显式的块中？
2. static 变量声明的含义、
3. extern 关键字的作用
4. c 语言的 separate compilation 模型
5. 作者开发的其他语言
   1. 一个 Scripting Language [Wren](https://wren.io/)
   2. http://finch.stuffwithstuff.com/index.html
   3. http://magpie-lang.org/
   4. https://github.com/munificent/vigil
   5. blog http://journal.stuffwithstuff.com/
   6. 作者参考的资料
      1. http://journal.stuffwithstuff.com/2020/04/05/crafting-crafting-interpreters/
      2. https://twitter.com/munificentbob/status/901543375945388032
      3. http://journal.stuffwithstuff.com/category/language/

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

数据类型的表示，基础类型 number/boolean/nil，对象类型 Obj。基础类型与对象类型的区分在于基础类型的大小固定且较小，可以直接有结构体表示，方便在栈上分配。
对象类型大小不确定且无长度限制，需要在运行时分配，适合分配在堆内存中。

宏参数需要用括号括起来，防止与其他语法冲突，如果宏参数被多次使用，且被展开的宏参数有副作用的话会造成多次副作用，下面例子中的宏使用函数实现，避免这个问题。

```c
#define IS_STRING(value) isObjType(value, OBJ_STRING)

static inline bool isObjType(Value value, ObjType type) {
return IS_OBJ(value) && AS_OBJ(value)->type == type;
}
```

使用 C 语言 struct 结构体模拟类继承效果，`ObjString`的第一个成员是基类`Obj`类型，这样任何`ObjString*`类型可以被安全的转换为基类指针类型`Obj*`。
C 语言规定结构体中字段在内存中的顺序和成员声明顺序一致，允许其中因为内存对其有 padding，成员数据之间在内存上不连续，但是第一个成员之前不能有 padding。
这样结构体的指针可以安全的转换为第一个成员类型的指针。

```c
typedef struct {
    ObjType type;
} Obj;

typedef struct {
    Obj obj;
} ObjString;

```

### 字符串

ObjString 的表示形式

1. Value -> Obj -> ObjString 使用动态分配的 Obj 中嵌套动态分配的字符串数组表示，访问字符串内容需要两次指针解引用 indirection，性能有影响。
2. 使用[flexible array members](https://en.wikipedia.org/wiki/Flexible_array_member)方法去除一层指针，
3. 每个新建的 ObjString 在堆中拷贝一个原始字符串 const char\*的副本，方便后续对象回收内存时正常调用 free 操作。但是对于只读字符串类型，多个字符串对象可以
   共享同一个内存字符串，避免多个副本。

字符串 API 的设计

1. 什么是单个字符？ ASCII, Unicode，Unicode 中有单个码点（Code Point）代表一个字符，也有多个组合字符（combining character）由多个码点组成。
2. 内存中如何表示单个码点
   1. ASCII 只支持英文
   2. UTF-32 支持所有 Unicode 字符集，定长表示,O(1)访问第 i 个字符，太浪费空间
   3. UTF-16 支持所有 Unicode 字符集,变长表示，浪费空间
   4. UTF-8 支持所有 Unicode 字符集，变长表示，空间紧凑，对于一个字节的字符来说和 ASCII 一致

TODO: string interning，Java 有显式的进行 API 进行 interning。
使用哈希表对所有字符串实例 ObjString 进行 interning 的操作，这时比较字符串相等只需要比较指针即可。

#### 哈希表

Load Factor 所有可能元素的个数/分桶个数, 衡量哈希表发生键冲突的可能性。

冲突解决：

1. Separate Chaining，最坏的情况下哈希表退化称为一个单项链表，查询操作由 O(1)退化为 O(n)，内存不友好，破坏 Locality 原则。
2. Open Addressing(closed hashing)，存在键值冲突时，寻找下一个合适的 bucket，probing，寻找 bucket 的顺序叫做 probe sequence，
   1. linear probing

哈希函数

1. deterministic 同样的输入产生同样的哈希值
2. uniform 对于一组输入，产生的哈希值应该均匀分布，避免聚集或者出现某种模式，减少冲突.
3. fast

FNV-1a

```c
static uint32_t hashString(const char* key, int length) {
  uint32_t hash = 2166136261u;
  for (int i = 0; i < length; i++) {
    hash ^= (uint8_t)key[i];
    hash *= 16777619;
  }
  return hash;
}
```

哈希表的操作

1. 初始化
2. 添加元素
3. 查询元素，
4. 内部操作 findEntry，存在时找到元素 Entry，不存在时找到第一个 tombstone 的位置或者空元素
5. 拷贝哈希表，不能直接拷贝内存，因为哈希表中元素插入的位置跟 size 有关，需要重新将所有元素插入一遍初始化新的哈希表。
6. 删除元素，删除元素需要使用 tombstone 元素，
7. 哈希表扩容
8. 释放内存

## 全局变量

两种语句分类

1. Declaration 声明，区别在于 Declaration 引入了一个名称绑定（Binding）。
2. Statement 普通语句

变量的相关的功能问题

1. 变量声明
   ```c
   var a = 1;
   对应bytecode
   // 效果是存储到vm的全局变量中.globals中
   //OP_DEFINE_GLOBAL "a" 1
   ```
2. 变量值读取
3. 变量值设置
4. 全局变量的名称字符串被保存到常量池中，但是同一个变量名每次使用都会生成新的变量，存在重复，浪费常量池的空间，如何优化？
5. 是否支持隐式变量声明。
6. 使用名称访问哈希表形式存储的全局变量比较慢，如何优化 ？
7. 对于可以检测出来的变量未使用情况如何进行错误处理，编译时

   ```text
   fun useVar() {
     print oops;
   }

   var ooops = "too many o's!";
   ```

## 局部变量

如果规定局部变量不能在运行时动态添加或者删除，一个局部作用域中使用的变量在编译时就完全确定，这样就可以
在编译时完成对变量的分析，将局部变量的某些操作（TODO: 具体是哪些操作，从下面的分类中做明确区分）从运行时提前到编译时，提高运行时效率。

局部变量分配在栈上，

语法作用域 (Lexical Scoping) 的含义

1. 变量定义在源码位置中所在最内层作用域
2. 外层变量内对内层作用域可见
3. 内层作用域中同名变量覆盖（shadowing）外层作用域的同名变量
4. 局部变量的生命周期从与所在作用域一致

局部变量的操作

局部变量的 ID 名称 name + 作用域嵌套深度 scopeDepth

1. 声明 declaration
2. 定义（初始化） definition/initialization
3. 初始化 两种初始化语句`var a/ var a = 1`认将 a 初始化为 nil 值，
4. 读取 未声明的变量报错（Javascript 严格模式），未初始化的变量(Javascript temporal deal zone)
5. 写入，读取变量 a 的值时，该值被保存在栈顶，此时栈中存在 a 重复的值，寄存器的虚拟机做优化。
6. 变量区分为可变和不可变
7. 同时存在的局部变量的数量限制，使用一个字节表示局部变量的栈偏移量，以下标 0 为 base，所以同时能存在的局部变量最多 256 个，可以根据需要拓展。
8. 对于 `var a = a;`的处理
9. Compiler 计算局部变量的偏移量时是线性扫描的，如何优化？
10. 错误检查
    1. 局部变量个数超过上限
    2. 重新定义局部变量
    3. 使用未初始化的局部变量 scope = -1 表示未初始化，读取变量时如果 scope = -1 表示变量 a 的初始化语句中使用了 a 本身`var a = a + 1`。

Javascript 中变量的声明

Javascript 变量隐式创建设计，造成很多 BUG。

```javascript
// VM547:1 Uncaught ReferenceError: e is not defined
let a = a + 1

// ok
var b = b + 1
```

表达式产生的值留在操作数栈顶，语句执行过程中产生副作用，栈会增加，但是执行结束后栈应该恢复到原来的高度。

局部变量语法作用域 Lexical Scope

编译时将计算局部变量偏移量，因此字节码中不存在局部变量的名称，对于 debugger 来说需要其他方式
来存储这些信息。

### 重复声明

同一个作用域中重新声明同名变量，Javascript var 允许 let/const 不允许， REPL 环境下允许 rust 允许。

## 流程控制

使用 OP_JUMP_IF_FALSE/OP_JUMP 指令，接受两字节跳转参数作为 ip 跳转偏移量。

1. if/else 语句，注意语句在执行完成后操作数栈应该恢复到原来的深度，使用 OP_POP 弹出操作数
2. 逻辑操作符
   1. a and b，短路逻辑，a 为真值时不对 b 进行求值操作，表达式的值就是 a 的值；a 为假值时对 b 求值，表达式的值就是 b 的值，表达式值不被转换为布尔值。使用一个 OP_JUMP_IF_FALSE 指令和 OP_POP 指令实现。
   2. a or b, 类似逻辑，可以使用一个 OP_JUMP_IF_FALSE，一个 OP_JUMP 和一个 OP_POP 实现
   3. or 使用了三个指令会比 and 执行慢一个指令，可以通过添加新执行 OP_JUMP_IF_TRUE 实现，不添加新指令如何实现？
3. while loop condition 只能是表达式？
4. for loop initializer 可以是变量声明或者表达式，不同的处理，对于栈影响不同。
5. continue 跳转到最近一层的下次循环顶部，相当于跳过剩余循环体的执行；continue 必须被循环体包围，否则是语法错误；注意 continue 跳转出，内部 scope 结束，其中局部变量应该被清理。
6. continue label 调到指定语句
7. break 结束最近一层的循环，同样注意局部变量和作用域的处理
8. switch case
9. rust 的 loop

Goto Statement Considered Harmful

break 只能中断一层循环，中断多层循环的写法比较麻烦，使用 goto 简洁很多。

```c
// See if the matrix contains a zero.
bool found = false;
for (int x = 0; x < xSize; x++) {
  for (int y = 0; y < ySize; y++) {
    for (int z = 0; z < zSize; z++) {
      if (matrix[x][y][z] == 0) {
        printf("found");
        found = true;
        break;
      }
    }
    if (found) break;
  }
  if (found) break;
}

for (int x = 0; x < xSize; x++) {
   for (int y = 0; y < ySize; y++) {
      for (int z = 0; z < zSize; z++) {
         if (matrix[x][y][z] == 0) {
            printf("found");
            goto done;
         }
      }
   }
}
done:
```

## 函数

1. 函数定义
1. 函数调用
1. 递归支持
1. inline
1. 函数参数
1. 函数返回值
1. 变长参数
1. 嵌套函数定义
1. first-class function
1. native function
1. closure
1. tail call optimization
