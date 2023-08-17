import {useEffect, useState} from 'react'

import {useAppSelector} from '../redux'
import {generatePageOriginPath} from '../utils/path'

export type DynamicPathNode = {
  id: string
  slug: string
  parentPage: {
    id: string
  } | null
  template: string | null
}

export const useDynamicPaths = (args: {
  staticPages: Array<DynamicPathNode>
}) => {
  const dynamicPages = useAppSelector(state => state.page.pages.nodes) as {
    [key: string]: DynamicPathNode
  }

  const pages = [
    ...args.staticPages,
    ...Object.entries(dynamicPages).map(([id, page]) => ({
      ...page,
      id
    }))
  ]

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
    const newPaths: Record<
      string,
      {
        jaenPageId: string
        jaenTemplateId: string
      }
    > = {}

    for (const page of pages) {
      const path = generatePageOriginPath(pages, page)

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
