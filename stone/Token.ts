export enum TokenType {
  String,
  Number,
  Identifier,
  Punctuator,
  Whitespace,
  EOF,
}

interface Position {
  row: number
  col: number
}

interface SourceLocation {
  start?: Position
  end?: Position
  from?: number
  to?: number
}

export abstract class Token {
  constructor(private _text: string, private _location?: SourceLocation) {}
  abstract type(): TokenType
  text() {
    return this._text
  }
  location(): SourceLocation {
    if (this._location !== void 0) {
      return this._location
    }
    return {
      start: void 0,
      end: void 0,
      from: void 0,
      to: void 0,
    }
  }
}

export class NumberToken extends Token {
  type() {
    return TokenType.Number
  }
}

export class StringToken extends Token {
  type() {
    return TokenType.String
  }
}

export class PunctuatorToken extends Token {
  type() {
    return TokenType.Punctuator
  }
}

export class IdentifierToken extends Token {
  type() {
    return TokenType.Identifier
  }
}

export class WhitespaceToken extends Token {
  type() {
    return TokenType.Whitespace
  }
}

export const EOF = (function () {
  class EOFToken extends Token {
    type() {
      return TokenType.EOF
    }
  }

  return new EOFToken('')
})()

export abstract class TokenStream {
  abstract peek(i: number): Token
  abstract peek(): Token

  abstract next(): Token
  end() {
    return this.peek() === EOF
  }
}
