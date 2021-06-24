import { ParseletParser } from './ParseletParser'
import { Lexer } from '../Lexer'
import {
  NumberValueToken,
  StringNameToken,
  StringValueToken,
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
  AssociativeOperator,
  PrefixOperator,
  PostfixOperator,
  BoundaryOperator,
} from './Operator'
import { Token } from '../Token'

export class Parser extends ParseletParser {
  constructor(lexer: Lexer) {
    super(lexer)

    this.registerAtoms()
    this.registerIndexOperators()
    this.registerConditionalOperators()

    const Operators = [
      new AssociativeOperator(TokenType.Plus, 1, 'left'),
      new AssociativeOperator(TokenType.Minus, 1, 'left'),
      new AssociativeOperator(TokenType.Star, 2, 'left'),
      new AssociativeOperator(TokenType.Div, 2, 'left'),
      new AssociativeOperator(TokenType.StarStar, 3, 'right'),
      new AssociativeOperator(TokenType.Dot, 14, 'left'),
      new PostfixOperator(TokenType.LeftSquare, 14),
      new BoundaryOperator(TokenType.RightSquare),
      // TODO: PrefixOperator 括号不需要优先级
      new PrefixOperator(TokenType.LeftParen, 0),
      new BoundaryOperator(TokenType.RightParen),
      new PrefixOperator(TokenType.Minus, 14),
      new PrefixOperator(TokenType.Plus, 14),
      new PostfixOperator(TokenType.Increment, 15),
      new PostfixOperator(TokenType.Decrement, 15),
    ]

    Operators.forEach((op) => {
      if (op instanceof AssociativeOperator) {
        // TODO: move expression to op configuration
        if (op.token === TokenType.Dot) {
          this.registerInfixParselet(
            op.token,
            new BinaryOperatorParselet(
              op,
              (left: Expression, right: Expression, token: Token) =>
                new MemberExpression(left, right, false)
            )
          )
        } else {
          this.registerInfixParselet(op.token, new BinaryOperatorParselet(op))
        }
      } else if (op instanceof PrefixOperator) {
        if (op.token === TokenType.LeftParen) {
          this.registerPrefixParselet(op.token, {
            parse(parser: ParseletParser, token: Token) {
              const expr = parser.expression(0)

              expr.parenthesized = true
              parser.consume(TokenType.RightParen)

              return expr
            },
          })
        } else {
          this.registerPrefixParselet(
            op.token,
            new PrefixOperatorParselet(op.precedence)
          )
        }
      } else if (op instanceof PostfixOperator) {
        this.registerInfixParselet(
          op.token,
          new PostfixOperatorParselet(op.precedence)
        )
      } else if (op instanceof BoundaryOperator) {
      }
    })
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
}
