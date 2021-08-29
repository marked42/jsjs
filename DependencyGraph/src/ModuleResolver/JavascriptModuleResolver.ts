import type { ModuleSpecifier } from '../Module'
import { ModuleResolver } from './ModuleResolver'
import { JavascriptModule } from '../Module'
import path from 'path'
import fs from 'fs'

export class JavascriptModuleResolver implements ModuleResolver {
  resolveModule(context: string, specifier: ModuleSpecifier): JavascriptModule {
    if (path.isAbsolute(specifier)) {
      throw new Error('cannot resolve absolute path')
    }

    const filePath = path.resolve(context, specifier)

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
      } else if (stat.isFile()) {
      } else {
        throw new Error('not file or directory')
      }
    }

    throw new Error('Method not implemented.')
  }
}
