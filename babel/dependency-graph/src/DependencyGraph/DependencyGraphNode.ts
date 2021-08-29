import { Module } from '../Module'

export class DependencyGraphNode {
  constructor(
    public value: Module,
    public dependencies: DependencyGraphNode[] = []
  ) {}
}
