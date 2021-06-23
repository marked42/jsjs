import { TokenType, Token } from '../Token'
import { PrefixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class LeftParenParselet implements PrefixParselet {
  parse(parser: ParseletParser, token: Token) {
    const expr = parser.expression(0)

    expr.parenthesized = true
    parser.consume(TokenType.RightParen)

    return expr
  }
}
