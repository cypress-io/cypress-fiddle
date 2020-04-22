#!/usr/bin/env node
// @ts-check

const debug = require('debug')('@cypress/fiddle')
const path = require('path')
const fs = require('fs')
const arg = require('arg')
const mdUtils = require('../src/markdown-utils')
const writeUtils = require('../src/write-utils')

const args = arg({
  '--before': String, // visit an URL
  '--before-each': String, // visit an URL before each test
})

const markdownFilename = args._[0]
if (!markdownFilename || path.extname(markdownFilename) !== '.md') {
  throw new Error(`Expected markdown filename, got ${markdownFilename}`)
}

const outputFilename = markdownFilename.replace(/\.md$/, '.js')
const md = fs.readFileSync(markdownFilename, 'utf8')
const tests = mdUtils.extractFiddles(md)
debug('found tests %o', tests)
const source = writeUtils.generateSpec(tests, {
  before: args['--before'],
  beforeEach: args['--before-each'],
  beforeHooksAtDepth: 1, // only add the hooks to 1 level deep
})
fs.writeFileSync(outputFilename, source + '\n', 'utf8')
console.log('saved %s', outputFilename)
