import { Expression, UnaryExpression } from '../AST'
import { TokenWithSource } from '../Token'
import { PostfixOperator } from './Operator'
import { InfixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class PostfixOperatorParselet implements InfixParselet {
  constructor(private op: PostfixOperator) {}

  parse(parser: ParseletParser, result: Expression, token: TokenWithSource) {
    return new UnaryExpression(result, token.source, false)
  }

  leftBindingPower() {
    return this.op.leftBindingPower()
  }
}
