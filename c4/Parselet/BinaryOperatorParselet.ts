import { OperatorInfixParselet } from './OperatorInfixParselet'
import type { ParseletParser } from './ParseletParser'
import { BinaryExpression, Expression } from '../AST'
import type { Token } from '../Token'
import { BinaryOperator } from './BinaryOperator'

export class BinaryOperatorParselet extends OperatorInfixParselet {
  constructor(
    op: BinaryOperator,
    private compose?: (
      left: Expression,
      right: Expression,
      token: Token
    ) => Expression
  ) {
    super(op)
  }

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
}
