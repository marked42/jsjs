grammar JSON;

json: object | array | NUMBER | STRING | BOOLEAN | NULL;

object: '{' '}' | '{' pair (',' pair)* '}';

pair: STRING ':' json;

array: '[' ']' | '[' json (',' json)* ']';

NUMBER: INTEGRAL FRACTION EXPONENT;

fragment INTEGRAL: '-'? ('0' | [1-9][0-9]*);

fragment FRACTION: | '.' DIGIT+;

fragment EXPONENT: | [e|E][+|-]? DIGITS;

fragment DIGITS: DIGIT+;

fragment DIGIT: [0-9];

STRING: '"' (ESC | ~["\\])* '"';

fragment ESC:
	'\\' (
		[bfnrt"\\]
		| 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	);

fragment HEX_DIGIT: [0-9a-fA-F];

WS: [ \r\n\t]+ -> skip;

NULL: 'null';

BOOLEAN: 'true' | 'false';
