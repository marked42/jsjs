import { ModuleSpecifier } from './Module'
import { Module } from './Module'
import traverse from '@babel/traverse'
import { parse } from '@babel/parser'
import * as t from '@babel/types'

export class JavascriptModule extends Module {
  constructor(private readonly _id: string, specifier: ModuleSpecifier) {
    super(specifier)
  }

  filePath(): string {
    throw new Error('Method not implemented.')
  }

  id(): string {
    return this._id
  }

  source(): string {
    throw new Error('Method not implemented.')
  }

  getSubModuleSpecifiers(): ModuleSpecifier[] {
    const subModuleSpecifiers = [] as ModuleSpecifier[]

    return subModuleSpecifiers
  }
}

function getModuleSpecifiers(source: string) {
  const ast = parse(source, { sourceType: 'unambiguous' })

  if (!ast) {
    return []
  }

  const subModuleSpecifiers = [] as ModuleSpecifier[]

  traverse(ast as t.File, {
    ImportDeclaration(path) {},
  })

  return subModuleSpecifiers
}
