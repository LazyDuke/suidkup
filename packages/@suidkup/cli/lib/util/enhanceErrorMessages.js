const { chalk } = require('@suidkup/cli-shared-utils')
const program = require('commander')

/**
 * @description enhance common error messages
 * (覆写`commmander`自带的错误处理函数)
 * @author Lazy Duke
 * @date 2020-08-04
 * @param {string} methodName
 * @param {function} log
 */
function enhanceCommanderErrorMessages(methodName, log) {
  program.Command.prototype[methodName] = function outPutErrorMessage(...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }
    this.outputHelp()
    console.log(`  ${chalk.red(log(...args))}`)
    console.log()
    process.exit(1)
  }
}

/**
 * @description enhance functions wrapper
 * (增强函数的wrapper)
 * @author Lazy Duke
 * @date 2020-08-06
 */
function wrapper() {
  enhanceCommanderErrorMessages(
    'missingArgument',
    argName => `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
  )
  enhanceCommanderErrorMessages(
    'unknownOption',
    optionName => `Unknown option ${chalk.yellow(optionName)}.`
  )
  enhanceCommanderErrorMessages(
    'optionMissingArgument',
    (option, flag) =>
      `Missing required argument for option ${chalk.yellow(option.flags)}${
        flag ? `, got ${chalk.yellow(flag)}` : ''
      }`
  )
}

module.exports = wrapper
