import {MigrationData} from '../../types.js'
import {Backend} from '../context/SnekFinder/SnekFinder.js'
import {resetState, store} from '../redux/index.js'
import {IJaenState} from '../redux/types.js'

export const prepareMigration = async () => {
  const state = store.getState() as IJaenState

  const migrationData: MigrationData = {}

  // jaen internal
  migrationData.jaen = {
    site: state.site,
    finderUrl: await Backend.uploadIndex()
  }

  // pages
  migrationData.pages = {
    ...state.page.pages.nodes
  }

  // popups
  migrationData.popups = {
    ...state.popup.nodes
  }

  return migrationData
}

export const insertMigration = async (migrationData: MigrationData) => {
  resetState({
    site: migrationData.jaen.site,
    page: {
      pages: {
        nodes: migrationData.pages
      }
    },
    popup: {
      nodes: migrationData.popups
    }
  })

  Backend.indexKey = migrationData.jaen.finderUrl
}
