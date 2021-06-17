export enum TokenType {
  StringLiteral,
  Whitespace,
  Newline,
  Identifier,
  LineComment,
  NumericLiteral,
  EOF,
  Operator,
}

export const TokenEOF = {
  type: TokenType.EOF,
  source: '',
}

export interface Token {
  type: TokenType
  source: string
}

// TODO: refactor as class for simple construction
export interface StringLiteral extends Token {
  value: string
}

export interface Whitespace extends Token {
  value: string
}

export interface Newline extends Token {
  value: string
}

export interface Identifier extends Token {
  name: string
}

export interface LineComment extends Token {
  value: string
}

export interface NumericLiteral extends Token {
  value: number
}
