import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'

export class BacktrackParser {
  private tokens: Token[] = []

  constructor(private input: Lexer) {}

  speculate_list() {
    let success = false
    try {
      this.list()
    } catch (e) {
      success = false
    }

    return success
  }

  list() {}
}
