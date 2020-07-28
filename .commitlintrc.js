const fg = require('fast-glob')

const scopes = fg.sync('packages/**', { onlyFiles: false, deep: 0 })

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      scopes.map(scope => scope.replace(/packages\//, ''))
    ]
  }
}
