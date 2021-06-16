grammar C4;

program: globalDeclaration+;

globalDeclaration:
	enumDeclaration
	| variableDeclaration
	| functionDeclaration;

enumDeclaration:
	'enum' Id? '{' enumConstant (',' enumConstant)* '}';
enumConstant: Id ('=' Number)?;

// 不支持变量声明的同时初始化
variableDeclaration: type variable (',' variable)*;
variable: '*'* Id;

type: ('int' | 'char');

functionDeclaration:
	type variable '(' functionParameterList ')' '{' functionBody '}';

functionParameterList:
	functionParameter (',' functionParameter)*;

functionParameter: type variable;

functionBody: variableDeclaration? statement*;

statement: emptyStatement | nonEmptyStatement;

nonEmptyStatement:
	ifStatement
	| whileStatement
	| blockStatement
	| returnStatement
	| expressionStatement;

ifStatement:
	'if' '(' expr ')' statement ('else' nonEmptyStatement)?;
whileStatement: 'while' '(' expr ')' nonEmptyStatement;
blockStatement: '{' statement* '}';
returnStatement: 'return' expr?;
emptyStatement: ';';
expressionStatement: expr ';';

expr:
	Id
	| Number
	| String
	| 'sizeof' expr
	| '!' expr
	| '-' expr
	| '+' expr
	| '~' expr
	| '*' expr
	| '&' expr
	// expr必须是左值
	| expr '++'
	// expr必须是左值
	| expr '--'
	| '(' expr ')'
	// 等号左边必须是左值
	| expr '=' expr
	| expr '?' expr ':' expr
	| expr '(' expr (',' expr)* ')'
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
	| expr '^' expr;

Id: [a-zA-Z_][a-zA-Z0-9_]*;

String: '"' (~["\\\r\n] | EscapeSequence | LineContinuation)* '"';

fragment LineContinuation: '\\\r\n' | '\\\r' | '\\\n';
// "\c" unknown escape sequence 其中'\'被忽略
fragment EscapeSequence: '\\' ['"?abfnrtv\\];

Comment: '//' ~[\r\n]* -> skip;

Whitespace: [ \t] -> skip;

Newline: ('\r''\n'? | '\n') -> skip;

Number:
	'0'
	| [1-9][0-9]*
	| '0' ('x' | 'X') [0-9A-Fa-f]+
	| '0' [0-7]+;
