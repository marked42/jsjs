import type { InfixParselet } from './Parselet'
import type { ParseletParser } from './ParseletParser'
import { BinaryExpression, Expression } from '../AST'
import { OperatorAssociativity } from '../Operators'
import type { Token } from '../Token'

export class BinaryOperatorParselet implements InfixParselet {
  constructor(
    private precedence: number,
    private associativity: OperatorAssociativity,
    private compose?: (
      left: Expression,
      right: Expression,
      token: Token
    ) => Expression
  ) {}

  parse(parser: ParseletParser, result: Expression, token: Token) {
    const minPrecedence =
      this.associativity === 'left' ? this.precedence + 1 : this.precedence
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
    return this.precedence
  }
}
