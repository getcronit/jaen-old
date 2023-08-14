import {JaenPage, JaenSite} from '@snek-at/jaen'
import {SourceNodesArgs, Node} from 'gatsby'
import fs from 'fs/promises' // Import the fs module for asynchronous file operations

import {fetchMergeData} from '../utils/fetch-and-merge'
import {JaenData} from './jaen-data'

export const sourceNodes = async (args: SourceNodesArgs) => {
  const {actions, createNodeId, createContentDigest, reporter, getNodesByType} =
    args
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

  console.log('JaenData', jaenData)

  // Read pages

  // Merge with jaenData pages

  // Create jaenPages
}
