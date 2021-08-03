import {
  DeclarationValue,
  DeclarationValueKeyword,
  DeclarationValueLength,
  Unit,
} from '../css'
import { StyleNode } from '../style'
import { Dimensions } from './Dimensions'

export enum LayoutBoxType {
  Block,
  Inline,
  Anonymous,
}

export class LayoutBox {
  public dimensions = Dimensions.default()
  public children = [] as LayoutBox[]
  constructor(public boxType: LayoutBoxType, public node?: StyleNode) {}

  getInlineContainer() {
    switch (this.boxType) {
      case LayoutBoxType.Inline:
      case LayoutBoxType.Anonymous:
        return this
      case LayoutBoxType.Block:
        const lastChild = this.children[this.children.length - 1]
        if (lastChild && lastChild.boxType === LayoutBoxType.Anonymous) {
          return lastChild
        } else {
          const anonymousBox = new LayoutBox(LayoutBoxType.Anonymous)

          this.children.push(anonymousBox)
          return anonymousBox
        }
    }
  }

  layout(containingBlock: Dimensions) {
    switch (this.boxType) {
      case LayoutBoxType.Block:
        this.layoutBlock(containingBlock)
      case LayoutBoxType.Inline:
      case LayoutBoxType.Anonymous:
        break
    }
  }

  layoutBlock(containingBlock: Dimensions) {
    this.calculateBlockWidth(containingBlock)
    this.calculateBlockPosition(containingBlock)
    this.layoutBlockChildren()
    this.calculateBlockHeight(containingBlock)
  }

  calculateBlockWidth(containingBlock: Dimensions) {
    const node = this.getStyleNode()

    const auto = DeclarationValueKeyword.of('auto')
    const width = node.value('width') || auto

    const zero = new DeclarationValueLength(0, Unit.Px)
    let marginLeft = node.lookup('margin-left', 'margin', zero)
    const borderLeft = node.lookup('border-left-width', 'border-width', zero)
    const paddingLeft = node.lookup('padding-left', 'padding', zero)
    let marginRight = node.lookup('margin-right', 'margin', zero)
    const borderRight = node.lookup('border-right-width', 'border-width', zero)
    const paddingRight = node.lookup('padding-right', 'padding', zero)

    const toPx = (value: DeclarationValue) => {
      if (value instanceof DeclarationValueLength) {
        return value.value
      }

      if (value instanceof DeclarationValueKeyword && value.value === 'auto') {
        return 0
      }

      throw new Error(`unexpected value ${value}`)
    }

    const totalWidth = [
      marginLeft,
      borderLeft,
      paddingLeft,
      width,
      paddingRight,
      borderRight,
      marginRight,
    ].reduce((acc, value) => {
      return acc + toPx(value)
    }, 0)

    // overflow
    if (width !== auto && totalWidth > containingBlock.content.width) {
      if (marginLeft === auto) {
        this.dimensions.margin.left = 0
      }
      if (marginRight === auto) {
        this.dimensions.margin.right = 0
      }
      return
    }

    const underflow = containingBlock.content.width - totalWidth

    // underflow 的8种情况
    if (width !== auto) {
      if (marginLeft === auto && marginRight === auto) {
        this.dimensions.margin.left = this.dimensions.margin.right =
          underflow / 2
        // marginLeft = marginRight = new DeclarationValueLength(

        //   Unit.Px
        // )
      }
    } else {
    }
  }

  getStyleNode() {
    if (this.boxType === LayoutBoxType.Anonymous || !this.node) {
      throw new Error('anonymous box has no style node')
    }

    return this.node
  }

  calculateBlockPosition(containingBlock: Dimensions) {}

  layoutBlockChildren() {
    this.children.forEach((child) => child.layoutBlock(this.dimensions))
  }

  calculateBlockHeight(containingBlock: Dimensions) {}
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
  const root = new LayoutBox(LayoutBoxType.Block, node)
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
        root.getInlineContainer().children.push(buildLayoutTree(child))
      case 'none':
        break
    }
  })

  return root
}
