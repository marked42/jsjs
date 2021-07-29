export enum NodeType {
  Element,
  Text,
}

export interface TextNode {
  type: NodeType.Text
}

export abstract class Node {
  constructor(public type: NodeType) {}
}

export class TextNode extends Node {
  constructor(public textContent: string) {
    super(NodeType.Text)
  }
}

export class ElementNode extends Node {
  constructor(
    public name: string,
    public attributes: Record<string, string>,
    public children: Node[]
  ) {
    super(NodeType.Element)
  }
}
