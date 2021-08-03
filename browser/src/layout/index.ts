import { TokenEOF } from '../../../c4/Token'
import {
  DeclarationValue,
  DeclarationValueType,
  DeclarationValueKeyword,
} from '../css'
import { StyleNode } from '../style'

export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  static default() {
    return new Rect(0, 0, 0, 0)
  }
}

export class EdgeSize {
  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) {}

  static default() {
    return new EdgeSize(0, 0, 0, 0)
  }
}

export class Dimensions {
  constructor(
    public content: Rect,
    public padding: EdgeSize,
    public border: EdgeSize,
    public margin: EdgeSize
  ) {}

  static default() {
    return new Dimensions(
      Rect.default(),
      EdgeSize.default(),
      EdgeSize.default(),
      EdgeSize.default()
    )
  }
}

export enum LayoutBoxType {
  Block,
  Inline,
  Anonymous,
}

export class LayoutBox {
  public dimensions = Dimensions.default()
  public children = [] as LayoutBox[]
  constructor(public boxType: LayoutBoxType) {}
}

export function getLayoutBoxType(node: StyleNode) {
  const display = node.specifiedValues['display']

  if (display instanceof DeclarationValueKeyword) {
    if (display.value === 'block') {
      return LayoutBoxType.Block
    } else if (display.value === 'none') {
      return LayoutBoxType.Inline
    } else {
      return LayoutBoxType.Block
    }
  }
  return LayoutBoxType.Block
}

export function getDisplayValue(node: StyleNode) {
  const display = node.specifiedValues['display']

  if (display instanceof DeclarationValueKeyword) {
    if (display.value === 'block') {
      return 'block'
    } else if (display.value === 'none') {
      return 'none'
    } else {
      return 'inline'
    }
  }
  return 'inline'
}

export function buildLayoutTree(node: StyleNode) {
  const display = getDisplayValue(node)
  const root = new LayoutBox(LayoutBoxType.Block)
  switch (display) {
    case 'inline':
      root.boxType = LayoutBoxType.Inline
      break
    case 'block':
      root.boxType = LayoutBoxType.Block
      break
    case 'none':
      throw new Error('display none at root node not allowed')
  }

  node.children.forEach((child) => {
    const childDisplay = getDisplayValue(child)
    switch (childDisplay) {
      case 'block':
        root.children.push(buildLayoutTree(child))
        break
      case 'inline':
        getInlineContainer(root).children.push(buildLayoutTree(child))
      case 'none':
        break
    }
  })

  return root
}

export function getInlineContainer(box: LayoutBox) {
  switch (box.boxType) {
    case LayoutBoxType.Inline:
    case LayoutBoxType.Anonymous:
      return box
    case LayoutBoxType.Block:
      const lastChild = box.children[box.children.length - 1]
      if (lastChild && lastChild.boxType === LayoutBoxType.Anonymous) {
        return lastChild
      } else {
        const anonymousBox = new LayoutBox(LayoutBoxType.Anonymous)

        box.children.push(anonymousBox)
        return anonymousBox
      }
  }
}
