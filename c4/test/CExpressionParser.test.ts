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

describe('conditional expression', () => {
  it('should parse conditional expression', () => {
    const input = 'a ? b : d ? e : f'
    const parser = parserForInput(input)

    expect(parser.expression()).toMatchSnapshot()
  })

  it('should parse conditional expression with correct precedence', () => {
    const input = 'a = 1 ? b : c = d'
    const parser = parserForInput(input)

    expect(parser.expression()).toMatchSnapshot()
  })
})

describe('logical expression', () => {
  it('should parse logical expression', () => {
    const input = 'a || b && c'
    const parser = parserForInput(input)

    expect(parser.expression()).toMatchSnapshot()
  })
})
