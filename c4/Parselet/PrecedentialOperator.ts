import { Operator, OperatorAssociativity } from './Operator'

/**
 * decide operator left binding power and right binding power according to
 * whether operator has left or right operand and operation position in expression.
 */

export class PrecedentialOperator implements Operator {
  private hasPrecedingOperand = true
  private hasFollowingOperand = true
  private isFirstOperator = false
  private isLastOperator = true
  private expressionStartWithOperand = false
  private associativity?: OperatorAssociativity

  constructor(
    private readonly precedence: number,
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
  }

  leftBindingPower() {
    if (!this.hasPrecedingOperand) {
      throw new Error('operator has no left binding power')
    }

    if (this.isFirstOperator) {
      return this.precedence
    }

    return -1
  }

  rightBindingPower() {
    if (!this.hasFollowingOperand) {
      throw new Error('operator has no right binding power')
    }

    if (!this.isLastOperator) {
      return 0
    }

    if (!this.expressionStartWithOperand || this.associativity === 'right') {
      return this.precedence
    }

    return this.precedence + 1
  }
}
