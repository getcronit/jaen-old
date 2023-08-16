import {Node, SourceNodesArgs} from 'gatsby'

import {JaenData} from './jaen-data'

export const sourceNodes = async (args: SourceNodesArgs) => {
  const {
    actions,
    createNodeId,
    createContentDigest,
    reporter,
    getNodesByType,
    getNode
  } = args
  const {createNode} = actions

  const jaenDataNodes = getNodesByType('JaenData')

  if (jaenDataNodes.length === 0) {
    // error that points out that jaen-data source-nodes must be called beforehand

    return
  }

  if (jaenDataNodes.length > 1) {
    // error that points out that there are more than one jaen data node and this is wrong
    return
  }

  const jaenData = jaenDataNodes[0] as Node & JaenData

  const jaenPages = jaenData.pages || []

  console.log('JaenData', jaenData)

  for (const page of jaenPages) {
    let slug = page.slug
    if (!slug) {
      // when no slug is defined, extract the slug form the id (JaenPage /foo/)

      const path = page.id.split('JaenPage ')[1] || ''

      const lastPathElement = path.split('/').pop() || 'root'

      slug = lastPathElement
    }

    const pageWithSlug = {
      ...page,
      slug,
      parent: page.id !== 'JaenPage /' ? 'JaenPage /' : null,
      children: page.children?.map(child => child.id) || []
    }

    console.log(pageWithSlug)

    const pageNode = {
      ...pageWithSlug,
      // parent: pageWithSlug.parent?.id,
      // children: pageWithSlug.children?.map(child => child.id) || [],
      internal: {
        type: 'JaenPage',
        content: JSON.stringify(pageWithSlug),
        contentDigest: createContentDigest(pageWithSlug)
      }
    }

    await createNode(pageNode)

    const parentPageNode = pageNode.parent ? getNode(pageNode.parent) : null

    if (pageNode && parentPageNode) {
      console.log(
        `Creating parent-child link between`,
        pageNode.id,
        parentPageNode.id
      )
      actions.createParentChildLink({
        parent: parentPageNode,
        child: pageNode
      })
    }
  }
}
