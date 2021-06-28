import { Lexer } from '../Lexer'
import { Expression } from '../AST'
import { TokenType } from '../Token'
import { InfixParselet, PrefixParselet } from './Parselet'
import { OperatorPrecedence } from './OperatorPrecedence'

export class ParseletParser {
  private readonly prefixParselets = new Map<TokenType, PrefixParselet>()
  private readonly infixParselets = new Map<TokenType, InfixParselet>()

  constructor(private lexer: Lexer) {
    lexer.skipComment()
    lexer.skipNewline()
    lexer.skipWhitespace()
  }

  registerPrefixParselet(type: TokenType, parselet: PrefixParselet) {
    this.prefixParselets.set(type, parselet)
  }

  registerInfixParselet(type: TokenType, parselet: InfixParselet) {
    this.infixParselets.set(type, parselet)
  }

  lookahead(i: number) {
    return this.lexer.lookahead(i)
  }

  consume(type?: TokenType) {
    return this.lexer.consume(type)
  }

  expression(
    minBp: OperatorPrecedence = OperatorPrecedence.start()
  ): Expression {
    const token = this.lexer.consume()

    if (token.type === TokenType.EOF) {
      throw new Error('unexpected end of file')
    }

    const parselet = this.prefixParselets.get(token.type)
    if (!parselet) {
      throw new Error('unexpected token ' + token)
    }

    let result = parselet.parse(this, token)

    while (true) {
      const token = this.lexer.lookahead()

      if (token.type === TokenType.EOF) {
        break
      }
      const parselet = this.infixParselets.get(token.type)

      if (!parselet) {
        throw new Error('unexpected token ' + token)
      }

      if (parselet.leftBindingPower().compare(minBp) === -1) {
        break
      }

      this.lexer.consume()
      result = parselet.parse(this, result, token)
    }

    return result
  }
}
