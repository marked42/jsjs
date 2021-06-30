import { Lexer } from '../Lexer'
import { CharacterStream } from '../CharacterStream'
import { TokenEOF, TokenType, Token } from '../Token'
import * as Errors from '../Errors'

function recognizeToken(input: string) {
  const stream = new CharacterStream(input)
  const lexer = new Lexer(stream)

  return lexer._next()
}

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
    if (result instanceof Error) {
      expect(() => recognizeToken(input)).toThrowError(result)
    } else {
      expect(recognizeToken(input)).toEqual(result)
    }
  })
})

describe('LineComment', () => {
  it('recognize line comment with content', () => {
    const input = '// line1\rline2'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.LineComment,
      source: '// line1',
      value: ' line1',
    })
  })

  it('recognize line comment with content at the end of file', () => {
    const input = '// line1'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.LineComment,
      source: '// line1',
      value: ' line1',
    })
  })

  it('recognize line comment with empty content immediately followed by newline', () => {
    const inputs = ['//\n', '//\r', '//\r\n']
    inputs.forEach((input) => {
      expect(recognizeToken(input)).toEqual({
        type: TokenType.LineComment,
        source: '//',
        value: '',
      })
    })
  })

  it('recognize line comment with empty content at the end of file', () => {
    const input = '//'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.LineComment,
      source: '//',
      value: '',
    })
  })
})

describe('Whitespace', () => {
  it('recognize whitespace', () => {
    const input = ' '
    expect(recognizeToken(input)).toEqual({
      type: TokenType.Whitespace,
      source: ' ',
    })
  })

  it('recognize whitespace tab', () => {
    const input = '\t'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.Whitespace,
      source: '\t',
    })
  })

  it('recognize whitespace of multiple characters', () => {
    const input = ' \t \t'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.Whitespace,
      source: ' \t \t',
    })
  })
})

describe('Newline', () => {
  it('recognize \\r\\n as newline', () => {
    const input = '\r\n'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.Newline,
      source: '\r\n',
    })
  })

  it('recognize \\r as newline', () => {
    const input = '\r'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.Newline,
      source: '\r',
    })
  })

  it('recognize \\n as newline', () => {
    const input = '\n'
    expect(recognizeToken(input)).toEqual({
      type: TokenType.Newline,
      source: '\n',
    })
  })
})

describe('Identifier', () => {
  it.each([
    [
      'a',
      {
        type: TokenType.Identifier,
        source: 'a',
        name: 'a',
      },
    ],
    [
      'A',
      {
        type: TokenType.Identifier,
        source: 'A',
        name: 'A',
      },
    ],
    [
      '_',
      {
        type: TokenType.Identifier,
        source: '_',
        name: '_',
      },
    ],
    [
      '_a1',
      {
        type: TokenType.Identifier,
        source: '_a1',
        name: '_a1',
      },
    ],
    [
      'aa1',
      {
        type: TokenType.Identifier,
        source: 'aa1',
        name: 'aa1',
      },
    ],
    [
      'AA1',
      {
        type: TokenType.Identifier,
        source: 'AA1',
        name: 'AA1',
      },
    ],
  ])('recognize identifier', (input, result) => {
    expect(recognizeToken(input)).toEqual(result)
  })
})

describe('NumericLiteral', () => {
  it.each([
    [
      'single digit zero',
      '0',
      {
        type: TokenType.NumericLiteral,
        source: '0',
        value: 0,
      },
    ],
    [
      'non-zero single digit',
      '1',
      {
        type: TokenType.NumericLiteral,
        source: '1',
        value: 1,
      },
    ],
    [
      'with multiple decimal digits followed by non digit',
      '121as',
      {
        type: TokenType.NumericLiteral,
        source: '121',
        value: 121,
      },
    ],
    [
      'with multiple decimal digits followed by EOF',
      '121',
      {
        type: TokenType.NumericLiteral,
        source: '121',
        value: 121,
      },
    ],
    [
      'with binary digits',
      '0b11',
      {
        type: TokenType.NumericLiteral,
        source: '0b11',
        value: 3,
      },
    ],
    [
      'throw error with no following binary digit',
      '0b',
      Errors.NumericLiteralUnexpectedNonBinaryDigitAfter0B,
    ],
    [
      'with octal digits',
      '011',
      {
        type: TokenType.NumericLiteral,
        source: '011',
        value: 9,
      },
    ],
    [
      'throw error with no following octal digit',
      '08',
      Errors.NumericLiteralUnexpectedDigitInOctalInteger,
    ],
    [
      'hex digits',
      '0x11',
      {
        type: TokenType.NumericLiteral,
        source: '0x11',
        value: 17,
      },
    ],
    [
      'hex digits',
      '0x0a',
      {
        type: TokenType.NumericLiteral,
        source: '0x0a',
        value: 10,
      },
    ],
    [
      'throw error with no following hex digit',
      '0xg',
      Errors.NumericLiteralUnexpectedNonHexDigitAfter0X,
    ],
  ])('recognize numeric literal %s', (_title, input, result) => {
    if (result instanceof Error) {
      expect(() => recognizeToken(input)).toThrowError(result)
    } else {
      expect(recognizeToken(input)).toEqual(result)
    }
  })
})

