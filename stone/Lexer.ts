import {
  EOF,
  IdentifierToken,
  NumberToken,
  PunctuatorToken,
  StringToken,
  Token,
  TokenStream,
  WhitespaceToken,
} from './Token'

const CHAR_EOF = ''

export class Lexer extends TokenStream {
  private tokens: Token[] = []

  private inputIndex = 0
  private inputRow = 0
  private inputCol = 0

  constructor(private input: string) {
    super()
  }

  peek(i: number = 0) {
    this.fillQueue(i)
    if (i < this.tokens.length) {
      return this.tokens[i]
    }
    return EOF
  }

  next() {
    const token = this.peek()
    if (token !== EOF) {
      this.tokens.shift()
    }
    return token
  }

  getTokens() {
    const tokens: Token[] = []
    while (true) {
      const token = this.next()
      if (token === EOF) {
        break
      }
      tokens.push(token)
    }
    return tokens
  }

  private peekChar(i = 0) {
    const index = this.inputIndex + i
    if (index >= this.input.length) {
      return CHAR_EOF
    }

    const char = this.input[index]

    return char
  }

  private nextChar() {
    const char = this.peekChar()
    if (char === CHAR_EOF) {
      return char
    }

    if (
      char === '\r' ||
      (char === '\n' && this.input[this.inputIndex - 1] !== '\r')
    ) {
      this.inputRow++
      this.inputCol = 0
    } else {
      this.inputCol++
    }

    this.inputIndex++
    return char
  }

  /**
   * 向缓冲队列中读入i个Token供消费
   */
  private fillQueue(i: number) {
    loop: while (true) {
      const notEnoughTokens = this.tokens.length <= i
      const hasMoreInput = this.inputIndex < this.input.length

      if (!hasMoreInput || !notEnoughTokens) {
        break
      }

      const start = {
        row: this.inputRow,
        col: this.inputCol,
      }
      const from = this.inputIndex
      const matches = [
        {
          test: this.isDigit,
          type: NumberToken,
          match: this.matchNumber,
        },
        {
          test: (char: string) => /[_a-zA-Z]/.test(char),
          type: IdentifierToken,
          match: this.matchIdentifier,
        },
        {
          test: (char: string) => char === '"',
          type: StringToken,
          match: this.matchString,
        },
        {
          test: (char: string) => /\p{Punct}/.test(char),
          type: PunctuatorToken,
          match: this.matchPunctuator,
        },
        {
          test: (char: string) => /\s/.test(char),
          type: WhitespaceToken,
          match: this.matchWhitespace,
        },
      ]
      // if (this.peekChar() === CHAR_EOF) {
      //   this.tokens.push(EOF)
      //   break
      // }

      for (const option of matches) {
        const { test, type, match } = option
        if (test(this.peekChar())) {
          this.tokens.push(
            // @ts-ignore
            new type(match.call(this), {
              start,
              end: {
                row: this.inputRow,
                col: this.inputCol,
              },
              from,
              to: this.inputIndex,
            })
          )
          continue loop
        }
      }

      this.throwTokenError('unknown type')
    }
  }

  isDigit(char: string) {
    if (char === CHAR_EOF) {
      return false
    }

    const min = '0'.codePointAt(0)
    const max = '9'.codePointAt(0)
    const codePoint = char.codePointAt(0)

    if (min === void 0 || max === void 0 || codePoint === void 0) {
      throw new Error('received code point undefined for character ' + char)
    }
    return min <= codePoint && codePoint <= max
  }

  isNonZeroDigit(char: string) {
    const min = '1'.codePointAt(0)
    const max = '9'.codePointAt(0)
    const codePoint = char.codePointAt(0)

    if (char === CHAR_EOF) {
      return true
    }

    if (min === void 0 || max === void 0 || codePoint === void 0) {
      throw new Error('received code point undefined for character ' + char)
    }
    return min <= codePoint && codePoint <= max
  }

  private matchNumber() {
    const char = this.peekChar()
    if (char === '0') {
      this.nextChar()
      if (this.isDigit(this.peekChar())) {
        throw new Error('no digits allowed after zeros, input ' + this.input)
      } else {
        return '0'
      }
    } else if (this.isNonZeroDigit(char)) {
      this.nextChar()
      let text = char
      while (this.isDigit(this.peekChar())) {
        text += this.nextChar()
      }
      return text
    }

    this.throwTokenError('number')
  }

  private matchIdentifier() {
    const char = this.peekChar()

    let text = ''
    if (/^[_a-zA-Z]$/.test(char)) {
      text += this.nextChar()
      while (/^[_a-zA-Z0-9]$/.test(this.peekChar())) {
        text += this.nextChar()
      }
      return text
    }

    this.throwTokenError('identifier')
  }

  throwTokenError(tokenType: string) {
    throw new Error(
      `expect ${tokenType} token at index ${this.inputIndex}, position: (${this.inputRow}, ${this.inputCol})`
    )
  }

  private matchWhitespace() {
    const char = this.peekChar()
    if (!/[ \t\n\r]/.test(char)) {
      this.throwTokenError('whitespace')
    }

    let text = ''
    while (/[ \t\n\r]/.test(this.peekChar())) {
      text += this.nextChar()
    }

    return text
  }

  private matchString() {
    let text = ''
    this.match('"')
    if (this.peekChar() === '\\') {
      text += this.nextChar()

      if (this.match(/(n|r|v|t)/)) {
        text += this.nextChar()
      } else {
        text += this.nextChar()
      }
    } else if (this.match(/[^\n\r\\"]/)) {
      while (this.match(/[^\n\r\\"]/)) {
        text += this.nextChar()
      }
    } else {
      this.throwTokenError('string')
    }

    this.match('"')
    return text
  }

  match(expected: string | RegExp | ((char: string) => boolean)) {
    const char = this.peekChar()

    if (
      (typeof expected === 'string' && expected === char) ||
      (expected instanceof RegExp && expected.test(char)) ||
      (typeof expected === 'function' && expected(char))
    ) {
      return this.nextChar()
    }

    throw new Error(
      'failed to match character, expect ${expected}, got ${char}'
    )
  }

  private matchPunctuator() {
    if (this.match(/\p{Punct}/)) {
      return this.nextChar()
    }
    this.throwTokenError('punctuator')
  }
}
