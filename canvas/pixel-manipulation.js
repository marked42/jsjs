// const canvas = document.getElementById('canvas')
// const ctx = canvas.getContext('2d')

// const imageData = new ImageData(100, 100)
// const arr = imageData.data

// // Iterate through every pixel
// for (let i = 0; i < arr.length; i += 4) {
//   arr[i + 0] = 0 // R value
//   arr[i + 1] = 190 // G value
//   arr[i + 2] = 0 // B value
//   arr[i + 3] = 255 // A value
// }

// // Draw image data to the canvas
// ctx.putImageData(imageData, 0, 0)

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const imageData = ctx.createImageData(100, 100)

// Iterate through every pixel
for (let i = 0; i < imageData.data.length; i += 4) {
  // Modify pixel data
  imageData.data[i + 0] = 190 // R value
  imageData.data[i + 1] = 0 // G value
  imageData.data[i + 2] = 210 // B value
  imageData.data[i + 3] = 255 // A value
}

// Draw image data to the canvas
ctx.putImageData(imageData, 20, 20)
