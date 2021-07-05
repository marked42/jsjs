import { Lexer } from './Lexer'
import { Parser } from './Parser'
import { TokenType } from './Token'

export class LLkParser extends Parser {
  constructor(input: Lexer) {
    super(input)
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
