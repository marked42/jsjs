export class CharacterStream {
  static EOF = -1
  private index = 0
  constructor(private input: string) {}

  peek() {
    const code = this.input.charCodeAt(this.index)
    if (Number.isNaN(code)) {
      return CharacterStream.EOF
    }

    return code
  }

  next() {
    const code = this.peek()
    if (code !== CharacterStream.EOF) {
      this.index++
    }

    return code
  }

  prev() {
    this.index -= 1
  }
}
