import { UnaryExpression } from '../AST'
import { TokenWithSource } from '../Token'
import { PrefixOperator } from "./PrefixOperator"
import { PrefixParselet } from './Parselet'
import { ParseletParser } from './ParseletParser'

export class PrefixOperatorParselet implements PrefixParselet {
  constructor(private op: PrefixOperator) {}

  parse(parser: ParseletParser, token: TokenWithSource) {
    const expr = parser.expression(this.op.rightBindingPower())

    return new UnaryExpression(expr, token.source, true)
  }
}
