export type ModuleSpecifier = string
export type ModuleId = string

export abstract class Module {
  constructor(public specifier: ModuleSpecifier) {}

  abstract getSubModuleSpecifiers(): ModuleSpecifier[]

  abstract id(): ModuleId

  abstract source(): string

  abstract filePath(): string
}
