import {MigrationData} from '../../types.js'
import {Backend} from '../context/SnekFinder/SnekFinder.js'
import {resetState, store} from '../redux/index.js'
import {IJaenState} from '../redux/types.js'

export const prepareMigration = async (filenameScope: string = 'draft') => {
  const state = store.getState() as IJaenState

  const migrationData: MigrationData = {}

  // jaen internal
  migrationData.jaen = {
    site: state.site,
    finderUrl: await Backend.uploadIndex(),
    widgets: state.widget.nodes
  }

  // pages
  migrationData.pages = {
    ...state.page.pages.nodes
  }

  // popups
  migrationData.popups = {
    ...state.popup.nodes
  }

  // migrationData to JSON file
  const blob = new Blob([JSON.stringify(migrationData)], {
    type: 'application/json'
  })

  return {
    data: migrationData,
    filename: `jaen-${filenameScope}-${new Date().toISOString()}.jaen`,
    blob
  }
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
    },
    widget: {
      nodes: migrationData.jaen.widgets
    }
  })

  Backend.indexKey = migrationData.jaen.finderUrl
}
