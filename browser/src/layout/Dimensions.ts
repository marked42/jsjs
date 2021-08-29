import { EdgeSize } from './EdgeSize'
import { Rect } from './Rect'

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

  contentBox() {
    return this.content
  }

  paddingBox() {
    return this.contentBox().expand(this.padding)
  }

  borderBox() {
    return this.paddingBox().expand(this.border)
  }

  marginBox() {
    return this.borderBox().expand(this.margin)
  }
}
