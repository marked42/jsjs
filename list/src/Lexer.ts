import { Token } from './Token'

export abstract class Lexer {
  public index = 0
  public char = Lexer.EOF

  static EOF = -1

  constructor(protected input: string) {
    this.char = input.charCodeAt(0)
  }

  abstract nextToken(): Token

  consume() {
    this.index++
    if (this.index >= this.input.length) {
      this.char = Lexer.EOF
    } else {
      this.char = this.input.charCodeAt(this.index)
    }
  }

  match(char: number) {
    if (this.char !== char) {
      throw new Error(`expecting ${char}, get ${this.char}`)
    }
    this.consume()
  }
}
