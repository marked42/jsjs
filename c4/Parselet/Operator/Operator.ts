import { Bindable } from './Bindable'
import { OperatorPrecedence } from './OperatorPrecedence'

export type OperatorAssociativity = 'left' | 'right'

export class Operator implements Bindable {
  constructor(
    private lbp?: OperatorPrecedence,
    private rbp?: OperatorPrecedence
  ) {}

  leftBindingPower() {
    if (!this.lbp) {
      throw new Error('operator has no left binding power')
    }

    return this.lbp
  }

  rightBindingPower() {
    if (!this.rbp) {
      throw new Error('operator has no right binding power')
    }
    return this.rbp
  }
}
