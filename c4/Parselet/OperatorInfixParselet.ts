import { ParseletParser } from './ParseletParser'
import { Expression } from '../AST'
import { Token } from '../Token'
import { Operator } from './Operator'
import { InfixParselet } from './Parselet'

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
