import { Lexer } from '../Lexer'
import { CharacterStream } from '../CharacterStream'
import { TokenType } from '../Token'
import * as Errors from '../Errors'

describe('StringLiteral', () => {
  it.each([
    [
      'recognize normal string literal',
      '"test"',
      {
        type: TokenType.StringLiteral,
        source: '"test"',
        value: 'test',
      },
    ],
    [
      'recognize escape sequence newline',
      '"\\n"',
      {
        type: TokenType.StringLiteral,
        source: '"\\n"',
        value: '\n',
      },
    ],
    [
      'recognize escape sequence backward',
      '"\\b"',
      {
        type: TokenType.StringLiteral,
        source: '"\\b"',
        value: '\b',
      },
    ],
    [
      'recognize escape sequence formfeed',
      '"\\f"',
      {
        type: TokenType.StringLiteral,
        source: '"\\f"',
        value: '\f',
      },
    ],
    [
      'recognize escape sequence carriage return',
      '"\\r"',
      {
        type: TokenType.StringLiteral,
        source: '"\\r"',
        value: '\r',
      },
    ],
    [
      'recognize escape sequence tab',
      '"\\t"',
      {
        type: TokenType.StringLiteral,
        source: '"\\t"',
        value: '\t',
      },
    ],
    [
      'recognize escape sequence vertical tab',
      '"\\v"',
      {
        type: TokenType.StringLiteral,
        source: '"\\v"',
        value: '\v',
      },
    ],
    [
      'recognize escape sequence double quote',
      '"\\""',
      {
        type: TokenType.StringLiteral,
        source: '"\\""',
        value: '"',
      },
    ],
    [
      'recognize escape sequence single quote',
      '"\\\'"',
      {
        type: TokenType.StringLiteral,
        source: '"\\\'"',
        value: "'",
      },
    ],
    [
      'recognize escape sequence backward slash',
      '"\\\\"',
      {
        type: TokenType.StringLiteral,
        source: '"\\\\"',
        value: '\\',
      },
    ],
    [
      'recognize escape sequence line continuation',
      '"\\\n"',
      {
        type: TokenType.StringLiteral,
        source: '"\\\n"',
        value: '\n',
      },
    ],
    [
      'recognize escape sequence line continuation',
      '"\\\r"',
      {
        type: TokenType.StringLiteral,
        source: '"\\\r"',
        value: '\r',
      },
    ],
    [
      'recognize escape sequence line continuation',
      '"\\\r\n"',
      {
        type: TokenType.StringLiteral,
        source: '"\\\r\n"',
        value: '\r\n',
      },
    ],
    [
      'throw error when encountering early EOF',
      '"',
      Errors.StringLiteralEndEarly,
    ],
    [
      'throw error when encountering unescaped newline',
      '"\n"',
      Errors.StringLiteralUnescapedNewline,
    ],
  ])('%s', (_title, input, result) => {
    const stream = new CharacterStream(input)
    const lexer = new Lexer(stream)

    if (result instanceof Error) {
      expect(() => lexer.next()).toThrowError(result)
    } else {
      expect(lexer.next()).toEqual(result)
    }
  })
})
