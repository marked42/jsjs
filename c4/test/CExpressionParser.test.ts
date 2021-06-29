import { CParser } from '../Parselet/CExpressionParser'
import { Lexer } from '../Lexer'
import { CharacterStream } from '../CharacterStream'

function parserForInput(input: string) {
  const stream = new CharacterStream(input)
  const lexer = new Lexer(stream)
  const parser = new CParser(lexer)

  return parser
}

describe('CExpressionParser', () => {
  it('should parse comma expression priority 15', () => {
    const input = 'a, b, 1'
    const parser = parserForInput(input)

    expect(parser.expression()).toMatchSnapshot()
  })
})
