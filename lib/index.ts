// lib/index.ts
import fs from 'fs'
import path from 'path'

import { AbstractFileSystemTree, Directory, File, ASFTOptions } from './types'

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

  file(name: string, content: string) {
    this.tree.children.push({
      type: 'file',
      name,
      content
    })

    return this
  }

  dir(name: string, subtree?: (afst: ASFT) => ASFT) {
    this.tree.children.push({
      type: 'dir',
      name,
      children: subtree ? subtree(new ASFT({ path: path.join(this.tree.path, name) })).tree.children : []
    })

    return this
  }

  toJSON() {
    return JSON.stringify(this.tree)
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
      fs.writeFileSync(_path, node.content)

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
}

export default ASFT
