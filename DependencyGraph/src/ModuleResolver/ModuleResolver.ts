import { Module, ModuleSpecifier } from '../Module'

export interface ModuleResolver {
  /**
   * 根据当前所在的模块环境context，模块所在文件夹路径解析模块表示符specifier代表的模块
   */
  resolveModule(context: string, specifier: ModuleSpecifier): Module
}
