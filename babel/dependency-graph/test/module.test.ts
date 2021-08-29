import { getModuleSpecifiers } from '../src/Module'
import { buildModuleDependencyGraph } from '../src'
import path from 'path'

describe('getModuleSpecifiers', () => {
  it('should get module specifiers', () => {
    const source = `
	import 'mod1'
	import a from 'mod2'
	import { a1 as b1 } from 'mod3'
	import * as a2 from 'mod4'

	import a3, { a4 } from 'mod5'
	import a5, * as b3 from 'mod6'
	`
    const specifiers = getModuleSpecifiers(source)
    expect(specifiers).toMatchSnapshot()
  })

  it('should build module dependency graph by file path', () => {
    const graph = buildModuleDependencyGraph(
      path.join(__dirname, 'module-test', 'index.ts')
    )

    expect(graph).toMatchSnapshot()
  })

  it('should build module dependency graph by folder path', () => {
    const graph = buildModuleDependencyGraph(
      path.join(__dirname, 'module-test')
    )

    expect(graph).toMatchSnapshot()
  })
})
