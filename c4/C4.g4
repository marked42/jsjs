grammar C4;

program: globalDeclaration+;

globalDeclaration:
	enumDeclaration
	| variableDeclaration
	| functionDeclaration;

enumDeclaration:
	'enum' Identifier? '{' enumConstant (',' enumConstant)* '}';
enumConstant: Identifier ('=' NumericLiteral)?;

// 不支持变量声明的同时初始化
variableDeclaration: type variable (',' variable)*;
variable: '*'* Identifier;

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
	Identifier
	| NumericLiteral
	| StringLiteral
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

Identifier: [a-zA-Z_][a-zA-Z0-9_]*;

StringLiteral:
	'"' (~["\\\r\n] | EscapeSequence | LineContinuation)* '"';

fragment LineContinuation: '\\\r\n' | '\\\r' | '\\\n';
// "\c" unknown escape sequence 其中'\'被忽略
fragment EscapeSequence: '\\' ['"?abfnrtv\\];

LineComment: '//' ~[\r\n]* -> skip;

Whitespace: [ \t] -> skip;

Newline: ('\r' '\n'? | '\n') -> skip;

NumericLiteral:
	'0'
	| [1-9][0-9]*
	| '0' ('x' | 'X') [0-9A-Fa-f]+
	| '0' [0-7]+;
