import { Selector } from './Selector'
import { Declaration } from './index'

export class Rule {
  constructor(
    public selectors: Selector[],
    public declarations: Declaration[]
  ) {}
}
