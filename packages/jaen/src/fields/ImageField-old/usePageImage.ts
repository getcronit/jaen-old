import {getImage, IGatsbyImageData} from 'gatsby-plugin-image'

import {useSectionBlockContext} from '../../contexts/block'
import {usePageContext} from '../../contexts/page'
import {findSection} from '../../utils/page/section'

export interface UsePageImageReturn {
  image: IGatsbyImageData
  description: string
}

export function usePageImage(options: {
  id: string
  byFieldName?: string
}): UsePageImageReturn | undefined {
  const {id, byFieldName} = options

  const {jaenPage} = usePageContext()
  const sectionContext = useSectionBlockContext()

  let file

  if (sectionContext) {
    const section = findSection(jaenPage.sections || [], sectionContext.path)

    const item = section?.items.find(({id}) => id === sectionContext.id)

    if (item) {
      if (byFieldName) {
        file = item[byFieldName]
      }

      if (!file) {
        file = item.jaenFiles.find(file => file.id === id)
      }
    }
  } else {
    if (byFieldName) {
      file = jaenPage[byFieldName]
    }

    if (!file) {
      file = jaenPage?.jaenFiles?.find(file => file.id === id)
    }
  }

  const image = getImage(file.node.childImageSharp.gatsbyImageData)

  if (image) {
    return {
      image,
      description: file.description
    }
  }

  return undefined
}
