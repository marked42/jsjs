import { CharacterStream } from './CharacterStream'
import { Token, TokenType, Identifier } from './Token'

export class Lexer {
  constructor(private stream: CharacterStream) {}

  next(): Token {
    const charCode = this.stream.peek()
    // StringLiteral
    if (charCodeIs(charCode, '"')) {
      // NumericLiteral
    } else if (isDigit(charCode)) {
      // LineComment
    } else if (charCodeIs(charCode, '/')) {
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
    } else if (isWhitespace(charCode)) {
      const codes = [this.stream.next()]
      while (isWhitespace(this.stream.peek())) {
        codes.push(this.stream.next())
      }
      // Newline
    } else if (charCodeIs(charCode, '\r')) {
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
    } else if (charCodeIs(charCode, '\n')) {
      this.stream.next()
      return {
        type: TokenType.Whitespace,
        source: '\n',
      }
    } else if (isIdentifierStart(charCode)) {
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

    throw new Error('Unexpected token ' + String.fromCharCode(charCode))
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
