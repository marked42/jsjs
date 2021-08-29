export type ModuleSpecifier = string
export type ModuleId = string

export abstract class Module {
  abstract getSubModuleSpecifiers(): ModuleSpecifier[]

  abstract id(): ModuleId

  abstract source(): string

  abstract filePath(): string
}
