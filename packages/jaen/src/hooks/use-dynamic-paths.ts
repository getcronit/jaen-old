import {useEffect, useState} from 'react'
import {store, useAppSelector} from '../redux'
import {JaenPage} from '../types'
import {generatePageOriginPath} from '../utils/path'

export const useDynamicPaths = () => {
  const pages = useAppSelector(state => state.page.pages.nodes) as {
    [key: string]: JaenPage
  }

  const [paths, setPaths] = useState<
    Record<
      string,
      {
        jaenPageId: string
        jaenTemplateId: string
      }
    >
  >({})

  useEffect(() => {
    console.log('pages', pages)
    const newPaths: Record<
      string,
      {
        jaenPageId: string
        jaenTemplateId: string
      }
    > = {}

    const pagesValuesWithId = Object.entries(pages).map(([id, page]) => ({
      ...page,
      id
    }))

    console.log('pagesValues', pagesValuesWithId)

    for (const page of pagesValuesWithId) {
      const path = generatePageOriginPath(pagesValuesWithId, page)

      if (path && page.template) {
        newPaths[path] = {
          jaenPageId: page.id,
          jaenTemplateId: page.template
        }
      }
    }

    // only update if paths changed
    if (JSON.stringify(newPaths) !== JSON.stringify(paths)) {
      setPaths(newPaths)
    }
  }, [pages])

  return paths
}