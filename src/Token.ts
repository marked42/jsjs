export enum TokenType {
  WhiteSpace,
  LineTerminator,
  Comment,
  CommonToken,
  DivPunctuator,
  RightBracePunctuator,
  EOF,
}

export abstract class Token {
  constructor(protected _text: string) {}
  text() {
    return this._text
  }

  abstract type(): TokenType
}

export class WhiteSpace extends Token {
  type() {
    return TokenType.WhiteSpace
  }
}

// class LineTerminator extends Token {}

// class Comment extends Token {}

// class DivPunctuator extends Token {
//   constructor() {
//     super('/')
//   }
// }

// class RightBracePunctuator extends Token {
//   constructor() {
//     super('}')
//   }
// }

// class CommonToken extends Token {}

// class IdentifierName extends CommonToken {}

// class Punctuator extends CommonToken {}

// class NumericLiteral extends CommonToken {}

// class StringLiteral extends CommonToken {}

enum GoalSymbol {
  InputElementDiv,
  InputElementRegExp,
  InputElementTemplateTail,
  InputElementRegExpOrTemplateTail,
}
