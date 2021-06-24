import { Expression, MemberExpression } from '../AST'
import { TokenType, Token } from '../Token'
import { InfixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class LeftSquareParselet implements InfixParselet {
  constructor(private precedence: number) {}

  parse(parser: ParseletParser, result: Expression, token: Token) {
    const property = parser.expression(0)

    parser.consume(TokenType.RightSquare)

    return new MemberExpression(result, property, true)
  }

  getPrecedence() {
    return this.precedence
  }
}
