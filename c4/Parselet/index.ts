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
import {
  BinaryOperator,
  PostfixOperator,
  PrefixOperator,
  FirstOperator,
  LastOperator,
} from './Operator'

export class Parser extends ParseletParser {
  constructor(lexer: Lexer) {
    super(lexer)

    this.registerAtoms()
    this.registerPrefixOperators()
    this.registerPostfixOperators()
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
        new BinaryOperator(14, 'left'),
        (left: Expression, right: Expression, token: Token) =>
          new MemberExpression(left, right, false)
      )
    )
  }

  registerIndexOperators() {
    // 索引表达式a[b]
    const leftSquare = new FirstOperator(14, true)
    const rightSquare = new LastOperator(14, false)

    this.registerInfixParselet(TokenType.LeftSquare, {
      parse(parser: ParseletParser, result: Expression, token: Token) {
        const property = parser.expression(leftSquare.rightBindingPower())
        parser.consume(TokenType.RightSquare)

        return new MemberExpression(result, property, true)
      },

      getPrecedence() {
        return leftSquare.leftBindingPower()
      },
    })

    this.registerInfixParselet(TokenType.RightSquare, new EndTokenParselet())
  }

  registerParenthesis() {
    const leftParen = new FirstOperator(15, false)
    const rightParen = new LastOperator(15, false)
    // 括号表达式
    this.registerPrefixParselet(TokenType.LeftParen, {
      parse(parser: ParseletParser, token: Token) {
        const expr = parser.expression(leftParen.rightBindingPower())

        expr.parenthesized = true
        parser.consume(TokenType.RightParen)

        return expr
      },
    })
    this.registerInfixParselet(TokenType.RightParen, new EndTokenParselet())
  }

  registerConditionalOperators() {
    const question = new FirstOperator(3, true)
    const colon = new LastOperator(3, true)

    this.registerInfixParselet(TokenType.Question, {
      parse(
        parser: ParseletParser,
        result: Expression,
        token: Token
      ): Expression {
        const consequent = parser.expression(this.getPrecedence())
        parser.consume(TokenType.Colon)
        const alternate = parser.expression(colon.rightBindingPower())

        return new ConditionalExpression(result, consequent, alternate)
      },
      getPrecedence(): number {
        return question.leftBindingPower()
      },
    })

    this.registerInfixParselet(TokenType.Colon, new EndTokenParselet())
  }

  registerPrefixOperators() {
    const operators = [
      [TokenType.Minus, new PrefixOperator(14)],
      [TokenType.Plus, new PrefixOperator(14)],
    ] as const
    operators.forEach(([type, op]) => {
      this.registerPrefixParselet(type, new PrefixOperatorParselet(op))
    })
  }

  registerPostfixOperators() {
    const operators = [
      [TokenType.Increment, new PostfixOperator(15)],
      [TokenType.Decrement, new PostfixOperator(15)],
    ] as const
    operators.forEach(([type, op]) => {
      this.registerInfixParselet(type, new PostfixOperatorParselet(op))
    })
  }

  registerBinaryOperators() {
    const operators = [
      [TokenType.Plus, new BinaryOperator(1, 'left')],
      [TokenType.Minus, new BinaryOperator(1, 'left')],
      [TokenType.Star, new BinaryOperator(2, 'left')],
      [TokenType.Div, new BinaryOperator(2, 'left')],
      [TokenType.StarStar, new BinaryOperator(3, 'right')],
    ] as const
    operators.forEach(([type, op]) => {
      this.registerInfixParselet(type, new BinaryOperatorParselet(op))
    })
  }
}
