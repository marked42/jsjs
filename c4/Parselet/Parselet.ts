import { ParseletParser } from './ParseletParser'
import { Expression } from '../AST'
import { Token } from '../Token'
import { OperatorPrecedence } from './OperatorPrecedence'

export interface PrefixParselet {
  parse(parser: ParseletParser, token: Token): Expression
}

export interface InfixParselet {
  parse(parser: ParseletParser, result: Expression, token: Token): Expression
  leftBindingPower(): OperatorPrecedence
}
