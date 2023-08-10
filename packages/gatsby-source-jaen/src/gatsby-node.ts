import {GatsbyNode} from 'gatsby'

import {sourceNodes as sourceNodesJaenData} from './source-nodes/jaen-data'
import {createPages as createPagesJaenData} from './create-pages/jaen-data'

export const sourceNodes: GatsbyNode['sourceNodes'] = async args => {
  await sourceNodesJaenData(args)
}

export const createPages: GatsbyNode['createPages'] = async args => {
  await createPagesJaenData(args)
}
