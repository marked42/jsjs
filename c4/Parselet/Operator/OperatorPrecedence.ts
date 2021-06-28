export interface OperatorPrecedence {
  value(): number

  /**
   * 表达式解析的初始优先级，任何操作符的优先级均高于此优先级
   */
  start(): OperatorPrecedence

  /**
   * 表达式解析的结束优先级，此优先级小于任何操作符的优先级和初始优先级
   */
  end(): OperatorPrecedence

  higherPrecedenceByOneLevel(): OperatorPrecedence

  /**
   *
   * @param op
   * @returns -1表示小于目标优先级，0表示等于目标优先级，1表示大于目标优先级
   */
  compare(op: OperatorPrecedence): number
}

export interface OperatorPrecedenceClass {
  of(precedence: number): OperatorPrecedence
  start(): OperatorPrecedence
  end(): OperatorPrecedence
}

/**
 * Higher priority operator has smaller number precedence.
 * Use 0, the minimum priority number as staring priority when parsing expression.
 * Use 1 as the precedence of operator with highest priority.
 */
function getOperatorPrecedenceClass(type: 'increasing' | 'decreasing') {
  const getHigherPrecedenceByOneLevel = (precedence: number) => {
    return type === 'increasing' ? precedence + 1 : precedence - 1
  }

  const validPrecedenceRange = { min: 1, max: 1000 }
  const start =
    type === 'increasing' ? validPrecedenceRange.min : validPrecedenceRange.max
  const end = type === 'increasing' ? start - 1 : start + 1

  const compare = (left: number, right: number) => {
    const less = (left: number, right: number) => {
      return type === 'increasing' ? left < right : right < left
    }

    if (left === right) {
      return 0
    }

    return less(left, right) ? -1 : 1
  }

  return class OperatorPrecedence implements OperatorPrecedence {
    private static cache = new Map<number, OperatorPrecedence>()

    private constructor(private precedence: number) {}

    static start() {
      return OperatorPrecedence.fromCache(start)
    }

    static end() {
      return OperatorPrecedence.fromCache(end)
    }

    static of(precedence: number) {
      return OperatorPrecedence._of(precedence, true)
    }

    private static _of(precedence: number, rangeCheck: boolean) {
      const { min, max } = validPrecedenceRange
      if (rangeCheck && (precedence < min || precedence > max)) {
        throw new Error(
          `precedence must be integer within [${min}, ${max}], get ${precedence}.`
        )
      }
      return OperatorPrecedence.fromCache(precedence)
    }

    private static fromCache(precedence: number) {
      const instance = OperatorPrecedence.cache.get(precedence)
      if (instance) {
        return instance
      }

      const newInstance = new OperatorPrecedence(precedence)
      OperatorPrecedence.cache.set(precedence, newInstance)

      return newInstance
    }

    value(): number {
      return this.precedence
    }

    start() {
      return OperatorPrecedence.start()
    }

    end() {
      return OperatorPrecedence.end()
    }

    higherPrecedenceByOneLevel() {
      return OperatorPrecedence._of(
        getHigherPrecedenceByOneLevel(this.precedence),
        false
      )
    }

    compare(op: OperatorPrecedence): -1 | 0 | 1 {
      return compare(this.precedence, op.precedence)
    }
  }
}

/**
 * switch to IncreasingOperatorPrecedence if needed
 */
export const OperatorPrecedence = getOperatorPrecedenceClass('increasing')
