import { createStyleTree } from '../../src/style'

describe('parse html', () => {
  it('should parse html', () => {
    const html = `
			<div class="test">hello</div>
		`
    const css = `
		.test {
			font-size: 14px;
			font-color: red;
		}
	`
    expect(createStyleTree(html, css)).toMatchSnapshot()
  })
})
