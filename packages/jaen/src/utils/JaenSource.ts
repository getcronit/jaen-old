import fs from 'fs'
import path from 'path'

import {JaenData} from './JaenData.js'

const loadPathOrNull = (p: string) => {
  // load the path if it exists, otherwise return null
  try {
    // check if p exists
    fs.accessSync(p)

    const absolutePath = path.resolve(p)

    return absolutePath
  } catch (e) {
    return null
  }
}

export const jaenData = new JaenData({jaenDataDir: './jaen-data'})
export const sourcePagesPath = loadPathOrNull('./src/pages')
export const sourceTemplatesPath = loadPathOrNull('./src/jaen-templates')
