grammar NestedNameList;

list: '[' elements ']';
elements: element (',' element)*;

element: NAME | list | NAME '=' NAME;

NAME: [a-zA-Z]+;

WS: [ \t\r\n]+;
