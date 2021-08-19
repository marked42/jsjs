import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'

export class LL1Parser {
  private lookahead!: Token

  constructor(private input: Lexer) {
    this.consume()
  }

  match(type: TokenType) {
    if (this.lookahead.type !== type) {
      throw new Error(
        `unexpected token type, expecting ${type}, get ${this.lookahead}`
      )
    }

    this.consume()
  }

  consume() {
    this.lookahead = this.input.nextToken()
  }

  list() {
    this.match(TokenType.LeftBracket)
    this.elements()
    this.match(TokenType.RightBracket)
  }

  elements() {
    this.element()
    while (this.lookahead.type === TokenType.Comma) {
      this.consume()
      this.element()
    }
  }

  element() {
    if (this.lookahead.type === TokenType.Name) {
      this.match(TokenType.Name)
    } else if (this.lookahead.type === TokenType.LeftBracket) {
      this.list()
    } else {
      throw new Error(`expecting name or list, found ${this.lookahead}`)
    }
  }
}
