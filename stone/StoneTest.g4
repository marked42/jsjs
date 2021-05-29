grammar StoneTest;

program: statement+;

statement
    : Number
    | Identifier
    | String
    | Punctuator
    | Whitespace
    ;

Number
    : '0'
    | [1-9][0-9]+
    ;

Identifier
    : ID_Start ID_Continue*;

fragment ID_Start: [_a-zA-Z];
fragment ID_Continue: [_a-zA-Z0-9];

Whitespace: [ \t\n\r]+ -> skip;

Punctuator
    : ('*' | '==' | '<=' | '>=' | '&&' | '||');

String
    : '"' (EscapeSequence | NonEscapeSequence)* '"';

fragment EscapeSequence: '\\' ;

fragment NonEscapeSequence: ~["\n\r\\];
