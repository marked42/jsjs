import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'

/**
 * 支持多个预看符号，使用大小的环形缓冲区，在初始化时就缓冲K个预看符号，然后每消耗一个预看符号，consume都会补充一个预看符号，
 * 始终保持缓冲K个预看符号。
 * 解析结束时缓冲区内有K个EOF预看符号。
 */
export class LLkParserEager {
  private lookaheadTokens!: Token[]
  private index = 0

  constructor(private input: Lexer, private size: number) {
    if (size < 1) {
      throw new Error('lookahead size must be an integer bigger than 0 ')
    }
    this.lookaheadTokens = new Array<Token>(size)

    for (let i = 0; i < this.size; i++) {
      this.lookaheadTokens[i] = this.input.nextToken()
    }
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
    return this.lookaheadTokens[this.lookaheadIndex(i)]
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
    this.lookaheadTokens[this.index] = this.input.nextToken()
    // 前进到下一个位置
    this.index = this.lookaheadIndex(2)
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
