export class GraphNode<T> {
  constructor(public value: T, public children: GraphNode<T>[] = []) {}
}

type ModuleSpecifier = string

export abstract class Module {
  constructor(public specifier: ModuleSpecifier) {}

  abstract getSubModuleSpecifiers(): ModuleSpecifier[]
}

export class JavascriptModule extends Module {
  getSubModuleSpecifiers(): string[] {
    throw new Error('Method not implemented.')
  }
}

export class ModuleResolver {}

export class DependencyGraph {
  private allModules = new Map<string, Module>()

  constructor(public root: GraphNode<Module>) {}
}

export class DependencyGraphBuilder {}
