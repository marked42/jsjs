import { OperatorAssociativity } from './Operator'
import { PrecedentialOperator } from './PrecedentialOperator'

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
