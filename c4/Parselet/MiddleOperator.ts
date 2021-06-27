import { PrecedentialOperator } from './Operator'

/**
 * 有至少三个操作符的表达式，中间的操作符
 * 1. 'a op1 b op2 c op3' 中间的 'op2'
 */

export class MiddleOperator extends PrecedentialOperator {
  constructor(precedence: number) {
    super(precedence, {
      hasPrecedingOperand: true,
      hasFollowingOperand: true,
      isFirstOperator: false,
      isLastOperator: false,
      // don't care
      expressionStartWithOperand: false,
    })
  }
}
