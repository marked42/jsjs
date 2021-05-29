import { Token, TokenType, WhiteSpace } from './Token'

type CodePoint = number
const EOF = 12

abstract class CodePointStream {
  abstract peek(): CodePoint
  abstract next(): CodePoint
  end() {
    return this.peek() === EOF
  }
}

abstract class TokenStream {
  abstract peek(): Token
  abstract next(): Token
  end() {
    return this.peek().type() === TokenType.EOF
  }
}

class Lexer {
  constructor(private codePointStream: CodePointStream) {}

  next() {}

  tokens(): TokenStream {
    return {
      peek() {
        return new WhiteSpace('')
      },
      next() {
        return new WhiteSpace('')
      },
      end() {
        return false
      },
    }
  }
}
