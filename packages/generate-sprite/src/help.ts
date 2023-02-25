import { access, createWriteStream, mkdir as mk, readFile as rf, readdir as rd, MakeDirectoryOptions } from 'fs'

export function exists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    access(path, (err: NodeJS.ErrnoException | null) => {
      if (!err) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

export function writeFile(source: string | Buffer, dist: string) {
  return new Promise((resolve) => {
    const stream = createWriteStream(dist)
    stream.write(source, (error) => {
      resolve(error)
    })
  })
}

export function meatureGrid({ height, width, total }: { height: number; width: number; total: number }) {
  let hc = Math.floor(Math.sqrt(height * width * total) / width) // 横向节点个数
  let vc = Math.ceil(total / hc) // 纵向节点个数
  const s1 = hc * vc * height * width
  const s2 = (hc + 1) * Math.ceil(total / hc + 1) * height * width
  if (s2 < s1) {
    hc++
    vc = Math.ceil(total / hc)
  }
  return {
    hc,
    vc,
  }
}

export const readFile = (source: string, options: any = null): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    rf(source, options, (error, buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer)
      }
    })
  })
}

export const mkdir = (path: string, options: MakeDirectoryOptions = { recursive: true }) => {
  return new Promise((resolve) => {
    mk(path, options, () => {
      resolve(null)
    })
  })
}

export const readdir = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    rd(path, (error, files) => {
      if (error) {
        reject(error)
      } else {
        resolve(files)
      }
    })
  })
}
