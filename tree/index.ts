interface Node {
  value: number
  children: Node[]
}

function logValue(node: Node) {
  console.log('visiting: ', node.value)
}

function dfs(node: Node, cb: (node: Node) => void) {
  cb(node)
  for (let i = 0; i <= node.children.length; i++) {
    dfs(node.children[i], cb)
  }
}

const node = {
  value: 1,
  children: [
    {
      value: 2,
      children: [],
    },
    {
      value: 3,
      children: [],
    },
  ],
}

// dfs(node, logValue)

// 深度优先树遍历，支持各种修改操作， 类似Babel的Path
function dfsLoop(root: Node, cb: (node: Node) => void) {
  const stack = [{ node: root, index: 0 }]

  console.log('enter: ', root)
  cb(root)

  while (stack.length > 0) {
    const top = stack[stack.length - 1]
    const { node, index } = top

    if (index <= node.children.length - 1) {
      const child = node.children[index]
      top.index++
      console.log('enter: ', child)
      stack.push({ node: child, index: 0 })
    } else {
      stack.pop()
      console.log('exit: ', top.node)
    }
  }
}

dfsLoop(node, logValue)
