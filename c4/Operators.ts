export type OperatorAssociativity = 'left' | 'right' | 'none'

// C operator precedence https://en.cppreference.com/w/c/language/operator_precedence
export function getInfixOperatorPrecedenceAssociativity(op: string) {
  const InfixPostfixOperatorsConfiguration: {
    [key: string]: readonly [number, OperatorAssociativity]
  } = {
    '+': [1, 'left'],
    '-': [1, 'left'],
    '*': [2, 'left'],
    '/': [2, 'left'],
    // TODO: c has no ** operator
    '**': [3, 'right'],
    '[': [14, 'none'],
    '.': [14, 'left'],
    '?': [3, 'right'],
  } as const

  const value = InfixPostfixOperatorsConfiguration[op]

  if (typeof value === undefined) {
    throw new Error('unknown infix or postfix operator ' + op)
  }

  return {
    precedence: value[0],
    associativity: value[1],
  }
}

export function getPostifxOperatorPrecedenceAssociativity(op: string) {
  const PostfixOperators: {
    [key: string]: number
  } = {
    '++': 15,
    '--': 15,
  }

  const precedence = PostfixOperators[op]
  if (typeof precedence === undefined) {
    throw new Error('unknown postfix operator ' + op)
  }

  return precedence
}

export function getPrefixOperatorPrecedence(op: string) {
  const PrefixOperatorsConfiguration: { [key: string]: number } = {
    '--': 14,
    '++': 14,
    '+': 14,
    '-': 14,
  }

  const precedence = PrefixOperatorsConfiguration[op]

  if (typeof precedence === undefined) {
    throw new Error('unknown prefix operator ' + op)
  }

  return precedence
}
