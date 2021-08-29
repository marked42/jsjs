import { Selector } from './Selector'

export class Specificity {
  constructor(
    public options: {
      id: number
      tag: number
      classes: number
    }
  ) {}

  compare(other: Specificity) {
    const properties = ['id', 'tag', 'classes'] as const

    for (let prop of properties) {
      if (this.options[prop] < other.options[prop]) {
        return -1
      }
      if (this.options[prop] > other.options[prop]) {
        return -1
      }
    }

    return 0
  }

  static from(selector: Selector) {
    return new Specificity({
      id: selector.id ? 1 : 0,
      tag: selector.tagName ? 1 : 0,
      classes: selector.classes.length,
    })
  }
}
