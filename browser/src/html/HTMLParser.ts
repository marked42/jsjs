import { NodeType, Node, ElementNode, TextNode } from './Node'

function isHTMLElement(node: Node): node is ElementNode {
  return node.type === NodeType.Element && (node as ElementNode).name === 'html'
}

export default class HTMLParser {
  private index = 0
  constructor(private input: string) {}

  char() {
    return this.input[this.index]
  }

  next() {
    this.index++
  }

  eat() {
    const char = this.char()
    this.next()
    return char
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

    return new ElementNode('html', {}, this.parseNodes())
  }

  consumeWhitespace() {
    const whitespace = /[\t|\r|\n| ]/
    const startIndex = this.index
    while (whitespace.test(this.char())) {
      this.eat()
    }

    return this.input.substring(startIndex, this.index)
  }

  parseTagName() {}

  parseStartTag() {}

  parseEndTag() {}

  parseTagAttributes() {}

  parseTagAttribute() {}

  parseElement(): ElementNode {
    return
  }

  parseNodes(): Node[] {
    const nodes: Node[] = []

    for (;;) {
      if (this.char() === '<') {
        nodes.push(this.parseElement())
      } else if (this.char() === undefined) {
        throw new Error('unexpected EOF token')
      } else if (this.char() === '>') {
        break
      } else {
        nodes.push(this.parseTextNode())
      }
    }

    return nodes
  }

  consumeCharsWhile(predicate: (char: string) => boolean) {
    let text = ''
    while (predicate(this.char())) {
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
