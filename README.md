Abstract File System Tree
=========================

Define an abstract tree of directories and files with content and create it in one go.

## Requirements

* node version 8 or higher

## Installation

```bash
$ git clone git@github.com:ViddaDigital/afst.git
```

```bash
$ yarn install
```

## How to use

```bash
$ yarn build
```

# Linking afst during development

Change directory to where your cloned afst.

```bash
$ yarn afst
```

Change directory to your local project.

```bash
$ yarn link afst
```

## Usage

```typescript
   let tree: AbstractFileSystemTree = {
      path: '/some/kind/of/path',
      children: [
        {
          type: 'dir',
          name: 'dir1',
          children: [
            {
              type: 'file',
              name: 'file2a.txt',
              content: 'File 2 a content'
            },
            {
              type: 'file',
              name: 'file2b.txt',
              content: 'File 2 b content'
            },
            {
              type: 'dir',
              name: 'dir2c',
              children: [
                {
                  type: 'file',
                  name: 'file3a.txt',
                  content: 'File 3 a content'
                },
                {
                  type: 'file',
                  name: 'file3b.txt',
                  content: 'File 3 b content'
                }
              ]
            }
          ]
        },
        {
          type: 'file',
          name: 'file2.txt',
          content: 'File 2 content'
        }
      ]
   }

  new AFST(tree, { log: true }).write()
```

This will create these files and directories:

```bash
├── dir1
│    ├── file2a.txt
│    ├── file2b.txt
│    └── dir2c
│        ├── file3a.txt
│        └── file3b.txt
└── file2.txt
```

## Builder

You can also use the builder to create the tree like this:

```typescript
new AFST({path: '/some/kind/of/path'})
  .dir('a', a => a
    .file('c.txt', 'Text content')
    .file('d.md', 'Markdown content')
    .dir('e', e => {
      e.file('f', 'File without extension')
      e.file('g', 'File without extension')
      return e
    })
  )
  .file('.b', 'Some dotfile content')
  .write()
```

This will create these files and directories:

```bash
├── a
│    ├── c.txt
│    ├── d.md
│    └── e
│        ├── f
│        └── g
└── .b
```

## Updating existing file content

To update file content provide a function instead of a string for content like so:

```typescript
new AFST({path: '/some/kind/of/path'})
  .file('c.txt', 'Content always replaces content')
  .file('d.txt', content =>
    content
      .replace("foo", "bar")
      .replace("baz", "baq")
  )
  .write()
```

If a file exists the content will be read and provided as a string to your function.
