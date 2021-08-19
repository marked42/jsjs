import { ListLexer } from '../src/ListLexer'
import { TokenType } from '../src/Token'

describe('ListLexer', () => {
  it('should recognize NAME token and punctuators', () => {
    const input = ' [ test, b ] '
    const lexer = new ListLexer(input)
    expect(lexer.nextToken()).toEqual({
      type: TokenType.LeftBracket,
      text: '[',
    })
    expect(lexer.nextToken()).toEqual({
      type: TokenType.Name,
      text: 'test',
    })
    expect(lexer.nextToken()).toEqual({
      type: TokenType.Comma,
      text: ',',
    })
    expect(lexer.nextToken()).toEqual({
      type: TokenType.Name,
      text: 'b',
    })
    expect(lexer.nextToken()).toEqual({
      type: TokenType.RightBracket,
      text: ']',
    })
    expect(lexer.nextToken()).toEqual({
      type: TokenType.EOF,
      text: '',
    })
  })
})
