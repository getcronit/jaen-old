import deepmerge from 'deepmerge'
import {usePopupStaticQuery} from 'gatsby-plugin-jaen'
import {useCallback, useEffect, useState} from 'react'
import {
  LoadedPopupComponent,
  loadPopupComponents
} from '../helper/popup/loadPopupComponents.js'
import {useAppDispatch, useAppSelector} from '../redux/index.js'
import * as popupActions from '../redux/slices/popup.js'

export const usePopupComponents = () => {
  const dispatch = useAppDispatch()
  const {jaenPopup, allJaenPopup} = usePopupStaticQuery()

  const dynamicPopupNodes = useAppSelector(state => state.popup.nodes)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [popups, setPopups] = useState<LoadedPopupComponent[]>([])

  const togglePopup = useCallback((popup: LoadedPopupComponent) => {
    if (popup.isActive) {
      dispatch(popupActions.setInactive(popup.id))
    } else {
      dispatch(popupActions.setActive(popup.id))
    }
  }, [])

  useEffect(() => {
    const loadPopups = async () => {
      setIsLoading(true)

      Object.entries(dynamicPopupNodes).forEach(([id, node]) => {
        const index = allJaenPopup.nodes.findIndex(n => n.id === id)

        const nodeWithId = {
          ...node,
          id
        }

        if (index > -1) {
          allJaenPopup.nodes[index] = deepmerge(
            allJaenPopup.nodes[index] as any,
            nodeWithId as any
          )
        } else {
          allJaenPopup.nodes.push(nodeWithId as any)
        }
      })

      const elements = await loadPopupComponents(jaenPopup, allJaenPopup)

      setPopups(elements)

      setIsLoading(false)
    }

    void loadPopups()
  }, [dynamicPopupNodes])

  return {
    isLoading,
    popups,
    togglePopup
  }
}
