import {existsSync, readFileSync, writeFileSync} from 'fs'
import {resolve} from 'path'

export interface RemoteFileMigration {
  createdAt: string
  fileUrl: string
}

export interface BaseEntity extends MigrationEntity {
  migrations: RemoteFileMigration[]
}

export interface MigrationEntity {
  context: RemoteFileMigration
}

export const getJSONFile = (filePath: string, defaultData: object = {}) => {
  if (!existsSync(filePath)) {
    writeJSONFile(filePath, defaultData)
  }

  const fileData = readFileSync(filePath, 'utf8')

  return JSON.parse(fileData)
}

export const writeJSONFile = (filePath: string, data: any) => {
  writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export class JaenData {
  #jaenDataDir: string

  pages: Record<string, BaseEntity>
  popups: Record<string, BaseEntity>
  internal?: any & {
    migrationHistory: RemoteFileMigration[]
  }

  constructor(options: {jaenDataDir: string}) {
    const absoluteJaenDataDir = resolve(options.jaenDataDir)

    if (!existsSync(absoluteJaenDataDir)) {
      throw new Error(
        `Jaen data directory does not exist: ${absoluteJaenDataDir}`
      )
    }

    this.#jaenDataDir = absoluteJaenDataDir
  }

  private readJSONFile(fileName: string, defaultData = {}) {
    return getJSONFile(`${this.#jaenDataDir}/${fileName}.json`, defaultData)
  }

  private writeJSONFile(fileName: string, data: any) {
    writeJSONFile(`${this.#jaenDataDir}/${fileName}.json`, data)
  }

  read() {
    this.pages = this.readJSONFile('pages')
    this.popups = this.readJSONFile('popups')
    this.internal = this.readJSONFile('internal', {
      site: {},
      migrationHistory: [],
      widgets: []
    })
  }

  write() {
    this.writeJSONFile('pages', this.pages)
    this.writeJSONFile('popups', this.popups)
    this.writeJSONFile('internal', this.internal)
  }
}
