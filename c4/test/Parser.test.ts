import { Parser } from '../Parser'
import { Lexer } from '../Lexer'
import { CharacterStream } from '../CharacterStream'

function parserForInput(input: string) {
  const stream = new CharacterStream(input)
  const lexer = new Lexer(stream)
  const parser = new Parser(lexer)

  return parser
}

describe('expression', () => {
  it('should parse binary operators with correct precedence', () => {
    const input = 'a + 1 * 2'
    const parser = parserForInput(input)

    expect(parser.expression()).toMatchSnapshot()
  })

  it('should parse left associative binary operators correctly', () => {
    const input = 'a + 1 + 2'
    const parser = parserForInput(input)
    expect(parser.expression()).toMatchSnapshot()
  })

  it('should parse right associative binary operators correctly', () => {
    const input = 'a ** 1 ** 2'
    const parser = parserForInput(input)
    expect(parser.expression()).toMatchSnapshot()
  })

  it('should parse prefix operators correctly', () => {
    const input = '-a + 1 * 2'
    const parser = parserForInput(input)
    expect(parser.expression()).toMatchSnapshot()
  })

  it('should parse prefix operators correctly at right', () => {
    const input = '1 + -a'
    const parser = parserForInput(input)
    expect(parser.expression()).toMatchSnapshot()
  })

  it('should parse postfix operators correctly', () => {
    const input = '-a++ + 1 * 2'
    const parser = parserForInput(input)
    expect(parser.expression()).toMatchSnapshot()
  })
})
