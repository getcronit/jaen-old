import {existsSync, readFileSync, writeFileSync} from 'fs'
import {resolve} from 'path'

export class RemoteFileMigration {
  createdAt: string
  fileUrl: string

  constructor(createdAt: string, fileUrl: string) {
    this.createdAt = createdAt
    this.fileUrl = fileUrl
  }

  async fetchRemoteFile<T>(): Promise<T> {
    const response = await fetch(this.fileUrl)
    return await response.json()
  }
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

  private readJSONFile<T = any>(fileName: string, defaultData = {}) {
    return getJSONFile(
      `${this.#jaenDataDir}/${fileName}.json`,
      defaultData
    ) as T
  }

  private writeJSONFile(fileName: string, data: any) {
    writeJSONFile(`${this.#jaenDataDir}/${fileName}.json`, data)
  }

  readPages() {
    const pages = this.readJSONFile<typeof this.pages>('pages', {})

    for (const [pageName, page] of Object.entries(pages)) {
      pages[pageName] = {
        context: new RemoteFileMigration(
          page.context.createdAt,
          page.context.fileUrl
        ),
        migrations: page.migrations.map(
          (m: any) => new RemoteFileMigration(m.createdAt, m.fileUrl)
        )
      }
    }

    this.pages = pages
  }

  readPopups() {
    const popups = this.readJSONFile<typeof this.popups>('popups', {})

    for (const [popupName, popup] of Object.entries(popups)) {
      popups[popupName] = {
        context: new RemoteFileMigration(
          popup.context.createdAt,
          popup.context.fileUrl
        ),
        migrations: popup.migrations.map(
          (m: any) => new RemoteFileMigration(m.createdAt, m.fileUrl)
        )
      }
    }

    this.popups = popups
  }

  readInternal() {
    this.internal = this.readJSONFile<typeof this.internal>('internal', {
      site: {},
      widgets: [],
      migrationHistory: []
    })

    this.internal.migrationHistory = this.internal.migrationHistory.map(
      (m: any) => new RemoteFileMigration(m.createdAt, m.fileUrl)
    )
  }

  read() {
    this.readPages()
    this.readPopups()
    this.readInternal()
  }

  write() {
    this.writeJSONFile('pages', this.pages)
    this.writeJSONFile('popups', this.popups)
    this.writeJSONFile('internal', this.internal)
  }
}
