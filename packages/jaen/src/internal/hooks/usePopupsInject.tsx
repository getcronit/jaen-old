import {usePopupStaticQuery} from 'gatsby-plugin-jaen'
import {useEffect, useState} from 'react'

import {PageProps} from '../../types.js'
import {loadNotificationsForPage} from '../helper/popup/loadPopupForPage.js'
import {useAppSelector} from '../redux/index.js'

export interface IPopupsInjectArgs {
  pageProps: PageProps
}

export const usePopupsInject = ({pageProps}: IPopupsInjectArgs) => {
  const {jaenPopup, allJaenPopup} = usePopupStaticQuery()

  const advanced = useAppSelector(state => state.popup.advanced)
  const dynamicPopupNodes = useAppSelector(state => state.popup.nodes)

  const [elements, setElements] = useState<JSX.Element[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const loadPopups = async () => {
      setIsLoading(true)
      const elements = await loadNotificationsForPage(
        jaenPopup,
        allJaenPopup,
        dynamicPopupNodes,
        pageProps,
        advanced
      )

      setElements(elements)

      setIsLoading(false)
    }

    void loadPopups()
  }, [])

  return {elements, isLoading}
}
