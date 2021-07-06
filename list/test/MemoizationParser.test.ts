import { MemoizationParser } from '../src/MemoizationParser'
import { ListLexer } from '../src/ListLexer'

describe('backtrack parser', () => {
  it.each([
    ['[ a ] = [ b ]'],
    ['[ a, b = c, [ d ] ]'],
    ['[ a, b = c, [ d ] ] = [ a, b = c, [ d ] ]'],
  ])('should recognize list', (input) => {
    const lexer = new ListLexer(input)
    const parser = new MemoizationParser(lexer)

    expect(() => parser.stat()).not.toThrowError()
  })
})
