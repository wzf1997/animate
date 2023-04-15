import fs from 'fs'
import chalk from 'chalk'
import { toExcel } from 'to-excel'
import { Compiler } from 'webpack'

interface CountType {
  [key: string]: number
}
export default class CountComponentPlugin {
  opts: {
    pathname: string // 文件的路径
    startCount: boolean // 是否开启统计
    isExportExcel: boolean
  }

  total: { len: number; components: CountType }

  constructor(opts = {}) {
    this.opts = {
      startCount: true, // 是否开启统计
      isExportExcel: false, // 是否生成excel
      pathname: '', // 文件路径
      ...opts,
    }
    this.total = {
      len: 0,
      components: {},
    }
  }

  sort(obj: CountType) {
    this.total.components = Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a))
  }

  // 生成excel 文件
  toExcel() {
    const arr: any[] = []
    Object.keys(this.total.components).forEach((key, index) => {
      const value = this.total.components[key]
      const data = {
        id: index + 1,
        component: key,
        count: value,
      }
      arr.push(data)
    })

    const headers = [
      { label: '名次', field: 'id' },
      { label: '组件', field: 'component' },
      { label: '次数', field: 'count' },
    ]
    const content = toExcel.exportXLS(headers, arr, 'filename')
    fs.writeFileSync('filename.xls', content)
  }

  toLog() {
    this.sort(this.total.components)
    Object.keys(this.total.components).forEach((key) => {
      const value = this.total.components[key]
      const per = Number((value / this.total.len).toPrecision(3)) * 100
      console.log(`\n${chalk.blue(key)} 组件引用次数 ${chalk.green(value)} 引用率 ${chalk.redBright(per)}%`)
    })
    console.log(`\n组件${chalk.blue('总共')}引用次数 ${chalk.green(this.total.len)}`)
  }

  apply(compiler: Compiler) {
    const parser = (factory: any) => {
      if (!this.opts.startCount) {
        return
      }
      factory.hooks.parser.for('javascript/auto').tap('count-webpack-plugin', (arg: any) => {
        arg.hooks.importSpecifier.tap(
          'count-webpack-plugin',
          (_statement: string, source: string, _exportName: string, identifierName: string) => {
            if (source.includes(this.opts.pathname)) {
              this.total.len += this.total.len
              const key = identifierName
              this.total.components[key] = this.total.components[key] ? this.total.components[key] + 1 : 1
            }
          },
        )
      })
    }
    const done = () => {
      if (!this.opts.startCount) {
        return
      }
      this.sort(this.total.components)
      if (this.opts.isExportExcel) {
        this.toExcel()
      } else {
        this.toLog()
      }
    }
    compiler.hooks.normalModuleFactory.tap('count-webpack-plugin', parser)
    compiler.hooks.done.tap('count-webpack-plugin-done', done)
  }
}
