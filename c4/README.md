# c4 in js

## 分词

1. 忽略宏
1. 只支持单行注释
1. 标识符
1. 数字支持 十进制、八进制、十六进制
1. 字符串 只支持转义字符'\n'
1. 字符类型
1. 操作符

```cpp
Assign =
Cond ?
Lor ||
Lan &&
Or |
And &
Eq ==
Ne !=
Lt <
Gt >
Le <=
Ge >=
Shl <<
Shr >>
Add +
Sub -
Mul *
Div /
Mod %
Inc ++
Dec --
Brak [
```

1. 标点符号

## 语法

语法

```g4
program: globalDeclaration+;

globalDeclaration: enumDeclaration | variableDeclaration | functionDeclaration;

enumDeclaration: 'enum' Id? '{' enumConstant (',' enumConstant)* '}';
enumConstant: Id ('=' Number)?

// 不支持变量声明的同时初始化
variableDeclaration: type variableDeclarator (',' variableDeclarator)*;
variableDeclarator: '*'* Id;
type: ('int' | 'char');

functionDeclaration: type '*'* id '(' functionParameterList ')' '{' functionBody '}'

functionParameterList: functionParameter (',' functionParameter)*;

functionParameter: type '*'* id;

functionBody: variableDeclaration statement*;

statement: emptyStatement | nonEmptyStatement;

nonEmptyStatement: ifStatement | whileStatement | blockStatement | returnStatement | expressionStatement;

ifStatement: 'if' '(' expr ')' statement ('else' nonEmptyStatement)?;
whileStatement: 'while' '(' expr ')' nonEmptyStatement;
blockStatement: '{' statement* '}';
returnStatement: 'return' expr?;
emptyStatement: ';';
expressionStatement: expr ';';

expr
	: Id
	| Number
	| String
	| 'sizeof' expr
	| '!' expr
	| '-' expr
	| '+' expr
	| '~' expr
	| '*' expr
	| '&' expr
	| expr '++'
	| expr '--'
	| '(' expr ')'
	| Id '=' expr
	| expr '?' expr ':' expr
	| Id '(' Id (',' Id)* ')'
	| expr ('+' | '-') expr
	| expr ('*' | '/') expr
	| expr ('==' | '!=' | '>' | '>=' | '<' | '<=') expr
	| expr ('>>' | '<<') expr
	| expr ('%') expr
	| expr '[' expr ']'
	| expr '&&' expr
	| expr '||' expr
	| expr '&' expr
	| expr '|' expr
	| expr '^' expr
	;
```

程序结构自定向下

program -> declaration -> statement -> expression -> token
