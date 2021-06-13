import { Lexer } from '../src/Lexer'
import {
  IdentifierToken,
  NumberToken,
  PunctuatorToken,
  StringToken,
} from '../src/Token'

describe('number', () => {
  it('should lex decimal integer', () => {
    const input = '111'
    const lexer = new Lexer(input)

    const tokens = lexer.getTokens()
    expect(tokens).toEqual([
      new NumberToken('111', {
        from: 0,
        to: 3,
        start: {
          row: 0,
          col: 0,
        },
        end: {
          row: 0,
          col: 3,
        },
      }),
    ])
  })

  it('should lex integer 0', () => {
    const input = '0'
    const lexer = new Lexer(input)

    const tokens = lexer.getTokens()
    expect(tokens).toEqual([
      new NumberToken('0', {
        from: 0,
        to: 1,
        start: {
          row: 0,
          col: 0,
        },
        end: {
          row: 0,
          col: 1,
        },
      }),
    ])
  })

  it('should lex non-zero single digit integer 1', () => {
    const input = '1'
    const lexer = new Lexer(input)

    const tokens = lexer.getTokens()
    expect(tokens).toEqual([
      new NumberToken('1', {
        from: 0,
        to: 1,
        start: {
          row: 0,
          col: 0,
        },
        end: {
          row: 0,
          col: 1,
        },
      }),
    ])
  })

  it('should throw for invalid', () => {
    const input = '00'
    const lexer = new Lexer(input)

    expect(() => {
      const tokens = lexer.getTokens()
    }).toThrowError()
  })
})

describe('string', () => {
  it('should lex empty string', () => {
    const input = '""'
    const lexer = new Lexer(input)

    expect(lexer.getTokens()).toEqual([
      new StringToken('""', {
        from: 0,
        to: 2,
        start: {
          row: 0,
          col: 0,
        },
        end: {
          row: 0,
          col: 2,
        },
      }),
    ])
  })

  it('should lex normal string', () => {
    const input = '"a"'
    const lexer = new Lexer(input)

    expect(lexer.getTokens()).toEqual([
      new StringToken('"a"', {
        from: 0,
        to: 3,
        start: {
          row: 0,
          col: 0,
        },
        end: {
          row: 0,
          col: 3,
        },
      }),
    ])
  })

  it('should not allow line terminator ', () => {
    const input = '"a\n"'
    const lexer = new Lexer(input)

    expect(() => lexer.getTokens()).toThrow()
  })

  it.each([
    [
      'newline',
      '"a\\n"',
      [
        new StringToken('"a\\n"', {
          from: 0,
          to: 5,
          start: {
            row: 0,
            col: 0,
          },
          end: {
            row: 0,
            col: 5,
          },
        }),
      ],
    ],
    [
      'carriage return',
      '"a\\r"',
      [
        new StringToken('"a\\r"', {
          from: 0,
          to: 5,
          start: {
            row: 0,
            col: 0,
          },
          end: {
            row: 0,
            col: 5,
          },
        }),
      ],
    ],
  ])('should lex escape string %s', (name, input, result) => {
    const lexer = new Lexer(input)

    expect(lexer.getTokens()).toEqual(result)
  })
})

describe('punctuator', () => {
  it('should lex punctuator', () => {
    const punctuators = ['*', '==', '<=', '=', '>=', '!=', '&&', '||']
    punctuators.forEach((punct) => {
      const lexer = new Lexer(punct)

      const tokens = lexer.getTokens()
      expect(tokens).toEqual([
        new PunctuatorToken(punct, {
          from: 0,
          to: punct.length,
          start: {
            row: 0,
            col: 0,
          },
          end: {
            row: 0,
            col: punct.length,
          },
        }),
      ])
    })
  })
})

describe('identifier', () => {
  it('should lex identifier', () => {
    const identifiers = ['_', 'a', '_a']
    identifiers.forEach((punct) => {
      const lexer = new Lexer(punct)

      const tokens = lexer.getTokens()
      expect(tokens).toEqual([
        new IdentifierToken(punct, {
          from: 0,
          to: punct.length,
          start: {
            row: 0,
            col: 0,
          },
          end: {
            row: 0,
            col: punct.length,
          },
        }),
      ])
    })
  })
})

describe('whitespace', () => {
  it('should lex ignore whitespace', () => {
    const whitespace = [' ', '\t']
    whitespace.forEach((punct) => {
      const lexer = new Lexer(punct)

      const tokens = lexer.getTokens()
      expect(tokens).toEqual([])
    })
  })
})

describe('compound example', () => {
  it('should parse multiple tokens', () => {
    const input = 'let a = 1, b = "str"'
    const lexer = new Lexer(input)
    const tokens = lexer.getTokens()
    expect(tokens).toMatchSnapshot()
  })
})
