import { CharacterStream } from './CharacterStream'
import {
  Token,
  TokenType,
  Identifier,
  StringLiteral,
  LineComment,
  NumericLiteral,
} from './Token'
import * as Errors from './Errors'
import * as Warnings from './Warnings'

export class Lexer {
  private codes: number[] = []
  private charCode: number = -1
  private skipWhitespaceAndNewline = false

  constructor(private stream: CharacterStream) {}

  setSkipWhitespaceAndNewline(value: boolean) {
    this.skipWhitespaceAndNewline = value
  }

  getChar() {
    this.charCode = this.stream.next()
    if (this.charCode !== CharacterStream.EOF) {
      this.codes.push(this.charCode)
    }
    return this.charCode
  }

  // TODO: better naming ?
  ungetChar() {
    if (this.charCode !== CharacterStream.EOF) {
      this.codes.splice(this.codes.length - 1, 1)
      this.stream.prev()
      this.charCode = this.codes[this.codes.length - 1]
    }
    return this.charCode
  }

  acceptCharCodes() {
    const source = String.fromCharCode(...this.codes)
    this.resetCharCodes()
    return source
  }

  resetCharCodes() {
    this.codes = []
    this.charCode = -1
  }

  recognizeKeyword(name: string) {
    const map: { [key: string]: TokenType } = {
      enum: TokenType.Enum,
      int: TokenType.Int,
      char: TokenType.Char,
      if: TokenType.If,
      else: TokenType.Else,
      while: TokenType.While,
      return: TokenType.Return,

      sizeof: TokenType.Sizeof,
    }
    const tokenType = map[name] || TokenType.Identifier

    return tokenType
  }

  next(): Token {
    while (true) {
      const token = this._next()

      if (
        this.skipWhitespaceAndNewline &&
        [TokenType.Whitespace, TokenType.Newline].includes(token.type)
      ) {
        continue
      }

      return token
    }
  }

