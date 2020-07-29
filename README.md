# Split-Chunk-Merge


* Split 

```splitByParts``` ```splitBySizes``` 

* Merge 

```fsMerge``` ```bufferMerge``` ```streamMerge```

### Installation

You can install and save an entry to your package.json with the following command:

```javascript
npm i split-chunk-merge --save
```

### Usage

#### Split Chunk

**1. splitByParts**

* Description

Splitting file with number of parts.

* Parameter
  - file: Path to the file to split.
  - parts: Number of parts

* Return  
  - Promise<string[]>: Promise with results in an array of part names (full paths) of the splitted files.

* Example

```javascript
const path = require('path');
const { splitByParts } = require('split-chunk-merge')

const filePath = path.join(__dirname, "chunks/", "chunks.jpg")

splitByParts(filePath, 3).then(res => {
  // <file>-chunk-1
  // ...
  // <file>-chunk-3
  console.log(res)
})
```

**2. splitBySizes**

* Description

Splitting file with maximum bytes per part.

* Parameter  
  - file: Path to the file to split.
  - maxSize: Max size of the splitted parts. (bytes)

* Return
  - Promise<string[]>: Promise with results in an array of part names (full paths) of the splitted files.

* Example

```javascript
const path = require('path');
const { splitBySizes } = require('split-chunk-merge')

const filePath = path.join(__dirname, "chunks/", "chunks.jpg")

splitBySizes(filePath, 2 * 1024 * 1024).then(res => {
  // <file>-chunk-1
  // ...
  // <file>-chunk-3
  console.log(res)
})
```

#### Merge Chunk 

**1. fsMerge**

* Description

Append file merging refers to merging using ```fs.appendFile()```. The function of ```fs.appendFile()``` is to append data to a file asynchronously, if the file does not exist, create the file, data can be a string or buffer.

* Parameter
  - inputPathList: Path to the file list to merge.
  - outputPath: Path to the ouput file after merge

* Return
  - Promise<string>: Promise with results in part names of the merged files.

* Example

```javascript
const path = require('path');
const { fsMerge } = require('split-chunk-merge')

const inputPath = path.join(__dirname, "chunks/")
const outputPath = path.join(__dirname, "chunks/", "chunks.jpg")
const inputPathList = new Array(3).fill().map((item, index) => {
  return inputPath + "chunks.jpg-chunk-" + index
})

fsMerge(inputPathList, outputPath).then(res => {
  console.log(res) // .../chunks/chunks.jpg
})
```

**2. bufferMerge**

* Description

Buffer mode merging is a common file merging method. The method is to read each fragmented file separately with fs.readFile(), and then merge it through ```Buffer.concat()```.

This method is simple and easy to understand, but it has the biggest drawback, that is, how big the file you read, how much memory the merging process takes up, because we are equivalent to loading all the contents of this large file at once. In the memory, this is very inefficient. At the same time, Node's default buffer size limit is ```2GB```. Once we upload a large file exceeding ```2GB```, this method will fail. Although this problem can be circumvented by modifying the upper limit of the buffer size, since this merge method is extremely memory-intensive, I do not recommend you to do this

* Parameter
  - inputPathList: Path to the file list to merge.
  - outputPath: Path to the ouput file after merge

* Return
  - Promise<string>: Promise with results in part names of the merged files.

* Example

```javascript
const path = require('path');
const { bufferMerge } = require('split-chunk-merge')

const inputPath = path.join(__dirname, "chunks/")
const outputPath = path.join(__dirname, "chunks/", "chunks.jpg")
const inputPathList = new Array(3).fill().map((item, index) => {
  return inputPath + "chunks.jpg-chunk-" + index
})

bufferMerge(inputPathList, outputPath).then(res => {
  console.log(res) // .../chunks/chunks.jpg
})
```

**3. streamMerge**

* Description

A stream is a collection of data - just like an array or string. The difference is that the data in the stream may not be available all at once, and you don't need to put all the data in memory at once. This makes streaming very useful when manipulating large amounts of data or sending data piece by piece from an external source.

In other words, when you use the buffer method to process a ```2GB``` file, the memory occupied may be more than ```2GB```, and when you use the stream to process the file, it may only occupy dozens of M. This is why the stream is chosen.

All streams are instances of EventEmitter. They emit events that can be used to read or write data. However, we can use the pipe method to use the data in the stream in a simpler way.

In the following code, we first create a writable stream through ```fs.createWriteStream()``` to store the final merged file. Then use ```fs.createReadStream()``` to read each fragmented file separately, and then use ```pipe()``` to "pour" the read data into a writable stream like pouring water. After monitoring that a glass of water is poured, Immediately continue to pour a cup until it is all poured. At this point, all files have been merged.

* Parameter
  - inputPathList: Path to the file list to merge.
  - outputPath: Path to the ouput file after merge

* Return
  - Promise<string>: Promise with results in part names of the merged files.

* Example

```javascript
const path = require('path');
const { streamMerge } = require('split-chunk-merge')

const inputPath = path.join(__dirname, "chunks/")
const outputPath = path.join(__dirname, "chunks/", "chunks.jpg")
const inputPathList = new Array(3).fill().map((item, index) => {
  return inputPath + "chunks.jpg-chunk-" + index
})

streamMerge(inputPathList, outputPath).then(res => {
  console.log(res) // .../chunks/chunks.jpg
})
```

### License
License is ISC.