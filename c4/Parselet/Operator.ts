export interface Operator {
  leftBindingPower(): number
  rightBindingPower(): number
}

export type OperatorAssociativity = 'left' | 'right'

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

/**
 * 前缀操作符
 */
export class PrefixOperator extends PrecedentialOperator {
  constructor(precedence: number) {
    super(precedence, {
      hasPrecedingOperand: false,
      hasFollowingOperand: true,
      isFirstOperator: true,
      isLastOperator: true,
      expressionStartWithOperand: false,
    })
  }
}

/**
 * 后缀操作符
 */
export class PostfixOperator extends PrecedentialOperator {
  constructor(precedence: number) {
    super(precedence, {
      hasPrecedingOperand: true,
      hasFollowingOperand: false,
      isFirstOperator: true,
      isLastOperator: true,
      expressionStartWithOperand: true,
    })
  }
}

/**
 * 据两个或者以上操作符的表达式中，最后一个操作符，后面跟一个操作数，且具有结合性
 * 1. ':' in 'a ? b : c'，':'后边有操作数，有结合
 * 1. 'op2' in 'op1 b op2 c'，'op2'后边有操作数，但是没有结合性
 */
export class LastAssociativeOperator extends PrecedentialOperator {
  constructor(precedence: number, associativity: OperatorAssociativity) {
    super(precedence, {
      hasPrecedingOperand: true,
      isFirstOperator: false,
      hasFollowingOperand: true,
      isLastOperator: true,
      expressionStartWithOperand: true,
      associativity,
    })
  }
}
