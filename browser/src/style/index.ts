import { ElementNode, Node, TextNode } from '../html/Node'
import { DeclarationValue, parseCSS, StyleSheet } from '../css'
import { parseHTML } from '../html'

interface PropertyMap {
  [key: string]: DeclarationValue
}

export class StyleNode {
  constructor(
    public node: Node,
    specifiedValues: PropertyMap,
    children: StyleNode[]
  ) {}
}

export function createStyleTree(html: string, css: string) {
  const node = parseHTML(html)
  const stylesheet = parseCSS(css)

  return doCreateStyleTree(node, stylesheet)
}

// 类型推导问题 'doCreateStyleTree' implicitly has return type 'any' because it does not have a return type annotation and is referenced directly or indirectly in one of its return expressions.ts(7023)
export function doCreateStyleTree(
  node: Node,
  stylesheet: StyleSheet
): StyleNode {
  if (node instanceof TextNode) {
    return new StyleNode(node, {}, [])
  }

  if (node instanceof ElementNode) {
    return new StyleNode(
      node,
      {},
      node.children.map((child) => doCreateStyleTree(child, stylesheet))
    )
  }

  throw new Error(`unexpected node type ${node}`)
}

function matchRulesForNode(node: Node, stylesheet: StyleSheet): PropertyMap {
  const specifiedValues: PropertyMap = {}

  return specifiedValues
}
