import type { InfixParselet } from './Parselet'
import type { ParseletParser } from './ParseletParser'
import { BinaryExpression, Expression } from '../AST'
import { OperatorAssociativity } from '../Operators'
import type { Token } from '../Token'

export class BinaryOperatorParselet implements InfixParselet {
  constructor(
    private precedence: number,
    private associativity: OperatorAssociativity
  ) {}

  parse(parser: ParseletParser, result: Expression, token: Token) {
    const minPrecedence =
      this.associativity === 'left' ? this.precedence + 1 : this.precedence
    const right = parser.expression(minPrecedence)

    // @ts-ignore TODO:
    return new BinaryExpression(result, right, token.source)
  }

  getPrecedence() {
    return this.precedence
  }
}
