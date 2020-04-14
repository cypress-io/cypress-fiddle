#!/usr/bin/env node
// @ts-check

const debug = require('debug')('@cypress/fiddle')
const path = require('path')
const fs = require('fs')
const mdUtils = require('../src/markdown-utils')
const writeUtils = require('../src/write-utils')

const markdownFilename = process.argv[2]
if (!markdownFilename || path.extname(markdownFilename) !== '.md') {
  throw new Error(`Expected markdown filename, got ${markdownFilename}`)
}

const outputFilename = markdownFilename.replace(/\.md$/, '.js')
const md = fs.readFileSync(markdownFilename, 'utf8')
const tests = mdUtils.extractFiddles(md)
debug('found tests %o', tests)
const source = writeUtils.generateSpec(tests)
fs.writeFileSync(outputFilename, source + '\n', 'utf8')
console.log('saved %s', outputFilename)
