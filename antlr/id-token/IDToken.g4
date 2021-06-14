grammar IDToken;

@parser::members {
    public static boolean id = false;
}

expr: variable | template;

template: RAW_STR? (variable RAW_STR?)* |;

variable: idExpr | memberExpr;

idExpr: LB  identifier ('.' identifier | property)* RB;

memberExpr: LB  identifier ('.' identifier | property)* RB;

identifier: name=ID;

property: '[' (NUMBER | variable)']';

NUMBER: [0-9]+;

LB: '{' { IDTokenParser.id = true; System.out.println(IDTokenParser.id);};

RB: '}' { IDTokenParser.id = false; System.out.println(IDTokenParser.id);};

ID: ID_Start ID_Continue* {System.out.println("id"); System.out.println(IDTokenParser.id); } {IDTokenParser.id}?;

fragment ID_Start: [_a-zA-Z];
fragment ID_Continue: [_0-9a-zA-Z];

RAW_STR:  ~["'{}[\]$@\r\n]+ {System.out.println("raw id"); System.out.println(IDTokenParser.id); } {!IDTokenParser.id}?;

WS: [ \r\n\t]+ -> skip;
