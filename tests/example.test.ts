import path from 'path'

import { AbstractFileSystemTree } from '../lib/types'
import AFST from '../lib/index'

describe('Example', () => {
  test('Jest works', () => {
    expect(true).toBe(true)
  })

  // test('it creates root dir', () => {
  //   let tree: AbstractFileSystemTree = {
  //     path: path.join(__dirname, 'foo'),
  //     children: [
  //       {
  //         type: 'dir',
  //         name: 'level1a',
  //         children: [
  //           {
  //             type: 'file',
  //             name: 'level2a',
  //             content: 'level 2a content'
  //           },
  //           {
  //             type: 'file',
  //             name: 'level2b',
  //             content: 'level 2b content'
  //           },
  //           {
  //             type: 'dir',
  //             name: 'levelbc',
  //             children: [
  //               {
  //                 type: 'file',
  //                 name: 'level3a',
  //                 content: 'level 3 a content'
  //               },
  //               {
  //                 type: 'file',
  //                 name: 'level3b',
  //                 content: 'level 3 b content'
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         type: 'file',
  //         name: 'level1b',
  //         content: 'level 1 b content'
  //       }
  //     ]
  //   }

  //   let afst = new AFST(tree, { log: true })

  //   afst.write()

  //   //expect(true).toBe(false)
  // })

  test('it creates root dir', () => {
    let tree = {
      path: path.join(__dirname, 'foo')
    }
    const afst = new AFST(tree, { log: true })
      .file('file1', 'File 1')
      .file('file2', 'File 2')
      .file('file3', 'File 3')
      .dir('dir1', d1 =>
        d1
          .file('g1', 'g1')
          .file('g2', 'g2')
          .file('g3', 'g3')
      )
      .dir('dir2', d2 =>
        d2
          .file('h1', 'h1')
          .file('h2', 'h2')
          .file('h3', 'h3')
          .dir('k1')
          .dir('l1', l1 => {
            l1.file('m1', 'm1')
            l1.file('m2', 'm2')
            l1.file('m3', 'm2')
            return l1
          })
      )
      .write()

    //expect(true).toBe(false)
  })

  test('nested', () => {
    new AFST({ path: path.join(__dirname, 'nested') })
      .dir('a', a => a.file('c.txt', 'Text content').file('d.md', 'Markdown content'))
      .dir('e', d2 => {
        d2.file('f', 'File without extension')
        d2.file('g', 'File without extension')
        return d2
      })
      .file('.b', 'Some dotfile content')
      .write()
  })
})
