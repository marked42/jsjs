import type { InfixParselet } from './Parselet'
import type { ParseletParser } from './ParseletParser'
import { BinaryExpression, Expression } from '../AST'
import type { Token } from '../Token'
import { AssociativeOperator } from './Operator'

export class BinaryOperatorParselet implements InfixParselet {
  constructor(
    private readonly operator: AssociativeOperator,
    private compose?: (
      left: Expression,
      right: Expression,
      token: Token
    ) => Expression
  ) {}

  parse(parser: ParseletParser, result: Expression, token: Token) {
    const minPrecedence =
      this.operator.associativity === 'left'
        ? this.operator.precedence + 1
        : this.operator.precedence
    const right = parser.expression(minPrecedence)

    const defaultCompose = (
      left: Expression,
      right: Expression,
      token: Token
      // @ts-ignore TODO:
    ) => new BinaryExpression(left, right, token.source as any)
    const compose = this.compose || defaultCompose
    return compose(result, right, token)
  }

  getPrecedence() {
    return this.operator.precedence
  }
}
