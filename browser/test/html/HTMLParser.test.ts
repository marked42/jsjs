import { parseHTML } from '../../src/html'

describe('parse html', () => {
  it('should parse html', () => {
    const input = `
			<div test="a">hello</div>
		`
    expect(parseHTML(input)).toMatchSnapshot()
  })

  it('should parse html', () => {
    const input = `<html><body>Hello, world!</body></html>`
    expect(parseHTML(input)).toMatchSnapshot()
  })
})
