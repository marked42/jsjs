import { Lexer } from './Lexer'
import { Token, TokenType } from './Token'

export class ListLexer extends Lexer {
  nextToken() {
    while (this.char !== Lexer.EOF) {
      if (this.isLetter(this.char)) {
        return this.NAME()
      } else if (this.isWhitespace(this.char)) {
        // skip whitespace
        this.WS()
        continue
      } else if ('['.charCodeAt(0) === this.char) {
        this.consume()
        return new Token(TokenType.LeftBracket, '[')
      } else if ('='.charCodeAt(0) === this.char) {
        this.consume()
        return new Token(TokenType.Equal, '=')
      } else if (']'.charCodeAt(0) === this.char) {
        this.consume()
        return new Token(TokenType.RightBracket, ']')
      } else if (','.charCodeAt(0) === this.char) {
        this.consume()
        return new Token(TokenType.Comma, ',')
      } else {
        throw new Error(`unexpected token ${this.char}`)
      }
    }

    return new Token(TokenType.EOF, '')
  }

  NAME() {
    let text = []
    while (this.isLetter(this.char)) {
      text.push(this.char)
      this.consume()
    }

    return new Token(TokenType.Name, String.fromCharCode(...text))
  }

  WS() {
    while (this.isWhitespace(this.char)) {
      this.consume()
    }
  }

  isLetter(char: number) {
    const a = 'a'.charCodeAt(0)
    const z = 'z'.charCodeAt(0)
    const A = 'A'.charCodeAt(0)
    const Z = 'Z'.charCodeAt(0)

    return (a <= char && char <= z) || (A <= char && char <= Z)
  }

  isWhitespace(char: number) {
    return [' ', '\t', '\r', '\n'].some((e) => e.charCodeAt(0) === char)
  }
}
