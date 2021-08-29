import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'

export class BacktrackParser {
  private tokens: Token[] = []
  private index = 0
  private markers: number[] = []

  constructor(private input: Lexer) {}

  private fill(i: number) {
    for (let j = this.tokens.length; j <= this.index + i - 1; j++) {
      this.tokens[j] = this.input.nextToken()
    }
  }

  lookahead(i: number) {
    this.fill(i)
    return this.tokens[this.index + i - 1]
  }

  match(type: TokenType) {
    if (this.lookahead(1).type !== type) {
      throw new Error(
        `unexpected token type, expecting ${type}, get ${this.lookahead(1)}`
      )
    }

    this.consume()
  }

  isSpeculating() {
    return this.markers.length > 0
  }

  consume() {
    if (this.index === this.tokens.length - 1 && !this.isSpeculating()) {
      this.index = 0
      this.tokens = []
    } else {
      this.index++
    }
  }

  mark() {
    this.markers.push(this.index)
  }

  release() {
    const value = this.markers.pop()
    if (value === undefined) {
      throw new Error('no marker to release')
    }
    this.index = value
  }

  speculate(rule: () => void) {
    let success = false
    this.mark()
    try {
      rule()
      success = true
    } catch (e) {
      success = false
    }
    this.release()

    return success
  }

  stat() {
    if (this.speculate(this.stat_alt1.bind(this))) {
      this.stat_alt1()
    } else if (this.speculate(this.stat_alt2.bind(this))) {
      this.stat_alt2()
    } else {
      throw new Error('no viable alternative rule for stat')
    }
  }

  stat_alt1() {
    this.list()
    this.match(TokenType.EOF)
  }

  stat_alt2() {
    this.assign()
    this.match(TokenType.EOF)
  }

  assign() {
    this.list()
    this.match(TokenType.Equal)
    this.list()
  }

  list() {
    this.match(TokenType.LeftBracket)
    this.elements()
    this.match(TokenType.RightBracket)
  }

  elements() {
    this.element()
    while (this.lookahead(1).type === TokenType.Comma) {
      this.match(TokenType.Comma)
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
      throw new Error('no viable alternative for rule element')
    }
  }
}
