import {
  BinaryExpression,
  Expression,
  Identifier,
  MemberExpression,
  NumericLiteral,
  StringLiteral,
  UnaryExpression,
} from './AST'
import { Lexer } from './Lexer'
import { TokenType } from './Token'
import {
  getPrefixOperatorPrecedence,
  getInfixOperatorPrecedenceAssociativity,
  getPostifxOperatorPrecedenceAssociativity,
} from './Operators'

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

  // 1. 起始优先级minPrecedence默认为0
  expression(minPrecedence: number = 0): Expression {
    const token = this.lexer.next()
    let result: Expression

    // 2. 操作数生成对应的ASTNode
    if (token.type === TokenType.Identifier) {
      result = new Identifier(token.name)
    } else if (token.type === TokenType.StringLiteral) {
      result = new StringLiteral(token.value)
    } else if (token.type === TokenType.NumericLiteral) {
      result = new NumericLiteral(token.value)
    } else if (token.type === TokenType.LeftParen) {
      result = this.expression()
      result.parenthesized = true
      this.match(TokenType.RightParen)
    } else if (
      // check operators
      token.type === TokenType.Plus ||
      token.type === TokenType.Minus ||
      token.type === TokenType.Star ||
      token.type === TokenType.Div
    ) {
      // 3. 前缀操作符处理
      const precedence = getPrefixOperatorPrecedence(token.source)
      const operand = this.expression(precedence)

      result = new UnaryExpression(operand, token.source, true)
    } else {
      // 4. 其余为非法token，包括EOF
      throw new Error(`unexpected token ${token}`)
    }

    // 5. 中缀、后缀操作符的解析有三种情况
    // 5.1. 优先级低终止循环，当前调用返回
    // 5.2. 优先级高且右侧还能结合操作数，递归调用继续循环
    // 5.3. 优先级高但是右侧不能结合操作数，终止循环
    while (true) {
      const token = this.lexer.next()

      // 6. 循环终止条件一 没有更多token
      if (token.type === TokenType.EOF) {
        break
      }

      if (
        token.type === TokenType.Plus ||
        token.type === TokenType.Minus ||
        token.type === TokenType.Star ||
        token.type === TokenType.Div ||
        token.type === TokenType.StarStar ||
        token.type === TokenType.Dot
      ) {
        const {
          precedence,
          associativity,
        } = getInfixOperatorPrecedenceAssociativity(token.source)

        // 7. 二元操作符优先级低，
        if (precedence < minPrecedence) {
          this.lexer.prev()
          break
        }

        const newLp = associativity === 'left' ? precedence + 1 : precedence
        const right = this.expression(newLp)
        // TODO: binary operator type warning
        if (token.type === TokenType.Dot) {
          result = new MemberExpression(result, right)
        } else {
          result = new BinaryExpression(result, right, token.source as any)
        }
        continue
      }

      if (
        token.type === TokenType.Increment ||
        token.type === TokenType.Decrement
      ) {
        const precedence = getPostifxOperatorPrecedenceAssociativity(
          token.source
        )
        if (precedence > minPrecedence) {
          result = new UnaryExpression(result, token.source, false)
          // TODO: 也可以使用peek操作， peek和prev是实现同样功能的两种方式，都需要token缓冲区支持
        } else {
          this.lexer.prev()
        }
        break
      }

      if (token.type === TokenType.RightParen) {
        this.lexer.prev()
        break
      }

      if (token.type === TokenType.LeftSquare) {
        const {
          precedence,
          associativity,
        } = getInfixOperatorPrecedenceAssociativity(token.source)

        // 7. 二元操作符优先级低，
        if (precedence < minPrecedence) {
          this.lexer.prev()
          break
        }

        const member = this.expression()
        this.match(TokenType.RightSquare)
        result = new MemberExpression(result, member, true)
        continue
      }

      if (token.type === TokenType.RightSquare) {
        this.lexer.prev()
        break
      }

      throw new Error('unexpected token ' + JSON.stringify(token, null, 2))
    }

    return result
  }

  program() {}
}
