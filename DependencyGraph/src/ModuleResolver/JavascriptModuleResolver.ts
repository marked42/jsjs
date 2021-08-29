import type { ModuleSpecifier } from '../Module'
import { ModuleResolver } from './ModuleResolver'
import { JavascriptModule } from '../Module'
import path from 'path'
import fs from 'fs'

export class JavascriptModuleResolver implements ModuleResolver {
  resolveModule(context: string, specifier: ModuleSpecifier): JavascriptModule {
    const filePath = path.isAbsolute(specifier)
      ? specifier
      : path.resolve(context, specifier)

    const id = path.relative(context, filePath)

    const extensions = ['.js', '.jsx', '.ts', '.tsx']

    const specifierExt = path.extname(specifier)
    if (specifierExt && !extensions.includes(specifierExt)) {
      throw new Error(
        `Javascript module only supports .js/.jsx extension, got ${specifierExt}`
      )
    }

    // TODO: 整理这个逻辑
    let sourceFilePath = ''
    if (specifierExt) {
      if (fs.existsSync(filePath)) {
        sourceFilePath = filePath
      }
    } else {
      const candidateFiles = [
        ...extensions.map((ext) => filePath + ext),
        ...extensions.map((ext) => path.join(filePath, `index${ext}`)),
      ]
      for (const file of candidateFiles) {
        if (fs.existsSync(file)) {
          const stat = fs.statSync(file)
          if (stat.isFile()) {
            sourceFilePath = file
          }
          break
        }
      }
    }

    return new JavascriptModule(id, sourceFilePath)
  }
}
