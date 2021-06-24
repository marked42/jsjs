import { ParseletParser } from './ParseletParser'
import { Lexer } from '../Lexer'
import {
  NumberValueToken,
  StringNameToken,
  StringValueToken,
  Token,
  TokenType,
} from '../Token'
import { PrefixOperatorParselet } from './PrefixOperatorParselet'
import { BinaryOperatorParselet } from './BinaryOperatorParselet'
import { OperatorAssociativity } from '../Operators'
import { PostfixOperatorParselet } from './PostfixOperatorParselet'
import { LeftParenParselet } from './LeftParenParselet'
import { EndTokenParselet } from './EndTokenParselet'
import { LeftSquareParselet } from './IndexOperatorParselet'
import {
  ConditionalExpression,
  Expression,
  Identifier,
  MemberExpression,
  NumericLiteral,
  StringLiteral,
} from '../AST'
import { InfixParselet } from './Parselet'
import { AtomParselet } from './AtomParselet'

export class Parser extends ParseletParser {
  constructor(lexer: Lexer) {
    super(lexer)

    this.registerAtoms()
    this.registerPostfixOperators()
    this.registerPrefixOperators()
    this.registerBinaryOperators()
    this.registerParenthesis()
    this.registerIndexOperators()
    this.registerConditionalOperators()
    this.registerDot()
  }

  registerAtoms() {
    this.registerPrefixParselet(
      TokenType.Identifier,
      new AtomParselet<StringNameToken>((token) => {
        return new Identifier(token.name)
      })
    )
    this.registerPrefixParselet(
      TokenType.NumericLiteral,
      new AtomParselet<NumberValueToken>(
        (token) => new NumericLiteral(token.value)
      )
    )
    this.registerPrefixParselet(
      TokenType.StringLiteral,
      new AtomParselet<StringValueToken>(
        (token) => new StringLiteral(token.value)
      )
    )
  }

  registerDot() {
    this.registerInfixParselet(
      TokenType.Dot,
      new (class extends BinaryOperatorParselet {
        composeExpression(left: Expression, right: Expression, token: Token) {
          return new MemberExpression(left, right, false)
        }
      })(14, 'left')
    )
  }

  registerIndexOperators() {
    // 索引表达式a[b]
    this.registerInfixParselet(TokenType.LeftSquare, new LeftSquareParselet(14))
    this.registerInfixParselet(TokenType.RightSquare, new EndTokenParselet())
  }

  registerParenthesis() {
    // 括号表达式
    this.registerPrefixParselet(TokenType.LeftParen, new LeftParenParselet())
    this.registerInfixParselet(TokenType.RightParen, new EndTokenParselet())
  }

  registerConditionalOperators() {
    this.registerInfixParselet(
      TokenType.Question,
      new (class implements InfixParselet {
        parse(
          parser: ParseletParser,
          result: Expression,
          token: Token
        ): Expression {
          const rightAssociativePrecedence = this.getPrecedence()
          const consequent = parser.expression(rightAssociativePrecedence)
          parser.consume(TokenType.Colon)
          const alternate = parser.expression(0)

          return new ConditionalExpression(result, consequent, alternate)
        }
        getPrecedence(): number {
          // TODO: extract precedence
          return 3
        }
      })()
    )

    this.registerInfixParselet(TokenType.Colon, new EndTokenParselet())
  }

  registerPrefixOperators() {
    const prefixOperators: Array<[TokenType, number]> = [
      [TokenType.Minus, 14],
      [TokenType.Plus, 14],
    ]
    prefixOperators.forEach(([type, precedence]) => {
      this.registerPrefixParselet(type, new PrefixOperatorParselet(precedence))
    })
  }

  registerPostfixOperators() {
    const postfixOperators: Array<[TokenType, number]> = [
      [TokenType.Increment, 15],
      [TokenType.Decrement, 15],
    ]
    postfixOperators.forEach(([type, precedence]) => {
      this.registerInfixParselet(type, new PostfixOperatorParselet(precedence))
    })
  }

  registerBinaryOperators() {
    const binaryOperators: Array<[TokenType, number, OperatorAssociativity]> = [
      [TokenType.Plus, 1, 'left'],
      [TokenType.Minus, 1, 'left'],
      [TokenType.Star, 2, 'left'],
      [TokenType.Div, 2, 'left'],
      [TokenType.StarStar, 3, 'right'],
    ]

    binaryOperators.forEach(([type, precedence, assoc]) => {
      this.registerInfixParselet(
        type,
        new BinaryOperatorParselet(precedence, assoc)
      )
    })
  }
}
