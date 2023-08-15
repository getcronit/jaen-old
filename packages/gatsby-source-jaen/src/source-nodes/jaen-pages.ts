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

  for (const page of jaenPages) {
    const pageNode = {
      internal: {
        type: 'JaenPage',
        contentDigest: createContentDigest(page)
      },
      ...page,
      parent: page.parent?.id,
      children: page.children?.map(child => child.id) || []
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
