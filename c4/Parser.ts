import { Lexer } from './Lexer'
import { Token } from './Token'

export class Parser {
  private token: Token

  constructor(private lexer: Lexer) {
    lexer.setSkipWhitespaceAndNewline(true)
  }

  expression() {
    const token = this.lexer.next()
  }
  program() {}
}
