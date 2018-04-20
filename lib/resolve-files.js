'use strict'

const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const stat = promisify(fs.stat)
const access = promisify(fs.access)

async function canRead(p) {
  try {
    await access(p, fs.constants.R_OK)
    return true
  } catch (err) {
    return false
  }
}

async function resolveAll(set, root) {
  const files = new Map()
  for (const relative of set) {
    const fullPath = path.resolve(root, relative)
    if (!(await canRead(fullPath))) continue
    if (!(await stat(fullPath)).isFile()) continue
    const src = await readFile(fullPath, 'utf8')
    files.set(relative, { fullPath, src })
  }
  return files
}

async function resolveFiles({ data, root }) {
  const { ics, deopts } = data

  const filesSet = new Set(ics.map(x => x.file).concat(deopts.map(x => x.file)))
  const files = await resolveAll(filesSet, root)
  return Object.assign(data, { files })
}

module.exports = resolveFiles