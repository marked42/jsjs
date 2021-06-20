export enum TokenType {
  EOF = -1,
  StringLiteral,
  Identifier,
  LineComment,
  NumericLiteral,
  Whitespace,
  Newline,

  // Keyword,
  Enum,
  Int,
  Char,
  If,
  Else,
  While,
  Return,

  // Operator
  Sizeof,
  Negate,
  Minus,
  MinusAssign,
  Plus,
  PlusAssign,
  Star,
  StarStar,
  StarAssign,
  Div,
  DivAssign,
  Tilde,
  And,
  AndAnd,
  Or,
  OrOr,
  Xor,
  Increment,
  Decrement,
  Modulus,
  ModulusAssign,
  Assign,
  Equal,
  NotEqual,
  Greater,
  GreaterEqual,
  Less,
  LessEqual,
  RightShift,
  LeftShift,

  // Punctuation
  LeftParen,
  RightParen,
  LeftSquare,
  RightSquare,
  LeftBracket,
  RightBracket,
  Question,
  Colon,
  Comma,
  SemiColon,
  Dot,
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
