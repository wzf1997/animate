/* eslint-disable no-console */

/**
 * 压缩图片
 */
import fs from 'fs'
import path, { resolve } from 'path'

import { Log } from './log'

const tinify = require('tinify')

const args = process.argv.splice(2)
let key = '2ygd6Kn2rlP1kqjphttdp3VVnwf4NKw6'
const newKey = args.find((e) => /^-key=/.test(e))
if (newKey) {
  key = newKey.split('=')[1]
  if (!key || key.length < 10) {
    throw new Error('传如的 key 值不正确, 详细查看 https://tinypng.com/developers/reference/nodejs')
  }
}

tinify.key = key

class FileSystemManager {
  readDir(filePath) {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(filePath, (error, files) => {
        if (error) {
          reject(error)
        } else {
          resolve(files)
        }
      })
    })
  }
  stat(fileDirection) {
    return new Promise<fs.Stats>((resolve, reject) => {
      fs.stat(fileDirection, function (error, stats) {
        if (error) {
          reject(error)
        } else {
          resolve(stats)
        }
      })
    })
  }
  mkDir(dirPath) {
    return new Promise<void>((resolve, reject) => {
      // path.sep 文件路径分隔符（mac 与 window 不同）
      // 转变成数组，如 ['a', 'b', 'c']
      const parts = dirPath.split(path.sep)
      for (let i = 1; i <= parts.length; i++) {
        // 重新拼接成 a a/b a/b/c
        const current = parts.slice(0, i).join(path.sep)
        // accessSync 路径不存在则抛出错误在 catch 中创建文件夹
        try {
          fs.accessSync(current)
        } catch (e) {
          fs.mkdirSync(current)
        }
      }
      resolve()
    })
  }
  copyFile(source, dest) {
    const rs = fs.createReadStream(source)
    //创建一个可写流
    const ws = fs.createWriteStream(dest)
    //将可读流中的数据写入到可写流中
    rs.pipe(ws)
  }
  exists(dirName, flag) {
    if (!dirName) {
      throw new Error('路径为空')
    }
    return new Promise((resolve, reject) => {
      try {
        fs.exists(dirName, (exists) => {
          if (exists) {
            resolve(true)
          } else {
            if (flag) {
              this.mkDir(dirName)
                .then((res) => {
                  resolve(true)
                })
                .catch((error) => {
                  reject(false)
                })
            } else {
              reject(false)
            }
          }
        })
      } catch (error) {
        console.error(error)
        reject(false)
      }
    })
  }
  async copyByDirection(filePath, destPath) {
    // 显示文件夹下的所有文件
    try {
      await this.exists(destPath, true)
      const files = await this.readDir(filePath)
      for (const filename of files) {
        const fileDir = path.join(filePath, filename)
        const stats = await this.stat(fileDir)
        const isFile = stats.isFile() //是文件
        const isDir = stats.isDirectory() //是文件夹
        const destDir = path.join(destPath, filename)

        const subDir = path.join(destPath, filename)
        if (isFile) {
          // console.log('文件 ', fileDir); // 读取文件内容
          this.copyFile(fileDir, subDir)
        }
        if (isDir) {
          await this.exists(subDir, true)
          void this.copyByDirection(fileDir, subDir)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  tinyPngHandle(filePath, destPath, filename): Promise<number> {
    return new Promise((resolve, rej) => {
      if (/.(png|jpg|jpeg)$/i.test(filePath)) {
        Log.info('compressing ' + filename + ' ...')
        const source = tinify.fromFile(filePath)
        const result = source.result()
        const states = fs.statSync(filePath)
        const sourceSize = states.size || 0
        const kb = 1024.0
        const reduceSize = (n = 0.0) => (n / kb).toFixed(1)
        result.meta().then((res) => {
          const resultSize = res['content-length'] || 0
          result.toFile(destPath, (argv) => {
            const percent = ((resultSize / sourceSize) * 100).toFixed(2)
            resolve(1)
            Log.success(`done ${filename} [${reduceSize(states.size)}K => ${reduceSize(resultSize)}K，-${percent}%]`)
          })
        })
      } else {
        rej(0)
      }
    })
  }
  async compressImg(filePath, destPath) {
    // 显示文件夹下的所有文件
    try {
      await this.exists(destPath, true)
      const files = await this.readDir(filePath)

      return await new Promise(async (resolve, rej) => {
        const total = files.length
        let suc = 0
        let err = 0
        for (const filename of files) {
          const fileDir = path.join(filePath, filename)
          const stats = await this.stat(fileDir)
          const isFile = stats.isFile() //是文件
          const isDir = stats.isDirectory() //是文件夹

          const subDir = path.join(destPath, filename)

          if (isFile) {
            void this.tinyPngHandle(fileDir, subDir, filename)
              .then(() => {
                suc += 1
              })
              .catch((e) => {
                err += 1
              })
              .finally(() => {
                console.error(suc, err, total)
                if (suc + err === total) {
                  resolve(true)
                }
              })
          }

          if (isDir) {
            await this.exists(subDir, true)

            void this.compressImg(fileDir, subDir)
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export const fsm = () => {
  return new FileSystemManager()
}

// fsm.compressImg('../dist', '../dest', true);
// let isFilter = false
// const newFilterKey = args.find((e) => /^-filter/.test(e))
// if (newFilterKey) {
//   isFilter = isFilter === 'true' || isFilter == '' ? true : false
// }

// if (!args[0]) {
//   throw new Error('需要原目录')
// }
// if (!args[1]) {
//   throw new Error('需要目标目录')
// }
// if (args.some((e) => /-h/.test(e))) {
//   console.log('compress ./src/images ./dist/images [filter]\n')
// }

// fsm.compressImg(args[0], args[1], isFilter)
