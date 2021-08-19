import { LL1Parser } from '../src/LL1Parser'
import { ListLexer } from '../src/ListLexer'

describe('ll1 parser', () => {
  it('should recognize ll1 grammar', () => {
    const lexer = new ListLexer('[ a, [b , c ]]')
    const parser = new LL1Parser(lexer)

    expect(() => parser.list()).not.toThrowError()
  })

  it('cannot recognize ll2 grammar', () => {
    const lexer = new ListLexer('[ a, b = c]')
    const parser = new LL1Parser(lexer)

    expect(() => parser.list()).toThrowError()
  })
})
