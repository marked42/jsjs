import { OperatorPrecedence } from './OperatorPrecedence'

export interface Operator {
  leftBindingPower(): OperatorPrecedence
  rightBindingPower(): OperatorPrecedence
}

export type OperatorAssociativity = 'left' | 'right'
