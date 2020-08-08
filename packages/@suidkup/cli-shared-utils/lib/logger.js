const chalk = require('chalk')
const spinner = require('./spinner')

class Logger {
  console = console

  _format(label, msg) {
    return msg
      .split('\n')
      .map((line, i) =>
        i === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length)
      )
      .join('\n')
  }

  _chalkTag(msg) {
    return chalk.bgBlackBright.white.dim(` ${msg} `)
  }

  tag(tagName) {
    return chalk.cyan(tagName)
  }

  log(msg = '', tag = null) {
    if (tag) {
      this.console.log(this._format(this._chalkTag(tag), msg))
    } else {
      this.console.log(msg)
    }
  }

  info(msg, tag = null) {
    this.console.log(
      this._format(
        chalk.bgBlue.black(' INFO ') + (tag ? this._chalkTag(tag) : ''),
        msg
      )
    )
  }

  done(msg, tag = null) {
    this.console.log(
      this._format(
        chalk.bgGreen.black(' DONE ') + (tag ? this._chalkTag(tag) : ''),
        msg
      )
    )
  }

  warn(msg, tag = null) {
    if (msg instanceof Error) {
      console.error(msg.stack)
    } else {
      this.console.warn(
        this._format(
          chalk.bgYellow.black(' WARN ') + (tag ? this._chalkTag(tag) : ''),
          chalk.yellow(msg)
        )
      )
    }
  }

  error(msg, tag = null) {
    this.console.error(
      this._format(
        chalk.bgRed(' ERROR ') + (tag ? this._chalkTag(tag) : ''),
        chalk.red(msg)
      )
    )
    if (msg instanceof Error) {
      console.error(msg.stack)
    }
  }

  logWithSpinner(symbol, msg) {
    spinner.logWithSpinner(symbol, msg)
  }

  stopSpinner(persist) {
    spinner.stopSpinner(persist)
  }

  pauseSpinner() {
    spinner.pauseSpinner()
  }

  resumeSpinner() {
    spinner.resumeSpinner()
  }

  failSpinner(text) {
    spinner.failSpinner(text)
  }
}

module.exports = new Logger()
