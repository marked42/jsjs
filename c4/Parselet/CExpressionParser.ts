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
  SequenceExpression,
  AssignmentExpression,
  LogicalExpression,
} from '../AST'
import {
  PrecedentialOperator,
  PrefixOperator,
  PostfixOperator,
  BinaryOperator,
  MiddleOperator,
  LastAssociativeOperator,
  OperatorPrecedence,
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

const enum Precedence {
  /**
   * a++, a--
   */
  PostfixIncrementDecrement = 1,
  /**
   * fn(1)
   */
  FunctionCall = 1,
  /**
   * a[1]
   */
  ArraySubscripting = 1,
  /**
   * a.b  a->b
   */
  MemberAccess = 1,
  PointerMemberAccess = 1,
  /**
   * (type) { list }
   */
  CompoundLiteral = 1,

  /**
   * ++a, --a
   */
  PrefixIncrementDecrement = 2,
  /**
   * -a, +a
   */
  UnaryPlusMinus = 2,
  /**
   * !a
   */
  LogicalNot = 2,
  /**
   * ~a
   */
  BitwiseNot = 2,

  /**
   * (type)
   */
  Cast = 2,

  /**
   * *
   */
  Dereference = 2,

  /** & */
  AddressOf = 2,

  /** sizeof */
  Sizeof = 2,

  /** _Alignof */
  Alignof = 2,

  /** * / % */
  MultiplicationDivisionRemainder = 3,

  /** + - */
  AdditionSubtraction = 4,

  /** << >> */
  BitwiseShift = 5,

  /** < <= > >= */
  LtLeGtGe = 6,

  /**
   * == !=
   */
  EqNq = 7,

  /** & */
  BitwiseAnd = 8,

  /** ^ */
  BitwiseXor = 9,

  /** | */
  BitwiseOr = 10,

  /** && */
  LogicalAnd = 11,

  /** || */
  LogicalOr = 12,

  Conditional = 13,

  Assignment = 14,

  Comma = 15,
}

export class CParser extends ParseletParser {
  constructor(lexer: Lexer) {
    super(lexer)

    this.registerAtoms()
    this.registerPrefixOperators()
    this.registerPostfixOperators()
    this.registerBinaryOperators()
    this.registerSequenceExpression()
    // this.registerParenthesis()
    // this.registerIndexOperators()
    this.registerConditionalOperators()
    // this.registerDot()
    // this.registerCallExpression()
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
    const question = new PrecedentialOperator(Precedence.Conditional, {
      hasPrecedingOperand: true,
      hasFollowingOperand: true,
      isFirstOperator: true,
      isLastOperator: false,
      expressionStartWithOperand: true,
    })
    const colon = new LastAssociativeOperator(Precedence.Conditional, 'right')

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
      [TokenType.Minus, new PrefixOperator(Precedence.UnaryPlusMinus)],
      [TokenType.Plus, new PrefixOperator(Precedence.UnaryPlusMinus)],
      [
        TokenType.Increment,
        new PrefixOperator(Precedence.PrefixIncrementDecrement),
      ],
      [
        TokenType.Decrement,
        new PrefixOperator(Precedence.PrefixIncrementDecrement),
      ],
      [TokenType.Negate, new PrefixOperator(Precedence.LogicalNot)],
      [TokenType.Tilde, new PrefixOperator(Precedence.BitwiseOr)],
      [TokenType.Star, new PrefixOperator(Precedence.Dereference)],
      [TokenType.And, new PrefixOperator(Precedence.BitwiseAnd)],
      [TokenType.Sizeof, new PrefixOperator(Precedence.Sizeof)],
    ] as const
    operators.forEach(([type, op]) => {
      this.registerPrefixParselet(type, new PrefixOperatorParselet(op))
    })
  }

  registerPostfixOperators() {
    const operators = [
      [
        TokenType.Increment,
        new PostfixOperator(Precedence.PostfixIncrementDecrement),
      ],
      [
        TokenType.Decrement,
        new PostfixOperator(Precedence.PostfixIncrementDecrement),
      ],
    ] as const
    operators.forEach(([type, op]) => {
      this.registerInfixParselet(type, new PostfixOperatorParselet(op))
    })
  }

  registerBinaryOperators() {
    const assignmentOperators = [
      TokenType.Assign,
      TokenType.PlusAssign,
      TokenType.MinusAssign,
      TokenType.StarAssign,
      TokenType.DivAssign,
      TokenType.ModulusAssign,
      TokenType.AndAssign,
      TokenType.OrAssign,
      TokenType.XorAssign,
      TokenType.LeftShiftAssign,
      TokenType.RightShiftAssign,
    ]
    const op = new BinaryOperator(Precedence.Assignment, 'right')
    assignmentOperators.forEach((type) => {
      this.registerInfixParselet(
        type,
        new BinaryOperatorParselet(op, (left, right, token) => {
          // @ts-ignore TODO:
          return new AssignmentExpression(left, right, token.source)
        })
      )
    })

    const logicalOperators = [
      [TokenType.OrOr, new BinaryOperator(Precedence.LogicalOr, 'left')],
      [TokenType.AndAnd, new BinaryOperator(Precedence.LogicalAnd, 'left')],
    ] as const
    logicalOperators.forEach(([type, op]) => {
      this.registerInfixParselet(
        type,
        new BinaryOperatorParselet(op, (left, right, token) => {
          // @ts-ignore TODO:
          return new LogicalExpression(left, right, token.source)
        })
      )
    })

    const operators = [
      [TokenType.Or, new BinaryOperator(Precedence.BitwiseOr, 'left')],
      [TokenType.Xor, new BinaryOperator(Precedence.BitwiseXor, 'left')],
      [TokenType.And, new BinaryOperator(Precedence.BitwiseAnd, 'left')],
      [TokenType.Equal, new BinaryOperator(Precedence.EqNq, 'left')],
      [TokenType.NotEqual, new BinaryOperator(Precedence.EqNq, 'left')],
      [TokenType.Less, new BinaryOperator(Precedence.LtLeGtGe, 'left')],
      [TokenType.LessEqual, new BinaryOperator(Precedence.LtLeGtGe, 'left')],
      [TokenType.Greater, new BinaryOperator(Precedence.LtLeGtGe, 'left')],
      [TokenType.GreaterEqual, new BinaryOperator(Precedence.LtLeGtGe, 'left')],
      [
        TokenType.LeftShift,
        new BinaryOperator(Precedence.BitwiseShift, 'left'),
      ],
      [
        TokenType.RightShift,
        new BinaryOperator(Precedence.BitwiseShift, 'left'),
      ],
      [
        TokenType.Plus,
        new BinaryOperator(Precedence.AdditionSubtraction, 'left'),
      ],
      [
        TokenType.Minus,
        new BinaryOperator(Precedence.AdditionSubtraction, 'left'),
      ],
      [
        TokenType.Star,
        new BinaryOperator(Precedence.MultiplicationDivisionRemainder, 'left'),
      ],
      [
        TokenType.Div,
        new BinaryOperator(Precedence.MultiplicationDivisionRemainder, 'left'),
      ],
      [
        TokenType.Modulus,
        new BinaryOperator(Precedence.MultiplicationDivisionRemainder, 'left'),
      ],
    ] as const

    operators.forEach(([type, op]) => {
      this.registerInfixParselet(type, new BinaryOperatorParselet(op))
    })
  }

  // 两种构造方法
  // 1. 左结合的二元运算符
  registerSequenceExpression() {
    const precedence = OperatorPrecedence.of(Precedence.Comma)
    this.registerInfixParselet(TokenType.Comma, {
      parse(parser: ParseletParser, result: Expression, token: Token) {
        const params = [result]

        while (true) {
          const result = parser.expression(
            precedence.higherPrecedenceByOneLevel()
          )
          params.push(result)
          if (parser.lookahead(0).type !== TokenType.Comma) {
            break
          }
          parser.consume(TokenType.Comma)
        }
        return new SequenceExpression(params)
      },
      leftBindingPower() {
        return precedence
      },
    })
  }

  // 2. 右结合的二元运算符，对结果进行处理成平行的ast
  // registerSequenceExpression() {
  //   const precedence = OperatorPrecedence.of(Precedence.Comma)
  //   this.registerInfixParselet(TokenType.Comma, {
  //     parse(parser: ParseletParser, result: Expression, token: Token) {
  //       const params = [result]

  //       while (true) {
  //         const result = parser.expression(precedence)
  //         if (result instanceof SequenceExpression) {
  //           params.splice(0, 0, ...result.expressions)
  //         } else {
  //           params.push(result)
  //         }
  //         if (parser.lookahead(0).type !== TokenType.Comma) {
  //           break
  //         }
  //         parser.consume(TokenType.Comma)
  //       }
  //       return new SequenceExpression(params)
  //     },
  //     leftBindingPower() {
  //       return precedence
  //     },
  //   })
  // }
}
