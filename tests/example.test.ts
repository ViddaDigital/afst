import path from 'path'

import { AbstractFileSystemTree } from '../lib/types'
import AFST from '../lib/index'

describe('Example', () => {
  test('Jest works', () => {
    expect(true).toBe(true)
  })

  test('it creates root dir', () => {
    let tree: AbstractFileSystemTree = {
      path: path.join(__dirname, 'foo'),
      children: [
        {
          type: 'dir',
          name: 'level1a',
          children: [
            {
              type: 'file',
              name: 'level2a',
              content: 'level 2a content'
            },
            {
              type: 'file',
              name: 'level2b',
              content: 'level 2b content'
            },
            {
              type: 'dir',
              name: 'levelbc',
              children: [
                {
                  type: 'file',
                  name: 'level3a',
                  content: 'level 3 a content'
                },
                {
                  type: 'file',
                  name: 'level3b',
                  content: 'level 3 b content'
                }
              ]
            }
          ]
        },
        {
          type: 'file',
          name: 'level1b',
          content: 'level 1 b content'
        }
      ]
    }

    let afst = new AFST(tree)

    afst.write()

    //expect(true).toBe(false)
  })
})
