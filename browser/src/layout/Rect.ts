import { EdgeSize } from './EdgeSize'

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

  expand(edgeSize: EdgeSize) {
    return new Rect(
      this.x - edgeSize.left,
      this.y - edgeSize.top,
      this.width + edgeSize.left + edgeSize.right,
      this.height + edgeSize.top + edgeSize.bottom
    )
  }
}
