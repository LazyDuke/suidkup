const env = require('./base/env')
const globals = require('./base/globals')
const parserOptions = require('./base/parserOptions')

module.exports = {
  env,
  extends: ['standard'],
  globals,
  parser: 'babel-eslint',
  parserOptions,
  plugins: ['babel']
}
