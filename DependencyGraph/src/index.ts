import { ModuleSpecifier } from './Module'
import {
  ModuleResolver,
  ChainedModuleResolver,
  JavascriptModuleResolver,
} from './ModuleResolver'
import { DependencyGraphBuilder } from './DependencyGraph'

export function buildModuleDependencyGraph(entry: ModuleSpecifier) {
  const resolverChain: ModuleResolver[] = [new JavascriptModuleResolver()]
  const resolver = new ChainedModuleResolver(resolverChain)
  const builder = new DependencyGraphBuilder(resolver, entry)

  return builder.build()
}
