import { Operator, OperatorAssociativity } from './Operator'
import { OperatorPrecedence } from './OperatorPrecedence'

function leftBindingPower(
  precedence: OperatorPrecedence,
  options: {
    hasPrecedingOperand: boolean
    isFirstOperator: boolean
  }
) {
  const { hasPrecedingOperand, isFirstOperator } = options
  if (!hasPrecedingOperand) {
    throw new Error('operator has no left binding power')
  }

  if (isFirstOperator) {
    return precedence
  }

  return precedence.end()
}

function rightBindingPower(
  precedence: OperatorPrecedence,
  options: {
    hasFollowingOperand: boolean
    isLastOperator: boolean
    expressionStartWithOperand: boolean
    associativity?: OperatorAssociativity
  }
) {
  const {
    hasFollowingOperand,
    isLastOperator,
    expressionStartWithOperand,
    associativity,
  } = options
  if (!hasFollowingOperand) {
    throw new Error('operator has no right binding power')
  }

  if (!isLastOperator) {
    return precedence.start()
  }

  if (!expressionStartWithOperand || associativity === 'right') {
    return precedence
  }

  return precedence.higherPrecedenceByOneLevel()
}

/**
 * decide operator left binding power and right binding power according to
 * whether operator has left or right operand and operator position in expression.
 */
export class PrecedentialOperator extends Operator {
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
    const p = OperatorPrecedence.of(precedence)
    super(leftBindingPower(p, options), rightBindingPower(p, options))
  }
}
