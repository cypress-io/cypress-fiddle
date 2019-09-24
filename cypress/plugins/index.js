const fs = require('fs')

module.exports = (on, config) => {
  on('file:preprocessor', (file) => {
    const {filePath, outputPath, shouldWatch} = file
    console.log({filePath, outputPath, shouldWatch})
    return new Promise((resolve, reject) => {
      const md = fs.readFileSync(filePath, 'utf8')

      fs.writeFileSync(outputPath, '', 'utf8')
      resolve(outputPath)
    })
  })
}
