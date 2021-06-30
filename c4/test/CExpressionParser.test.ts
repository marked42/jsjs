import { CParser } from '../Parselet/CExpressionParser'
import { Lexer } from '../Lexer'
import { CharacterStream } from '../CharacterStream'

function parserForInput(input: string) {
  const stream = new CharacterStream(input)
  const lexer = new Lexer(stream)
  const parser = new CParser(lexer)

  return parser
}

describe('comma expression', () => {
  it('should parse comma expression priority 15', () => {
    const input = 'a, b, 1'
    const parser = parserForInput(input)

    expect(parser.expression()).toMatchSnapshot()
  })
})

describe('assignment expression', () => {
  it('should parse assignment expression', () => {
    const input = 'a = b += c -= d *= e /= f &= g |= h ^= i'
    const parser = parserForInput(input)

    expect(parser.expression()).toMatchSnapshot()
  })
})
