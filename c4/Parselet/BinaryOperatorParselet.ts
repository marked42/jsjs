import type { InfixParselet } from './Parselet'
import type { ParseletParser } from './ParseletParser'
import { BinaryExpression, Expression } from '../AST'
import type { Token } from '../Token'
import { BinaryOperator } from './Operator'

export class BinaryOperatorParselet implements InfixParselet {
  constructor(
    private op: BinaryOperator,
    private compose?: (
      left: Expression,
      right: Expression,
      token: Token
    ) => Expression
  ) {}

  parse(parser: ParseletParser, result: Expression, token: Token) {
    const right = parser.expression(this.op.rightBindingPower())

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
    return this.op.leftBindingPower()
  }
}
