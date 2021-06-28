import { ParseletParser } from './ParseletParser'
import { Lexer } from '../Lexer'
import {
  NumberValueToken,
  StringNameToken,
  StringValueToken,
  Token,
  TokenType,
} from '../Token'
import {
  PrefixOperatorParselet,
  BinaryOperatorParselet,
  PostfixOperatorParselet,
  NonFirstOperatorParselet,
  AtomParselet,
  OperatorInfixParselet,
} from './Parselet'
import {
  ConditionalExpression,
  Expression,
  Identifier,
  MemberExpression,
  NumericLiteral,
  StringLiteral,
  CallExpression,
} from '../AST'
import {
  PrecedentialOperator,
  PrefixOperator,
  PostfixOperator,
  BinaryOperator,
  MiddleOperator,
  LastAssociativeOperator,
} from './Operator'

const enum ExpressionPrecedence {
  PlusMinus = 1,
  StarDiv = 2,
  StarStar = 3,
  Conditional = 3,
  MemberExpression = 14,
  IndexExpression = 14,
  PrefixMinusPlus = 14,
  Increment = 15,
  Decrement = 15,
  Parenthesis = 15,
  CallExpression = 15,
}

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
    this.registerCallExpression()
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
        new BinaryOperator(ExpressionPrecedence.MemberExpression, 'left'),
        (left: Expression, right: Expression, token: Token) =>
          new MemberExpression(left, right, false)
      )
    )
  }

  registerIndexOperators() {
    // 索引表达式a[b]
    const leftSquare = new PrecedentialOperator(
      ExpressionPrecedence.IndexExpression,
      {
        hasPrecedingOperand: true,
        hasFollowingOperand: true,
        isFirstOperator: true,
        isLastOperator: false,
        expressionStartWithOperand: true,
      }
    )
    const rightSquare = new PrecedentialOperator(
      ExpressionPrecedence.IndexExpression,
      {
        hasPrecedingOperand: true,
        hasFollowingOperand: false,
        isFirstOperator: false,
        isLastOperator: true,
        expressionStartWithOperand: true,
      }
    )

    this.registerInfixParselet(
      TokenType.LeftSquare,
      new (class extends OperatorInfixParselet {
        parse(parser: ParseletParser, result: Expression, token: Token) {
          const property = parser.expression(leftSquare.rightBindingPower())
          parser.consume(TokenType.RightSquare)

          return new MemberExpression(result, property, true)
        }
      })(leftSquare)
    )

    this.registerInfixParselet(
      TokenType.RightSquare,
      new NonFirstOperatorParselet(rightSquare)
    )
  }

  registerParenthesis() {
    const leftParen = new PrecedentialOperator(
      ExpressionPrecedence.Parenthesis,
      {
        hasPrecedingOperand: false,
        hasFollowingOperand: true,
        isFirstOperator: true,
        isLastOperator: false,
        expressionStartWithOperand: false,
      }
    )
    const rightParen = new PrecedentialOperator(
      ExpressionPrecedence.Parenthesis,
      {
        hasPrecedingOperand: true,
        hasFollowingOperand: false,
        isFirstOperator: false,
        isLastOperator: true,
        expressionStartWithOperand: false,
      }
    )
    // 括号表达式
    this.registerPrefixParselet(TokenType.LeftParen, {
      parse(parser: ParseletParser, token: Token) {
        const expr = parser.expression(leftParen.rightBindingPower())

        expr.parenthesized = true
        parser.consume(TokenType.RightParen)

        return expr
      },
    })
    this.registerInfixParselet(
      TokenType.RightParen,
      new NonFirstOperatorParselet(rightParen)
    )
  }

  registerCallExpression() {
    const leftParen = new PrecedentialOperator(
      ExpressionPrecedence.CallExpression,
      {
        hasPrecedingOperand: true,
        hasFollowingOperand: true,
        isFirstOperator: true,
        isLastOperator: false,
        expressionStartWithOperand: true,
      }
    )
    const comma = new MiddleOperator(ExpressionPrecedence.CallExpression)
    const rightParen = new PrecedentialOperator(
      ExpressionPrecedence.CallExpression,
      {
        hasPrecedingOperand: true,
        hasFollowingOperand: false,
        isFirstOperator: false,
        isLastOperator: true,
        expressionStartWithOperand: false,
      }
    )

    // 括号表达式中'('是前缀操作符，这里括号'('是中缀操作符。
    this.registerInfixParselet(
      TokenType.LeftParen,
      new (class extends OperatorInfixParselet {
        parse(parser: ParseletParser, result: Expression, token: Token) {
          const params = [parser.expression(leftParen.rightBindingPower())]

          while (parser.lookahead(0).type !== TokenType.RightParen) {
            parser.consume(TokenType.Comma)
            params.push(parser.expression(leftParen.rightBindingPower()))
          }
          parser.consume(TokenType.RightParen)

          return new CallExpression(result, params)
        }
      })(leftParen)
    )
    this.registerInfixParselet(
      TokenType.Comma,
      new NonFirstOperatorParselet(comma)
    )
    // 和括号表达式中的‘)'重复了，但是不影响逻辑逻辑正确性
    this.registerInfixParselet(
      TokenType.RightParen,
      new NonFirstOperatorParselet(rightParen)
    )
  }

  registerConditionalOperators() {
    const question = new PrecedentialOperator(
      ExpressionPrecedence.Conditional,
      {
        hasPrecedingOperand: true,
        hasFollowingOperand: true,
        isFirstOperator: true,
        isLastOperator: false,
        expressionStartWithOperand: true,
      }
    )
    const colon = new LastAssociativeOperator(
      ExpressionPrecedence.Conditional,
      'right'
    )

    this.registerInfixParselet(
      TokenType.Question,
      new (class extends OperatorInfixParselet {
        parse(
          parser: ParseletParser,
          result: Expression,
          token: Token
        ): Expression {
          const consequent = parser.expression(this.leftBindingPower())
          parser.consume(TokenType.Colon)
          const alternate = parser.expression(colon.rightBindingPower())

          return new ConditionalExpression(result, consequent, alternate)
        }
      })(question)
    )

    this.registerInfixParselet(
      TokenType.Colon,
      new NonFirstOperatorParselet(colon)
    )
  }

  registerPrefixOperators() {
    const operators = [
      [
        TokenType.Minus,
        new PrefixOperator(ExpressionPrecedence.PrefixMinusPlus),
      ],
      [
        TokenType.Plus,
        new PrefixOperator(ExpressionPrecedence.PrefixMinusPlus),
      ],
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
      [
        TokenType.Plus,
        new BinaryOperator(ExpressionPrecedence.PlusMinus, 'left'),
      ],
      [
        TokenType.Minus,
        new BinaryOperator(ExpressionPrecedence.PlusMinus, 'left'),
      ],
      [
        TokenType.Star,
        new BinaryOperator(ExpressionPrecedence.StarDiv, 'left'),
      ],
      [TokenType.Div, new BinaryOperator(ExpressionPrecedence.StarDiv, 'left')],
      [
        TokenType.StarStar,
        new BinaryOperator(ExpressionPrecedence.StarStar, 'right'),
      ],
    ] as const
    operators.forEach(([type, op]) => {
      this.registerInfixParselet(type, new BinaryOperatorParselet(op))
    })
  }
}
