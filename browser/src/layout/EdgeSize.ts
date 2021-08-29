
export class EdgeSize {
  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) { }

  static default() {
    return new EdgeSize(0, 0, 0, 0);
  }
}
