import { join, basename, extname } from 'path'

import sharp from 'sharp'

import { readFile, readdir, meatureGrid } from './help'

// 创建雪碧图
export const createSprite = async ({
  source,
  height,
  width,
  outputType = 'png',
  span = 0,
  quality = 80,
  output,
  sample = 1,
  // 导出 一排文件
  isExportRow = false,
}: {
  source: string
  height?: number
  width?: number
  output?: string
  span?: number
  quality?: number
  outputType?: 'png' | 'jpg'
  sample?: number
  isExportRow?: boolean
}) => {
  const files = (await readdir(source))
    .filter((v) => ['.png', '.jpg'].indexOf(extname(v)) !== -1)
    .sort((v1, v2) => parseInt(v1) - parseInt(v2))
    .filter((_v, index) => {
      return index % sample === 0
    })
  const imageBuffers: Uint8Array[] = []

  for (const file of files) {
    const buffer = await readFile(join(source, file))
    // const compress = await compressImageBuffer(buffer)
    imageBuffers.push(buffer)
  }
  const metadata = await sharp(imageBuffers[0]).metadata()
  height = height ?? metadata.height ?? 0
  width = width ?? metadata.width ?? 0

  const { hc, vc } = meatureGrid({ total: files.length, height, width })
  let outputImage
  if (isExportRow) {
    outputImage = sharp({
      create: {
        height,
        width: width * files.length,
        channels: 4,
        background: 'transparent',
      },
    })
    outputImage.composite(
      imageBuffers.map((input, index) => {
        const top = 0
        const left = width * index
        return {
          input,
          left,
          top,
          blend: 'add',
        }
      }),
    )
  } else {
    outputImage = sharp({
      create: {
        height: (height + span) * vc,
        width: (width + span) * hc,
        channels: 4,
        background: 'transparent',
      },
    })
    outputImage.composite(
      imageBuffers.map((input, index) => {
        const h = index % hc
        const l = Math.floor(index / hc)
        const top = (height + span) * l
        const left = (width + span) * h
        return {
          input,
          left,
          top,
          blend: 'add',
        }
      }),
    )
  }
  const dest = outputType === 'png' ? outputImage.png({ quality }) : outputImage.jpeg({ quality })
  await dest.toFile(output ?? join(source, basename(source) + '.' + outputType))
}
