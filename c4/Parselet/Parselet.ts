import { ParseletParser } from './ParseletParser'
import { Expression } from '../AST'
import { Token } from '../Token'
import { Operator } from './Operator'

export interface PrefixParselet {
  parse(parser: ParseletParser, token: Token): Expression
}

export interface InfixParselet {
  parse(parser: ParseletParser, result: Expression, token: Token): Expression
  leftBindingPower(): number
}

export abstract class OperatorInfixParselet implements InfixParselet {
  constructor(protected op: Operator) {}

  abstract parse(
    parser: ParseletParser,
    result: Expression,
    token: Token
  ): Expression

  leftBindingPower() {
    return this.op.leftBindingPower()
  }
}
