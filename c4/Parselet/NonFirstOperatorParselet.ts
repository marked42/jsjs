import { Expression } from '../AST'
import { Token } from '../Token'
import { Operator } from './Operator/Operator'
import { OperatorInfixParselet } from './OperatorInfixParselet'
import { ParseletParser } from './ParseletParser'

/**
 * 除了第一个操作符，其他操作符对应的parselet
 */
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
