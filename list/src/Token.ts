export class Token {
  constructor(public type: TokenType, public text: string) {}
}

export enum TokenType {
  Invalid = 'invalid',
  EOF = 'eof',
  Name = 'name',
  Comma = 'comma',
  Equal = 'equal',
  LeftBracket = 'leftBracket',
  RightBracket = 'rightBracket',
}
