import { Expression, Identifier } from './AST'
import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'

export class Parser {
  constructor(private lexer: Lexer) {
    lexer.setSkipWhitespaceAndNewline(true)
  }

  expression() {
    const token = this.lexer.next()
    let result: Expression

    if (token.type === TokenType.Identifier) {
    }
  }

  program() {}
}
