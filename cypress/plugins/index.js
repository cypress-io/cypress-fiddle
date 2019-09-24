const fs = require('fs')

module.exports = (on, config) => {
  on('file:preprocessor', (file) => {
    const {filePath, outputPath, shouldWatch} = file
    console.log({filePath, outputPath, shouldWatch})
    return new Promise((resolve, reject) => {
      const md = fs.readFileSync(filePath, 'utf8')
      // console.log('----')
      // console.log(md)
      // console.log('----')

      const lines = md.split('\n')
      const fiddles = []

      let start
      do {
        start = lines.indexOf('<!-- fiddle -->', start)
        if (start === -1) {
          break
        }
        const end = lines.indexOf('<!-- fiddle-end -->', start)
        if (end === -1) {
          break
        }

        const fiddle = lines.slice(start + 1, end).join('\n')
        // console.log('found fiddle')
        // console.log('----')
        // console.log(fiddle)
        // console.log('----')
        fiddles.push(fiddle)

        start = end + 1
      } while (true)

      // const fiddleRegex = /<!-- fiddle -->\n()<!-- fiddle-end -->\n/
      // const matches = fiddleRegex.exec(md)
      // console.log('matches')
      // console.log(matches)
      console.log('found %d fiddles in file %s', fiddles.length, filePath)

      fs.writeFileSync(outputPath, '', 'utf8')
      resolve(outputPath)
    })
  })
}
