/* eslint-disable no-console */
const WHITE = '\x1b[0m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[36m'
const RED = '\x1b[31m'
export const Log = {
  log: function (...args) {
    console.log(WHITE, ...args)
  },
  success: function (...args) {
    console.log(GREEN, ...args)
  },
  info: function (...args) {
    console.log(BLUE, ...args)
  },
  warn: function (...args) {
    console.warn(YELLOW, ...args)
  },
  error: function (...args) {
    console.error(RED, ...args)
  },
}
