export interface Operator {
  leftBindingPower(): number
  rightBindingPower(): number
}

export type OperatorAssociativity = 'left' | 'right'
