import { LLkParser } from '../src/LLkParser'
import { ListLexer } from '../src/ListLexer'

describe('llk parser', () => {
  it('should recognize ll1 grammar', () => {
    const lexer = new ListLexer('[ a, [b , c ]]')
    const parser = new LLkParser(lexer, 2)

    expect(() => parser.list()).not.toThrowError()
  })

  it('cannot recognize ll2 grammar', () => {
    const lexer = new ListLexer('[ a, b = c]')
    const parser = new LLkParser(lexer, 2)

    expect(() => parser.list()).not.toThrowError()
  })
})
