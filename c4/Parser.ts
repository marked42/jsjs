import { Lexer } from './Lexer'

export class Parser {
  constructor(private lexer: Lexer) {
    lexer.setSkipWhitespaceAndNewline(true)
  }

  expression() {
    const token = this.lexer.next()
  }
}
