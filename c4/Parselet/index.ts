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
import { EndTokenParselet } from './EndTokenParselet'
import {
  ConditionalExpression,
  Expression,
  Identifier,
  MemberExpression,
  NumericLiteral,
  StringLiteral,
} from '../AST'
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
    // TODO: call expression
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
      new BinaryOperatorParselet(
        14,
        'left',
        (left: Expression, right: Expression, token: Token) =>
          new MemberExpression(left, right, false)
      )
    )
  }

  registerIndexOperators() {
    // 索引表达式a[b]
    this.registerInfixParselet(TokenType.LeftSquare, {
      parse(parser: ParseletParser, result: Expression, token: Token) {
        const property = parser.expression(0)

        parser.consume(TokenType.RightSquare)

        return new MemberExpression(result, property, true)
      },

      getPrecedence() {
        return 14
      },
    })

    this.registerInfixParselet(TokenType.RightSquare, new EndTokenParselet())
  }

  registerParenthesis() {
    // 括号表达式
    this.registerPrefixParselet(TokenType.LeftParen, {
      parse(parser: ParseletParser, token: Token) {
        const expr = parser.expression(0)

        expr.parenthesized = true
        parser.consume(TokenType.RightParen)

        return expr
      },
    })
    this.registerInfixParselet(TokenType.RightParen, new EndTokenParselet())
  }

  registerConditionalOperators() {
    this.registerInfixParselet(TokenType.Question, {
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
      },
      getPrecedence(): number {
        // TODO: extract precedence
        return 3
      },
    })

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
