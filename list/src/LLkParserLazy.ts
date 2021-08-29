import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'

/**
 * 使用环形缓冲区，同时使用lookaheadCount记录当前缓冲的预看token个数。
 * 预看第i个token时，如果缓冲token个数lookaheadCount大于等于i，则可直接返回token，否则要预看更多。
 *
 * 这种延迟预看的方法直到需要预看第i个token时才会检查并确保预看token存在。
 *
 * 代码复杂、效率一般，不如LLkParserEager.
 */
export class LLkParserLazy {
  private lookaheadTokens!: Token[]
  private index = 0
  private lookaheadCount = 0

  constructor(private input: Lexer, private size: number) {
    if (size < 1) {
      throw new Error('lookahead size must be an integer bigger than 0 ')
    }
    this.lookaheadTokens = new Array<Token>(size)
  }

  private lookaheadIndex(i: number) {
    return (this.index + i - 1) % this.size
  }

  lookahead(i: number) {
    if (i > this.size) {
      throw new Error(
        `try to lookahead next ${i} token, but max lookahead is ${this.size}`
      )
    }
    if (this.lookaheadCount >= i) {
      return this.lookaheadTokens[this.lookaheadIndex(i)]
    }
    this.fill(i)

    return this.lookaheadTokens[this.lookaheadIndex(i)]
  }

  private fill(i: number) {
    for (let j = this.lookaheadCount + 1; j <= i; j++) {
      this.lookaheadTokens[this.lookaheadIndex(j)] = this.input.nextToken()
    }
    this.lookaheadCount = i
  }

  match(type: TokenType) {
    if (this.lookahead(1).type !== type) {
      throw new Error(
        `unexpected token type, expecting ${type}, get ${this.lookahead(1)}`
      )
    }

    this.consume()
  }

  consume() {
    // 前进到下一个位置
    this.index = this.lookaheadIndex(2)
    this.lookaheadCount--
  }

  list() {
    this.match(TokenType.LeftBracket)
    this.elements()
    this.match(TokenType.RightBracket)
  }

  elements() {
    this.element()
    while (this.lookahead(1).type === TokenType.Comma) {
      this.consume()
      this.element()
    }
  }

  element() {
    if (
      this.lookahead(1).type === TokenType.Name &&
      this.lookahead(2).type === TokenType.Equal
    ) {
      this.match(TokenType.Name)
      this.match(TokenType.Equal)
      this.match(TokenType.Name)
    } else if (this.lookahead(1).type === TokenType.Name) {
      this.match(TokenType.Name)
    } else if (this.lookahead(1).type === TokenType.LeftBracket) {
      this.list()
    } else {
      throw new Error(`expecting name or list, found ${this.lookahead}`)
    }
  }
}