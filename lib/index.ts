// lib/index.ts
import fs from 'fs'
import path from 'path'

import { AbstractFileSystemTree, Directory, File } from './types'

class ASFT {
  tree: AbstractFileSystemTree

  constructor(tree: AbstractFileSystemTree) {
    this.tree = tree
  }

  toJSON() {
    return JSON.stringify(this.tree)
  }

  write() {
    if (!fs.existsSync(this.tree.path)) {
      fs.mkdirSync(this.tree.path)
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
    }

    if (node.type == 'dir') {
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path)
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
