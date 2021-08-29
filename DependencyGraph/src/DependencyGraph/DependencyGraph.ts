import { Module, ModuleId } from '../Module'
import { DependencyGraphNode } from './DependencyGraphNode'

export class DependencyGraph {
  constructor(
    public entry: DependencyGraphNode,
    public allModules: Map<ModuleId, Module>
  ) {}
}
