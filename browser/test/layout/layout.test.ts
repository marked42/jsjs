import { buildLayoutTree } from '../../src/layout'
import { createStyleTree } from '../../src/style'

describe('box generation', () => {
  it('should generate anonymous boxes', () => {
    const html = `<html><a></a><b></b><c></c><d></d></html>`
    const css = `
		html { display: block; }
		a    { display: block; }
		b, c { display: inline; }
		d    { display: block; }
	`

    expect(buildLayoutTree(createStyleTree(html, css))).toMatchSnapshot()
  })
})
