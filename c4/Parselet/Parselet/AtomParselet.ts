import { Expression } from '../../AST'
import { Token } from '../../Token'
import { PrefixParselet } from './Parselet'
import { ParseletParser } from '../ParseletParser'

export class AtomParselet<T extends Token> implements PrefixParselet {
  constructor(private compose: (token: T) => Expression) {}

  parse(parser: ParseletParser, token: T) {
    return this.compose(token)
  }
}
