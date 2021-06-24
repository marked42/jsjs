import { TokenType } from '../Token'

export type OperatorAssociativity = 'left' | 'right'

export abstract class Operator {
  constructor(
    public readonly token: TokenType,
    public readonly precedence: number
  ) {}
}

export class BoundaryOperator extends Operator {
  constructor(public token: TokenType) {
    // TODO: remove this -1
    super(token, -1)
  }
}

export class PrefixOperator extends Operator {}

export class PostfixOperator extends Operator {}

export class AssociativeOperator extends Operator {
  constructor(
    public readonly token: TokenType,
    public readonly precedence: number,
    public readonly associativity: OperatorAssociativity
  ) {
    super(token, precedence)
  }
}
