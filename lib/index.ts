// lib/index.ts
import fs from 'fs'
import path from 'path'

import { AbstractFileSystemTree, Directory, File, ASFTOptions, ReadWriteContentFunction, FileOptions } from './types'

class ASFT {
  tree: AbstractFileSystemTree
  options: ASFTOptions

  constructor(tree: AbstractFileSystemTree, options?: ASFTOptions) {
    this.tree = {
      path: tree.path ? tree.path : process.cwd(),
      children: tree.children ? tree.children : []
    }

    this.options = options
      ? options
      : {
          log: false
        }
  }

  file(name: string, content: string | ReadWriteContentFunction, options?: FileOptions) {
    let file: File = {
      type: 'file',
      name,
      content
    }

    if (options) {
      file.options = options
    }

    this.tree.children.push(file)

    return this
  }

  file_if(condition: boolean, name: string, content: string | ReadWriteContentFunction) {
    return condition ? this.file(name, content) : this
  }

  file_unless(condition: boolean, name: string, content: string) {
    return condition ? this : this.file(name, content)
  }

  dir_if(condition: boolean, name: string, subtree?: (afst: ASFT) => ASFT) {
    return condition ? this.dir(name, subtree) : this
  }

  dir_unless(condition: boolean, name: string, subtree?: (afst: ASFT) => ASFT) {
    return condition ? this : this.dir(name, subtree)
  }

  dir(name: string, subtree?: (afst: ASFT) => ASFT) {
    this.tree.children.push({
      type: 'dir',
      name,
      children: subtree ? subtree(new ASFT({ path: path.join(this.tree.path, name) })).tree.children : []
    })

    return this
  }

  write() {
    if (!fs.existsSync(this.tree.path)) {
      fs.mkdirSync(this.tree.path)

      if (this.options.log) {
        console.log(`Created directory: ${this.tree.path}`)
      }
    }

    if (this.tree.children) {
      this.tree.children.forEach(child => {
        this.writeNode(path.join(this.tree.path, child.name), child)
      })
    }
  }

  writeNode(_path: string, node: Directory | File) {
    if (node.type == 'file') {
      const exists = fs.existsSync(_path)

      if (exists && node.options && !node.options.overwrite) {
        console.log(`Skipping existing file: ${_path}`)
        return
      }

      const currentContent = exists ? fs.readFileSync(_path).toString() : ''
      const content = typeof node.content == 'function' ? node.content(currentContent) : node.content

      fs.writeFileSync(_path, content)

      if (node.options && node.options.mode) {
        fs.chmodSync(_path, node.options.mode)
      }

      if (this.options.log) {
        console.log(`Created file: ${_path}`)
      }
    }

    if (node.type == 'dir') {
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path)

        if (this.options.log) {
          console.log(`Created directory: ${_path}`)
        }
      }

      if (node.children) {
        node.children.forEach(child => {
          this.writeNode(path.join(_path, child.name), child)
        })
      }
    }
  }

  absoluteFilePaths() {
    return this.filePathsForNode(this.tree.path, this.tree.children)
  }

  relativeFilePaths() {
    return this.filePathsForNode('', this.tree.children)
  }

  filePathsForNode(parent_path: string, arr: Array<File | Directory>): Array<string> {
    const self = this
    return arr.reduce(function(paths: Array<string>, node) {
      const new_path = path.join(parent_path, node.name)
      if (node.type == 'file') {
        return paths.concat(new_path)
      }

      if (node.type == 'dir') {
        return paths.concat(self.filePathsForNode(new_path, node.children))
      }

      return paths
    }, [])
  }
}

export function file(name: string, content: string): File {
  return {
    type: 'file',
    name,
    content
  }
}

export function dir(name: string): Directory {
  return {
    type: 'dir',
    name
  }
}

export default ASFT
