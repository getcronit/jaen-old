import {GatsbyNode} from 'gatsby'

import {sourceNodes as sourceNodesJaenData} from './source-nodes/jaen-data'
import {sourceNodes as sourceNodesJaenPages} from './source-nodes/jaen-pages'
import {createPages as createPagesJaenPages} from './create-pages/jaen-pages'

import {onCreatePage as onCreatePageJaenPage} from './on-create-page/jaen-page'

export const sourceNodes: GatsbyNode['sourceNodes'] = async args => {
  await sourceNodesJaenData(args)
  // Must be called after sourceJaenNodes
  await sourceNodesJaenPages(args)
}

export const createPages: GatsbyNode['createPages'] = async args => {
  await createPagesJaenPages(args)
}

export const onCreatePage: GatsbyNode['onCreatePage'] = async args => {
  await onCreatePageJaenPage(args)
}
