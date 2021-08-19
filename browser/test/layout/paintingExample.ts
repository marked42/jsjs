import { buildLayoutTree } from '../../src/layout'
import { createStyleTree } from '../../src/style'
import { buildDisplayList, drawLayoutBoxAsCanvasData } from '../../src/painting'
import { Rect } from '../../src/layout/Rect'
import { Dimensions } from '../../src/layout/Dimensions'

const html = `
<div class="a">
</div>
`
// <div class="b">
//   <div class="c">
//     <div class="d">
//       <div class="e">
//         <div class="f">
//           <div class="g">
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

const css = `
div, html { display: block; padding: 50px; }
.a { background: #ff0000; }
`
// .b { background: #ffa500; }
// .c { background: #ffff00; }
// .d { background: #008000; }
// .e { background: #0000ff; }
// .f { background: #4b0082; }
// .g { background: #800080; }

const layoutTree = buildLayoutTree(createStyleTree(html, css))
const initialContainingBlock = Dimensions.default()
initialContainingBlock.content = new Rect(0, 0, 400, 0)
layoutTree.layout(initialContainingBlock)
const displayList = buildDisplayList(layoutTree)
const canvasData = drawLayoutBoxAsCanvasData(
  layoutTree,
  new Rect(0, 0, 400, 400)
)
console.log('displayList: ', displayList)
console.log('canvasData: ', canvasData)

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (canvas) {
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const imageData = new ImageData(
      canvasData.data,
      canvasData.width,
      canvasData.height
    )
    ctx.putImageData(imageData, 0, 0, 50, 50, 300, 100)
  }
}
