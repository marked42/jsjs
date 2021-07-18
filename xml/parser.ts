interface XmlNode {
  tag: string
  type: 'element' | 'text' | 'comment'
  selfClosing: boolean
  attributes?: XmlAttribute[]
  children?: XmlNode[]
}

interface XmlAttribute {
  name: string
  value: boolean | string
}

export function parseXml(source: string) {}
