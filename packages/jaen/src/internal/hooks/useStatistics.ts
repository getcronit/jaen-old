import {RemoteFileMigration} from '../../utils/JaenData.js'
import {useAdminStaticQuery} from './useAdminStaticQuery.js'

export interface IStatistics {
  totalPages: number
  totalPopups: number
  migrations: RemoteFileMigration[]
}

export const useStatistics = (): IStatistics => {
  const {
    jaenInternal: {migrationHistory},
    allJaenPage,
    allJaenPopup
  } = useAdminStaticQuery()

  const sortedMigration = migrationHistory.sort((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1
  ) as RemoteFileMigration[]

  return {
    totalPages: allJaenPage.totalCount,
    totalPopups: allJaenPopup.totalCount,
    migrations: sortedMigration
  }
}
