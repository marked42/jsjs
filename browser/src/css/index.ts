import { BasicParser } from '../BasicParser'

class Stylesheet {
  constructor(public rules: Rule[]) {}
}

class Rule {
  constructor(
    public selectors: Selector[],
    public declarations: Declaration[]
  ) {}
}

class Selector {
  constructor(
    public tagName: string,
    public id: string,
    public classes: string[]
  ) {}
}

class Declaration {
  constructor(public name: string, public value: string) {}
}

enum DeclarationValueType {
  Keyword,
  Length,
  Color,
}

class DeclarationValue {
  constructor(public type: DeclarationValueType) {}
}

class DeclarationValueKeyword extends DeclarationValue {
  constructor(public value: string) {
    super(DeclarationValueType.Keyword)
  }
}

class DeclarationValueLength extends DeclarationValue {
  constructor(public value: number, public unit: Unit) {
    super(DeclarationValueType.Length)
  }
}

enum Unit {
  Px,
}

interface Color {
  r: number
  g: number
  b: number
  a: number
}

class DeclarationValueColor extends DeclarationValue {
  constructor(public value: Color) {
    super(DeclarationValueType.Color)
  }
}

export class CSSParser extends BasicParser {
  parseCSS() {}
}

export function parseCSS(input: string) {
  const parser = new CSSParser(input)
  return parser.parseCSS()
}
