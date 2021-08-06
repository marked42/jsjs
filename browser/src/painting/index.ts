import { LayoutBox, LayoutBoxType } from '../layout'
import { Rect } from '../layout/Rect'
import { Color, DeclarationValueColor } from '../css'

class DisplayCommand {}

class DisplayCommandSolidColor extends DisplayCommand {
  constructor(public color: Color, public rect: Rect) {
    super()
  }
}

export function buildDisplayList(layoutBox: LayoutBox): DisplayCommand[] {
  const displayList = [] as DisplayCommand[]
  renderLayoutBox(displayList, layoutBox)
  return displayList
}

export function renderLayoutBox(list: DisplayCommand[], layoutBox: LayoutBox) {
  renderBackground(list, layoutBox)
  renderBorders(list, layoutBox)

  layoutBox.children.forEach((child) => {
    renderLayoutBox(list, child)
  })
}

export function renderBackground(list: DisplayCommand[], layoutBox: LayoutBox) {
  const backgroundColor = getBoxColor(layoutBox, 'background')
  if (!backgroundColor) {
    return
  }

  list.push(
    new DisplayCommandSolidColor(
      backgroundColor,
      layoutBox.dimensions.borderBox()
    )
  )
}

export function renderBorders(list: DisplayCommand[], layoutBox: LayoutBox) {
  const borderColor = getBoxColor(layoutBox, 'border-color')
  if (!borderColor) {
    return
  }

  const dimensions = layoutBox.dimensions
  const borderBox = layoutBox.dimensions.borderBox()

  // left
  list.push(
    new DisplayCommandSolidColor(
      borderColor,
      new Rect(
        borderBox.x,
        borderBox.y,
        dimensions.border.left,
        borderBox.height
      )
    )
  )

  // right
  list.push(
    new DisplayCommandSolidColor(
      borderColor,
      new Rect(
        borderBox.x +
          dimensions.border.left +
          dimensions.padding.left +
          dimensions.content.width,
        borderBox.y,
        dimensions.border.right,
        borderBox.height
      )
    )
  )

  // top border
  list.push(
    new DisplayCommandSolidColor(
      borderColor,
      new Rect(borderBox.x, borderBox.y, dimensions.border.top, borderBox.width)
    )
  )

  // bottom color
  list.push(
    new DisplayCommandSolidColor(
      borderColor,
      new Rect(
        borderBox.x,
        borderBox.y + borderBox.height - dimensions.border.bottom,
        borderBox.width,
        dimensions.border.bottom
      )
    )
  )
}

export function getBoxColor(layoutBox: LayoutBox, name: string) {
  switch (layoutBox.boxType) {
    case LayoutBoxType.Block:
    case LayoutBoxType.Inline:
      const styleNode = layoutBox.getStyleNode()
      const value = styleNode.value(name)
      if (value) {
        if (value instanceof DeclarationValueColor) {
          return value.value
        } else {
          throw new Error(`style ${name} value is not color, get ${value}|`)
        }
      }
    case LayoutBoxType.Anonymous:
    default:
      break
  }
}

interface CanvasData {
  data: Uint8ClampedArray
  width: number
  height: number
}

export function drawLayoutBoxAsCanvasData(layoutBox: LayoutBox, bounds: Rect) {
  const canvasData = {
    data: new Uint8ClampedArray(4 * bounds.width * bounds.height),
    width: bounds.width,
    height: bounds.height,
  }

  const displayCommandList = buildDisplayList(layoutBox)

  for (const command of displayCommandList) {
    if (command instanceof DisplayCommandSolidColor) {
      applyCommandToCanvasData(command, canvasData)
    }
  }

  return canvasData
}

function applyCommandToCanvasData(
  command: DisplayCommandSolidColor,
  canvasData: CanvasData
) {
  for (let row = 0; row < canvasData.height; row++) {
    for (let col = 0; col < canvasData.width; col++) {
      canvasData.data[row * canvasData.width + col] = command.color.r
      canvasData.data[row * canvasData.width + col + 1] = command.color.g
      canvasData.data[row * canvasData.width + col + 2] = command.color.b
      canvasData.data[row * canvasData.width + col + 3] = command.color.a
    }
  }
}
