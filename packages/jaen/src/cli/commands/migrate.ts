import {createMigration, CreateMigrationOptions} from '../createMigration.js'

export default async (options: CreateMigrationOptions) => {
  console.log(options)
  const JAEN_MIGRATION_URL = options.migrationUrl

  if (!JAEN_MIGRATION_URL) {
    throw new Error(
      'No migration url provided. Please provide a migration url with the -m, --migrationUrl flag or the JAEN_MIGRATION_URL environment variable'
    )
  }

  try {
    await createMigration({
      migrationUrl: JAEN_MIGRATION_URL,
      jaenDataDir: options.jaenDataDir
    })
  } catch (err) {
    // rethrow error with a more helpful message
    throw new Error(
      `Error creating migration. Please make sure the migration url is correct. ${err.message}`
    )
  }
}
