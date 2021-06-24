import { ParseletParser } from './ParseletParser'
import { Expression } from '../AST'
import { Token } from '../Token'

export interface PrefixParselet {
  parse(parser: ParseletParser, token: Token): Expression
}

export interface InfixParselet {
  parse(parser: ParseletParser, result: Expression, token: Token): Expression
  getPrecedence(): number
}
