import { Expression } from '../AST'
import { Token } from '../Token'
import { Operator } from './Operator'
import { InfixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class NonFirstOperatorParselet implements InfixParselet {
  constructor(private op: Operator) {}

  parse(parser: ParseletParser, result: Expression, token: Token): Expression {
    throw new Error(
      'parse method of non-first operator parselet should not get called.'
    )
  }

  getPrecedence() {
    return this.op.leftBindingPower()
  }
}
