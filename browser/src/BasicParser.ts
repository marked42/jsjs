export class BasicParser {
  private index = 0
  constructor(private input: string) {}

  char() {
    return this.input[this.index]
  }

  next(len?: number) {
    len = len || 1
    this.index += len
  }

  eat(char?: string) {
    if (typeof char === 'string') {
      this.assert(char)
    }

    const text = char ? char : this.char()
    this.next(text ? text.length : 1)
    return text
  }

  assert(char: string) {
    if (!this.input.substring(this.index).startsWith(char)) {
      throw new Error(`unexpected char ${char}`)
    }
  }

  consumeWhitespace() {
    const whitespace = /[\t|\r|\n| ]/
    const startIndex = this.index
    while (whitespace.test(this.char())) {
      this.eat()
    }

    return this.input.substring(startIndex, this.index)
  }

  startsWith(input: string) {
    return this.input.substring(this.index).indexOf(input) === 0
  }

  end() {
    return this.index >= this.input.length
  }

  consumeCharsWhile(predicate: (char: string) => boolean) {
    let text = ''
    while (predicate(this.char()) && !this.end()) {
      text += this.eat()
    }

    return text
  }
}
