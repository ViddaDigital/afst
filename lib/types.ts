export interface File {
  type: 'file'
  name: string
  content: string
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
