const env = require('./base/env')
const globals = require('./base/globals')
const parserOptions = require('./base/parserOptions')

module.exports = {
  env,
  extends: ['standard', 'plugin:@typescript-eslint/recommended'],
  globals,
  parser: '@typescript-eslint/parser',
  parserOptions,
  plugins: ['@typescript-eslint']
}
