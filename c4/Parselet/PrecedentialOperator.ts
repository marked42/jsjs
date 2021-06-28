import { Operator, OperatorAssociativity } from './Operator'
import { OperatorPrecedence } from './OperatorPrecedence'

/**
 * decide operator left binding power and right binding power according to
 * whether operator has left or right operand and operator position in expression.
 */
export class PrecedentialOperator implements Operator {
  protected hasPrecedingOperand = true
  protected hasFollowingOperand = true
  protected isFirstOperator = false
  protected isLastOperator = true
  protected expressionStartWithOperand = false
  protected associativity?: OperatorAssociativity

  private precedence: OperatorPrecedence
  private lbp?: OperatorPrecedence
  private rbp?: OperatorPrecedence

  constructor(
    precedence: number,
    options: {
      hasPrecedingOperand: boolean
      hasFollowingOperand: boolean
      isFirstOperator: boolean
      isLastOperator: boolean
      expressionStartWithOperand: boolean
      associativity?: OperatorAssociativity
    }
  ) {
    const {
      hasPrecedingOperand,
      hasFollowingOperand,
      isFirstOperator,
      isLastOperator,
      expressionStartWithOperand,
      associativity,
    } = options
    // hasFollowingOperand = true;
    // isLastOperator = true
    // expressionStartWithOperand = true
    // associativity 才有意义
    this.hasPrecedingOperand = hasPrecedingOperand
    this.hasFollowingOperand = hasFollowingOperand
    this.isFirstOperator = isFirstOperator
    this.isLastOperator = isLastOperator
    this.expressionStartWithOperand = expressionStartWithOperand
    this.associativity = associativity

    this.precedence = OperatorPrecedence.of(precedence)
  }

  leftBindingPower() {
    if (typeof this.lbp === 'undefined') {
      this.lbp = this._leftBindingPower()
    }
    return this.lbp
  }

  private _leftBindingPower() {
    if (!this.hasPrecedingOperand) {
      throw new Error('operator has no left binding power')
    }

    if (this.isFirstOperator) {
      return this.precedence
    }

    return this.precedence.end()
  }

  rightBindingPower() {
    if (typeof this.rbp === 'undefined') {
      this.rbp = this._rightBindingPower()
    }
    return this.rbp
  }

  private _rightBindingPower() {
    if (!this.hasFollowingOperand) {
      throw new Error('operator has no right binding power')
    }

    if (!this.isLastOperator) {
      return this.precedence.start()
    }

    if (!this.expressionStartWithOperand || this.associativity === 'right') {
      return this.precedence
    }

    return this.precedence.higherPrecedenceByOneLevel()
  }
}
