const path = require('path');
const {
  splitByParts
} = require('../index.js')

const filePath = path.join(__dirname, "chunks/", "chunks.jpg")

splitByParts(filePath, 3).then(res => {
  // <file>-chunk-1
  // ...
  // <file>-chunk-3
  console.log(res)
})