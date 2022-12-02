import {RemoteFileMigration} from '../../utils/JaenData.js'

export interface IStatistics {
  totalChanges: number
  totalPages: number
  totalNotificatons: number
  migrations: RemoteFileMigration[]
}

export const useStatistics = (): IStatistics => {
  const migrations: RemoteFileMigration[] = [
    {
      createdAt: '2021-01-01T00:00:00.000Z',
      fileUrl: 'https://example.com/2021-01-01T00:00:00.000Z.json'
    }
  ]
  const sortedMigration = migrations.sort((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1
  )

  return {
    totalChanges: 0,
    totalPages: 0,
    totalNotificatons: 0,
    migrations: sortedMigration
  }
}
