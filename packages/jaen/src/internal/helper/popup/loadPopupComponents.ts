import {IPopupConnection} from 'packages/jaen/src/connectors/connectPopup.js'
import {IJaenPopup} from 'packages/jaen/src/types.js'
import {popupLoader} from '../componentLoader.js'
import {QueryData} from './types.js'

export interface LoadedPopupComponent {
  id: string
  isActive: boolean
  popup?: IJaenPopup
  Component: IPopupConnection
}

export const loadPopupComponents = async (
  jaenPopup: QueryData['jaenPopup'],
  allJaenPopup: QueryData['allJaenPopup']
) => {
  const popups: LoadedPopupComponent[] = []

  for (const {relativePath} of jaenPopup.nodes) {
    const Popup = await popupLoader(relativePath)
    if (Popup) {
      console.log(`Popup`, allJaenPopup, relativePath)

      const popup = allJaenPopup.nodes.find(
        node => node.id === relativePath
      ) as IJaenPopup

      popups.push({
        id: relativePath,
        isActive: !!popup?.active,
        popup,
        Component: Popup
      })
    }
  }

  return popups
}
