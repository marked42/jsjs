import { ModuleSpecifier } from './Module'
import { Module } from './Module'
import traverse from '@babel/traverse'
import { parse } from '@babel/parser'
import fs from 'fs'
import path from 'path'

export class JavascriptModule extends Module {
  constructor(
    private readonly _id: string,
    private readonly _filePath: string
  ) {
    super()
  }

  filePath(): string {
    return this._filePath
  }

  id(): string {
    return this._id
  }

  source(): string {
    return fs.readFileSync(this.filePath(), { encoding: 'utf-8' })
  }

  getSubModuleSpecifiers(): ModuleSpecifier[] {
    return getModuleSpecifiers(this.source())
  }
}

export function getModuleSpecifiers(source: string) {
  const ast = parse(source, {
    sourceType: 'unambiguous',
    plugins: ['typescript'],
  })

  const subModuleSpecifiers = [] as ModuleSpecifier[]
  if (!ast) {
    return subModuleSpecifiers
  }

  traverse(ast, {
    ImportDeclaration(path) {
      const moduleSpecifier = path.node.source.value

      subModuleSpecifiers.push(moduleSpecifier)
    },
  })

  return subModuleSpecifiers
}
