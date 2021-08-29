import { Rule } from './Rule'
import { Specificity } from './Specificity'

export class MatchedRule {
  constructor(public specificity: Specificity, public rule: Rule) {}
}
