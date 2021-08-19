import { parseCSS } from '../../src/css'

describe('parse css', () => {
  it('should parse css', () => {
    const input = `
	div#test.first , test {
		font-size: 14px;
		font-color: #ffffffff;
		font-weight: bold;
	}

	first , test {
		font-size: 14px;
		font-color: #ffffffff;
		font-weight: bold;
	}
		`
    expect(parseCSS(input)).toMatchSnapshot()
  })
})
