import { ModuleSpecifier } from '../Module'
import { ModuleResolver } from './ModuleResolver'

export class ChainedModuleResolver implements ModuleResolver {
  constructor(private readonly resolverChain: ModuleResolver[]) {}

  resolveModule(context: string, specifier: ModuleSpecifier) {
    for (const resolver of this.resolverChain) {
      const module = resolver.resolveModule(context, specifier)
      if (module) {
        return module
      }
    }

    throw new Error(
      `Unable to resolve module for specifier ${specifier} under ${context}`
    )
  }
}
