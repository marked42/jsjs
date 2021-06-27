import { Expression } from '../AST'
import { Token } from '../Token'
import { Operator } from './Operator'
import { OperatorInfixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class NonFirstOperatorParselet extends OperatorInfixParselet {
  constructor(op: Operator) {
    super(op)
  }

  parse(parser: ParseletParser, result: Expression, token: Token): Expression {
    throw new Error(
      'parse method of non-first operator parselet should not get called.'
    )
  }
}
