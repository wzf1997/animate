/* eslint-disable no-console */
import { fsm } from './compressImg'
import { createSprite } from './create'

export async function generateSprite() {
  const [curPath = './soruce', destPath = './sprite-dist'] = process.argv.slice(2)
  if (!curPath) {
    console.error('请输入原目录')
  }

  if (!destPath) {
    console.error('请输入目标目录')
    return
  }
  if (process.argv.slice(2).some((e) => /-h/.test(e))) {
    console.log('请输入 npx  tsx gs ./src/images ./dist/images [filter]\n')
  }
  // 先压缩文件
  // 然后 进行转换成 雪碧图
  try {
    await fsm().compressImg(curPath, destPath)
    await createSprite({
      source: destPath,
    })
  } catch (e) {
    process.exit(1)
  }
}
