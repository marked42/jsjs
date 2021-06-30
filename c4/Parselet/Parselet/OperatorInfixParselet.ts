import { ParseletParser } from '../ParseletParser'
import { Expression } from '../../AST'
import { Token } from '../../Token'
import { Bindable } from '../Operator/Bindable'
import { InfixParselet } from './Parselet'

export abstract class OperatorInfixParselet implements InfixParselet {
  constructor(protected op: Bindable) {}

  abstract parse(
    parser: ParseletParser,
    result: Expression,
    token: Token
  ): Expression

  leftBindingPower() {
    return this.op.leftBindingPower()
  }
}
