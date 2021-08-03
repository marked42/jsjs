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
