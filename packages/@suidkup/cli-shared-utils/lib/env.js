const { resolve } = require('path')

/**
 * @description check lerna dependency
 * (检查是否引入 lerna 依赖)
 * @author Lazy Duke
 * @date 2020-08-06
 * @param {*} cwd
 * @returns {boolean}
 */
function hasLerna(cwd) {
  try {
    const {
      dependencies: { lerna } = {},
      devDependencies: { lerna: devLerna } = {}
    } = require(resolve(cwd, './package.json'))

    return !!lerna || !!devLerna
  } catch (error) {
    return false
  }
}

module.exports = {
  hasLerna
}
