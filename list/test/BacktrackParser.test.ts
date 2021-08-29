import { BacktrackParser } from '../src/BacktrackParser'
import { ListLexer } from '../src/ListLexer'

describe('backtrack parser', () => {
  it.each([
    ['[ a, b = c, [ d ] ]'],
    ['[ a, b = c, [ d ] ] = [ a, b = c, [ d ] ]'],
  ])('should recognize list', (input) => {
    const lexer = new ListLexer(input)
    const parser = new BacktrackParser(lexer)

    expect(() => parser.stat()).not.toThrowError()
  })
})
