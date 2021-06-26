export abstract class Operator {
  abstract leftBindingPower(): number
  abstract rightBindingPower(): number
}

export type OperatorAssociativity = 'left' | 'right'

/**
 * 使用优先级来代表操作符左右结合性的方法，也可以使用不同的数据分别代表左右优先级
 */
export abstract class PrecedentialOperator extends Operator {
  constructor(protected readonly precedence: number) {
    super()
  }

  leftBindingPower() {
    return this.precedence
  }

  rightBindingPower() {
    return this.precedence
  }
}

/**
 * 前缀操作符
 */
export class PrefixOperator extends PrecedentialOperator {
  leftBindingPower(): number {
    throw new Error('prefix operator has no left binding power')
  }
}

/**
 * 后缀操作符
 */
export class PostfixOperator extends PrecedentialOperator {
  rightBindingPower(): number {
    throw new Error('post operator has no right binding power')
  }
}

/**
 * 有至少两个操作符的表达式中第一个操作符
 * 1. '?' in "a ? b : c"
 * 2. '(' in '( a )'
 * 3. '[' in 'a [ a ]'
 */
export class FirstOperator extends PrecedentialOperator {
  constructor(precedence: number, private hasPrecedingOperand: boolean) {
    super(precedence)
  }

  leftBindingPower() {
    if (this.hasPrecedingOperand) {
      return this.precedence
    }
    throw new Error('operator has no left binding power')
  }
}

/**
 * 有至少两个操作符的表达式中，最后一个操作符
 * 最后一个操作符
 * 	后面有没有操作数
 *   yes -> 有没有结合性 -> 左结合还是右结合
 *   no ->
 * 1. ']' in 'a [ b ]', ']'后边没有操作数
 */
export class LastOperator extends PrecedentialOperator {
  constructor(precedence: number, private hasFollowingOperand: boolean) {
    super(precedence)
  }

  rightBindingPower() {
    if (this.hasFollowingOperand) {
      return this.precedence
    }
    throw new Error('last operator has no right binding power')
  }
}

/**
 * 据两个或者以上操作符的表达式中，最后一个操作符，后面跟一个操作数，且具有结合性
 * 1. ':' in 'a ? b : c'，':'后边有操作数，有结合
 * 1. 'op2' in 'op1 b op2 c'，'op2'后边有操作数，但是没有结合性
 */
export class LastAssociativeOperator extends LastOperator {
  constructor(
    precedence: number,
    private associativity: OperatorAssociativity
  ) {
    super(precedence, true)
  }

  rightBindingPower() {
    return this.associativity === 'left' ? this.precedence + 1 : this.precedence
  }
}

/**
 * 有至少三个操作符的表达式，中间的操作符
 * 1. 'a op1 b op2 c op3' 中间的 'op2'
 */
export class MiddleOperator extends PrecedentialOperator {
  leftBindingPower() {
    return -1
  }

  rightBindingPower() {
    return 0
  }
}

/**
 * 二元操作符
 */
export class BinaryOperator extends PrecedentialOperator {
  constructor(
    precedence: number,
    private associativity: OperatorAssociativity
  ) {
    super(precedence)
  }

  rightBindingPower() {
    return this.associativity === 'left' ? this.precedence + 1 : this.precedence
  }
}
