export enum TokenType {
  EOF = -1,
  StringLiteral,
  Identifier,
  NumericLiteral,
  LineComment,
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

export type Keyword =
  | TokenType.Enum
  | TokenType.Int
  | TokenType.Char
  | TokenType.If
  | TokenType.Else
  | TokenType.While
  | TokenType.Return

export const TokenEOF: EOF = {
  type: TokenType.EOF,
}

export interface EOF {
  type: TokenType.EOF
}

export interface TokenWithSource {
  type: OtherTokenType
  source: string
}

export type OtherTokenType = Exclude<
  TokenType,
  TokenType.EOF | StringValueType | NumberValueType | StringNameType
>

export type StringValueType = TokenType.StringLiteral | TokenType.LineComment

export interface StringValueToken extends Omit<TokenWithSource, 'type'> {
  type: StringValueType
  value: string
}

type NumberValueType = TokenType.NumericLiteral

export interface NumberValueToken extends Omit<TokenWithSource, 'type'> {
  type: NumberValueType
  value: number
}

type StringNameType = TokenType.Identifier
export interface StringNameToken extends Omit<TokenWithSource, 'type'> {
  type: StringNameType
  name: string
}

export type Token =
  | EOF
  | TokenWithSource
  | StringValueToken
  | NumberValueToken
  | StringNameToken
