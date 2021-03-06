import { OperatorAssociativity } from './Operator'
import { PrecedentialOperator } from './PrecedentialOperator'

/**
 * 二元操作符
 */
export class BinaryOperator extends PrecedentialOperator {
  constructor(precedence: number, associativity: OperatorAssociativity) {
    super(precedence, {
      hasPrecedingOperand: true,
      hasFollowingOperand: true,
      isFirstOperator: true,
      isLastOperator: true,
      expressionStartWithOperand: true,
      associativity,
    })
  }
}
