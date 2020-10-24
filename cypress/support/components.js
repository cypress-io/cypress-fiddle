const React = require('react')
const { mount } = require('cypress-react-unit-test')

globalThis.React = React
globalThis.mount = mount

require('cypress-react-unit-test/support')
