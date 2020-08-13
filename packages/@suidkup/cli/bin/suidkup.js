#!/usr/bin/env node

const {
  version,
  engines: { node: requiredVersion }
} = require('../package.json')
const { program } = require('commander')
const {
  chalk,
  semver,
  env: { hasLerna }
} = require('@suidkup/cli-shared-utils')
const minimist = require('minimist')
const leven = require('leven')
const enhanceErrorMessages = require('../lib/util/enhanceErrorMessages')

checkNodeVersion(requiredVersion, '@suidkup/cli')
enhanceErrorMessages()

program
  .command('create <sdk-name>')
  .description('create a new project')
  .option('-m, --mono', 'to develop in monorepos mode')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)

    invalidArgumentsWarning()

    console.log(name, options)
  })

program
  .command('add <package-name>')
  .description('add a new package for monorepos')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)

    // check lerna dependency
    // 确认是否是在 monorepos 根目录运行 add 命令
    if (!hasLerna(process.cwd())) {
      console.log(
        chalk.red(
          `You should using 'add' command in the root directory of monorepos.`
        )
      )

      process.exit(1)
    }

    invalidArgumentsWarning()

    console.log(name, options)
  })

// show basic use
// 显示命令的基本用法
program.version(`@suidkup/cli ${version}`).usage('<command> [options]')

// output help information on unknown commands
// 输出键入错误命令后的信息（包含建议）
program.arguments('<command>').action(cmd => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  suggestCommands(cmd)
})

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(
    `  Run ${chalk.cyan(
      `suidkup <command> --help`
    )} for detailed usage of given command.`
  )
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

/**
 * @description warning if pass invalid arguments
 * (传入错误参数的警告)
 * @author Lazy Duke
 * @date 2020-08-04
 */
function invalidArgumentsWarning() {
  if (minimist(process.argv.slice(3))._.length > 1) {
    console.log(
      chalk.yellow(
        "\n Info: You provided more than one argument. The first one will be used as the sdk's name, the rest are ignored."
      )
    )
  }
}

/**
 * @description suggest matching commands
 * (输入接近错误键入的正确命令)
 * @author Lazy Duke
 * @date 2020-08-04
 * @param {*} unknownCommand
 */
function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name)

  let suggestion

  availableCommands.forEach(cmd => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand)
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd
    }
  })

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}

/**
 * @description hyphen to camel
 * (连字符转驼峰)
 * @author Lazy Duke
 * @date 2020-08-04
 * @param {string} str
 * @returns
 */
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

/**
 * @description commander passes the Command object itself as options,
 * extract only actual options into a fresh object.
 * (格式化命令行传入的参数）
 * @author Lazy Duke
 * @date 2020-08-04
 * @param {*} cmd
 * @returns
 */
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

/**
 * @description check version of Node
 * (检查 Node 版本是否符合要求)
 * @author Lazy Duke
 * @date 2020-08-04
 * @param {string} wanted
 * @param {string} id
 */
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`
      )
    )
    process.exit(1)
  }
}
