import { Operator, OperatorAssociativity } from './Operator'

interface OperatorPrecedence {
  value(): number

  /**
   * 最低的优先级，解析表达式时依次作为初始的优先级，任何操作符的优先级都大于此优先级
   */
  min(): OperatorPrecedence

  higherPrecedenceByOne(): OperatorPrecedence

  /**
   *
   * @param op
   * @returns -1表示小于目标优先级，0表示等于目标优先级，1表示大于目标优先级
   */
  compare(op: OperatorPrecedence): number
}

export class IncreasingOperatorPrecedence implements OperatorPrecedence {
  private static min = new IncreasingOperatorPrecedence()

  value(): number {
    throw new Error('Method not implemented.')
  }

  min(): IncreasingOperatorPrecedence {
    return IncreasingOperatorPrecedence.min
  }

  higherPrecedenceByOne() {
    // TODO:
    return IncreasingOperatorPrecedence.min
  }

  compare(op: IncreasingOperatorPrecedence): number {
    throw new Error('Method not implemented.')
  }
}

/**
 * decide operator left binding power and right binding power according to
 * whether operator has left or right operand and operator position in expression.
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
