import { NumericLiteral } from '../AST'
import { NumberValueToken } from '../Token'
import { PrefixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class NumericLiteralParselet implements PrefixParselet {
  parse(parser: ParseletParser, token: NumberValueToken) {
    return new NumericLiteral(token.value)
  }
}
