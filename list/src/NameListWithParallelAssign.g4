grammar NameListWithParallelAssign;
options {backtrack=true;}

stat: list EOF | assign EOF;

assign: list '=' list;

list: '[' elements ']';

elements: element (',' element);

element: NAME '=' NAME | NAME | list;

NAME: LETTER+;

fragment LETTER: 'a'..'z' | 'A'..'Z';

WS: (' ' | '\t' | '\n' | '\r')+ -> skip;
