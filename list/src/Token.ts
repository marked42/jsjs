export class Token {
  constructor(public type: TokenType, public text: string) {}
}

export enum TokenType {
  Invalid = 'invalid',
  EOF = 'eof',
  Name = 'name',
  Comma = 'comma',
  LeftBracket = 'leftBracket',
  RightBracket = 'rightBracket',
}
