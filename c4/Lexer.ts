import { CharacterStream } from './CharacterStream'
import { Token, TokenType, Identifier, StringLiteral } from './Token'
import * as Errors from './Errors'

export class Lexer {
  private codes: number[] = []
  private charCode: number = -1
  constructor(private stream: CharacterStream) {}

  getChar() {
    this.charCode = this.stream.next()
    if (this.charCode !== CharacterStream.EOF) {
      this.codes.push(this.charCode)
    }
    return this.charCode
  }

  ungetChar() {
    this.codes.splice(this.codes.length - 1, 1)
    this.stream.prev()
    this.charCode = this.codes[this.codes.length - 1]
  }

  resetCharCodes() {
    this.codes = []
    this.charCode = -1
  }

  next(): Token {
    this.getChar()
    // StringLiteral
    if (charCodeIs(this.charCode, '"')) {
      const value = []

      while (true) {
        this.getChar()

        if (charCodeIs(this.charCode, '\\')) {
          this.getChar()
          if (charCodeIs(this.charCode, '"')) {
            value.push('"'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, "'")) {
            value.push("'".charCodeAt(0))
          } else if (charCodeIs(this.charCode, 'b')) {
            value.push('\b'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, 'f')) {
            value.push('\f'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, 'n')) {
            value.push('\n'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, 'r')) {
            value.push('\r'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, 't')) {
            value.push('\t'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, 'v')) {
            value.push('\v'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, '\\')) {
            value.push('\\'.charCodeAt(0))
          } else if (charCodeIs(this.charCode, '\r')) {
            value.push('\r'.charCodeAt(0))
            this.getChar()
            if (charCodeIs(this.charCode, '\n')) {
              value.push('\n'.charCodeAt(0))
            } else {
              this.ungetChar()
            }
          } else if (charCodeIs(this.charCode, '\n')) {
            value.push('\n'.charCodeAt(0))
          } else {
            console.error(
              'invalid escape sequence \\' + String.fromCharCode(this.charCode)
            )
            value.push(this.charCode)
          }
        } else if (
          charCodeIs(this.charCode, '\r') ||
          charCodeIs(this.charCode, '\n')
        ) {
          throw Errors.StringLiteralUnescapedNewline
        } else if (charCodeIs(this.charCode, '"')) {
          const source = String.fromCharCode(...this.codes)
          this.resetCharCodes()
          return {
            type: TokenType.StringLiteral,
            source,
            value: String.fromCharCode(...value),
          } as StringLiteral
        } else if (this.charCode === CharacterStream.EOF) {
          throw Errors.StringLiteralEndEarly
        } else {
          value.push(this.charCode)
        }
      }
      // NumericLiteral
    } else if (isDigit(this.charCode)) {
      // LineComment
    } else if (charCodeIs(this.charCode, '/')) {
      this.stream.next()

      if (charCodeIs(this.stream.peek(), '/')) {
        this.stream.next()
        const codes = []
        while (true) {
          const code = this.stream.peek()
          if (!charCodeIs(code, '\r') && !charCodeIs(code, '\n')) {
            codes.push(code)
            this.stream.next()
          } else {
            return {
              type: TokenType.LineComment,
              source: String.fromCharCode(...codes),
            }
          }
        }
      } else {
        return {
          type: TokenType.Operator,
          source: '/',
        }
      }
      // Whitespace
    } else if (isWhitespace(this.charCode)) {
      const codes = [this.stream.next()]
      while (isWhitespace(this.stream.peek())) {
        codes.push(this.stream.next())
      }

      return {
        type: TokenType.Whitespace,
        source: String.fromCharCode(...codes),
      }
      // Newline
    } else if (charCodeIs(this.charCode, '\r')) {
      this.stream.next()
      if (charCodeIs(this.stream.peek(), '\n')) {
        this.stream.next()
        return {
          type: TokenType.Newline,
          source: '\r\n',
        }
      } else {
        return {
          type: TokenType.Newline,
          source: '\r',
        }
      }
    } else if (charCodeIs(this.charCode, '\n')) {
      this.stream.next()
      return {
        type: TokenType.Whitespace,
        source: '\n',
      }
    } else if (isIdentifierStart(this.charCode)) {
      const codes = [this.stream.next()]

      while (true) {
        const code = this.stream.peek()
        if (isIdentifierContinue(code)) {
          codes.push(code)
          this.stream.next()
          continue
        }

        const source = String.fromCharCode(...codes)
        return {
          type: TokenType.Identifier,
          source,
          name: source,
        } as Identifier
      }
    }

    throw new Error('Unexpected token ' + String.fromCharCode(this.charCode))
  }
}

function charCodeIs(code: number, text: string) {
  if (text.length !== 1) {
    throw new Error('text must be single character, got ' + text)
  }
  return code === text.charCodeAt(0)
}

function isDigit(code: number) {
  return code >= '0'.charCodeAt(0) && code <= '9'.charCodeAt(0)
}

function isWhitespace(code: number) {
  const ws = [' ', '\t'].map((c) => c.charCodeAt(0))

  return ws.includes(code)
}

function isLetter(code: number) {
  const isLower = code >= 'a'.charCodeAt(0) && code <= 'z'.charCodeAt(0)
  const isUpper = code >= 'A'.charCodeAt(0) && code <= 'Z'.charCodeAt(0)

  return isLower || isUpper
}

function isIdentifierStart(code: number) {
  return isLetter(code) || charCodeIs(code, '_')
}

function isIdentifierContinue(code: number) {
  return isLetter(code) || charCodeIs(code, '_') || isDigit(code)
}
