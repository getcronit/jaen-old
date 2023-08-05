import {IGatsbyImageData, getImage} from 'gatsby-plugin-image'
import {useSectionBlockContext} from '../../../contexts/block'
import {usePageContext} from '../../../contexts/page'
import {findSection} from '../../../utils/page/section'

export interface UsePageImageReturn {
  image: IGatsbyImageData
  description: string
}

/**
 * Retrieves an image for a given ID from the page or section context and generates an IGatsbyImageData object.
 *
 * @param id - The ID of the image media node to retrieve.
 * @param byFieldName - (Optional) The field name to look for the media node in page context or section context.
 * @returns The IGatsbyImageData object representing the image or undefined if not found.
 */
export const usePageImage = (
  id: string,
  byFieldName?: string
): UsePageImageReturn | undefined => {
  // Get the current page context from the Jaen CMS.
  const {jaenPage} = usePageContext()

  // Get the current section context from the Jaen CMS.
  const sectionContext = useSectionBlockContext()

  let file

  // Check if the image is defined in the section context.
  if (sectionContext) {
    // Find the section that matches the current section context path.
    const section = findSection(jaenPage.sections || [], sectionContext.path)

    // Find the item within the section that matches the current section context ID.
    const item = section?.items.find(({id}) => id === sectionContext.id)

    if (item) {
      // Check if the image is defined in the 'byFieldName' field.
      if (byFieldName) {
        file = item[byFieldName]
      }

      // If the image is not found, find the image with the provided ID in the 'jaenFiles' of the item.
      if (!file) {
        file = item.jaenFiles.find(file => file.id === id)
      }
    }
  } else {
    // If there is no section context, check if the image is defined in the 'byFieldName' field of the page context.
    if (byFieldName) {
      file = jaenPage[byFieldName]
    }

    // If the image is not found, find the image with the provided ID in the 'jaenFiles' of the page context.
    if (!file) {
      file = jaenPage?.jaenFiles?.find(file => file.id === id)
    }
  }

  if (file) {
    const image = getImage(file.node.childImageSharp.gatsbyImageData)

    // If a valid file is found, generate the IGatsbyImageData object using Gatsby's 'getImage' function.
    if (image) {
      return {
        image,
        description: file.description
      }
    }
  }

  return undefined
}
