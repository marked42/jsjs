import * as t from '@babel/types'

interface Frame {
  left: null | t.Expression
  minBindingPower: number
  operator: string | null
}

function parseExpression(source: string) {
  let i = 0
  const hasNextSegment = () => i < source.length
  const nextSegment = () => (hasNextSegment() ? source[i++] : null)

  // 当前帧
  let top: Frame = {
    left: null,
    minBindingPower: 0,
    operator: null,
  }
  const stack = [] as Frame[]

  for (;;) {
    const segment = nextSegment()

    for (;;) {
      const isPrefixOperator = top.left === null
      const power =
        segment === null
          ? undefined
          : getOperatorBindingPower(segment, isPrefixOperator)

      if (
        power &&
        power.leftBindingPower !== undefined &&
        power.leftBindingPower >= top.minBindingPower
      ) {
        top.operator = segment
        // 递归调用入栈
        stack.push(top)
        // 新的栈帧
        top = {
          left: null,
          minBindingPower: power.rightBindingPower || 0,
          operator: null,
        }
        break
      } else {
        if (isOperand(segment)) {
          top.left = t.numericLiteral(Number.parseInt(segment))
          break
        }

        // 递归调用返回对应出栈
        const frame = stack.pop()
        if (!frame) {
          if (hasNextSegment()) {
            throw new Error('预期到达表达式末尾，但是后面还有输入')
          }
          return top.left
        }

        // 出栈后维护上一层的栈帧
        if (frame.left === null) {
          const unary = ['+', '-', '!']
          // @ts-ignore
          if (unary.includes(frame.operator)) {
            // @ts-ignore
            top.left = t.unaryExpression(frame.operator, top.left)
            top.minBindingPower = frame?.minBindingPower || 0
          }
        } else {
          if (frame.operator === ')') {
            if (!frame.left) {
              throw new Error('右括号左侧缺少操作数')
            }

            const prevFrame = stack.pop()
            if (!prevFrame || prevFrame.operator !== '(') {
              throw new Error('没有匹配的左括号')
            }
            // @ts-ignore
            top.left = t.parenthesizedExpression(frame.left)
            top.minBindingPower = prevFrame?.minBindingPower || 0
          } else {
            top.left =
              // @ts-ignore
              t.binaryExpression(frame.operator, frame.left, top.left)
            top.minBindingPower = frame?.minBindingPower || 0
          }
        }
      }
    }
  }
}

type OpMap = Record<
  string,
  { leftBindingPower?: number; rightBindingPower?: number }
>

function getOperatorBindingPower(op: string, prefix: boolean) {
  if (prefix) {
    const map: OpMap = {
      '+': { leftBindingPower: 99, rightBindingPower: 10 },
      '-': { leftBindingPower: 99, rightBindingPower: 10 },
      '(': { leftBindingPower: 99, rightBindingPower: 0 },
    }

    return map[op]
  }

  const map: OpMap = {
    '+': { leftBindingPower: 1, rightBindingPower: 2 },
    '-': { leftBindingPower: 1, rightBindingPower: 2 },
    '*': { leftBindingPower: 3, rightBindingPower: 4 },
    '/': { leftBindingPower: 3, rightBindingPower: 4 },
    ')': { leftBindingPower: 0, rightBindingPower: 100 },
  }
  return map[op]
}

function isOperand(op: string | null): op is string {
  const ops = ['+', '-', '*', '/', '(', ')']
  return op !== null && !ops.includes(op)
}

// binary
console.log(JSON.stringify(parseExpression('1+2*3-4'), null, 2))
// unary
// console.log(JSON.stringify(parseExpression('-1+2'), null, 2))
// paren
// console.log(JSON.stringify(parseExpression('(1)*3'), null, 2))
