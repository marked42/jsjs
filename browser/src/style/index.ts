import { ElementNode, Node, TextNode } from '../html/Node'
import { DeclarationValue, parseCSS, StyleSheet } from '../css'
import { parseHTML } from '../html'
import { MatchedRule } from '../css/MatchedRule'
import { Rule } from '../css/Rule'
import { Selector } from '../css/Selector'
import { Specificity } from '../css/Specificity'

interface PropertyMap {
  [key: string]: DeclarationValue
}

export class StyleNode {
  constructor(
    public node: Node,
    public specifiedValues: PropertyMap,
    public children: StyleNode[]
  ) {}

  lookup(name: string, name2: string, fallback: DeclarationValue) {
    return this.specifiedValues[name] || this.specifiedValues[name2] || fallback
  }

  value(name: string) {
    return this.specifiedValues[name]
  }
}

export function createStyleTree(html: string, css: string) {
  const node = parseHTML(html)
  const stylesheet = parseCSS(css)

  if (node instanceof TextNode) {
    return new StyleNode(node, {}, [])
  }

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
      specifiedValuesForNode(node, stylesheet),
      node.children.map((child) => doCreateStyleTree(child, stylesheet))
    )
  }

  throw new Error(`unexpected node type ${node}`)
}

function specifiedValuesForNode(node: ElementNode, stylesheet: StyleSheet) {
  const matchedRules = matchRulesForNode(node, stylesheet)

  const specifiedValues: PropertyMap = {}
  for (const rule of matchedRules) {
    rule.rule.declarations.forEach((value) => {
      specifiedValues[value.name] = value.value
    })
  }

  return specifiedValues
}

function matchRulesForNode(
  node: ElementNode,
  stylesheet: StyleSheet
): MatchedRule[] {
  const matchedRules: MatchedRule[] = []

  for (const rule of stylesheet.rules) {
    const specificity = nodeMatchedWithRule(node, rule)
    if (specificity) {
      matchedRules.push(new MatchedRule(specificity, rule))
    }
  }

  matchedRules.sort((a, b) => a.specificity.compare(b.specificity))
  return matchedRules
}

function nodeMatchedWithRule(node: ElementNode, rule: Rule) {
  let specificity: Specificity | null = null

  for (const selector of rule.selectors) {
    if (selectorMatchedWithRule(node, selector)) {
      if (!specificity) {
        specificity = Specificity.from(selector)
      } else {
        const newSpecificity = Specificity.from(selector)
        if (specificity.compare(newSpecificity) < 0) {
          specificity = newSpecificity
        }
      }
    }
  }

  return specificity
}

function selectorMatchedWithRule(node: ElementNode, selector: Selector) {
  if (selector.tagName && selector.tagName !== node.name) {
    return false
  }

  if (selector.id && selector.id !== node.attributes['id']) {
    return false
  }

  const classAttributeValue = node.attributes['class']
  const classes: string[] =
    classAttributeValue === undefined ? [] : classAttributeValue.split(' ')
  if (
    selector.classes.length > 0 &&
    !classes.some((klass) => selector.classes.includes(klass))
  ) {
    return false
  }

  return true
}
