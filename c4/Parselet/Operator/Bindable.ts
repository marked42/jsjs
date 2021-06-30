import { OperatorPrecedence } from './OperatorPrecedence'

export interface Bindable {
  leftBindingPower(): OperatorPrecedence
  rightBindingPower(): OperatorPrecedence
}
