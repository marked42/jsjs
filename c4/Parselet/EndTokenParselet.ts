import { Expression } from '../AST'
import { Token } from '../Token'
import { InfixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class EndTokenParselet implements InfixParselet {
  parse(parser: ParseletParser, result: Expression, token: Token): Expression {
    throw new Error('should not execute')
  }

  getPrecedence() {
    return -1
  }
}
