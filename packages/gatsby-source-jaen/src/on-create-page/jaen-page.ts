import {PageConfig} from '@snek-at/jaen'
import {CreatePageArgs} from 'gatsby'
import {getJaenPageParentId} from '../utils/get-jaen-page-parent-id'

import {readPageConfig} from '../utils/page-config-reader'

export const onCreatePage = async ({
  actions,
  page,
  getNodesByType
}: CreatePageArgs) => {
  let jaenPageId = page.context?.jaenPageId as string | undefined
  let pageConfig = page.context?.pageConfig as PageConfig | undefined

  if (!jaenPageId) {
    jaenPageId = `JaenPage ${page.path}`
    pageConfig = readPageConfig(page.component)

    actions.deletePage(page)

    actions.createPage({
      ...page,
      context: {
        ...page.context,
        jaenPageId,
        pageConfig
      }
    })
  }

  // Check if there is a JaenPage node with the same id
  // If there is, delete the Node and create a new one with the props, else create a new one

  const jaenPageNodes = getNodesByType('JaenPage')

  // Find the JaenPage node with the same id
  const jaenPageNode = jaenPageNodes.find(node => node.id === jaenPageId)

  const path = page.path.replace(/\/+$/, '') // Remove trailing slashes from the path
  const lastPathElement = path.split('/').pop() || '' // Extract the last element

  const newJaenPageNode = {
    id: jaenPageId,
    slug: lastPathElement,
    parent: getJaenPageParentId({
      parent: null,
      id: jaenPageId
    }),
    jaenPageMetadata: {
      title:
        pageConfig?.label ||
        lastPathElement.charAt(0).toUpperCase() + lastPathElement.slice(1)
    },
    jaenFields: null,
    jaenFiles: [],
    sections: [],
    template: null,
    childTemplates: pageConfig?.childTemplates || [],
    ...jaenPageNode,
    children: [],
    pageConfig
  }

  const node = {
    ...newJaenPageNode,
    internal: {
      type: 'JaenPage',
      contentDigest: 'JaenPage',
      content: JSON.stringify(newJaenPageNode)
    }
  }

  await actions.createNode(node)
}
