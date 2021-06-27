import { PrecedentialOperator } from './PrecedentialOperator'

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
