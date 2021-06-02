grammar Expr;

@header {
package tools;
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

stat:
	expr NEWLINE { System.out.println($expr.v); }
	| ID '=' expr NEWLINE { memory.put($ID.text, $expr.v); }
	| NEWLINE;

expr
	returns[int v]:
	ID {
    String id = $ID.text;
    $v = memory.getOrDefault(id, 0);
  }
	| NUMBER { $v = $NUMBER.int; }
	| a = expr op = (ADD | SUB) b = expr { $v = eval($a.v, $op.type, $b.v); }
	| a = expr op = (MUL | DIV) b = expr { $v = eval($a.v, $op.type, $b.v); }
	| '(' expr ')' { $v = $expr.v; };

MUL: '*';
DIV: '/';
ADD: '+';
SUB: '-';

ID: [a-zA-Z]+;
NUMBER: [0-9]+;
NEWLINE: '\r'? '\n';
