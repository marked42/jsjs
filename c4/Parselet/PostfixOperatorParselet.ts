import { Expression, UnaryExpression } from '../AST'
import { TokenWithSource } from '../Token'
import { InfixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class PostfixOperatorParselet implements InfixParselet {
  constructor(private precedence: number) {}

  parse(parser: ParseletParser, result: Expression, token: TokenWithSource) {
    return new UnaryExpression(result, token.source, false)
  }

  getPrecedence() {
    return this.precedence
  }
}
