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

const jaenData = new JaenData({jaenDataDir: './jaen-data'})
const sourcePagesPath = loadPathOrNull('./src/pages')
const sourceTemplatesPath = loadPathOrNull('./src/jaen-templates')
const sourceViewsPath = loadPathOrNull('./src/jaen-views')
const sourcePopupsPath = loadPathOrNull('./src/jaen-popups')

export const JaenSource = {
  jaenData,
  sourcePagesPath,
  sourceTemplatesPath,
  sourceViewsPath,
  sourcePopupsPath
}
