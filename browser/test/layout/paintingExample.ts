import { buildLayoutTree } from '../../src/layout'
import { createStyleTree } from '../../src/style'
import { buildDisplayList, drawLayoutBoxAsCanvasData } from '../../src/painting'
import { Rect } from '../../src/layout/Rect'

const html = `
<div class="a">
  <div class="b">
    <div class="c">
      <div class="d">
        <div class="e">
          <div class="f">
            <div class="g">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`

const css = `
div { display: block; padding: 12px; }
.a { background: #ff0000; }
.b { background: #ffa500; }
.c { background: #ffff00; }
.d { background: #008000; }
.e { background: #0000ff; }
.f { background: #4b0082; }
.g { background: #800080; }
`

const layoutTree = buildLayoutTree(createStyleTree(html, css))
const displayList = buildDisplayList(layoutTree)
const canvasData = drawLayoutBoxAsCanvasData(
  layoutTree,
  new Rect(0, 0, 400, 400)
)
console.log('displayList: ', displayList)
console.log('canvasData: ', canvasData)
