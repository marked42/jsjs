grammar NestedNameList;

list: '[' elements ']';
elements: element (',' element)*;

element
	: NAME
	| list	// ll1
	| NAME '=' NAME // llk
	;

NAME: [a-zA-Z]+;

WS: [ \t\r\n]+;
