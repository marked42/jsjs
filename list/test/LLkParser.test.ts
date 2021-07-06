import { LLkParserLazy } from '../src/LLkParserLazy'
import { LLkParserEager } from '../src/LLkParserEager'
import { ListLexer } from '../src/ListLexer'

describe('llk parser lazy', () => {
  it('should recognize ll1 grammar', () => {
    const lexer = new ListLexer('[ a, [b , c ]]')
    const parser = new LLkParserLazy(lexer, 2)

    expect(() => parser.list()).not.toThrowError()
  })

  it('cannot recognize ll2 grammar', () => {
    const lexer = new ListLexer('[ a, b = c]')
    const parser = new LLkParserLazy(lexer, 2)

    expect(() => parser.list()).not.toThrowError()
  })
})

describe('llk parser eager', () => {
  it('should recognize ll1 grammar', () => {
    const lexer = new ListLexer('[ a, [b , c ]]')
    const parser = new LLkParserEager(lexer, 2)

    expect(() => parser.list()).not.toThrowError()
  })

  it('cannot recognize ll2 grammar', () => {
    const lexer = new ListLexer('[ a, b = c]')
    const parser = new LLkParserEager(lexer, 2)

    expect(() => parser.list()).not.toThrowError()
  })
})
