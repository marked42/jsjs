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
}
