import {CreateNodeArgs} from 'gatsby'

export const onCreateNode = async ({
  node,
  actions,
  getNode
}: CreateNodeArgs) => {
  // if (node.internal.type === 'JaenPage') {
  //   const parentPageNode = node.parent ? getNode(node.parent) : null
  //   if (node && parentPageNode) {
  //     // console.log(
  //     //   `onCreateNode Creating parent-child link between`,
  //     //   node.id,
  //     //   parentPageNode.id
  //     // )
  //     // actions.createParentChildLink({
  //     //   parent: parentPageNode,
  //     //   child: node
  //     // })
  //   }
  // }
}
