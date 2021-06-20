export enum ASTNodeType {
  Identifier = 'Identifier',
  NumericLiteral = 'NumericLiteral',
  StringLiteral = 'StringLiteral',
  UnaryExpression = 'UnaryExpression',
  BinaryExpression = 'BinaryExpression',
  LogicalExpression = 'LogicalExpression',

  MemberExpression = 'MemberExpression',
  ConditionalExpression = 'ConditionalExpression',

  VariableDeclaration = 'VariableDeclaration',
  VariableDeclarator = 'VariableDeclarator',
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

export type BinaryOperator =
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
  | '&&'
  | '||'
  | '&'
  | '|'
  | '^'

export class MemberExpression extends Expression {
  constructor(
    public object: Expression,
    public property: Expression,
    public computed = false
  ) {
    super(ASTNodeType.MemberExpression)
  }
}

export class BinaryExpression extends Expression {
  constructor(
    public left: Expression,
    public right: Expression,
    public op: BinaryOperator
  ) {
    super(ASTNodeType.BinaryExpression)
  }
}

type LogicalOperator = '&&' | '||'

export class LogicalExpression extends Expression {
  constructor(
    public left: Expression,
    public right: Expression,
    public op: LogicalOperator
  ) {
    super(ASTNodeType.LogicalExpression)
  }
}
