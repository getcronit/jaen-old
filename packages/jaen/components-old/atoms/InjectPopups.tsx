import React from 'react'
import {PageProps} from '../../../types.js'
import {usePopupsInject} from '../../hooks/usePopupsInject.js'

export const InjectPopups: React.FC<{
  pageProps: PageProps
}> = ({pageProps}) => {
  const {elements} = usePopupsInject({
    pageProps
  })

  return <>{elements}</>
}
