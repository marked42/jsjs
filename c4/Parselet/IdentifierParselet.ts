import { Identifier } from '../AST'
import { StringNameToken } from '../Token'
import { PrefixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class IdentifierParselet implements PrefixParselet {
  parse(parser: ParseletParser, token: StringNameToken) {
    return new Identifier(token.name)
  }
}
