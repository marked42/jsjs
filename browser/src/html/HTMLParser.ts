import { NodeType, Node, ElementNode, TextNode, NodeAttributeMap } from './Node'

function isHTMLElement(node: Node): node is ElementNode {
  return node.type === NodeType.Element && (node as ElementNode).name === 'html'
}

export default class HTMLParser {
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

  parseHTML(): ElementNode {
    const nodes = this.parseNodes()

    if (nodes.length === 1) {
      const node = nodes[0]
      if (isHTMLElement(node)) {
        return node
      }
      throw new Error(`single root node must be html, get ${nodes[0]}`)
    }

    return new ElementNode('html', {}, nodes)
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

  parseNodes(): Node[] {
    const nodes: Node[] = []

    for (;;) {
      if (this.startsWith('</') || this.end()) {
        break
      }
      nodes.push(this.parseNode())
    }

    return nodes
  }

  parseNode(): Node {
    if (this.startsWith('<')) {
      return this.parseElement()
    }

    return this.parseTextNode()
  }

  parseElement(): ElementNode {
    this.eat('<')
    const tagName = this.parseTagName()
    const attributes = this.parseTagAttributes()

    this.eat('>')

    const children = this.parseNodes()

    this.eat('<')
    this.eat('/')
    this.eat(tagName)
    this.eat('>')

    return new ElementNode(tagName, attributes, children)
  }

  parseTagName() {
    return this.consumeCharsWhile((char) => /[a-zA-Z0-9]/.test(char))
  }

  parseTagAttributes() {
    const attributes: NodeAttributeMap = {}
    for (;;) {
      if (this.char() === '>') {
        break
      }

      const { name, value } = this.parseTagAttribute()
      attributes[name] = value
    }
    return attributes
  }

  parseTagAttribute() {
    this.consumeWhitespace()
    const name = this.parseTagName()
    this.eat('=')
    const value = this.parseTagValue()
    return {
      name,
      value,
    }
  }

  parseTagValue() {
    const quote = this.char()
    if (quote !== '"' && quote !== "'") {
      throw new Error('expect quote')
    }
    this.next()

    let value = ''
    for (;;) {
      if (this.char() === quote) {
        this.next()
        break
      }
      value += this.char()
    }

    return value
  }

  consumeCharsWhile(predicate: (char: string) => boolean) {
    let text = ''
    while (predicate(this.char()) && !this.end()) {
      text += this.eat()
    }

    return text
  }

  parseTextNode() {
    const text = this.consumeCharsWhile((char) => char !== '<')

    return new TextNode(text)
  }
}

export function parseHTML(input: string) {
  const parser = new HTMLParser(input)

  return parser.parseHTML()
}
