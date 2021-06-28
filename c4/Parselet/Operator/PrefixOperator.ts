import { PrecedentialOperator } from './PrecedentialOperator'

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
