import { Lexer } from '../Lexer'
import { NumberToken } from '../Token'
// describe('Lexer', () => {
//   it('should lex number', () => {
//     const input = '111'
//     const lexer = new Lexer(input)

//     const tokens = lexer.getTokens()
//     console.log('tokens: ', lexer.getTokens())
//     // expect(tokens).toEqual([new NumberToken('111')])
//   })

//   it('should lex number', () => {
//     const input = '0'
//     const lexer = new Lexer(input)

//     const tokens = lexer.getTokens()
//     console.log('tokens: ', lexer.getTokens())
//     // expect(tokens).toEqual([new NumberToken('111')])
//   })

//   //   it('should lex number', () => {
//   //     const input = '00'
//   //     const lexer = new Lexer(input)

//   //     const tokens = lexer.getTokens()
//   //     console.log('tokens: ', lexer.getTokens())
//   //     // expect(tokens).toEqual([new NumberToken('111')])
//   //   })
// })

const input = '012'
const lexer = new Lexer(input)

console.log('tokens: ', lexer.getTokens())