  _next(): Token {
    this.getChar()
    // StringLiteral
    if (charCodeIs(this.charCode, '"')) {
      const value = []

      while (true) {
        this.getChar()

        if (charCodeIs(this.charCode, '\\')) {
          this.getChar()
          if (charCodeIs(this.charCode, '"')) {
            // TODO: refactor as char code constant
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
            console.error(Warnings.StringLiteralInvalidEscapeSequence)
            value.push(this.charCode)
          }
        } else if (
          charCodeIs(this.charCode, '\r') ||
          charCodeIs(this.charCode, '\n')
        ) {
          throw Errors.StringLiteralUnescapedNewline
        } else if (charCodeIs(this.charCode, '"')) {
          return {
            type: TokenType.StringLiteral,
            source: this.acceptCharCodes(),
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
      let value = getDigitIntegerValue(this.charCode)

      if (isDigitZero(this.charCode)) {
        this.getChar()

        if (charCodeIs(this.charCode, 'x') || charCodeIs(this.charCode, 'X')) {
          this.getChar()
          if (!isHexDigit(this.charCode)) {
            throw Errors.NumericLiteralUnexpectedNonHexDigitAfter0X
          }
          while (true) {
            value = value * 16 + getDigitIntegerValue(this.charCode)

            this.getChar()
            if (!isHexDigit(this.charCode)) {
              this.ungetChar()
              break
            }
          }
        } else if (
          charCodeIs(this.charCode, 'b') ||
          charCodeIs(this.charCode, 'B')
        ) {
          this.getChar()
          if (!isBinaryDigit(this.charCode)) {
            throw Errors.NumericLiteralUnexpectedNonBinaryDigitAfter0B
          }
          while (true) {
            value = value * 2 + getDigitIntegerValue(this.charCode)

            this.getChar()
            if (!isBinaryDigit(this.charCode)) {
              this.ungetChar()
              break
            }
          }
        } else if (isDigit(this.charCode)) {
          while (true) {
            if (!isDigit(this.charCode)) {
              this.ungetChar()
              break
            }
            if (!isOctalDigit(this.charCode)) {
              throw Errors.NumericLiteralUnexpectedDigitInOctalInteger
            }
            value = value * 8 + getDigitIntegerValue(this.charCode)
            this.getChar()
          }
        }
      } else {
        while (true) {
          this.getChar()
          if (!isDigit(this.charCode)) {
            this.ungetChar()
            break
          }
          value = value * 10 + getDigitIntegerValue(this.charCode)
        }
      }
      return {
        type: TokenType.NumericLiteral,
        source: this.acceptCharCodes(),
        value,
      } as NumericLiteral
      // LineComment
    } else if (charCodeIs(this.charCode, '/')) {
      this.getChar()

      if (charCodeIs(this.charCode, '/')) {
        const value: number[] = []
        while (true) {
          this.getChar()
          if (
            charCodeIs(this.charCode, '\r') ||
            charCodeIs(this.charCode, '\n') ||
            this.charCode === CharacterStream.EOF
          ) {
            if (this.charCode !== CharacterStream.EOF) {
              this.ungetChar()
            }
            return {
              type: TokenType.LineComment,
              source: this.acceptCharCodes(),
              value: String.fromCharCode(...value),
            } as LineComment
          }
          value.push(this.charCode)
        }
      } else if (charCodeIs(this.charCode, '=')) {
        return {
          type: TokenType.DivAssign,
          source: this.acceptCharCodes(),
        }
      } else {
        this.ungetChar()
        return {
          type: TokenType.Div,
          source: this.acceptCharCodes(),
        }
      }
      // Whitespace
    } else if (isWhitespace(this.charCode)) {
      this.getChar()
      while (isWhitespace(this.charCode)) {
        this.getChar()
      }

      return {
        type: TokenType.Whitespace,
        source: this.acceptCharCodes(),
      }
      // Newline
    } else if (charCodeIs(this.charCode, '\r')) {
      this.getChar()
      if (charCodeIs(this.charCode, '\n')) {
        return {
          type: TokenType.Newline,
          source: '\r\n',
        }
      } else {
        this.ungetChar()
        return {
          type: TokenType.Newline,
          source: '\r',
        }
      }
    } else if (charCodeIs(this.charCode, '\n')) {
      return {
        type: TokenType.Newline,
        source: '\n',
      }
    } else if (isIdentifierStart(this.charCode)) {
      do {
        this.getChar()
      } while (isIdentifierContinue(this.charCode))

      const source = this.acceptCharCodes()
      const tokenType = this.recognizeKeyword(source)

      if (tokenType === TokenType.Identifier) {
        return {
          type: tokenType,
          source,
          name: source,
        } as Identifier
      }

      return {
        type: tokenType,
        source,
      }
    } else {
      let type!: TokenType
      if (charCodeIs(this.charCode, '!')) {
        type = TokenType.Negate
        this.getChar()

        if (charCodeIs(this.charCode, '=')) {
          type = TokenType.NotEqual
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '-')) {
        type = TokenType.Minus
        this.getChar()

        if (charCodeIs(this.charCode, '-')) {
          type = TokenType.Decrement
        } else if (charCodeIs(this.charCode, '=')) {
          type = TokenType.MinusAssign
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '+')) {
        type = TokenType.Plus
        this.getChar()

        if (charCodeIs(this.charCode, '+')) {
          type = TokenType.Increment
        } else if (charCodeIs(this.charCode, '=')) {
          type = TokenType.PlusAssign
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '*')) {
        type = TokenType.Star
        this.getChar()

        if (charCodeIs(this.charCode, '*')) {
          type = TokenType.StarStar
        } else if (charCodeIs(this.charCode, '=')) {
          type = TokenType.StarAssign
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '~')) {
        type = TokenType.Tilde
      } else if (charCodeIs(this.charCode, '&')) {
        type = TokenType.And
        this.getChar()

        if (charCodeIs(this.charCode, '&')) {
          type = TokenType.AndAnd
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '|')) {
        type = TokenType.Or
        this.getChar()

        if (charCodeIs(this.charCode, '|')) {
          type = TokenType.OrOr
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '^')) {
        type = TokenType.Xor
        this.getChar()
      } else if (charCodeIs(this.charCode, '=')) {
        type = TokenType.Assign
        this.getChar()

        if (charCodeIs(this.charCode, '=')) {
          type = TokenType.Equal
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '>')) {
        type = TokenType.Greater
        this.getChar()

        if (charCodeIs(this.charCode, '=')) {
          type = TokenType.GreaterEqual
        } else if (charCodeIs(this.charCode, '>')) {
          type = TokenType.RightShift
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '<')) {
        type = TokenType.Less
        this.getChar()

        if (charCodeIs(this.charCode, '=')) {
          type = TokenType.LessEqual
        } else if (charCodeIs(this.charCode, '<')) {
          type = TokenType.LeftShift
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '(')) {
        type = TokenType.LeftParen
      } else if (charCodeIs(this.charCode, ')')) {
        type = TokenType.RightParen
      } else if (charCodeIs(this.charCode, '{')) {
        type = TokenType.LeftBracket
      } else if (charCodeIs(this.charCode, '}')) {
        type = TokenType.RightBracket
      } else if (charCodeIs(this.charCode, '[')) {
        type = TokenType.LeftSquare
      } else if (charCodeIs(this.charCode, ']')) {
        type = TokenType.RightSquare
      } else if (charCodeIs(this.charCode, '?')) {
        type = TokenType.Question
      } else if (charCodeIs(this.charCode, ':')) {
        type = TokenType.Colon
      } else if (charCodeIs(this.charCode, ';')) {
        type = TokenType.SemiColon
      } else if (charCodeIs(this.charCode, ',')) {
        type = TokenType.Comma
      } else if (charCodeIs(this.charCode, '.')) {
        type = TokenType.Dot
      }

      if (type !== undefined) {
        return {
          type,
          source: this.acceptCharCodes(),
        }
      }
    }

    throw new Error('Unexpected token ' + String.fromCharCode(this.charCode))
  }
}

// TODO: move to charcode utils
function charCodeIs(code: number, text: string) {
  if (text.length !== 1) {
    throw new Error('text must be single character, got ' + text)
  }
  return code === text.charCodeAt(0)
}

function isDigit(code: number) {
  return code >= '0'.charCodeAt(0) && code <= '9'.charCodeAt(0)
}

function isDigitZero(code: number) {
  return code === '0'.charCodeAt(0)
}

function isBinaryDigit(code: number) {
  const binaryDigitCodes = ['0', '1'].map((c) => c.charCodeAt(0))

  return binaryDigitCodes.includes(code)
}

function getDigitIntegerValue(code: number) {
  if (isLowerCaseAToF(code)) {
    return code - 'a'.charCodeAt(0) + 10
  }
  if (isUpperCaseAToF(code)) {
    return code - 'A'.charCodeAt(0) + 10
  }
  return code - '0'.charCodeAt(0)
}

function isLowerCaseAToF(code: number) {
  return code >= 'a'.charCodeAt(0) && code <= 'f'.charCodeAt(0)
}

function isUpperCaseAToF(code: number) {
  return code >= 'A'.charCodeAt(0) && code <= 'F'.charCodeAt(0)
}

function isOctalDigit(code: number) {
  return code >= '0'.charCodeAt(0) && code <= '7'.charCodeAt(0)
}

function isHexDigit(code: number) {
  return (
    isDigit(code) ||
    (code >= 'a'.charCodeAt(0) && code <= 'f'.charCodeAt(0)) ||
    (code >= 'A'.charCodeAt(0) && code <= 'F'.charCodeAt(0))
  )
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
