export enum ASTNodeType {
  Identifier = 'Identifier',
  NumericLiteral = 'NumericLiteral',
  StringLiteral = 'StringLiteral',
  UnaryExpression = 'UnaryExpression',
  BinaryExpression = 'BinaryExpression',
  LogicalExpression = 'LogicalExpression',
  AssignmentExpression = 'AssignmentExpression',

  MemberExpression = 'MemberExpression',
  PointerMemberExpression = 'PointerMemberExpression',
  ConditionalExpression = 'ConditionalExpression',

  CallExpression = 'CallExpression',

  VariableDeclaration = 'VariableDeclaration',
  VariableDeclarator = 'VariableDeclarator',

  SequenceExpression = 'SequenceExpression',
}

export abstract class ASTNode {
  constructor(public type: ASTNodeType) {}
}

export abstract class Expression extends ASTNode {
  constructor(type: ASTNodeType, public parenthesized = false) {
    super(type)
  }
}

export class Identifier extends Expression {
  constructor(public name: string) {
    super(ASTNodeType.Identifier)
  }
}

export class StringLiteral extends Expression {
  constructor(public value: string) {
    super(ASTNodeType.StringLiteral)
  }
}

export class NumericLiteral extends Expression {
  constructor(public value: number) {
    super(ASTNodeType.NumericLiteral)
  }
}

export type UnaryOperator =
  | 'sizeof'
  | '!'
  | '+'
  | '-'
  | '~'
  | '*'
  | '&'
  | '++'
  | '--'

export class UnaryExpression extends Expression {
  constructor(
    public operand: Expression,
    public op: string,
    public prefix: boolean
  ) {
    super(ASTNodeType.UnaryExpression)
  }
}

export class ConditionalExpression extends Expression {
  constructor(
    public test: Expression,
    public consequent: Expression,
    public alternate: Expression
  ) {
    super(ASTNodeType.ConditionalExpression)
  }
}

export class CallExpression extends Expression {
  constructor(public callee: Expression, public params: Expression[]) {
    super(ASTNodeType.CallExpression)
  }
}

export type BaseBinaryOperator =
  | '='
  | '+'
  | '-'
  | '*'
  | '/'
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | '>>'
  | '<<'
  | '%'
  | '&'
  | '|'
  | '^'

export type BinaryOperator =
  | BaseBinaryOperator
  | AssignmentOperator
  | LogicalOperator

export class MemberExpression extends Expression {
  constructor(
    public object: Expression,
    public property: Expression,
    public computed = false
  ) {
    super(ASTNodeType.MemberExpression)
  }
}

export class PointerMemberExpression extends Expression {
  constructor(public object: Expression, public property: Expression) {
    super(ASTNodeType.PointerMemberExpression)
  }
}

export class BinaryExpression extends Expression {
  constructor(
    public left: Expression,
    public right: Expression,
    public op: BinaryOperator,
    type = ASTNodeType.BinaryExpression
  ) {
    super(type)
  }
}

type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '&='
  | '|='
  | '^|'
  | '>>='
  | '<<='

export class AssignmentExpression extends BinaryExpression {
  constructor(
    public left: Expression,
    public right: Expression,
    public op: AssignmentOperator
  ) {
    super(left, right, op, ASTNodeType.AssignmentExpression)
  }
}

type LogicalOperator = '&&' | '||'

export class LogicalExpression extends BinaryExpression {
  constructor(
    public left: Expression,
    public right: Expression,
    public op: LogicalOperator
  ) {
    super(left, right, op, ASTNodeType.LogicalExpression)
  }
}

export class SequenceExpression extends Expression {
  constructor(public expressions: Expression[]) {
    super(ASTNodeType.SequenceExpression)
  }
}
