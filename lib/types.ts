export type ReadWriteContentFunction = (content: string) => string

export interface File {
  type: 'file'
  name: string
  content: string | ReadWriteContentFunction
  options?: FileOptions
}

export interface Directory {
  type: 'dir'
  name: string
  children?: Array<Directory | File>
}

export interface AbstractFileSystemTree {
  path: string
  children?: Array<Directory | File>
}

export interface ASFTOptions {
  log: boolean
}

export interface FileOptions {
  mode?: number | string
  overwrite?: boolean
}