describe('Keyword', () => {
  it('recognize keyword', () => {
    const keywords = [
      ['enum', TokenType.Enum],
      ['int', TokenType.Int],
      ['char', TokenType.Char],
      ['if', TokenType.If],
      ['else', TokenType.Else],
      ['return', TokenType.Return],
      ['while', TokenType.While],
    ] as const

    keywords.forEach((option) => {
      const [keyword, type] = option

      expect(recognizeToken(keyword)).toEqual({
        type,
        source: keyword,
      })
    })
  })
})

describe('Operator and Punctuation', () => {
  it('recognize operator', () => {
    const keywords = [
      ['sizeof', TokenType.Sizeof],
      ['+', TokenType.Plus],
      ['++', TokenType.Increment],
      ['+=', TokenType.PlusAssign],
      ['-', TokenType.Minus],
      ['--', TokenType.Decrement],
      ['-=', TokenType.MinusAssign],
      ['*', TokenType.Star],
      ['**', TokenType.StarStar],
      ['*=', TokenType.StarAssign],
      ['/', TokenType.Div],
      ['/=', TokenType.DivAssign],
      ['%', TokenType.Modulus],
      ['%=', TokenType.ModulusAssign],
      ['~', TokenType.Tilde],
      ['&', TokenType.And],
      ['&=', TokenType.AndAssign],
      ['&&', TokenType.AndAnd],
      ['|', TokenType.Or],
      ['|=', TokenType.OrAssign],
      ['||', TokenType.OrOr],
      ['^', TokenType.Xor],
      ['^=', TokenType.XorAssign],
      ['=', TokenType.Assign],
      ['==', TokenType.Equal],
      ['!', TokenType.Negate],
      ['!=', TokenType.NotEqual],
      ['>', TokenType.Greater],
      ['>=', TokenType.GreaterEqual],
      ['<', TokenType.Less],
      ['<=', TokenType.LessEqual],
      ['>>', TokenType.RightShift],
      ['>>=', TokenType.RightShiftAssign],
      ['<<', TokenType.LeftShift],
      ['<<=', TokenType.LeftShiftAssign],

      ['(', TokenType.LeftParen],
      [')', TokenType.RightParen],
      ['{', TokenType.LeftBracket],
      ['}', TokenType.RightBracket],
      ['[', TokenType.LeftSquare],
      [']', TokenType.RightSquare],
      ['?', TokenType.Question],
      [':', TokenType.Colon],
      [',', TokenType.Comma],
      [';', TokenType.SemiColon],
      ['.', TokenType.Dot],
      ['->', TokenType.PointerMember],
    ] as const

    keywords.forEach((option) => {
      const [keyword, type] = option

      expect(recognizeToken(keyword)).toEqual({
        type,
        source: keyword,
      })
    })
  })
})

describe('multiple tokens of different types', () => {
  it('should recognize different types of tokens', () => {
    const input = `
      int a = 0b01;
      // line comment
      char* b = "test";

      int c = a == b;
    `

    const stream = new CharacterStream(input)
    const lexer = new Lexer(stream)

    const tokens: Token[] = []
    while (true) {
      const token = lexer.consume()
      tokens.push(token)
      if (token === TokenEOF) {
        break
      }
    }

    expect(tokens).toMatchSnapshot()
  })
})
