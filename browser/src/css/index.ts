import { BasicParser } from '../BasicParser'
import { Rule } from './Rule'
import { Selector } from './Selector'

export class StyleSheet {
  constructor(public rules: Rule[]) {}
}

export class Declaration {
  constructor(public name: string, public value: DeclarationValue) {}
}

enum DeclarationValueType {
  Keyword,
  Length,
  Color,
}

export class DeclarationValue {
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
  parseCSS() {
    const rules: Rule[] = []
    for (;;) {
      this.consumeWhitespace()
      if (this.end()) {
        break
      }

      rules.push(this.parseRule())
    }

    return new StyleSheet(rules)
  }

  parseRule() {
    const selectors: Selector[] = this.parseSelectors()
    const declarations: Declaration[] = this.parseDeclarations()

    return new Rule(selectors, declarations)
  }

  parseSelectors() {
    const selectors: Selector[] = []

    for (;;) {
      selectors.push(this.parseSelector())
      this.consumeWhitespace()
      if (this.char() === ',') {
        this.eat()
        this.consumeWhitespace()
      } else if (this.char() === '{') {
        break
      } else {
        throw new Error(
          `unexpected token ${this.char()}, expect ',' or '{' after selector `
        )
      }
    }

    return selectors
  }

  parseSelector() {
    // tag#id.class1.class2
    const simpleSelector = new Selector([])
    for (;;) {
      if (this.isValidIdentifierStart()) {
        simpleSelector.tagName = this.parseIdentifier()
      } else if (this.char() === '#') {
        this.eat()
        simpleSelector.id = this.parseIdentifier()
      } else if (this.char() === '.') {
        // no duplicate class detection
        this.eat()
        simpleSelector.classes.push(this.parseIdentifier())
      } else if (this.char() === '*') {
        // universal
      } else {
        break
      }
    }

    return simpleSelector
  }

  parseDeclarations() {
    const declarations: Declaration[] = []

    this.eat('{')
    for (;;) {
      this.consumeWhitespace()
      if (this.char() === '}') {
        break
      }
      declarations.push(this.parseDeclaration())
    }
    this.eat('}')

    return declarations
  }

  // font-size
  parseIdentifier() {
    return this.consumeCharsWhile((char) => /[a-zA-Z0-9\-]/.test(char))
  }

  parseDeclaration() {
    const name = this.parseIdentifier()

    this.eat(':')
    this.consumeWhitespace()
    const value = this.parseDeclarationValue()
    this.consumeWhitespace()
    this.eat(';')

    return new Declaration(name, value)
  }

  parseDeclarationValue(): DeclarationValue {
    if (this.isDigit()) {
      const length = this.parseFloat()
      const unit = this.eat('px')
      return new DeclarationValueLength(length, Unit.Px)
    }

    if (this.char() === '#') {
      return this.parseColor()
    }

    return new DeclarationValueKeyword(this.parseIdentifier())
  }

  parseColor() {
    this.eat('#')

    return new DeclarationValueColor({
      r: this.parseHexPair(),
      g: this.parseHexPair(),
      b: this.parseHexPair(),
      a: this.parseHexPair(),
    })
  }

  parseHexPair() {
    if (!this.isHexDigit()) {
      throw new Error(`expect hex digit in color, get ${this.char()}`)
    }
    const high = this.eat()
    if (!this.isHexDigit()) {
      throw new Error(`expect hex digit in color, get ${this.char()}`)
    }
    const low = this.eat()

    return Number.parseInt(`${high}${low}`, 16)
  }

  parseFloat() {
    const text = this.consumeCharsWhile((char) => /[0-9\.]/.test(char))
    return Number.parseFloat(text)
  }
}

/**
 * parse multiple rules with multiple selectors and multiple declarations
 */
export function parseCSS(input: string) {
  const parser = new CSSParser(input)
  return parser.parseCSS()
}
