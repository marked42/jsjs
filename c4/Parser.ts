import {
  BinaryExpression,
  Expression,
  Identifier,
  NumericLiteral,
  StringLiteral,
  UnaryExpression,
} from './AST'
import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'
import {
  getPrefixOperatorPrecedence,
  getInfixOperatorPrecedenceAssociativity,, getPostifxOperatorPrecedenceAssociativity
} from './Operators'
import { Token, Token } from '../src/Token'

export class Parser {
  constructor(private lexer: Lexer) {
    lexer.skipComment()
    lexer.skipNewline()
    lexer.skipWhitespace()
  }

  match(type: TokenType) {
    const token = this.lexer.next()

    if (token.type !== type) {
      throw new Error(`expect token type ${type}, encountered ${token}`)
    }

    return token
  }

  expression(lp: number): Expression {
    const token = this.lexer.next()
    let result: Expression

    if (token.type === TokenType.Identifier) {
      result = new Identifier(token.name)
    } else if (token.type === TokenType.StringLiteral) {
      result = new StringLiteral(token.value)
    } else if (token.type === TokenType.NumericLiteral) {
      result = new NumericLiteral(token.value)
    } else if (
      // check operators
      token.type === TokenType.Plus ||
      token.type === TokenType.Minus ||
      token.type === TokenType.Star ||
      token.type === TokenType.Div
    ) {
      const precedence = getPrefixOperatorPrecedence(token.source)
      const operand = this.expression(precedence)

      return new UnaryExpression(operand, token.source, true)
    } else {
      throw new Error(`unexpected token ${token}`)
    }

    while (true) {
      const token = this.lexer.next()

      if (
        token.type === TokenType.Plus ||
        token.type === TokenType.Minus ||
        token.type === TokenType.Star ||
        token.type === TokenType.Div ||
        token.type === TokenType.StarStar
      ) {
        const {
          precedence,
          associativity,
        } = getInfixOperatorPrecedenceAssociativity(token.source)

        if (precedence < lp) {
          break
        }

        const newLp = associativity === 'left' ? precedence + 1 : precedence
        const right = this.expression(newLp)
        // TODO: binary operator type warning
        result = new BinaryExpression(result, right, token.source as any)
        continue
      }

      if (
        token.type === TokenType.Increment ||
        token.type === TokenType.Decrement
      ) {
        const precedence = getPostifxOperatorPrecedenceAssociativity(token.source);
        if (precedence > lp) {
          result = new UnaryExpression(result, token.source, false)
          // TODO: 也可以使用peek操作， peek和prev是实现同样功能的两种方式，都需要token缓冲区支持
          this.lexer.prev();
        }
        break;
      }

      throw new Error('unexpected token ' + token)
    }

    return result
  }

  program() {}
}
