import { ParseletParser } from './ParseletParser'
import { Lexer } from '../Lexer'
import { Token, TokenType } from '../Token'
import { IdentifierParselet } from './IdentifierParselet'
import { NumericLiteralParselet } from './NumericLiteralParselet'
import { PrefixOperatorParselet } from './PrefixOperatorParselet'
import { BinaryOperatorParselet } from './BinaryOperatorParselet'
import { OperatorAssociativity } from '../Operators'
import { PostfixOperatorParselet } from './PostfixOperatorParselet'
import { LeftParenParselet } from './LeftParenParselet'
import { EndTokenParselet } from './EndTokenParselet'
import { LeftSquareParselet } from './IndexOperatorParselet'
import { Expression, MemberExpression } from '../AST'

export class Parser extends ParseletParser {
  constructor(lexer: Lexer) {
    super(lexer)

    this.registerPrefixParselet(TokenType.Identifier, new IdentifierParselet())
    this.registerPrefixParselet(
      TokenType.NumericLiteral,
      new NumericLiteralParselet()
    )

    // 括号表达式
    this.registerPrefixParselet(TokenType.LeftParen, new LeftParenParselet())
    this.registerInfixParselet(TokenType.RightParen, new EndTokenParselet())

    // 索引表达式a[b]
    this.registerInfixParselet(TokenType.LeftSquare, new LeftSquareParselet(14))
    this.registerInfixParselet(TokenType.RightSquare, new EndTokenParselet())

    this.registerPostfixOperators([
      [TokenType.Increment, 15],
      [TokenType.Decrement, 15],
    ])

    this.registerPrefixOperators([
      [TokenType.Minus, 14],
      [TokenType.Plus, 14],
    ])

    this.registerBinaryOperators([
      [TokenType.Plus, 1, 'left'],
      [TokenType.Minus, 1, 'left'],
      [TokenType.Star, 2, 'left'],
      [TokenType.Div, 2, 'left'],
      [TokenType.StarStar, 3, 'right'],
      // [TokenType.Dot, 14, 'left'],
      // TODO:
      //   [TokenType.LeftBracket, 3, 'right'],
      //   [TokenType.Question, 3, 'right'],
    ])

    this.registerInfixParselet(
      TokenType.Dot,
      new (class extends BinaryOperatorParselet {
        composeExpression(left: Expression, right: Expression, token: Token) {
          return new MemberExpression(left, right, false)
        }
      })(14, 'left')
    )
  }

  registerPrefixOperators(prefixOperators: Array<[TokenType, number]>) {
    prefixOperators.forEach(([type, precedence]) => {
      this.registerPrefixParselet(type, new PrefixOperatorParselet(precedence))
    })
  }

  registerPostfixOperators(postfixOperators: Array<[TokenType, number]>) {
    postfixOperators.forEach(([type, precedence]) => {
      this.registerInfixParselet(type, new PostfixOperatorParselet(precedence))
    })
  }

  registerBinaryOperators(
    binaryOperators: Array<[TokenType, number, OperatorAssociativity]>
  ) {
    binaryOperators.forEach(([type, precedence, assoc]) => {
      this.registerInfixParselet(
        type,
        new BinaryOperatorParselet(precedence, assoc)
      )
    })
  }
}
