import { Bindable } from './Bindable'
import { OperatorPrecedence } from './OperatorPrecedence'

export type OperatorAssociativity = 'left' | 'right'

export class Operator implements Bindable {
  constructor(
    private lbp: OperatorPrecedence,
    private rbp: OperatorPrecedence
  ) {}

  leftBindingPower() {
    return this.lbp
  }

  rightBindingPower() {
    return this.rbp
  }
}
