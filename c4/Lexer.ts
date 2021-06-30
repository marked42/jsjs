import { CharacterStream } from './CharacterStream'
import { Token, TokenType, TokenEOF, OtherTokenType, Keyword } from './Token'
import * as Errors from './Errors'
import * as Warnings from './Warnings'

export class Lexer {
  private codes: number[] = []
  private charCode: number = -1
  private skippedTokenTypes: TokenType[] = []

  private lookaheadTokens: Token[] = []
  private lookaheadTokenIndex = 0

  constructor(private stream: CharacterStream) {}

  skipComment() {
    this.skippedTokenTypes.push(TokenType.LineComment)
  }

  skipWhitespace() {
    this.skippedTokenTypes.push(TokenType.Whitespace)
  }

  skipNewline() {
    this.skippedTokenTypes.push(TokenType.Newline)
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
    // TODO: better type organization
    const map: {
      [key: string]: Keyword | TokenType.Sizeof | TokenType.Identifier
    } = {
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

  fillQueue(num: number) {
    for (let i = 0; i !== num; i++) {
      this.lookaheadTokens.push(this.nextNonSkippedToken())
    }
  }

  lookahead(i: number = 0) {
    const targetIndex = this.lookaheadTokenIndex + i
    this.fillQueue(targetIndex - this.lookaheadTokens.length + 1)

    return this.lookaheadTokens[targetIndex]
  }

  consume(tokenType?: TokenType): Token {
    const token = this.lookahead()

    if (tokenType !== undefined && tokenType !== token.type) {
      throw new Error(
        `expect token type ${tokenType}, encountered ${JSON.stringify(token)}`
      )
    }
    this.lookaheadTokenIndex++

    return token
  }

  nextNonSkippedToken() {
    while (true) {
      const token = this._next()

      if (
        this.skippedTokenTypes.length > 0 &&
        this.skippedTokenTypes.includes(token.type)
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
          }
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
      }
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
            }
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
      while (true) {
        this.getChar()
        if (isWhitespace(this.charCode)) {
          continue
        }
        this.ungetChar()
        break
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
          source: this.acceptCharCodes(),
        }
      } else {
        this.ungetChar()
        return {
          type: TokenType.Newline,
          source: this.acceptCharCodes(),
        }
      }
    } else if (charCodeIs(this.charCode, '\n')) {
      return {
        type: TokenType.Newline,
        source: this.acceptCharCodes(),
      }
    } else if (isIdentifierStart(this.charCode)) {
      while (true) {
        this.getChar()
        if (isIdentifierContinue(this.charCode)) {
          continue
        }
        this.ungetChar()
        break
      }

      const source = this.acceptCharCodes()
      const tokenType = this.recognizeKeyword(source)

      if (tokenType === TokenType.Identifier) {
        return {
          type: tokenType,
          source,
          name: source,
        }
      }

      return {
        type: tokenType,
        source,
      }
    } else if (this.charCode === CharacterStream.EOF) {
      return TokenEOF
    } else {
      let type!: OtherTokenType
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
        } else if (charCodeIs(this.charCode, '=')) {
          type = TokenType.AndAssign
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '%')) {
        type = TokenType.Modulus
        this.getChar()

        if (charCodeIs(this.charCode, '=')) {
          type = TokenType.ModulusAssign
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '|')) {
        type = TokenType.Or
        this.getChar()

        if (charCodeIs(this.charCode, '|')) {
          type = TokenType.OrOr
        } else if (charCodeIs(this.charCode, '=')) {
          type = TokenType.OrAssign
        } else {
          this.ungetChar()
        }
      } else if (charCodeIs(this.charCode, '^')) {
        type = TokenType.Xor
        this.getChar()

        if (charCodeIs(this.charCode, '=')) {
          type = TokenType.XorAssign
        } else {
          this.ungetChar()
        }
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
          this.getChar()
          if (charCodeIs(this.charCode, '=')) {
            type = TokenType.RightShiftAssign
          } else {
            this.ungetChar()
          }
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
          this.getChar()
          if (charCodeIs(this.charCode, '=')) {
            type = TokenType.LeftShiftAssign
          } else {
            this.ungetChar()
          }
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
