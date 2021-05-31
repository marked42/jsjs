grammar Expr;

@header {
import java.util.*;
}

@parser::members {
  Map<String, Integer> memory = new HashMap<>();

  int eval(int op, int left, int right) {
    switch (op) {
      case MUL: return left * right;
      case DIV: return left / right;
      case ADD: return left + right;
      case SUB: return left - right;
    }
    return 0;
  }
}

prog: stat+;

stat: expr NEWLINE | ID '=' expr NEWLINE | NEWLINE;

expr:
	expr ADD expr
	| expr SUB expr
	| expr MUL expr
	| expr DIV expr
	| '(' expr ')'
	| NUMBER
	| expr '/' expr;

MUL: '*';
DIV: '/';
ADD: '+';
SUB: '-';

ID: [a-zA-Z]+;
NUMBER: [0-9]+;
NEWLINE: '\r'? '\n';
