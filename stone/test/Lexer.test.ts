import { Lexer } from '../src/Lexer'
import { NumberToken, StringToken } from '../src/Token'

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
  it.only('should lex empty string', () => {
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
})
