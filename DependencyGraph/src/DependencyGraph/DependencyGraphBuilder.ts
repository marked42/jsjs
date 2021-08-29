import { Module, ModuleId, ModuleSpecifier } from '../Module'
import { ModuleResolver } from '../ModuleResolver'
import { DependencyGraph } from './DependencyGraph'
import { DependencyGraphNode } from './DependencyGraphNode'
import path from 'path'

export class DependencyGraphBuilder {
  constructor(
    private readonly moduleResolver: ModuleResolver,
    private readonly entry: ModuleSpecifier
  ) {}

  build() {
    const allModules = new Map<ModuleId, Module>()
    const root = this.doBuild(process.cwd(), this.entry, allModules)
    const graph = new DependencyGraph(root, allModules)

    return graph
  }

  private doBuild(
    context: string,
    moduleSpecifier: ModuleSpecifier,
    allModules: Map<string, Module>
  ) {
    const module = this.moduleResolver.resolveModule(context, moduleSpecifier)

    const dependencies = module
      .getSubModuleSpecifiers()
      .map((moduleSpecifier) =>
        this.doBuild(
          path.dirname(module.filePath()),
          moduleSpecifier,
          allModules
        )
      )

    return new DependencyGraphNode(module, dependencies)
  }
}
