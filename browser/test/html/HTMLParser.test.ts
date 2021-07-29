import { parseHTML } from '../../src/html'

describe('parse html', () => {
  it('should parse html', () => {
    const input = `
			<div>hello</div>
		`
    console.log(parseHTML(input))
  })
})
