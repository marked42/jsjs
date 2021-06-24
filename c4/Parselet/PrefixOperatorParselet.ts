import { UnaryExpression } from '../AST'
import { TokenWithSource } from '../Token'
import { PrefixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class PrefixOperatorParselet implements PrefixParselet {
  constructor(private precedence: number) {}

  parse(parser: ParseletParser, token: TokenWithSource) {
    const expr = parser.expression(this.precedence)

    return new UnaryExpression(expr, token.source, true)
  }
}
